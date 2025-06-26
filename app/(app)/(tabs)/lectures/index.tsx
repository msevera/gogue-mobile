import { View, FlatList } from 'react-native';
import { Text } from '@/components/ui/Text';
import { useCallback, useState } from 'react';
import { ScreenLayout } from '@/components/layouts/ScreenLayout';
import { Lecture } from '@/apollo/__generated__/graphql';
import { useGetLectures } from '@/hooks/useGetLectures';
import { RootSettings } from '@/components/RootSettings';
import { CreateLecture } from '@/components/CreateLecture';
import { LectureItem } from '@/components/LectureItem';
import Animated, {
  LinearTransition,
  FadeIn,
  FadeOut
} from 'react-native-reanimated';
import { Header } from '@/components/layouts/Header';


const AnimatedLectureItem = ({ item }: { item: Lecture }) => {
  return (
    <Animated.View
      layout={LinearTransition.duration(300)}
      entering={FadeIn.duration(300)}
      exiting={FadeOut.duration(300)}
    >
      <LectureItem lecture={item} parentPath='/lectures' />
    </Animated.View>
  );
};

const keyExtractor = (item: Lecture) => item.id;

export default function Screen() {
  const { items, isLoading } = useGetLectures();
  const [newLectureVisible, setNewLectureVisible] = useState(false);
  const [settingsVisible, setSettingsVisible] = useState(false);

  const onMenuPressHandler = useCallback(() => {
    setSettingsVisible(!settingsVisible);
  }, [settingsVisible]);

  const onNewLecturePressHandler = useCallback(() => {
    setNewLectureVisible(!newLectureVisible);
  }, [newLectureVisible]);

  const renderItem = useCallback(({ item }: { item: Lecture, index: number }) => {
    return <AnimatedLectureItem item={item} />;
  }, []);

  return (    
    <View className='flex-1'>
      <ScreenLayout
        screenOptions={{
          headerShown: true,
          header: () => <Header showMenu title='Home' onMenuPress={onMenuPressHandler} />,
        }}
        contentLoading={isLoading}
        contentEmpty={false}
        contentEmptyText='Create your first lecture'
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
                <Text className='text-gray-500 text-lg top-[-40]'>You don't have any lectures yet.</Text>
              </View>
            </View>
          )
        }
      </ScreenLayout>
      <RootSettings visible={settingsVisible} onClose={onMenuPressHandler} />
      <CreateLecture visible={newLectureVisible} onClose={onNewLecturePressHandler} />
    </View>
  );
}
