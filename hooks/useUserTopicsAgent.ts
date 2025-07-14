import EventSource, { } from 'react-native-sse';
import { useState } from 'react';

import { getAuthHeaders } from '@/apollo/settings';


export type ModelStreamStartMessage = {
  id: string;
  type: 'model_start';
}

export type ModelStreamMessage = {
  id: string;
  content: string;
  type: 'model';
}

export type ConversationItemType = {
  id: string;
  messages: (ModelStreamStartMessage | ModelStreamMessage)[];
};

export const useUserTopicsAgent = ({ onStreamStart, onStreamEnd, onTopicsStored }: { onStreamStart?: () => void, onStreamEnd?: () => void, onTopicsStored?: () => void }) => {
  const [conversationItems, setConversationItems] = useState<ConversationItemType[]>([]);
  const [threadId, setThreadId] = useState<string | null>(null);

  const stream = async (topics?: string[], storeTopics?: boolean) => {
    onStreamStart?.();
    console.log('threadId topics', threadId, topics, storeTopics)
    const es = new EventSource<'MODEL_STREAM' | 'THREAD_ID' | 'TOPICS_STORED' | 'DONE'>(
      `${process.env.EXPO_PUBLIC_API_ENDPOINT}/users-topics-agent/topics`,
      {
        method: 'POST',
        debug: false,
        headers: {
          'Content-Type': 'application/json',
          ...(await getAuthHeaders())
        },
        body: JSON.stringify({
          threadId,
          input: topics?.join(', ') || '',
          store: storeTopics || false
        }),
      });


    es.addEventListener('MODEL_STREAM', (msg) => {
      if (storeTopics) {
        return;
      }

      let message = JSON.parse(msg.data!) as ModelStreamMessage;

      setConversationItems((conversationItems) => {
        const conversationItem = conversationItems.at(-1);
        if (!conversationItem) {
          return [...conversationItems, {
            id: message.id,
            messages: [message],
          }];
        }

        const { messages } = conversationItem;
        const modelStreamMessage = messages.find(m => m.type === 'model');
        if (!modelStreamMessage) {
          return [...conversationItems.slice(0, -1), {
            ...conversationItem,
            messages: [...messages, message],
          }];
        }

        if (modelStreamMessage.id === message.id) {
          return [...conversationItems.slice(0, -1), {
            ...conversationItem,
            messages: conversationItem.messages.map(m => m.type === 'model' ? {
              ...m,
              content: `${m.content}${message.content}`.trimStart(),
            } : m),
          }];
        }

        return [...conversationItems, {
          id: message.id,
          messages: [message],
        }];
      });
    });

    es.addEventListener('THREAD_ID', (msg) => {
      const threadId = msg.data as string;
      setThreadId(threadId);
    });

    es.addEventListener('TOPICS_STORED', (msg) => {
      console.log('TOPICS_STORED', msg)
      onTopicsStored?.();
    });

    es.addEventListener('DONE', (msg) => {
      es.close();
    });

    es.addEventListener('open', (msg) => {

    });

    es.addEventListener('close', async (msg) => {
      onStreamEnd?.();
      es.close();
    });

    es.addEventListener('error', (event) => {
      es.close();
      if (event.type === 'error') {
        console.log('Connection error:', JSON.stringify(event));
      } else if (event.type === 'exception') {
        console.log('Error:', event.message, event.error);
      }
    });
  };

  return {
    stream,
    conversationItems,
  }
}