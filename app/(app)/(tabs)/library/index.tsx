import { FlatList, View } from 'react-native';
import { Text } from '@/components/ui/Text';
import { ScreenLayout } from '@/components/layouts/ScreenLayout';
import { Header } from '@/components/layouts/Header';
import { useGetLectures } from '@/hooks/useGetLectures';
import { Lecture } from '@/apollo/__generated__/graphql';
import Animated, { FadeIn, FadeOut, LinearTransition } from 'react-native-reanimated';
import { useCallback } from 'react';
import { LectureItemSmall } from '@/components/LectureItemSmall';

const AnimatedLectureItem = ({ item }: { item: Lecture }) => {
  return (
    <Animated.View
      layout={LinearTransition.duration(300)}
      entering={FadeIn.duration(300)}
      exiting={FadeOut.duration(300)}
    >
      <LectureItemSmall lecture={item} parentPath='/library' />
    </Animated.View>
  );
};

const keyExtractor = (item: Lecture) => item.id;

export default function Screen() {
  const { items, isLoading } = useGetLectures({ input: { addedToLibrary: true } });

  const renderItem = useCallback(({ item }: { item: Lecture, index: number }) => {
    return <AnimatedLectureItem item={item} />;
  }, []);
  return (
    <View className='flex-1'>
      <ScreenLayout
        screenOptions={{
          headerShown: true,
          header: () => <Header title='Your Library' />,
        }}
        contentLoading={isLoading}
        contentEmpty={false}
        bottomPadding={false}        
      >

        {
          items.length > 0 ? (
            <FlatList
              keyExtractor={keyExtractor}
              contentInsetAdjustmentBehavior="automatic"
              data={items as Lecture[]}
              renderItem={renderItem}
              // ListFooterComponent={() => <View className='h-2 w-full' />}              
              ListHeaderComponent={() => <View className='h-4 w-full' />}
            />
          ) : (
            <View className='flex-1 justify-center items-center px-4'>
              <View className='flex-1 justify-center items-center'>
                <Text className='text-gray-500 text-lg top-[-40]'>Your library is empty.</Text>
              </View>
            </View>
          )
        }
      </ScreenLayout>
    </View>
  );
}