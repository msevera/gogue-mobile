import { ScrollView, View } from 'react-native'
import { Text } from './ui/Text'

type TopicItem = {
  text: string,
  value: string,
}

export type TopicProps = {
  source: TopicItem[]
}

export const Topics = ({ source }: TopicProps) => {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      <View className='flex-row items-center gap-2 ml-4 mr-4'>
        {
          source.map((item) => (
            <View key={item.value} className='flex-row items-center bg-gray-100 py-2 px-4 rounded-full'>
              <Text className='text-gray-600 text-sm'>{item.text}</Text>
            </View>
          ))
        }
      </View>
    </ScrollView>
  )
}