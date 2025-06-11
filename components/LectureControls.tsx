import React from 'react';
import { View } from 'react-native';
import { Button } from './ui/Button';
import { cn } from '@/lib/utils';
import { PlayLine } from './PlayLine';
import { Note } from '@/apollo/__generated__/graphql';

export const LectureControls = React.memo(({
  currentTime,
  isPlaying,
  duration,
  className,
  onPlayPause,
  onCreateNote,
  onCreateNoteLoading,
  onNotes,
  onSeek,
  onSeekEnd,
  alignments,
  onSeekStart,
  notes,
  notesCount
}:
  {
    className?: string,
    onPlayPause: () => void,
    onCreateNote: () => void,
    onCreateNoteLoading: boolean,
    onNotes: () => void,
    onSeek: (position: number) => void,
    onSeekEnd: (position: number) => void,
    alignments: any,
    currentTime: number,
    isPlaying: boolean,
    duration: number,
    onSeekStart: (position: number) => void,
    notes: Note[],
    notesCount: number
  }) => {  
  const added = false;
  return (
    <View className={cn('flex-1', className)}>
      <View className='flex-1 bg-white'>
        <PlayLine
          currentTime={currentTime}
          duration={duration}
          onSeek={onSeek}
          onSeekEnd={onSeekEnd}
          onSeekStart={onSeekStart}
          alignments={alignments}
          notes={notes}
        />
        <View className='flex-row items-center justify-between px-4 gap-4 mt-5'>
          <Button
            icon={{
              component: 'MaterialIcons',
              name: added ? 'star' : 'star-outline',
              color: added ? '#9ca3af' : '#374151',              
            }}
            disabled
            text={added ? 'Saved' : 'Save'}
            secondary
            sm
            className='bg-gray-100'
            textClassName={added ? 'text-gray-500' : 'text-gray-800'}
          />
          <View className='absolute left-0 right-0 top-0 bottom-0 items-center justify-center'>
            <Button
              sm
              secondary
              className='w-[50px] h-[50px]'
              icon={{
                component: !isPlaying ? 'Ionicons' : 'MaterialIcons',
                name: !isPlaying ? 'play' : 'pause',
                size: 24,
                // color: '#374151',
                className: !isPlaying ? 'left-[2]' : 'left-[0]',
              }}
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
                    icon={{
                      component: 'MaterialIcons',
                      name: 'notes',
                      color: '#374151',
                    }}
                    onPress={onNotes}
                  />
                </View>
              )
            }
            <Button
              icon={{
                component: 'MaterialIcons',
                name: 'add',
                color: '#374151',
              }}
              loading={onCreateNoteLoading}
              loaderColor='#374151'
              text="Note"
              secondary
              sm
              className='bg-gray-100'
              textClassName='text-gray-800'
              onPress={onCreateNote}
            />
          </View>
        </View>
      </View>
    </View>
  )
})