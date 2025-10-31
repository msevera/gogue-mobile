import { FlatList, View } from 'react-native';
import { Text } from '@/components/ui/Text';
import { ScreenLayout } from '@/components/layouts/ScreenLayout';
import { Header } from '@/components/layouts/Header';
import { Lecture } from '@/apollo/__generated__/graphql';
import Animated, { FadeIn, FadeOut, LinearTransition } from 'react-native-reanimated';
import { useCallback } from 'react';
import { LectureItemLibrary } from '@/components/LectureItemLibrary';
import { useGetLecturesAddedToLibrary } from '@/hooks/useGetLecturesAddedToLibrary';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';

const AnimatedLectureItem = ({ item }: { item: Lecture }) => {
  return (
    <Animated.View
      layout={LinearTransition.duration(300)}
      entering={FadeIn.duration(300)}
      exiting={FadeOut.duration(300)}
    >
      <LectureItemLibrary lecture={item} parentPath='/library' />
    </Animated.View>
  );
};

const keyExtractor = (item: Lecture) => item.id;

export default function Screen() {
  const { authUser, setAuthSettingsVisible } = useAuth();
  const { items, isLoading, fetchMore } = useGetLecturesAddedToLibrary({ skip: !authUser?.id });

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
        contentLoading={isLoading && !!authUser?.id}
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
              ListHeaderComponent={() => <View className='h-4 w-full' />}
              onEndReached={fetchMore}
            />
          ) : (
            <View className='flex-1 justify-center items-center px-4'>
              <View className='flex-1 justify-center items-center'>
                {
                  !authUser?.id ? (
                    <>
                      <Text className='text-gray-950 text-xl font-semibold top-[-40] text-center mb-4'>Sign in to see your library</Text>
                      <Text className='text-gray-500 text-lg top-[-40] text-center'>Your saved items will appear here once you’re logged in.</Text>
                      <Button text='Sign in' onPress={() => {
                        setAuthSettingsVisible(true);
                      }} />
                    </>
                  ) : (
                    <Text className='text-gray-500 text-lg top-[-40]'>Your library is empty.</Text>
                  )
                }
              </View>
            </View>
          )
        }
      </ScreenLayout>
    </View>
  );
}