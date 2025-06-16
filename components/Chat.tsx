import { FlatList, View, ViewStyle } from 'react-native'
import { Text } from './ui/Text'
import { Message } from '@/hooks/useNoteChat'
import { useMemo } from 'react'

const overrideProps = {
  contentContainerStyle: {
    flexGrow: 1,
    justifyContent: 'flex-end',
  }
}

const AssistantMessage = ({ message }: { message: Message }) => {
  return (
    <View>
      <Text>{message.content}</Text>
    </View>
  )
}

const UserMessage = ({ message }: { message: Message }) => {
  return (
    <View className='flex-row justify-end'>
      <View className='bg-gray-100 rounded-full p-2 px-4'>
        <Text>{message.content}</Text>
      </View>
    </View>
  )
}

const ChatItem = ({ message }: { message: Message }) => {
  return (
    <View className='mb-4 px-4'>
      {
        message.role === 'assistant' ? <AssistantMessage message={message} /> : <UserMessage message={message} />
      }
    </View>
  )
}


export const Chat = ({ messages, onFetchMore }: { messages: Message[], onFetchMore: () => void }) => {  
  return (
    <View className='flex-1'>
      <FlatList
        inverted
        data={messages}
        renderItem={({ item }) => <ChatItem message={item} />}
        contentContainerStyle={overrideProps.contentContainerStyle as ViewStyle}
        ListHeaderComponent={() => <View className='h-[100]' />}
        onEndReached={onFetchMore}        
      />
    </View>
  )
}