import { View } from 'react-native'
import { Text } from '@/components/ui/Text'
import { Message } from './conversation'

export default function LectureSubtitles({ message, title }: { message?: Message, title?: string }) {
  return (
    <View className='h-[105]'>
      {
        message ? (
          <View className='items-center'>
            <View className='rounded-xl bg-yellow-400 self-center mb-2'>
              <Text className='text-sm px-4 text-center'>{message.role === 'assistant' ? 'AI' : 'You'}</Text>
            </View>
            <Text className='text-2xl text-center'>{message.transcript}</Text>
          </View>
        ) : (
          <Text className='text-2xl px-4 text-center'>{title}</Text>
        )
      }
    </View>
  );
}