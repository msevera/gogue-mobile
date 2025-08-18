import { FlatList, View, ViewStyle } from 'react-native'
import { Text } from './ui/Text'
import { Message } from '@/hooks/useNoteChat'
import Markdown from 'react-native-markdown-display';

const overrideProps = {
  contentContainerStyle: {
    flexGrow: 1,
    justifyContent: 'flex-end',
  }
}

const keyExtractor = (item: Message, index: number) => {
  return `${item.role}-${index}`
}

const MessageText = ({ text }: { text: string }) => {
  return (
    <Markdown
      style={{
        body: {
          color: '#030712',
          fontSize: 18,
          lineHeight: 28,
        },
      }}
    >{text || ''}</Markdown>
  )
}

const AssistantMessage = ({ message }: { message: Message }) => {
  return (
    <View>
      <MessageText text={message.content} />
    </View>
  )
}

const UserMessage = ({ message }: { message: Message }) => {
  return (
    <View className='flex-row justify-end'>
      <View className='bg-gray-100 rounded-2xl px-4 max-w-[75%]'>
        <MessageText text={message.content} />
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
        ListFooterComponent={() => <View className='h-[10]' />}
        onEndReached={onFetchMore}
        keyExtractor={keyExtractor}
      />
    </View>
  )
}