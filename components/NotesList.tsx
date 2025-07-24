import { FlatList, Pressable, View } from "react-native";
import { Text } from "@/components/ui/Text";
import { Note } from '@/apollo/__generated__/graphql';
import { formatTime } from '@/lib/utils';
import { Button } from "./ui/Button";
import Markdown from 'react-native-markdown-display';

const extractKey = (item: Note) => item.id;

const NoteItem = ({ note, onOpenNote }: { note: Note, onOpenNote?: (note: Note) => void }) => {
  return (
    <Pressable className='mb-4 mx-4 px-4 py-2 pt-3 bg-gray-50 rounded-2xl' onPress={() => onOpenNote?.(note)}>      
      <Markdown style={{
        body: {
          color: '#030712',
          fontSize: 18,
          lineHeight: 28,
        },
      }}>
        {note.title}
      </Markdown>
      <View className='flex-row items-center justify-between mt-2'>
        <View className='flex-row items-center'>
          <Text className='text-sm text-gray-500'>{formatTime(note.timestamp)}</Text>
        </View>
        {
          onOpenNote && (
            <Button className='right-[-6]' ghost sm secondary icon={{ component: 'Ionicons', name: 'chevron-forward' }} />
          )
        }
      </View>
    </Pressable>
  )
}

export const NotesList = ({ notes, onOpenNote, useFlatList = true }: { notes: Note[], onOpenNote?: (note: Note) => void, useFlatList?: boolean }) => {
  return (
    <View className='flex-1'>
      {
        useFlatList ? (
          <FlatList
            data={notes}
            renderItem={({ item }) => <NoteItem note={item} onOpenNote={onOpenNote} />}
            keyExtractor={extractKey}
          />
        ) : notes.map((note) => (
          <NoteItem key={note.id} note={note} onOpenNote={onOpenNote} />
        ))
      }
    </View>
  )
} 