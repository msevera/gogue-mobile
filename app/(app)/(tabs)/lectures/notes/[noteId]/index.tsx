import { useLocalSearchParams } from 'expo-router';
import { ScreenLayout } from '@/components/layouts/ScreenLayout';
import { useQuery } from '@apollo/client';
import { ScrollView, View } from 'react-native';
import { Text } from '@/components/ui/Text';
import { Note } from '@/apollo/__generated__/graphql';
import { useRef, useState, useCallback } from 'react';
import { GET_NOTE } from '@/apollo/queries/notes';
import { Button } from '@/components/ui/Button';
import { NoteDeepDive } from '@/components/NoteDeepDive';
import { LinearGradient } from 'expo-linear-gradient';

export default function Screen() {
  const { noteId } = useLocalSearchParams();
  const [noteDeepDiveVisible, setNoteDeepDiveVisible] = useState(false);
  const noteDeepDiveRef = useRef<{ open: () => void, close: () => void }>(null);

  const { data: { note } = {}, loading } = useQuery(GET_NOTE, {
    fetchPolicy: 'network-only',
    variables: {
      id: noteId as string,
    },
    skip: !noteId,
    onError: (error) => {
      console.log('GET_NOTE error', JSON.stringify(error, null, 2));
    }
  });

  const noteData = note as Note;

  const onNoteDeepDivePressHandler = useCallback(() => {
    setNoteDeepDiveVisible(!noteDeepDiveVisible);
  }, [noteDeepDiveVisible]);

  return (
    <View className="flex-1">
      <ScreenLayout
        screenOptions={{
          headerTitle: 'Note',
          headerShown: true,
        }}
        contentLoading={loading}
        contentEmpty={false}
        bottomPadding={false}
      >
        {
          noteData && (
            <View className='flex-1'>
              <ScrollView className='flex-1 flex-col px-5 py-2'>
                <View>
                  <Text className="text-2xl text-gray-950 mt-2">{noteData.title}</Text>
                  <Text className="text-lg text-gray-500 mt-2">{noteData.content}</Text>
                </View>
                <View className='flex-row mt-4'>
                  <View className='flex-row items-center justify-center bg-gray-100 rounded-full px-2 pr-3 py-1'>
                    <Text className="text-sm text-gray-500 mr-1">{noteData.lecture.emoji}</Text>
                    <Text className="text-sm text-gray-500">{noteData.lecture.title}</Text>
                  </View>
                </View>
                <View className='h-[120] w-full' />
                <NoteDeepDive ref={noteDeepDiveRef} note={noteData} visible={noteDeepDiveVisible} onClose={onNoteDeepDivePressHandler} />
              </ScrollView>
              <View className='items-center absolute bottom-0 left-0 right-0'>
                <LinearGradient
                  colors={['rgba(255,255,255,0)', 'rgba(255,255,255,1)', 'rgba(255,255,255,1)']}
                  locations={[0, 0.55, 1]}
                  style={{
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    bottom: 0,
                    height: 103,
                    zIndex: -1,
                  }}
                />
                <Button
                  className='px-10 mb-[30]'
                  text='Ask anything'
                  secondary
                  icon={{
                    component: 'Ionicons',
                    name: 'sparkles-sharp',
                  }}
                  onPress={onNoteDeepDivePressHandler}
                />
              </View>
            </View>

          )
        }
      </ScreenLayout>
    </View>
  );
}
