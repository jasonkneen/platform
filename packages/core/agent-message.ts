import { z } from 'zod';
import { DEPLOYMENT_STATE } from './types/api';

export const PlatformMessageType = {
  DEPLOYMENT_COMPLETE: 'deployment_complete',
  DEPLOYMENT_IN_PROGRESS: 'deployment_in_progress',
  DEPLOYMENT_STOPPING: 'deployment_stopping',
  DEPLOYMENT_FAILED: 'deployment_failed',
  REPO_CREATED: 'repo_created',
  COMMIT_CREATED: 'commit_created',
} as const;

export const AgentStatus = {
  RUNNING: 'running',
  IDLE: 'idle',
  HISTORY: 'history',
} as const;

export const DeployStatus = {
  DEPLOYING: 'deploying',
  DEPLOYED: 'deployed',
  FAILED: 'failed',
  STOPPING: 'stopping',
  PENDING: 'pending',
} as const;

export const DEPLOYMENT_STATE_TO_DEPLOY_STATUS = {
  [DEPLOYMENT_STATE.HEALTHY]: DeployStatus.DEPLOYED,
  [DEPLOYMENT_STATE.ERROR]: DeployStatus.FAILED,
  [DEPLOYMENT_STATE.STOPPING]: DeployStatus.STOPPING,
  [DEPLOYMENT_STATE.DEPLOYMENT_IN_PROGRESS]: DeployStatus.DEPLOYING,
} as const;

export const MessageKind = {
  KEEP_ALIVE: 'KeepAlive',
  STAGE_RESULT: 'StageResult',
  RUNTIME_ERROR: 'RuntimeError',
  REFINEMENT_REQUEST: 'RefinementRequest',
  REVIEW_RESULT: 'ReviewResult',
  WIP_UPDATE: 'WipUpdate',

  // these are Platform only messages, don't exist in the agent
  PLATFORM_MESSAGE: 'PlatformMessage',
  USER_MESSAGE: 'UserMessage',
  AGENT_MESSAGE: 'AgentMessage',
} as const;

export const PromptKind = {
  USER: 'user',
  ASSISTANT: 'assistant',
} as const;

type RequestId = string;
export type ApplicationId = string;
export type TraceId = `app-${ApplicationId}.req-${RequestId}`;
export type AgentStatus = (typeof AgentStatus)[keyof typeof AgentStatus];
export type MessageKind = (typeof MessageKind)[keyof typeof MessageKind];
export type DeployStatusType = (typeof DeployStatus)[keyof typeof DeployStatus];
export type PromptKindType = (typeof PromptKind)[keyof typeof PromptKind];
export type PlatformMessageType =
  (typeof PlatformMessageType)[keyof typeof PlatformMessageType];

export const agentStatusSchema = z.nativeEnum(AgentStatus);
export const messageKindSchema = z.nativeEnum(MessageKind);

// Conversation message
export const conversationMessageSchema = z.object({
  role: z.nativeEnum(PromptKind),
  content: z.string(),
  kind: messageKindSchema.optional(),
});

export type PlatformMessageMetadata = {
  type?: PlatformMessageType;
  deploymentId?: string;
  deploymentUrl?: string;
  deploymentType?: 'databricks' | 'koyeb';
  githubUrl?: string;
  deployStatus?: DeployStatusType;
  commitUrl?: string;
};

// Agent SSE Event message object
export const agentSseEventMessageSchema = z.object({
  kind: messageKindSchema,
  messages: z.array(conversationMessageSchema),
  agentState: z.record(z.unknown()).nullish(),
  unifiedDiff: z.string().nullish(),
  app_name: z.string().nullish(),
  commit_message: z.string().nullish(),

  // Platform message metadata
  metadata: z
    .object({
      type: z.nativeEnum(PlatformMessageType).optional(),
    })
    .optional(),
});

// Agent SSE Event
export const agentSseEventSchema = z.object({
  appId: z.string().optional(),
  status: agentStatusSchema,
  traceId: z.string(),
  createdAt: z.date().optional(),
  message: agentSseEventMessageSchema,
  metadata: z
    .object({
      type: z.nativeEnum(PlatformMessageType).optional(),
      deploymentId: z.string().optional(),
      deploymentType: z.enum(['databricks', 'koyeb']).optional(),
      deployStatus: z.nativeEnum(DeployStatus).optional(),
      githubUrl: z.string().optional(),
      deploymentUrl: z.string().optional(),
      commitUrl: z.string().optional(),
    })
    .optional(),
});

// Agent Request
export const agentRequestSchema = z.object({
  allMessages: z.array(conversationMessageSchema),
  applicationId: z.string(),
  traceId: z.string(),
  agentState: z.record(z.unknown()).optional(),
  settings: z.record(z.unknown()).optional(),
});

// Type inference helpers
export type ConversationMessage = z.infer<typeof conversationMessageSchema>;
export type AgentSseEventMessage = z.infer<typeof agentSseEventMessageSchema>;
export type AgentSseEvent = z.infer<typeof agentSseEventSchema>;
export type AgentRequest = z.infer<typeof agentRequestSchema>;

export class ErrorResponse {
  error: string;
  details?: string;

  constructor(error: string, details?: string) {
    this.error = error;
    this.details = details;
  }
}

export class PlatformMessage {
  status: AgentStatus;
  traceId: TraceId;
  appId: ApplicationId;
  message: AgentSseEventMessage;
  metadata?: PlatformMessageMetadata;

  constructor(
    status: AgentStatus,
    traceId: TraceId,
    appId: string,
    message: string,
    metadata?: PlatformMessageMetadata,
  ) {
    this.status = status;
    this.traceId = traceId;
    this.appId = appId;
    this.message = {
      kind: MessageKind.PLATFORM_MESSAGE,
      messages: [{ role: PromptKind.ASSISTANT, content: message }],
    };
    this.metadata = metadata;
  }
}

export class StreamingError {
  error: string;
  traceId?: TraceId;
  appId?: ApplicationId;
  message: AgentSseEventMessage;

  constructor(error: string, appId: ApplicationId, traceId?: TraceId) {
    this.error = error;
    this.traceId = traceId;
    this.message = {
      kind: MessageKind.RUNTIME_ERROR,
      messages: [{ role: PromptKind.ASSISTANT, content: error }],
    };
    this.appId = appId;
  }
}

export interface Message {
  role: PromptKindType;
  content: string;
  icon: string;
  kind: MessageKind;
  metadata?: Record<string, any>;
  isHistory?: boolean;
}

export function extractApplicationIdFromTraceId(traceId: TraceId) {
  const appPart = traceId.split('.')[0];
  const applicationId = appPart?.replace('app-', '').replace('temp-', '');

  return applicationId;
}
