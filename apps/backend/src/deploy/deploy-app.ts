import path from 'node:path';
import fs from 'node:fs';
import { exec as execNative } from 'node:child_process';
import { randomBytes } from 'node:crypto';
import { eq } from 'drizzle-orm';
import { createApiClient } from '@neondatabase/api-client';
import { apps, db, deployments } from '../db';
import { logger } from '../logger';
import { promisify } from 'node:util';
import { isProduction } from '../env';
import {
  createRepositoryIfNotExists,
  getImageName,
  generateScopedPullToken,
} from '../ecr';
import { dockerLoginIfNeeded } from '../docker';
import {
  createEcrSecret,
  updateEcrSecret,
  createKoyebApp,
  createKoyebOrganization,
  createKoyebService,
  getOrganizationToken,
  updateKoyebService,
  createKoyebDomain,
  getKoyebDomain,
} from './koyeb';
import type { App } from '../db/schema';
import { DeployStatus, type TemplateId } from '@appdotbuild/core';
import { deployToDatabricks } from './databricks';

const exec = promisify(execNative);
const NEON_DEFAULT_DATABASE_NAME = 'neondb';

const neonClient = createApiClient({
  apiKey: process.env.NEON_API_KEY!,
});

async function deployToKoyeb({
  appId,
  appDirectory,
  currentApp,
  templateId,
}: {
  appId: string;
  appDirectory: string;
  currentApp: Partial<App>;
  templateId: TemplateId;
}) {
  let connectionString: string | undefined;
  let neonProjectId = currentApp.neonProjectId;

  const githubUsername = currentApp.githubUsername?.toLowerCase();

  if (neonProjectId) {
    connectionString = await getNeonProjectConnectionString({
      projectId: neonProjectId,
    });
    logger.info('Using existing Neon database', {
      projectId: neonProjectId,
    });
  } else {
    // Create a Neon database
    const { data } = await neonClient.createProject({
      project: {},
    });
    neonProjectId = data.project.id;
    connectionString = data.connection_uris[0]?.connection_uri;
    logger.info('Created Neon database', { projectId: data.project.id });
  }

  if (!connectionString) {
    throw new Error('Failed to create Neon database');
  }

  const deployment = await db
    .select({
      koyebOrgId: deployments.koyebOrgId,
      koyebOrgName: deployments.koyebOrgName,
      koyebOrgEcrSecretId: deployments.koyebOrgEcrSecretId,
    })
    .from(deployments)
    .where(eq(deployments.ownerId, currentApp.ownerId!));

  let koyebOrgId = deployment[0]?.koyebOrgId;
  let koyebOrgName = deployment[0]?.koyebOrgName;
  let koyebOrgEcrSecretId = deployment[0]?.koyebOrgEcrSecretId;

  if (!koyebOrgId) {
    ({ koyebOrgId, koyebOrgName } = await createKoyebOrganization(
      githubUsername!,
    ));

    await db.insert(deployments).values({
      appId,
      ownerId: currentApp.ownerId!,
      koyebOrgId,
      koyebOrgName,
    });
  }

  await db
    .update(apps)
    .set({
      neonProjectId,
    })
    .where(eq(apps.id, appId));

  // check if dockerfile exists
  if (!fs.existsSync(path.join(appDirectory, 'Dockerfile'))) {
    throw new Error('Dockerfile not found');
  }

  const imageName = getImageName(appId, githubUsername!);

  logger.info('Building Docker image');

  const buildImagePromise = exec(`docker build -t ${imageName} .`, {
    cwd: appDirectory,
    // @ts-ignore
    stdio: 'inherit',
  });
  const createRepositoryPromise = createRepositoryIfNotExists(
    appId,
    githubUsername!,
  );

  const koyebAppName = `app-${appId}`;

  await Promise.all([
    dockerLoginIfNeeded(),
    buildImagePromise,
    createRepositoryPromise,
  ]);

  logger.info('Pushing Docker image to ECR');

  await exec(`docker push ${imageName}`, {
    cwd: appDirectory,
  }).then(() => {
    logger.info('Cleaning up Docker image');
    return exec(`docker rmi ${imageName}`);
  });

  logger.info('Starting Koyeb deployment', { koyebAppName });

  const userToken = await getOrganizationToken(koyebOrgId);

  let koyebAppId = currentApp.koyebAppId;
  let koyebServiceId = currentApp.koyebServiceId;
  let koyebDomainId = currentApp.koyebDomainId;
  const scopedPullToken = await generateScopedPullToken(githubUsername!);

  const ecrParams = {
    token: userToken,
    username: scopedPullToken.username,
    password: scopedPullToken.password,
    url: scopedPullToken.registry.replace('https://', ''),
  };

  if (!koyebOrgEcrSecretId) {
    koyebOrgEcrSecretId = await createEcrSecret(ecrParams);
  } else {
    await updateEcrSecret({
      ...ecrParams,
      secretId: koyebOrgEcrSecretId,
    });
  }

  await db
    .update(deployments)
    .set({
      koyebOrgEcrSecretId,
    })
    .where(eq(deployments.ownerId, currentApp.ownerId!));

  if (!koyebAppId) {
    ({ koyebAppId } = await createKoyebApp({
      koyebAppName,
      token: userToken,
    }));
  }

  if (!koyebDomainId) {
    ({ koyebDomainId } = await createKoyebDomain({
      koyebAppId,
      koyebAppName,
      token: userToken,
    }));
  }

  let customEnvs;
  if (templateId === 'nicegui_agent') {
    customEnvs = [
      {
        key: 'NICEGUI_PORT',
        value: '80',
      },
    ];
  } else if (templateId === 'laravel_agent') {
    const unPooledConnectionString = connectionString.replace('-pooler', '');
    // Generate a random 32-byte key and base64 encode it for Laravel
    const appKey = `base64:${randomBytes(32).toString('base64')}`;
    customEnvs = [
      {
        key: 'APP_KEY',
        value: appKey,
      },
      {
        key: 'DB_MIGRATION_URL',
        // To run migrations in Laravel, we need to use the unpooled connection string
        value: unPooledConnectionString,
      },
    ];
  }

  const params = {
    dockerImage: imageName,
    databaseUrl: connectionString,
    token: userToken,
    customEnvs,
  };

  let deploymentId: string;

  if (!koyebServiceId) {
    ({ koyebServiceId, deploymentId } = await createKoyebService({
      ...params,
      koyebAppId,
    }));
  } else {
    ({ deploymentId } = await updateKoyebService({
      ...params,
      serviceId: koyebServiceId,
    }));
  }

  await db
    .update(apps)
    .set({
      flyAppId: koyebAppName,
      koyebAppId,
      koyebServiceId,
      koyebDomainId,
      deployStatus: DeployStatus.DEPLOYED,
    })
    .where(eq(apps.id, appId));

  logger.info('Koyeb deployment completed', { koyebAppName });
  logger.info('Updating apps table', {
    koyebAppName,
    appId,
  });

  const { koyebDomainName } = await getKoyebDomain({
    koyebDomainId,
    token: userToken,
  });
  const appUrl = `https://${koyebDomainName}`;

  await db
    .update(apps)
    .set({
      appUrl,
    })
    .where(eq(apps.id, appId));

  if (isProduction) {
    if (fs.existsSync(appDirectory)) {
      fs.rmdirSync(appDirectory, { recursive: true });
    }
  }

  return { appURL: appUrl, deploymentId };
}

export async function deployApp({
  appId,
  appDirectory,
  databricksMode,
  templateId,
}: {
  appId: string;
  appDirectory: string;
  databricksMode: boolean;
  templateId: TemplateId;
}) {
  const app = await db
    .select({
      deployStatus: apps.deployStatus,
      neonProjectId: apps.neonProjectId,
      ownerId: apps.ownerId,
      githubUsername: apps.githubUsername,
      koyebAppId: apps.koyebAppId,
      koyebServiceId: apps.koyebServiceId,
      koyebDomainId: apps.koyebDomainId,
      databricksApiKey: apps.databricksApiKey,
      databricksHost: apps.databricksHost,
    })
    .from(apps)
    .where(eq(apps.id, appId));

  const currentApp = app[0];

  if (!currentApp) {
    throw new Error(`App ${appId} not found`);
  }

  // deployed is okay, but deploying is not
  if (currentApp.deployStatus === DeployStatus.DEPLOYING) {
    throw new Error(`App ${appId} is already being deployed`);
  }

  if (databricksMode) {
    return deployToDatabricks({ appId, appDirectory, currentApp });
  }

  return deployToKoyeb({ appId, appDirectory, currentApp, templateId });
}

async function getNeonProjectConnectionString({
  projectId,
}: {
  projectId: string;
}) {
  const branches = await neonClient.listProjectBranches({
    projectId,
  });
  const defaultBranch = branches.data.branches.find((branch) => branch.default);
  const branchId = defaultBranch?.id;
  if (!branchId) {
    throw new Error(`Default branch not found`);
  }

  const databases = await neonClient.listProjectBranchDatabases(
    projectId,
    branchId,
  );
  const defaultDatabase =
    databases.data.databases.find(
      (db) => db.name === NEON_DEFAULT_DATABASE_NAME,
    ) ?? databases.data.databases[0];

  if (!defaultDatabase) {
    throw new Error(`Default database not found`);
  }
  const databaseName = defaultDatabase?.name;
  const roleName = defaultDatabase?.owner_name;

  const connectionString = await neonClient.getConnectionUri({
    projectId,
    database_name: databaseName,
    role_name: roleName,
  });

  return connectionString.data.uri;
}
