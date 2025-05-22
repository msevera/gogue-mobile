import { View } from 'react-native';
import { Button } from './ui/Button';
import { cn } from '@/lib/utils';
import { PlayLine } from './PlayLine';
import { AudioStatus } from 'expo-audio';

export const LectureControls = ({
  status,
  className, isCreatingNote, onPlayPause, onNote
}:
  {
    status: AudioStatus,
    className?: string,
    isCreatingNote: boolean,
    onPlayPause: () => void,
    onNote: () => void
  }) => {
  return (
    <View className={cn('flex-1', className)}>
      <View className='flex-1 bg-white'>
        <PlayLine status={status} />
        <View className='flex-row items-center justify-between px-6 gap-4 mt-5'>
          <Button text='1 note' secondary sm className='bg-gray-100' textClassName='text-gray-500' />
          <View className='absolute left-0 right-0 top-0 bottom-0 items-center justify-center'>
            <Button
              sm
              secondary
              className='w-[50px] h-[50px]'
              icon={{
                component: !status.playing ? 'Ionicons' : 'MaterialIcons',
                name: !status.playing ? 'play' : 'pause',
                size: 24,
                // color: '#374151',
                className: !status.playing ? 'left-[2]' : 'left-[0]',
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
}