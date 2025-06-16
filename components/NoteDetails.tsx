import { View } from 'react-native'
import { Text } from './ui/Text'
import { Note } from '@/apollo/__generated__/graphql'
import { CurrentSentence } from '@/hooks/useSentence'
import { Message, useNoteChat } from '@/hooks/useNoteChat'
import { Chat } from './Chat'
import { forwardRef, useImperativeHandle } from 'react'

type NoteDetailsProps = {
  currentNote: Note
  currentSentence: CurrentSentence
}

export type NoteDetailsRef = {
  addMessage: (message: Message) => void
}

export const NoteDetails = forwardRef<NoteDetailsRef, NoteDetailsProps>(({ currentNote, currentSentence }, ref) => {
  const { messages, addMessage, fetchMore } = useNoteChat({ noteId: currentNote?.id });
  const title = currentNote ? currentNote.title : currentSentence?.text;

  useImperativeHandle(ref, () => ({
    addMessage: (message: Message) => {
      addMessage(message);
    }
  }));

  return (
    <View className='flex-1'>
      <View className='flex-row items-center justify-between bg-yellow-100 py-2 px-4 rounded-2xl mb-4 mx-4'>
        <Text className='text-lg'>{title}</Text>
      </View>
      <View className='flex-1'>
        <Chat messages={messages} onFetchMore={() => fetchMore()} />        
      </View>
    </View>
  )
})