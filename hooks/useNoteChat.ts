import { GetNoteMessagesQuery, GetNoteMessagesQueryVariables, NoteMessage, SortOrder } from '@/apollo/__generated__/graphql'
import { GET_NOTE_MESSAGES } from '@/apollo/queries/noteMessages'
import { useQuery } from '@apollo/client'
import { useEffect, useMemo, useState } from 'react'

export type Message = {
  role: 'user' | 'assistant'
  content: string
  timestamp: string
}

export const useNoteChat = ({ noteId }: { noteId: string }) => {
  const [messages, setMessages] = useState<Message[]>([])
  const [init, setInit] = useState(false);

  const variables = useMemo(() => {
    return {
      noteId,
      pagination: {
        limit: 10,
        sort: [{
          by: 'timestamp',
          order: SortOrder.Desc
        }]
      }
    }
  }, [noteId]);

  const { data, loading, error, fetchMore } = useQuery<GetNoteMessagesQuery, GetNoteMessagesQueryVariables>(GET_NOTE_MESSAGES, {
    variables,
    skip: !noteId,
    fetchPolicy: 'network-only'
  });

  useEffect(() => {
    setMessages([]);
    setInit(false);
  }, [noteId])

  useEffect(() => {
    if (!init  && data?.noteMessages?.items) {      
      setMessages((data?.noteMessages?.items as NoteMessage[]).map((item) => {
        return {
          role: item.role as 'user' | 'assistant',
          content: item.content,
          timestamp: item.timestamp
        }
      }));

      setInit(true);
    }
  }, [data, init])

  const addMessage = (message: Message) => {
    const [firstMessage, ...restMessages] = messages;
    if (message.role === 'assistant' && firstMessage?.role === 'assistant') {
      firstMessage.content = `${firstMessage.content} ${message.content}`;
      setMessages([firstMessage, ...restMessages]);
    } else {
      setMessages([message, ...messages]);
    }

  }

  const fetchMoreMessages = async () => {
    if (!data?.noteMessages?.pageInfo?.next) {
      return;
    }

    try {
      const result = await fetchMore(
        {
          variables: {
            ...variables,
            pagination: {
              ...variables.pagination,
              next: data?.noteMessages?.pageInfo?.next
            }
          }
        }
      );

      if (result.data?.noteMessages?.items) {
        setMessages([...messages, ...(result.data.noteMessages.items as NoteMessage[]).map((item) => {
          return {
            role: item.role as 'user' | 'assistant',
            content: item.content,
            timestamp: item.timestamp
          }
        })]);

      }
    } catch (error) {
      console.error('[useNoteChat]: fetchMoreMessages', error);
    }
  }

  return {
    messages,
    addMessage,
    fetchMore: fetchMoreMessages
  }
}