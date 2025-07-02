import { Pressable, View } from 'react-native'
import { Text } from './ui/Text'
import { cn } from '@/lib/utils'

type TabItem = {
  text: string,
  value: string,
}

export type TabProps = {
  source: TabItem[],
  value: string,
  onChange: (value: string) => void,
}

export const Tabs = ({ source, value, onChange }: TabProps) => {

  return (
    <View className='flex-row items-center gap-6'>
      {
        source.map((item) => (
          <Pressable
            key={item.value}
            onPress={() => onChange(item.value)}
          >
            <View className={cn('flex-row items-center gap-4 border-b-2 border-transparent pb-2', {
              'border-b-2 border-blue-500': item.value === value
            })}>
              <Text className={cn('text-base text-gray-500 font-semibold', {
                'text-gray-950': item.value === value
              })}>{item.text}</Text>
            </View>
          </Pressable>
        ))
      }
    </View>
  )
}