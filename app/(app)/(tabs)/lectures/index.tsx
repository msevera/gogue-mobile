import { View, FlatList, SectionList } from 'react-native';
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
import { LectureItemSmall } from '@/components/LectureItemSmall';
import { useGetLecturesRecentlyPlayed } from '@/hooks/useGetLecturesRecentlyPlayed';


const AnimatedLectureItem = ({ item }: { item: Lecture }) => {
  return (
    <Animated.View
      layout={LinearTransition.duration(300)}
      entering={FadeIn.duration(300)}
      exiting={FadeOut.duration(300)}
      className='mr-5'
    >
      <LectureItemSmall lecture={item} parentPath='/lectures' />
    </Animated.View>
  );
};

const keyExtractor = (item: Lecture) => item.id;

export default function Screen() {
  const { items: itemsRecentlyPlayed, isLoading: isLoadingRecentlyPlayed } = useGetLecturesRecentlyPlayed();
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

  const data = [{
    title: 'Jump back in',
    horizontal: true,
    data: itemsRecentlyPlayed as Lecture[]
  },
  {
    title: 'You might also like',
    data: items as Lecture[]
  }]

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
        <SectionList
          className='pt-4'
          stickySectionHeadersEnabled={false}
          sections={data}
          renderItem={({ item, section }) => {
            if (section.horizontal) {
              return null;
            }
            return <LectureItem lecture={item} parentPath='/lectures' />;
          }}
          renderSectionHeader={({ section }) => {
            if (section.data.length === 0) {
              return null;
            }

            return (
              <View>
                <View className="px-4 mb-4">
                  <Text className='text-gray-800 font-bold text-2xl'>{section.title}</Text>
                </View>
                {section.horizontal ? (
                  <View className='mb-6'>
                    <FlatList
                      horizontal
                      keyExtractor={keyExtractor}
                      contentInsetAdjustmentBehavior="automatic"
                      data={section.data as Lecture[]}
                      renderItem={renderItem}
                      showsHorizontalScrollIndicator={false}
                      ListHeaderComponent={() => <View className='w-4' />}
                    />
                  </View>

                ) : null}
              </View>
            )
          }}
          keyExtractor={keyExtractor}
        />
      </ScreenLayout>
      <RootSettings visible={settingsVisible} onClose={onMenuPressHandler} />
      <CreateLecture visible={newLectureVisible} onClose={onNewLecturePressHandler} />
    </View>
  );
}
