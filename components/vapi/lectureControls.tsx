import { Keyboard, View } from 'react-native';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { cn } from '@/lib/utils';


export const LectureControls = ({
  elapsedTime,
  className, text, setText, onInputFocus, onInputBlur, onRewind, isRewinding, isPaused, showPause, isPausing, isCreatingNote, onPause, onSubmit, onNote
}:
  {
    elapsedTime: number,
    className?: string, text: string, setText: (text: string) => void, onInputFocus: () => void, onInputBlur: () => void, onRewind: () => void, isRewinding: boolean, isPaused: boolean, showPause: boolean, isPausing: boolean, isCreatingNote: boolean, onPause: () => void, onSubmit: (text: string) => void, onNote: () => void
  }) => {
  return (
    <View className={cn('flex-1 bg-white rounded-t-3xl border border-gray-200 p-4', className)}>
      <View>
        <Input
          value={text}
          onChangeText={setText}
          placeholder='Type to ask'
          componentClassName='border-1 p-0'
          onFocus={onInputFocus}
          onBlur={onInputBlur}
        />
      </View>
      <View className='flex-row items-center justify-between mt-3'>
        <Button sm className='bg-gray-100' text={`${String(Math.floor(elapsedTime / 60)).padStart(2, '0')}:${String(elapsedTime % 60).padStart(2, '0')}`} textClassName='text-gray-500' />
        <View className='flex-row items-center gap-3'>
          <Button
            sm
            className='bg-gray-100 w-[40px] h-[40px]'
            icon={{
              component: 'MaterialCommunityIcons',
              name: 'rewind-10',
              size: 24,
              color: '#374151',
            }}
            onPress={onRewind}
            loading={isRewinding}
            loaderColor='#374151'
            loaderClassName='top-[1]'
          />
          {showPause && (
            <Button
              sm
              className='bg-gray-100 w-[40px] h-[40px]'
              icon={{
                component: isPaused ? 'Ionicons' : 'MaterialIcons',
                name: isPaused ? 'play' : 'pause',
                size: 24,
                color: '#374151',
                className: isPaused ? 'left-[2]' : 'left-[0]',
              }}
              onPress={onPause}
              loading={isPausing}
              loaderColor='#374151'
              loaderClassName='top-[1]'
            />
          )}
          <Button
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
          />
        </View>
      </View>
    </View>
  )
}