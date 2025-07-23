import { Pressable, View, ScrollView } from 'react-native'
import { Text } from './ui/Text'
import { cn } from '@/lib/utils'

type TabItem = {
  text: string,
  value: string,
  highlighted?: boolean,
}

export type TabProps = {
  source: TabItem[],
  value: string,
  onChange: (value: string) => void,
}

export const Tabs = ({ source, value, onChange }: TabProps) => {

  return (
    <ScrollView horizontal className='flex-row gap-6 px-4' contentContainerStyle={{ justifyContent: 'center', gap: 18 }} showsHorizontalScrollIndicator={false}>
      {
        source.map((item) => (
          <Pressable
            key={item.value}
            onPress={() => onChange(item.value)}
          >
            <View className={cn('flex-row items-center gap-4 border-b-2 border-transparent pb-2', {
              'border-b-2 border-blue-500': item.value === value && !item.highlighted,
              'border-b-2 border-yellow-400': item.value === value && item.highlighted
            })}>
              <Text className={cn('text-base text-gray-500 font-semibold', {
                'text-gray-950': item.value === value,
                'text-yellow-500': item.highlighted
              })}>{item.text}</Text>
            </View>
          </Pressable>
        ))
      }
    </ScrollView>
  )
}