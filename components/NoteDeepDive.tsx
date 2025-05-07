import { Keyboard, Pressable, View } from 'react-native'
import { GlobalDrawer } from './globalDrawer/GlobalDrawer'
import { forwardRef, useEffect, useMemo, useState } from 'react';
import { LectureControls } from './vapi/lectureControls';
import { CALL_STATUS, useVapi } from './vapi/useVapi';
import LectureStart from './vapi/lectureStart';
import { Message } from './vapi/conversation';
import LectureSubtitles from './vapi/lectureSubtitles';
import { Note } from '@/apollo/__generated__/graphql';
import { Text } from './ui/Text';
import { BottomSheet } from './BottomSheet';

export const NoteDeepDive = forwardRef(({ note, visible, onClose }: { note: Note, visible: boolean, onClose: () => void }, ref) => {
  const {
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
    createNote,
    elapsedTime
  } = useVapi({
    noteId: note.id as string,
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
  
  const [text, setText] = useState('');
  const [activeMessage, setActiveMessage] = useState<Message | undefined>();
  const [noteAgentIsLoading, setNoteAgentIsLoading] = useState(true);
  const [innerDrawerSettings, setInnerDrawerSettings] = useState({
    snapPoints: ['0'],
    backdrop: false,
    index: 0,
    gesturesEnabled: false,
    closeByGestureEnabled: false
  });

  const drawerSettings = useMemo(() => ({
    snapPoints: visible ? ['100%'] : [0],
    backdrop: visible,
    index: 0,
    gesturesEnabled: false,
    closeByGestureEnabled: false
  }), [visible]);

  const showInnerDrawerBackdrop = () => {
    setInnerDrawerSettings({
      ...innerDrawerSettings,
      backdrop: true,
    })
  }

  const showInnerDrawer = () => {
    setInnerDrawerSettings({
      ...innerDrawerSettings,
      snapPoints: ['120'],
      backdrop: false,
    })
  }

  const hideInnerDrawerBackdrop = () => {    
    setInnerDrawerSettings({
      ...innerDrawerSettings,      
      backdrop: false,
    })
  }
  
  useEffect(() => {
    if (callStatus === CALL_STATUS.ACTIVE) {
      showInnerDrawer();
    } 
  }, [callStatus])

  useEffect(() => {
    if (visible) {
      start();
    } else {
      stop();
    }
  }, [visible]);

  return (
    <GlobalDrawer title='Ask about note' headerBorder drawerSettings={drawerSettings}
      onBackdropPress={() => {
        Keyboard.dismiss();
        onClose();
      }}>
      <View className='flex-1'>
        <Pressable className='flex-1 items-center justify-evenly p-4 mb-[100] mt-[100]'
          onPressIn={() => setMuted(false)}
          onPressOut={() => setMuted(true)}
        >
          <Text className='text-[40px] text-center mb-[50]'>{note.lecture.emoji}</Text>
          <LectureSubtitles message={activeMessage} title={note.title} />
          <View className='items-center h-[100] mt-[50]'>
            <LectureStart
              isStarted
              isLoading={callStatus !== CALL_STATUS.ACTIVE || noteAgentIsLoading}
              isPlaying={callStatus === CALL_STATUS.ACTIVE}             
              isHolding={!isMuted}
              onHoldStart={() => setMuted(false)}
              onHoldEnd={() => setMuted(true)}
            />
          </View>
        </Pressable>
        <BottomSheet
          customBackground
          gesturesEnabled={false}
          snapPoints={innerDrawerSettings.snapPoints}
          index={innerDrawerSettings.index}
          backdrop={innerDrawerSettings.backdrop}
          backdropClassName='bg-white/80'
          onBackdropPress={() => {
            Keyboard.dismiss();
            hideInnerDrawerBackdrop();
          }}
        >
          <LectureControls
            elapsedTime={elapsedTime}
            className='pb-8'
            text={text}
            setText={setText}
            onInputFocus={() => {
              showInnerDrawerBackdrop();
            }}
            onInputBlur={() => {
              Keyboard.dismiss();
              hideInnerDrawerBackdrop();
            }}
            isRewinding={tryingToRewind}
            isPaused={isPaused}
            showPause={callStatus === CALL_STATUS.ACTIVE}
            isPausing={tryingToPause}
            isCreatingNote={tryingToCreateNote}
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
        </BottomSheet>
      </View>
    </GlobalDrawer>
  )
})