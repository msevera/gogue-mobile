import React, { useCallback, useMemo, useRef } from 'react';
import { Keyboard, View } from 'react-native';
import { forwardRef, useImperativeHandle, useState } from 'react';
import { BottomSheet } from './BottomSheet';
import { LectureControls, LectureControlsRef } from './LectureControls';
import { Text } from './ui/Text';
import { Input } from './ui/Input';
import { Button } from './ui/Button';
import Animated, { SharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Note } from '@/apollo/__generated__/graphql';
import { LectureInput } from './LectureInput';
import { useVoiceAgent } from '@/hooks/useVoiceAgent';
import { Alignment } from './TextHighlighter';
import { NoteDetails, NoteDetailsRef } from './NoteDetails';
import { CurrentSentence } from '@/hooks/useSentence';
import { Message } from '@/hooks/useNoteChat';
import { NotesList } from './NotesList';
import { cn } from '@/lib/utils';

export interface LectureDrawerRef {
  open: () => void;
  close: () => void;
  getControlsDrawerClosedSnapPoint: () => string;
  setPlayLineCurrentTime: (currentTime: number) => void;
}

const controlsDrawerClosedSnapPoint = '200';
const controlsDrawerActiveInputSnapPoint = '420';
const controlsDrawerOnlyInputSnapPoint = '90';
const controlsDrawerNoInputSnapPoint = '0';
const gradientStyle = {
  position: 'absolute',
  top: -20,
  left: 0,
  right: 0,
  bottom: 0,
  height: 200,
  zIndex: -1,
}

const LectureDrawer = forwardRef<LectureDrawerRef, {
  notes: Note[],
  onPlayPause: () => void,
  onSeek: (position: number) => void,
  onSeekEnd: (position: number) => void,
  onSeekStart: (position: number) => void,
  onCreateNote: () => void,
  onAgentCreateNote: (noteId: string) => void,
  onCreateNoteLoading: boolean,
  onDeleteNoteLoading: boolean,
  onNotes: () => void,
  onDeleteNote: (noteId: string) => void,
  onSelectNote: (note: Note) => void,
  sentences: any,
  isPlaying: boolean,
  duration: number,
  notesCount: number,
  noteId: string,
  lectureId: string,
  currentNote: Note,
  currentSentence: CurrentSentence
}>(({
  notes,
  onPlayPause,
  onSeek,
  onSeekEnd,
  onSeekStart,
  onCreateNote,
  onAgentCreateNote,
  onCreateNoteLoading,
  onDeleteNoteLoading,
  onNotes,
  onDeleteNote,
  onSelectNote,
  sentences,
  isPlaying,
  duration,
  notesCount,
  noteId,
  lectureId,
  currentNote,
  currentSentence
}, ref) => {
  const noteDetailsRef = useRef<NoteDetailsRef>(null);
  const lectureControlsRef = useRef<LectureControlsRef>(null);
  const { connect, connecting, disconnect, inCall, sendMessage } = useVoiceAgent({
    onNoteCreated: useCallback((noteId: string) => {
      onAgentCreateNote(noteId);
    }, [onAgentCreateNote]),
    onTranscript: useCallback((message: Message) => {
      noteDetailsRef.current?.addMessage(message);
    }, []),
  });

  const [agentMode, setAgentMode] = useState<'text' | 'voice' | null>(null);
  const [isNotesDrawerOpen, setIsNotesDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState<'noteDetails' | 'notesList' | null>(null);
  const [wasNotesListOpen, setWasNotesListOpen] = useState(false);

  const initialControlsDrawerSettings = useMemo(() => ({
    snapPoints: [controlsDrawerClosedSnapPoint],
    backdrop: false,
    index: 0,
    gesturesEnabled: false
  }), []);

  const initialNotesDrawerSettings = useMemo(() => ({
    snapPoints: ['0'],
    backdrop: false,
    index: 0,
    gesturesEnabled: false
  }), []);

  const [controlsDrawerSettings, setControlsDrawerSettings] = useState(initialControlsDrawerSettings);
  const [notesDrawerSettings, setNotesDrawerSettings] = useState(initialNotesDrawerSettings);

  useImperativeHandle(ref, () => ({
    open: () => {
      showDrawer();
    },
    close: () => {
      hideDrawer();
    },
    getControlsDrawerClosedSnapPoint: () => {
      return controlsDrawerClosedSnapPoint;
    },
    setPlayLineCurrentTime: (currentTime: number) => {
      lectureControlsRef.current?.setPlayLineCurrentTime(currentTime);
    }
  }), []);

  const showDrawer = useCallback(() => {
    setControlsDrawerSettings(prev => ({
      ...prev,
      snapPoints: [isNotesDrawerOpen ? controlsDrawerOnlyInputSnapPoint : controlsDrawerClosedSnapPoint],
      backdrop: false,
    }));
  }, [isNotesDrawerOpen]);

  const hideDrawer = useCallback(() => {
    setControlsDrawerSettings(prev => ({
      ...prev,
      snapPoints: ['0'],
      backdrop: false,
    }));
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: withTiming(isNotesDrawerOpen ? 0 : 1, { duration: 500 }),
  }), [isNotesDrawerOpen]);

  const connectToAgent = useCallback((enableMic: boolean) => {
    if (!inCall) {
      connect({
        lectureId,
        noteId: currentNote?.id || noteId,
        noteTimestamp: currentSentence?.sentence.start_time,
        enableMic
      });
    }
  }, [lectureId, noteId, currentSentence, currentNote, inCall, connect]);

  const openDrawer = useCallback((snapPoint: string) => {
    setControlsDrawerSettings(prev => ({
      ...prev,
      snapPoints: [snapPoint],
    }));

    setNotesDrawerSettings(prev => ({
      ...prev,
      snapPoints: ['100%'],
      backdrop: true,
    }));

    setIsNotesDrawerOpen(true);
  }, []);

  const handleBackdropPress = useCallback(() => {
    setWasNotesListOpen(false);
    disconnect();
    setAgentMode(null);
    Keyboard.dismiss();
    showDrawer();
    setControlsDrawerSettings(prev => ({
      ...prev,
      snapPoints: [controlsDrawerClosedSnapPoint],
    }));

    setNotesDrawerSettings(prev => ({
      ...prev,
      snapPoints: ['0'],
      backdrop: false,
    }));

    setIsNotesDrawerOpen(false);
  }, [disconnect, showDrawer]);

  const handleControlsBackdropPress = useCallback(() => {
    Keyboard.dismiss();
    showDrawer();
  }, [showDrawer]);

  const handleTextSubmit = useCallback((text: string) => {
    sendMessage(text);
  }, [sendMessage]);

  const handleRecordPress = useCallback(() => {
    setDrawerMode('noteDetails');
    setAgentMode('voice');
    connectToAgent(true);
  }, [connectToAgent]);

  const handleInputFocus = useCallback(() => {
    setDrawerMode('noteDetails');
    setAgentMode('text');
    connectToAgent(false);
    openDrawer(controlsDrawerActiveInputSnapPoint);
  }, [connectToAgent, openDrawer]);

  const handleInputBlur = useCallback(() => {
    Keyboard.dismiss();
    showDrawer();
  }, [showDrawer]);

  const handleInputPress = useCallback(() => {
    openDrawer(controlsDrawerOnlyInputSnapPoint);
    Keyboard.dismiss();
  }, [openDrawer]);

  const handleOpenNote = useCallback(() => {
    setDrawerMode('noteDetails');
    openDrawer(controlsDrawerOnlyInputSnapPoint);
  }, [openDrawer]);

  const handleOpenNoteFromList = useCallback((note: Note) => {
    onSelectNote(note);
    setDrawerMode('noteDetails');
    openDrawer(controlsDrawerOnlyInputSnapPoint);
  }, [openDrawer]);

  const handleNotesPress = useCallback(() => {
    setDrawerMode('notesList');
    setWasNotesListOpen(true)
    openDrawer(controlsDrawerNoInputSnapPoint);
  }, [openDrawer]);


  const handleDeleteNote = useCallback(async () => {
    await onDeleteNote(currentNote.id);    
    if (wasNotesListOpen && notes.length !== 1) {
      handleNotesPress();
    } else {
      handleBackdropPress();
    }
  }, [currentNote, handleNotesPress, handleBackdropPress, notes, wasNotesListOpen]);


  const memoizedNotesList = useMemo(() => (
    <NotesList
      notes={notes}
      onOpenNote={handleOpenNoteFromList}
    />
  ), [notes]);

  const memoizedNoteDetails = useMemo(() => (
    <NoteDetails
      ref={noteDetailsRef}
      currentNote={currentNote}
      currentSentence={currentSentence}
      onDelete={handleDeleteNote}
      onDeleteNoteLoading={onDeleteNoteLoading}
    />
  ), [currentNote, currentSentence, onDeleteNoteLoading, wasNotesListOpen]);

  const memoizedLectureInput = useMemo(() => (
    <LectureInput
      agentMode={agentMode}
      loading={connecting}
      onTextSubmit={handleTextSubmit}
      onRecordPress={handleRecordPress}
      onFocus={handleInputFocus}
      onBlur={handleInputBlur}
      onPress={handleInputPress}
    />
  ), [agentMode, connecting, handleTextSubmit, handleRecordPress, handleInputFocus, handleInputBlur, handleInputPress]);

  const memoizedLectureControls = useMemo(() => (
    <LectureControls
      ref={lectureControlsRef}
      isPlaying={isPlaying}
      duration={duration}
      onPlayPause={onPlayPause}
      onCreateNote={onCreateNote}
      onCreateNoteLoading={onCreateNoteLoading}
      onNotes={handleNotesPress}
      onSeek={onSeek}
      onSeekEnd={onSeekEnd}
      onSeekStart={onSeekStart}
      sentences={sentences}
      notes={notes}
      notesCount={notesCount}
      currentNote={currentNote}
      onOpenNote={handleOpenNote}
    />
  ), [
    isPlaying,
    duration,
    onPlayPause,
    onCreateNote,
    onCreateNoteLoading,
    onNotes,
    onSeek,
    onSeekEnd,
    onSeekStart,
    sentences,
    notes,
    notesCount,
    currentNote,
    handleOpenNote
  ]);

  return (
    <>
      <BottomSheet
        title={drawerMode === 'noteDetails' ? 'Ask AI' : 'Notes'}
        headerLeft={
          drawerMode === 'noteDetails' &&
          wasNotesListOpen &&
          <Button
            sm
            ghost
            icon={
              {
                component: 'Ionicons',
                name: 'chevron-back',
                className: 'left-[-1]'
              }
            }
            onPress={handleNotesPress}
            className="bg-gray-50"
            textClassName='text-gray-800'
          />
        }
        backdrop={notesDrawerSettings.backdrop}
        gesturesEnabled={false}
        snapPoints={notesDrawerSettings.snapPoints}
        index={notesDrawerSettings.index}
        onBackdropPress={handleBackdropPress}
      >
        <View className='flex-1'>
          <View className={cn('flex-1', drawerMode !== 'notesList' && 'hidden')}>
            {memoizedNotesList}
          </View>
          <View className={cn('flex-1', drawerMode !== 'noteDetails' && 'hidden')}>
            {memoizedNoteDetails}
          </View>
        </View>
      </BottomSheet>
      <BottomSheet
        customBackground
        gesturesEnabled={false}
        snapPoints={controlsDrawerSettings.snapPoints}
        index={controlsDrawerSettings.index}
        backdrop={controlsDrawerSettings.backdrop}
        onBackdropPress={handleControlsBackdropPress}
      >
        <View className='flex-row items-center justify-between px-4 gap-2 shadow-md shadow-gray-100'>
          <View className='flex-1'>
            {memoizedLectureInput}
          </View>
        </View>
        <LinearGradient
          colors={['rgba(255,255,255,0)', 'rgba(255,255,255,1)', 'rgba(255,255,255,1)']}
          locations={[0, 0.18, 1]}
          style={gradientStyle}
        />
        <Animated.View className='flex-1' style={animatedStyle}>
          {memoizedLectureControls}
        </Animated.View>
      </BottomSheet>
    </>
  );
});

LectureDrawer.displayName = 'LectureDrawer';

export default React.memo(LectureDrawer); 