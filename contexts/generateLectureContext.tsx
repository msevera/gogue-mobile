import {
  type PropsWithChildren,
  useState,
} from 'react';
import EventSource from 'react-native-sse';
import { getAuthHeaders } from '@/apollo/settings';
import { createContext } from 'use-context-selector';
import { GeneratingLecturePlanMessage, GeneratingLectureContentMessage, GeneratingLectureCreatedMessage } from '@/types/generatingLectureType';
import { useApolloClient } from '@apollo/client';
import { GET_LECTURE } from '@/apollo/queries/lectures';

export type EventState = {
  id: string;
  type: string;
  data?: GeneratingLecturePlanMessage | GeneratingLectureContentMessage | GeneratingLectureCreatedMessage;
}

export const GenerateLectureContext = createContext<{
  streamInProgress: boolean;
  eventsState: EventState[];
  stream: (description: string, duration: number) => Promise<void>;
}>({
  streamInProgress: false,
  eventsState: [],
  stream: () => Promise.resolve(),
});

export function GenerateLectureProvider({ children }: PropsWithChildren) {
  const [streamInProgress, setStreamInProgress] = useState(false);
  const [eventsState, setEventsState] = useState<EventState[]>([]);
  const client = useApolloClient();

  // useEffect(() => {
  //   const timeouts: NodeJS.Timeout[] = [];
  //   // Add initial event
  //   timeouts.push(setTimeout(() => {
  //     setEventsState((prev) => [...prev, {
  //       id: `${new Date().getTime().toString()}-normalizing`,
  //       type: 'NORMALIZING_TOPIC',
  //     }]);
  //     setEventsState((prev) => [...prev, {
  //       id: `${new Date().getTime().toString()}-generating`,
  //       type: 'GENERATING_PLAN',
  //       data: {
  //         topic: 'Introduction into AI for Project Managers',
  //         title: 'AI for Project Managers',
  //       },
  //     }]);
  //     setEventsState((prev) => [...prev, {
  //       id: `${new Date().getTime().toString()}-generating-content`,
  //       type: 'GENERATING_CONTENT',
  //       data: {
  //         title: 'Introduction to AI in Project Management',
  //       },
  //     }]);
  //     setEventsState((prev) => [...prev, {
  //       id: `${new Date().getTime().toString()}-generating-content`,
  //       type: 'GENERATING_CONTENT',
  //       data: {
  //         title: 'Understanding AI Capabilities',
  //       },
  //     }]);
  //   }, 3000));

  //   // console.log('push');
  //   // // Add generating plan event
  //   // timeouts.push(setTimeout(() => {
  //   //   setEventsState((prev) => [...prev, {
  //   //     id: `${new Date().getTime().toString()}-generating`,
  //   //     type: 'GENERATING_PLAN',
  //   //     data: {
  //   //       topic: 'Introduction into AI for Project Managers',
  //   //       title: 'AI for Project Managers',
  //   //     },
  //   //   }]);
  //   // }, 5000));

  //   // // Add generating content event
  //   // timeouts.push(setTimeout(() => {
  //   //   setEventsState((prev) => [...prev, {
  //   //     id: `${new Date().getTime().toString()}-generating-content`,
  //   //     type: 'GENERATING_CONTENT',
  //   //     data: {
  //   //       title: 'Introduction to AI in Project Management',
  //   //     },
  //   //   }]);
  //   // }, 7000));

  //   //  // Add generating content event
  //   //  timeouts.push(setTimeout(() => {
  //   //   setEventsState((prev) => [...prev, {
  //   //     id: `${new Date().getTime().toString()}-generating-content`,
  //   //     type: 'GENERATING_CONTENT',
  //   //     data: {
  //   //       title: 'Understanding AI Capabilities',
  //   //     },
  //   //   }]);
  //   // }, 9000));

  //    // Add generating content event
  //    timeouts.push(setTimeout(() => {
  //     setEventsState((prev) => [...prev, {
  //       id: `${new Date().getTime().toString()}-generating-content`,
  //       type: 'GENERATING_CONTENT',
  //       data: {
  //         title: 'AI Tools and Technologies',
  //       },
  //     }]);
  //   }, 20000));

  //   // timeouts.push(setTimeout(() => {
  //   //   setEventsState((prev) => [...prev, {
  //   //     id: `${new Date().getTime().toString()}-generating-content`,
  //   //     type: 'GENERATING_CONTENT',
  //   //     data: {
  //   //       title: 'Implementing AI in Project Workflows',
  //   //     },
  //   //   }]);
  //   // }, 13000));

  //   // timeouts.push(setTimeout(() => {
  //   //   setEventsState((prev) => [...prev, {
  //   //     id: `${new Date().getTime().toString()}-generating-content`,
  //   //     type: 'GENERATING_CONTENT',
  //   //     data: {
  //   //       title: 'Challenges and Considerations',
  //   //     },
  //   //   }]);
  //   // }, 15000));

  //   // timeouts.push(setTimeout(() => {
  //   //   setEventsState((prev) => [...prev, {
  //   //     id: `${new Date().getTime().toString()}-generating-content`,
  //   //     type: 'GENERATING_CONTENT',
  //   //     data: {
  //   //       title: 'Conclusion and Future Outlook',
  //   //     },
  //   //   }]);
  //   // }, 17000));

  //   // Add finalizing event
  //   timeouts.push(setTimeout(() => {
  //     setEventsState((prev) => [...prev, {
  //       id: `${new Date().getTime().toString()}-finalizing`,
  //       type: 'FINALIZING',
  //     }]);
  //   }, 25000));

  //   timeouts.push(setTimeout(() => {
  //     setEventsState((prev) => [...prev, {
  //       id: `${new Date().getTime().toString()}-lecture-created`,
  //       type: 'LECTURE_CREATED',
  //       data: {
  //         lectureId: '1234',
  //       },
  //     }]);
  //     // router.replace(`/lectures/1234`);
  //   }, 30000));

  //   // Cleanup function to clear all timeouts
  //   return () => {
  //     timeouts.forEach(timeout => clearTimeout(timeout));
  //   };
  // }, []);

  const stream = async (description: string, duration: number) => {
    setStreamInProgress(true);    
    const es = new EventSource<'NORMALIZING_TOPIC' | 'GENERATING_PLAN' | 'GENERATING_CONTENT' | 'FINALIZING' | 'LECTURE_CREATED' | 'DONE'>(
      `${process.env.EXPO_PUBLIC_API_ENDPOINT}/lecture-agent/create`,
      {
        method: 'POST',
        debug: false,
        headers: {
          'Content-Type': 'application/json',
          ...(await getAuthHeaders())
        },
        body: JSON.stringify({
          input: description,
          duration
        }),
      });

    es.addEventListener('NORMALIZING_TOPIC', (msg) => {
      console.log('NORMALIZING_TOPIC', msg);
      setEventsState((prev) => {
        return [...prev, {
          id: `${new Date().getTime().toString()}-normalizing`,
          type: 'NORMALIZING_TOPIC',
        }]
      })
    });

    es.addEventListener('GENERATING_PLAN', (msg) => {
      console.log('GENERATING_PLAN', msg);
      let message = JSON.parse(msg.data!) as GeneratingLecturePlanMessage;
      setEventsState((prev) => {
        return [...prev, {
          id: `${new Date().getTime().toString()}-generating`,
          type: 'GENERATING_PLAN',
          data: message
        }]
      })
    });

    es.addEventListener('GENERATING_CONTENT', (msg) => {
      console.log('GENERATING_CONTENT', msg);
      let message = JSON.parse(msg.data!) as GeneratingLectureContentMessage;
      setEventsState((prev) => {
        return [...prev, {
          id: `${new Date().getTime().toString()}-generating-${message.title.split(' ').join('-')}`,
          type: 'GENERATING_CONTENT',
          data: message
        }]
      })
    });

    es.addEventListener('FINALIZING', (msg) => {
      console.log('FINALIZING', msg);
      setEventsState((prev) => {
        return [...prev, {
          id: `${new Date().getTime().toString()}-finalizing`,
          type: 'FINALIZING',
        }]
      })
    });

    es.addEventListener('LECTURE_CREATED', async (msg) => {
      console.log('LECTURE_CREATED', msg);
      let message = JSON.parse(msg.data!) as GeneratingLectureCreatedMessage;    
      setEventsState((prev) => {
        return [...prev, {
          id: `${new Date().getTime().toString()}-lecture-created`,
          type: 'LECTURE_CREATED',
          data: message
        }]
      });

      // Fetch the newly created lecture
      const { data: lectureData } = await client.query({
        query: GET_LECTURE,
        variables: { id: message.lectureId }
      });

      // Update the lectures list cache
      if (lectureData?.lecture) {
        client.cache.modify({
          fields: {
            lectures(existingLectures = { items: [] }) {
              const newLectures = {
                ...existingLectures,
                items: [lectureData.lecture, ...existingLectures.items]
              };
              return newLectures;
            }
          }
        });
      }
    });

    es.addEventListener('DONE', (msg) => {
      console.log('DONE', msg);
      es.close();
    });

    es.addEventListener('open', (msg) => {
     
    });

    es.addEventListener('close', async (msg) => {
      setStreamInProgress(false);
      es.close();
    });

    es.addEventListener('error', (event) => {
      es.close();
      if (event.type === 'error') {
        console.error('Connection error:', JSON.stringify(event));
      } else if (event.type === 'exception') {
        console.error('Error:', event.message, event.error);
      }
    });
  };

  return (
    <GenerateLectureContext.Provider
      value={{
        streamInProgress,
        stream,
        eventsState,
      }}>
      {children}
    </GenerateLectureContext.Provider>
  );
}
