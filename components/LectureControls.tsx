import { Keyboard, View } from 'react-native';
import { Input } from './ui/Input';
import { Button } from './ui/Button';
import { cn } from '@/lib/utils';
import { PlayLine } from './PlayLine';
import { AudioStatus } from 'expo-audio';


export const LectureControls = ({
  status,
  className, text, setText, onInputFocus, onInputBlur, onRewind, isPlaying, isCreatingNote, onPlayPause, onSubmit, onNote
}:
  {
    status: AudioStatus,
    elapsedTime: number,
    className?: string, text: string, setText: (text: string) => void, onInputFocus: () => void, onInputBlur: () => void, onRewind: () => void, isPlaying: boolean, isCreatingNote: boolean, onPlayPause: () => void, onSubmit: (text: string) => void, onNote: () => void
  }) => {
  const isHolding = false;
  return (
    <View className={cn('flex-1 bg-white rounded-t-4xl border border-gray-200', className)}>
      <View className='flex-row items-center justify-between p-4 gap-2'>
        <View className='flex-1'>
          <Input
            value={text}
            onChangeText={setText}
            placeholder='Ask anything'
            componentClassName='border-1 p-1 px-4 pr-1 rounded-4xl bg-gray-100'
            onFocus={onInputFocus}
            onBlur={onInputBlur}
            right={<View className='flex-row items-center gap-2'>
              <Button
                secondary
                className={`p-2 border-1 bg-gray-100`}
                textClassName={`${isHolding ? 'text-red-400' : 'text-gray-300'}`}
                // onPressIn={onHoldStart}
                // onPressOut={onHoldEnd}
                icon={{
                  component: 'Ionicons',
                  name: 'mic',
                  size: 24,
                  color: '#374151',
                }}
              // text={!isHolding ? 'Hold to ask' : 'Speak'}
              />
            </View>}
          />
        </View>       
      </View>
      <View className='pt-0'>
        <PlayLine status={status} />
      </View>
      <View className='flex-row items-center justify-center px-4 gap-4 mt-3'>
        {/* <Button
          sm
          className='bg-gray-100 w-[40px] h-[40px]'
          icon={{
            component: 'MaterialCommunityIcons',
            name: 'rewind-10',
            size: 24,
            color: '#374151',
          }}
          onPress={onRewind}
          loaderColor='#374151'
          loaderClassName='top-[1]'
        /> */}
        <Button
          sm
          secondary
          className='w-[40px] h-[40px]'
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
        {/* <Button
          sm
          className={`bg-gray-100 w-[40px] h-[40px] ${text.length > 0 ? 'bg-gray-950' : ''}`}
          icon={{
            component: text.length > 0 ? 'MaterialIcons' : 'MaterialCommunityIcons',
            name: text.length > 0 ? 'arrow-upward' : 'note-plus-outline',
            size: 24,
            color: text.length > 0 ? 'white' : '#374151',
          }}
          onPress={() => {
            if (text.length > 0) {
              Keyboard.dismiss();
              onSubmit(text);
              setText('');
            } else {
              onNote();
            }
          }}
          loading={isCreatingNote}
          loaderColor='#374151'
          loaderClassName='top-[1]'
        /> */}
      </View>
    </View>
  )
}