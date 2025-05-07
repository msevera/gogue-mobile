import { ScreenLayout } from "@/components/layouts/ScreenLayout";
import { FlatList, Pressable, View } from "react-native";
import { Text } from "@/components/ui/Text";
import { useGetNotes } from "@/hooks/useGetNotes";
import { Note } from '@/apollo/__generated__/graphql';
import { useCallback } from 'react';
import { router } from 'expo-router';

const keyExtractor = (item: Note) => item.id;

export default function NotesScreen() {
  const { items, isLoading } = useGetNotes();

  const renderItem = useCallback(({ item }: { item: Note, index: number }) => {
    return (
      <Pressable
        className='mb-2'
        onPress={() => {
          router.push(`/lectures/notes/${item.id}`);
        }}
      >
        <View className='flex-col px-5 py-2 mt-2'>
          <View>
            <Text className="text-lg text-gray-950">{item.title}</Text>
            <Text className="text-base text-gray-500 mt-1" numberOfLines={2}>{item.content}</Text>
          </View>
          <View className='flex-row mt-3 justify-between'>
            <View className='flex-row items-center justify-center bg-gray-100 rounded-full px-2 pr-3 py-1'>
              <Text className="text-sm text-gray-500 mr-1">{item.lecture.emoji}</Text>
              <Text className="text-sm text-gray-500">{item.lecture.title}</Text>
            </View>
          </View>
        </View>
      </Pressable>
    )
  }, []);

  const isEmpty = items.length === 0 && !isLoading;

  return (
    <View className='flex-1'>
      <ScreenLayout
        screenOptions={{
          headerShown: true,
          headerTitle: 'Your notes',          
        }}
        contentLoading={isLoading}
        contentEmpty={isEmpty}
        contentEmptyText='You can save notes from lectures'
        bottomPadding={false}
      >
        <FlatList
          keyExtractor={keyExtractor}
          contentInsetAdjustmentBehavior="automatic"
          data={items as Note[]}
          renderItem={renderItem}
          ListFooterComponent={() => <View className='h-[16] w-full' />}
          ItemSeparatorComponent={() => <View className='px-5'><View className='h-[1] bg-gray-100 w-full ' /></View>}
        />
      </ScreenLayout>
    </View>
  )
} 