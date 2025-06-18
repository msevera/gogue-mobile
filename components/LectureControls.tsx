import React, { forwardRef, useCallback, useImperativeHandle, useMemo, useRef } from 'react';
import { View } from 'react-native';
import { Button } from './ui/Button';
import { cn } from '@/lib/utils';
import { PlayLine, PlayLineRef } from './PlayLine';
import { Note } from '@/apollo/__generated__/graphql';
import { SharedValue } from 'react-native-reanimated';

type IconComponent = 'Ionicons' | 'MaterialIcons' | 'AntDesign' | 'Entypo' | 'EvilIcons' | 'Feather' | 'Fontisto' | 'FontAwesome' | 'FontAwesome5' | 'FontAwesome6' | 'Foundation' | 'MaterialCommunityIcons';

interface IconConfig {
  component: IconComponent;
  name: string;
  color?: string;
  size?: number;
  className?: string;
}

export interface LectureControlsRef {
  setPlayLineCurrentTime: (currentTime: number) => void;
}

export const LectureControls = React.memo(forwardRef<LectureControlsRef, {
  className?: string,
  onPlayPause: () => void,
  onCreateNote: () => void,
  onOpenNote: (note: Note) => void,
  onCreateNoteLoading: boolean,
  onNotes: () => void,
  onSeek: (position: number) => void,
  onSeekEnd: (position: number) => void,
  sentences: any,
  isPlaying: boolean,
  duration: number,
  onSeekStart: (position: number) => void,
  notes: Note[],
  notesCount: number,
  currentNote: Note,
  bars: number[]
}>(({
  isPlaying,
  duration,
  className,
  onPlayPause,
  onCreateNote,
  onCreateNoteLoading,
  onNotes,
  onSeek,
  onSeekEnd,
  sentences,
  onSeekStart,
  notes,
  notesCount,
  currentNote,
  onOpenNote,
  bars
}, ref) => {
  const playLineRef = useRef<PlayLineRef>(null);

  useImperativeHandle(ref, () => ({
    setPlayLineCurrentTime(currentTime: number) {
      playLineRef.current?.setCurrentTime(currentTime);
    }
  }), []);

  const onNotePress = useCallback(() => {
    if (currentNote) {
      onOpenNote(currentNote);
    } else {
      onCreateNote();
    }
  }, [currentNote, onOpenNote, onCreateNote]);

  const playPauseButtonConfig: IconConfig = useMemo(() => ({
    component: !isPlaying ? 'Ionicons' : 'MaterialIcons',
    name: !isPlaying ? 'play' : 'pause',
    size: 24,
    className: !isPlaying ? 'left-[2]' : 'left-[0]',
  }), [isPlaying]);

  const noteButtonConfig: IconConfig = useMemo(() => ({
    component: 'MaterialIcons',
    name: currentNote ? 'arrow-upward' : 'add',
    color: '#374151',
  }), [currentNote]);

  const notesButtonConfig: IconConfig = useMemo(() => ({
    component: 'MaterialIcons',
    name: 'notes',
    color: '#374151',
  }), []);

  return (
    <View className={cn('flex-1', className)}>
      <View className='flex-1 bg-white'>
        <PlayLine
          ref={playLineRef}
          duration={duration}
          onSeek={onSeek}
          onSeekEnd={onSeekEnd}
          onSeekStart={onSeekStart}
          sentences={sentences}
          notes={notes}
          bars={bars}
        />
        <View className='flex-row items-center justify-between px-4 gap-4 mt-5'>
          <Button
            icon={{
              component: 'MaterialIcons',
              name: 'star-outline',
              color: '#374151',
            }}
            disabled
            text="Save"
            secondary
            sm
            className='bg-gray-100'
            textClassName='text-gray-800'
          />
          <View className='absolute left-0 right-0 top-0 bottom-0 items-center justify-center'>
            <Button
              sm
              secondary
              className='w-[50px] h-[50px]'
              icon={playPauseButtonConfig}
              onPress={onPlayPause}
              loaderColor='#374151'
              loaderClassName='top-[1]'
            />
          </View>
          <View className='flex-row items-center gap-2'>
            {
              notesCount > 0 && (
                <View className='flex-row items-center gap-2'>
                  <Button
                    text={notesCount.toString()}
                    secondary
                    sm
                    className='bg-gray-100'
                    textClassName='text-gray-800'
                    icon={notesButtonConfig}
                    onPress={onNotes}
                  />
                </View>
              )
            }
            <Button
              icon={noteButtonConfig}
              loading={onCreateNoteLoading}
              loaderColor='#374151'
              text="Note"
              secondary
              sm
              className={cn(currentNote ? 'bg-yellow-300' : 'bg-gray-100')}
              textClassName='text-gray-800'
              onPress={onNotePress}
            />
          </View>
        </View>
      </View>
    </View>
  )
}))