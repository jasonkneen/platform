import {
  AssistantRuntimeProvider,
  ThreadMessageLike,
  useExternalStoreRuntime,
} from '@assistant-ui/react';
import type { Meta, StoryObj } from '@storybook/react';
import Chat from './chat';
import { ChatConfigProvider } from './chat-provider';
import { PromptKind } from '@appdotbuild/core';

function MockChat({
  messages,
  isRunning,
}: {
  messages?: ThreadMessageLike[];
  isRunning?: boolean;
}) {
  const mockRuntime = useExternalStoreRuntime({
    isRunning,
    convertMessage: (message) => message,
    messages: messages || [],
    onNew: async () => {},
  });

  return (
    <AssistantRuntimeProvider runtime={mockRuntime}>
      <ChatConfigProvider>
        <Chat />
      </ChatConfigProvider>
    </AssistantRuntimeProvider>
  );
}

const meta: Meta<typeof MockChat> = {
  title: 'UI/Chat/Thread',
  component: MockChat,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof MockChat>;

export const Default: Story = {};

export const Running: Story = {
  args: {
    isRunning: true,
  },
};

export const WithMessages: Story = {
  args: {
    messages: [
      {
        role: PromptKind.ASSISTANT,
        content: [{ type: 'text', text: 'Hello, how can I help you today?' }],
      },
      {
        role: PromptKind.USER,
        content: [{ type: 'text', text: 'I need help with my account' }],
      },
      {
        role: PromptKind.ASSISTANT,
        content: [
          {
            type: 'text',
            text: 'I can help you with that. What seems to be the problem?',
          },
        ],
      },
    ],
  },
};

export const WithMarkdown: Story = {
  args: {
    messages: [
      {
        role: PromptKind.ASSISTANT,
        content: [
          { type: 'text', text: 'Hello, **how can** I help you today?' },
        ],
      },
    ],
  },
};
