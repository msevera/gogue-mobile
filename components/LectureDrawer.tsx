import React, { useMemo } from 'react';
import { Keyboard, View } from 'react-native';
import { forwardRef, useImperativeHandle, useState } from 'react';
import { BottomSheet } from './BottomSheet';
import { LectureControls } from './LectureControls';
import { Text } from './ui/Text';
import { Input } from './ui/Input';
import { Button } from './ui/Button';
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Note } from '@/apollo/__generated__/graphql';
import { LectureInput } from './LectureInput';
import { useVoiceAgent } from '@/hooks/useVoiceAgent';

export interface LectureDrawerRef {
  open: () => void;
  close: () => void;
  getControlsDrawerClosedSnapPoint: () => string;
}

const controlsDrawerClosedSnapPoint = '200';
const controlsDrawerActiveInputSnapPoint = '420';
const controlsDrawerOnlyInputSnapPoint = '90';

const LectureDrawer = forwardRef<LectureDrawerRef, {
  notes: Note[],
  onPlayPause: () => void,
  onSeek: (position: number) => void,
  onSeekEnd: (position: number) => void,
  onSeekStart: (position: number) => void,
  onCreateNote: () => void,
  onAgentCreateNote: (noteId: string) => void,
  onCreateNoteLoading: boolean,
  onNotes: () => void,
  alignments: any,
  currentTime: number,
  isPlaying: boolean,
  duration: number,
  notesCount: number,
  noteId: string,
  lectureId: string
}>(({
  notes,
  onPlayPause,
  onSeek,
  onSeekEnd,
  onSeekStart,
  onCreateNote,
  onAgentCreateNote,
  onCreateNoteLoading,
  onNotes,
  alignments,
  currentTime,
  isPlaying,
  duration,
  notesCount,
  noteId,
  lectureId
}, ref) => {
  const { connect, connecting, disconnect, currentState, inCall, sendMessage, botReady } = useVoiceAgent({
    onNoteCreated: (noteId: string) => {
      onAgentCreateNote(noteId);
    }
  });

  const [agentMode, setAgentMode] = useState<'text' | 'voice' | null>(null);

  const [isNotesDrawerOpen, setIsNotesDrawerOpen] = useState(false);
  const [controlsDrawerSettings, setControlsDrawerSettings] = useState({
    snapPoints: [controlsDrawerClosedSnapPoint],
    // snapPoints: ['0'],
    backdrop: false,
    index: 0,
    gesturesEnabled: false
  });

  const [notesDrawerSettings, setNotesDrawerSettings] = useState({
    snapPoints: ['0'],
    backdrop: false,
    index: 0,
    gesturesEnabled: false
  });

  useImperativeHandle(ref, () => ({
    open: () => {
      showDrawer();
    },
    close: () => {
      hideDrawer();
    },
    getControlsDrawerClosedSnapPoint: () => {
      return controlsDrawerClosedSnapPoint;
    }
  }));

  const showDrawer = () => {
    setControlsDrawerSettings({
      ...controlsDrawerSettings,
      snapPoints: [isNotesDrawerOpen ? controlsDrawerOnlyInputSnapPoint : controlsDrawerClosedSnapPoint],
      backdrop: false,
    })
  }

  const hideDrawer = () => {
    setControlsDrawerSettings({
      ...controlsDrawerSettings,
      snapPoints: ['0'],
      backdrop: false,
    })
  }

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(isNotesDrawerOpen ? 0 : 1, { duration: 500 }),
    };
  });

  return (
    <>
      <BottomSheet
        title='Ask AI'
        backdrop={notesDrawerSettings.backdrop}
        gesturesEnabled={false}
        snapPoints={notesDrawerSettings.snapPoints}
        index={notesDrawerSettings.index}
        onBackdropPress={() => {
          disconnect();
          setAgentMode(null);
          Keyboard.dismiss();
          showDrawer();
          setControlsDrawerSettings({
            ...controlsDrawerSettings,
            snapPoints: [controlsDrawerClosedSnapPoint],
          });

          setNotesDrawerSettings({
            ...notesDrawerSettings,
            snapPoints: ['0'],
            backdrop: false,
          });

          setIsNotesDrawerOpen(false);
        }}
      >
        <View className='flex-1'>
          <Text>Notes</Text>
        </View>
      </BottomSheet>
      <BottomSheet
        customBackground
        gesturesEnabled={false}
        snapPoints={controlsDrawerSettings.snapPoints}
        index={controlsDrawerSettings.index}
        backdrop={controlsDrawerSettings.backdrop}
        onBackdropPress={() => {
          Keyboard.dismiss();
          showDrawer();
        }}
      >
        <View className='flex-row items-center justify-between px-4 gap-2 shadow-md shadow-gray-100'>
          <View className='flex-1'>
            <LectureInput
              agentMode={agentMode}
              loading={connecting}
              onTextSubmit={(text) => {
                sendMessage(text);
              }}
              onRecordPress={() => {
                setAgentMode('voice');
                connect({
                  lectureId: lectureId,
                  noteId: noteId,
                  noteTimestamp: currentTime
                });
              }}
              onFocus={() => {
                setAgentMode('text');
                connect({
                  lectureId: lectureId,
                  noteId: noteId,
                  noteTimestamp: currentTime
                });
                setControlsDrawerSettings({
                  ...controlsDrawerSettings,
                  snapPoints: [controlsDrawerActiveInputSnapPoint],
                });

                setNotesDrawerSettings({
                  ...notesDrawerSettings,
                  snapPoints: ['100%'],
                  backdrop: true,
                });

                setIsNotesDrawerOpen(true);
              }}
              onBlur={() => {
                Keyboard.dismiss();
                showDrawer();
              }}
              onPress={() => {
                setControlsDrawerSettings({
                  ...controlsDrawerSettings,
                  snapPoints: [controlsDrawerOnlyInputSnapPoint],
                });

                setNotesDrawerSettings({
                  ...notesDrawerSettings,
                  snapPoints: ['100%'],
                  backdrop: true,
                });

                setIsNotesDrawerOpen(true);
                Keyboard.dismiss();
              }}
            />
          </View>
        </View>
        <LinearGradient
          colors={['rgba(255,255,255,0)', 'rgba(255,255,255,1)', 'rgba(255,255,255,1)']}
          locations={[0, 0.18, 1]}
          style={{
            // borderWidth: 1,
            // borderColor: 'red',
            position: 'absolute',
            top: -20,
            left: 0,
            right: 0,
            bottom: 0,
            height: 200,
            zIndex: -1,
          }}
        />
        <Animated.View className='flex-1' style={animatedStyle}>
          <LectureControls
            currentTime={currentTime}
            isPlaying={isPlaying}
            duration={duration}
            onPlayPause={onPlayPause}
            onCreateNote={onCreateNote}
            onCreateNoteLoading={onCreateNoteLoading}
            onNotes={onNotes}
            onSeek={onSeek}
            onSeekEnd={onSeekEnd}
            onSeekStart={onSeekStart}
            alignments={alignments}
            notes={notes}
            notesCount={notesCount}
          />
        </Animated.View>
      </BottomSheet>

    </>
  );
});

LectureDrawer.displayName = 'LectureDrawer';

export default LectureDrawer; 