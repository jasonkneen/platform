import type { AgentSseEvent, MessageKind } from '@appdotbuild/core';

export interface Message {
  role: 'user' | 'assistant';
  content: string;
  icon: string;
  kind: MessageKind;
}

export function convertEventToMessages(events: AgentSseEvent[]): Message[] {
  const result: Message[] = [];

  for (const event of events) {
    const eventKind = event.message.kind;

    // add messages in order
    for (const message of event.message.messages) {
      result.push({
        role: message.role,
        content: message.content,
        icon: message.role === 'assistant' ? '🤖' : '👤',
        kind: eventKind,
      });
    }
  }

  return result;
}
