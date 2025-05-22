import React from 'react';
import { View } from 'react-native';
import { Button } from './ui/Button';
import { cn } from '@/lib/utils';
import { PlayLine } from './PlayLine';

export const LectureControls = React.memo(({
  currentTime,
  isPlaying,
  duration,
  className, isCreatingNote, onPlayPause, onNote, onSeek, onSeekEnd, alignments, onSeekStart
}:
  {
    className?: string,
    isCreatingNote: boolean,
    onPlayPause: () => void,
    onNote: () => void,
    onSeek: (position: number) => void,
    onSeekEnd: (position: number) => void,
    alignments: any,
    currentTime: number,
    isPlaying: boolean,
    duration: number,
    onSeekStart: (position: number) => void
  }) => {
  return (
    <View className={cn('flex-1', className)}>
      <View className='flex-1 bg-white'>
        <PlayLine currentTime={currentTime} duration={duration} onSeek={onSeek} onSeekEnd={onSeekEnd} onSeekStart={onSeekStart} alignments={alignments} />
        <View className='flex-row items-center justify-between px-6 gap-4 mt-5'>
          <Button text='1 note' secondary sm className='bg-gray-100' textClassName='text-gray-500' />
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
          <Button
            sm
            className={`bg-gray-100 w-[40px] h-[40px]`}
            icon={{
              component: 'MaterialIcons',
              name: 'bookmark-add',
              size: 24,
              color: '#374151',
            }}
            onPress={onNote}
            loading={isCreatingNote}
            loaderColor='#374151'
            loaderClassName='top-[1]'
          />
        </View>
      </View>
    </View>
  )
})