import { View, FlatList, SectionList } from 'react-native';
import { Text } from '@/components/ui/Text';
import { useCallback, useState } from 'react';
import { ScreenLayout } from '@/components/layouts/ScreenLayout';
import { Lecture } from '@/apollo/__generated__/graphql';
import { RootSettings } from '@/components/RootSettings';
import { CreateLecture } from '@/components/CreateLecture';
import { LectureItem } from '@/components/LectureItem';
import { Header } from '@/components/layouts/Header';
import { LectureItemSmall } from '@/components/LectureItemSmall';
import { useGetLecturesRecentlyPlayed } from '@/hooks/useGetLecturesRecentlyPlayed';
import { GlimpsesBlock } from '@/components/GlimpsesBlock';
import { useGetLecturesRecommended } from '@/hooks/useGetLecturesRecommended';

const keyExtractor = (item: Lecture) => item.id;

export default function Screen() {
  const { items: itemsRecentlyPlayed, isLoading: isLoadingRecentlyPlayed } = useGetLecturesRecentlyPlayed();
  const { items: itemsRecommended, isLoading: isLoadingRecommended } = useGetLecturesRecommended();
  const [newLectureVisible, setNewLectureVisible] = useState(false);
  const [settingsVisible, setSettingsVisible] = useState(false);

  const onMenuPressHandler = useCallback(() => {
    setSettingsVisible(!settingsVisible);
  }, [settingsVisible]);

  const onNewLecturePressHandler = useCallback(() => {
    setNewLectureVisible(!newLectureVisible);
  }, [newLectureVisible]);

  const renderItem = useCallback(({ item }: { item: Lecture, index: number }) => {
    return <View className='mr-5'>
      <LectureItemSmall lecture={item} parentPath='/lectures' />
    </View>;
  }, []);

  const data = [
    {
      title: 'Glimpses',
      type: 'glimpses',      
      data: []
    },
    {
      title: 'Jump back in',
      horizontal: true,
      data: itemsRecentlyPlayed as Lecture[]
    },
    {
      title: 'You might also like',
      data: itemsRecommended as Lecture[]
    }]

  return (
    <View className='flex-1'>
      <ScreenLayout
        screenOptions={{
          headerShown: true,
          header: () => <Header showMenu title='Home' onMenuPress={onMenuPressHandler} />,
        }}
        contentLoading={isLoadingRecommended}
        contentEmpty={false}
        contentEmptyText='Create your first lecture'
        bottomPadding={false}
      >
        <SectionList
          className='pt-4'
          stickySectionHeadersEnabled={false}
          sections={data}
          renderItem={({ item, section }) => {
            if (section.horizontal || section.type === 'glimpses') {
              return null;
            }
            return <LectureItem lecture={item} parentPath='/lectures' />;
          }}
          renderSectionHeader={({ section }) => {
            if (section.type === 'glimpses') {
              return <GlimpsesBlock />;
            }

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
