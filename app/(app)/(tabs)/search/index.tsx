import { ActivityIndicator, FlatList, SectionList, View } from 'react-native';
import { ScreenLayout } from '@/components/layouts/ScreenLayout';
import { Header } from '@/components/layouts/Header';
import { Input } from '@/components/ui/Input';
import { Lecture } from '@/apollo/__generated__/graphql';
import { useGetLectures } from '@/hooks/useGetLectures';
import { Text } from '@/components/ui/Text';
import { LectureItemSmall } from '@/components/LectureItemSmall';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { LectureItemSearch } from '@/components/LectureItemSearch';
import { SearchInput } from '@/components/SearchInput';
import Animated, { useAnimatedStyle, useDerivedValue, useSharedValue, withTiming } from 'react-native-reanimated';
import { transform } from '@babel/core';
import { useGetLecturesSearch } from '@/hooks/useGetLecturesSearch';
import { Button } from '@/components/ui/Button';
import { useNewLecture } from '@/hooks/useNewLecture';

const keyExtractor = (item: Lecture) => item.id;

export default function Screen() {
  const [search, setSearch] = useState('');
  const [isSearchActive, setIsSearchActive] = useState(false);
  const { items, isLoading, fetchMore } = useGetLectures({});
  const { setNewLectureVisible } = useNewLecture();
  const { items: searchItems, isLoading: isSearchLoading, search: searchLectures } = useGetLecturesSearch();

  useEffect(() => {
    if (isSearchActive) {
      searchLectures(search);
    }
  }, [search, isSearchActive]);

  const renderItem = useCallback(({ item }: { item: Lecture, index: number }) => {
    return <View className='mr-5'>
      <LectureItemSearch lecture={item} parentPath='/search' />
    </View>;
  }, []);

  const data = useMemo(() => {
    const result = [{
      title: '',
      search: true,
      data: searchItems as Lecture[],
      results: false
    }]

    if (isSearchActive) {
      result.push({
        title: 'Results',
        data: searchItems as Lecture[],
        search: false,
        results: true
      })
    } else {
      result.push({
        title: 'Latest',
        data: items as Lecture[],
        search: false,
        results: false
      })
    }

    return result;
  }, [items, searchItems, isSearchActive]);


  const topValue = useSharedValue(0);
  const opacityValue = useSharedValue(1);
  useDerivedValue(() => {
    topValue.value = withTiming(isSearchActive ? -50 : 1, { duration: 200 });
    opacityValue.value = withTiming(isSearchActive ? 0 : 1, { duration: 200 });
  }, [isSearchActive])

  const layoutAnimatedStyle = useAnimatedStyle(() => {
    return {
      top: topValue.value
    }
  })

  const headerAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacityValue.value
    }
  })

  return (
    <Animated.View className='flex-1' style={[layoutAnimatedStyle]}>
      <ScreenLayout
        screenOptions={{
          headerShown: false,
        }}
        contentLoading={false}
        contentEmpty={false}
        bottomPadding={false}
      >
        <Animated.View style={[headerAnimatedStyle]}>
          <Header title='Search' />
        </Animated.View>
        <SectionList
          keyboardShouldPersistTaps="handled"
          className='pt-4'
          stickySectionHeadersEnabled={false}
          sections={data}
          renderItem={({ item, section }) => {
            if (section.search || section.results && search.length <= 2 || section.results && isSearchLoading) {
              return null;
            }

            return renderItem({ item });
          }}
          renderSectionHeader={({ section }) => {
            if (section.search) {
              return <View className='px-4 mb-4'>
                <SearchInput value={search} setValue={setSearch} onActive={setIsSearchActive} />
              </View>;
            }

            if (section.results && search.length <= 2) {
              return <View className='px-4 mb-4 flex-1 mt-10'>
                <Text className='text-gray-800 font-semibold text-xl text-center'>Learn what you like</Text>
                <Text className='text-gray-800 text-base text-center'>Search for titles, topics, and more</Text>
              </View>;
            }

            if (section.results && isSearchLoading) {
              return <View className='px-4 mb-4 flex-1 mt-10'>
                <View className='flex-row items-center justify-center mb-2'>
                  <ActivityIndicator size="small" color="#000000" />
                </View>
                <Text className='text-gray-800 font-semibold text-xl text-center'>Searching...</Text>
                <Text className='text-gray-800 text-base text-center'>Hold tight, we're searching for lectures</Text>
              </View>;
            }

            if (section.results && !isSearchLoading && section.data.length === 0) {
              return <View className='px-4 mb-4 flex-1 mt-10 items-center'>
                <Text className='text-gray-800 font-semibold text-xl text-center mb-2'>Don't see the lecture you want?</Text>
                <Text className='text-gray-800 text-base text-center w-60'>The good news is, you can create any lecture</Text>
                <Button sm className='mt-4' text='Create Lecture' onPress={() => {
                  setNewLectureVisible(true)
                }} />
              </View>;
            }

            if (section.data.length === 0) {
              return null;
            }

            return (
              <View>
                <View className="px-4 mb-2">
                  <Text className='text-gray-800 font-bold text-2xl'>{section.title}</Text>
                </View>
              </View>
            )
          }}
          keyExtractor={keyExtractor}
          onEndReached={fetchMore}
        />
      </ScreenLayout>
    </Animated.View>
  )
}