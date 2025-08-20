import { logger } from '../logger';
import { type GithubEntityInitialized } from './entity';

type ArchiveRepositoryRequest = {
  githubEntity: GithubEntityInitialized;
};

export const archiveRepository = async ({
  githubEntity,
}: ArchiveRepositoryRequest) => {
  try {
    const response = await githubEntity.octokit.rest.repos.update({
      owner: githubEntity.owner,
      repo: githubEntity.repo,
      archived: true,
    });

    logger.info('Repository archived successfully!', response);
    return {
      statusCode: 200,
      status: 'success',
      message: 'Repository archived',
    };
  } catch (error: any) {
    logger.error('Failed to archive repository', {
      error: error.message,
    });
    return {
      statusCode: 400,
      error: `Failed to archive repository: ${error.message}`,
    };
  }
};
