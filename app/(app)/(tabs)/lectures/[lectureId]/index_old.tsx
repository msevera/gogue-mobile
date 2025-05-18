import { useLocalSearchParams } from 'expo-router';
import { ScreenLayout } from '@/components/layouts/ScreenLayout';
import { useQuery } from '@apollo/client';
import { Pressable, View } from 'react-native';
import { Text } from '@/components/ui/Text';
import { GET_LECTURE } from '@/apollo/queries/lectures';
import { Lecture } from '@/apollo/__generated__/graphql';
import { CALL_STATUS, useVapi } from '@/components/vapi/useVapi';
import { Message } from '@/components/vapi/conversation';
import { useEffect, useRef, useState } from 'react';
import LectureSubtitles from '@/components/vapi/lectureSubtitles';
import LectureStart from '@/components/vapi/lectureStart';
import LectureDrawer from '@/components/vapi/lectureDrawer';

export default function Screen() {
  const { lectureId } = useLocalSearchParams();
  const lectureDrawerRef = useRef<{ open: () => void, close: () => void }>(null);  
  const [activeMessage, setActiveMessage] = useState<Message | undefined>();  
  const {
    elapsedTime,
    sendMessage,
    tryingToPause,
    tryingToRewind,
    tryingToCreateNote,
    isPaused,
    pause,
    unpause,
    start,
    stop,
    callStatus,
    isMuted,
    setMuted,
    rewind, 
    createNote   
  } = useVapi({
    lectureId: lectureId as string,
    onMessage: (message: Message) => {
      if (message.type === "transcript") {       
        setActiveMessage(message);
      }      
    },
    onError: (error) => {
      setActiveMessage(undefined);
    },
    onCallEnd: () => {
      setActiveMessage(undefined);
    },
    onSpeechStart: () => {
      console.log('speech has started');
    },
    onSpeechEnd: () => {
      console.log('speech has ended');
    }
  });

  useEffect(() => {
    return () => {
      stop();
    }
  }, [])

  useEffect(() => {
    if (callStatus === CALL_STATUS.ACTIVE) {
      lectureDrawerRef.current?.open();
    }

    if (callStatus === CALL_STATUS.INACTIVE) {
      lectureDrawerRef.current?.close();
    }
  }, [callStatus]);

  const { data: { lecture } = {}, loading } = useQuery(GET_LECTURE, {
    fetchPolicy: 'network-only',
    variables: {
      id: lectureId as string,
    },
    skip: !lectureId,
    onError: (error) => {
      console.log('GET_LECTURE error', error);
    }
  });

  const lectureData = lecture as Lecture;

  return (
    <View className="flex-1">
      <ScreenLayout
        screenOptions={{
          headerLoading: loading,
          headerTitle: lectureData?.title,
          headerShown: true,
        }}
        contentLoading={loading}
        contentEmpty={false}
        contentEmptyText='Create your first lecture'
        bottomPadding={false}
      >
        {
          lectureData && (
            <View className='flex-1'>
              <Pressable className='flex-1 items-center justify-evenly px-4 mb-[100]'
                onPressIn={() => setMuted(false)}
                onPressOut={() => setMuted(true)}
              >
                <Text className='text-[40px] text-center'>{lectureData.emoji}</Text>
                <LectureSubtitles message={activeMessage} title={lectureData.topic} />
                <View className='items-center h-[100]'>
                  <LectureStart
                    isStarted={!!lectureData.checkpoint}
                    isLoading={callStatus === CALL_STATUS.LOADING}
                    isPlaying={callStatus === CALL_STATUS.ACTIVE}
                    onStartPress={() => {
                      start();
                    }}
                    isHolding={!isMuted}
                    onHoldStart={() => setMuted(false)}
                    onHoldEnd={() => setMuted(true)}
                  />
                </View>
              </Pressable>
              <LectureDrawer
                ref={lectureDrawerRef}
                elapsedTime={elapsedTime}
                isPaused={isPaused}
                isPausing={tryingToPause}
                isRewinding={tryingToRewind}
                isCreatingNote={tryingToCreateNote}
                showPause={callStatus === CALL_STATUS.ACTIVE}
                onPause={() => {
                  if (isPaused) {
                    unpause();
                  } else {
                    pause();
                  }
                }}
                onRewind={() => {
                  rewind();
                }}
                onNote={() => {
                  createNote();
                }}
                onSubmit={(text: string) => {
                  sendMessage(text);
                }}
              />
            </View>
          )
        }
      </ScreenLayout>
    </View>
  );
}
