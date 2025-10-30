import { ActivityIndicator, View, Animated as RNAnimated } from 'react-native';
import { ScreenLayout } from '@/components/layouts/ScreenLayout';
import { Header } from '@/components/layouts/Header';
import { Lecture } from '@/apollo/__generated__/graphql';
import { useGetLectures } from '@/hooks/useGetLectures';
import { Text } from '@/components/ui/Text';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { LectureItemSearch } from '@/components/LectureItemSearch';
import { SearchInput } from '@/components/SearchInput';
import { useGetLecturesSearch } from '@/hooks/useGetLecturesSearch';
import { Button } from '@/components/ui/Button';
import { useNewLecture } from '@/hooks/useNewLecture';

// Define proper types for section data
interface SearchSection {
  search: boolean;
  data: Lecture[];
}

interface ResultsSection {
  title: string;
  data: Lecture[];
  results: boolean;
}

interface LatestSection {
  title: string;
  data: Lecture[];
}

type SectionData = SearchSection | ResultsSection | LatestSection;

const keyExtractor = (item: Lecture) => {
  return item.id;
}

export default function Screen() {
  const rnScrollY = useRef(new RNAnimated.Value(0)).current;
  const [search, setSearch] = useState('');
  const [isSearchActive, setIsSearchActive] = useState(false);
  const { items, isLoading, fetchMore } = useGetLectures();  
  const { setNewLectureVisible } = useNewLecture();
  const { items: searchItems, isLoading: isSearchLoading, search: searchLectures } = useGetLecturesSearch();
  const translateYValue = useRef(new RNAnimated.Value(0)).current;
  const searchOpacityValue = useRef(new RNAnimated.Value(1)).current;
  const lastScrollY = useRef(0);

  useEffect(() => {
    if (isSearchActive) {
      searchLectures(search);
    }
  }, [search, isSearchActive]);

  useEffect(() => {
    let offset = Math.min(lastScrollY.current, 60);
    if (isSearchActive) {
      translateYValue.setValue(offset * -1)
    }

    RNAnimated.timing(translateYValue, {
      toValue: isSearchActive ? -60 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [isSearchActive, translateYValue]);

  useEffect(() => {
    RNAnimated.timing(searchOpacityValue, {
      toValue: isSearchActive ? 0 : 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [isSearchActive, searchOpacityValue]);

  const renderItem = useCallback(({ item }: { item: Lecture, index: number }) => {
    return <View className='mr-5'>
      <LectureItemSearch lecture={item} parentPath='/search' />
    </View>;
  }, []);

  const data = useMemo(() => {
    const result: SectionData[] = [{
      search: true,
      data: searchItems as Lecture[],
    }]

    if (isSearchActive) {
      result.push({
        title: 'Results',
        data: searchItems as Lecture[],
        results: true,
      })
    } else {
      result.push({
        title: 'Latest',
        data: items as Lecture[],
      })
    }

    return result;
  }, [items, searchItems, isSearchActive, search]);

  // Create a continuous translateY animation that preserves scroll position
  const getTranslateYAnimation = useCallback(() => {
    if (isSearchActive) {
      // When search is active, always follow the scroll position
      return rnScrollY.interpolate({
        inputRange: [0, Number.MAX_SAFE_INTEGER],
        outputRange: [0, Number.MAX_SAFE_INTEGER],
        extrapolate: 'clamp',
      });
    } else {
      // When search is not active, use the original sticky behavior
      return RNAnimated.add(
        rnScrollY.interpolate({
          inputRange: [0, 60],
          outputRange: [0, 0],
          extrapolate: 'clamp',
        }),
        rnScrollY.interpolate({
          inputRange: [60, Number.MAX_SAFE_INTEGER],
          outputRange: [0, Number.MAX_SAFE_INTEGER - 60],
          extrapolate: 'clamp',
        })
      );
    }
  }, [isSearchActive, rnScrollY]);

  return (
    <RNAnimated.View className='flex-1'
      style={{
        transform: [{
          translateY: translateYValue
        }]
      }}
    >
      <ScreenLayout
        screenOptions={{
          headerShown: false,
        }}
        contentLoading={false}
        contentEmpty={false}
        bottomPadding={false}
      >
        {
          isLoading ? (
            <View className="flex-1">
              <Header title='Search' />
              <View className='flex-1 items-center justify-center'>
                <ActivityIndicator size="small" color="#000000" />
              </View>
            </View>
          ) : (
            <RNAnimated.SectionList
              stickySectionHeadersEnabled={false}
              onScroll={RNAnimated.event(
                [{ nativeEvent: { contentOffset: { y: rnScrollY } } }],
                {
                  useNativeDriver: true,
                  listener: (event: any) => {
                    lastScrollY.current = event.nativeEvent.contentOffset.y;
                  }
                }
              )}
              keyboardShouldPersistTaps="handled"
              sections={data}
              renderItem={({ item, section, index }) => {
                if ((section as SearchSection).search || ((section as ResultsSection).results && search.length <= 2) || ((section as ResultsSection).results && isSearchLoading)) {
                  return null;
                }

                return renderItem({ item, index });
              }}
              renderSectionHeader={
                ({ section }) => {
                  if ((section as SearchSection).search) {
                    return <RNAnimated.View className='pb-4 bg-white z-10'
                      style={{
                        transform: [{
                          translateY: getTranslateYAnimation()
                        }]
                      }}
                    >
                      <RNAnimated.View className="mb-4"
                        style={{
                          opacity: isSearchActive ? searchOpacityValue : rnScrollY.interpolate({
                            inputRange: [0, 60],
                            outputRange: [1, 0],
                            extrapolate: 'clamp',
                          })
                        }}
                      >
                        <Header title='Search' />
                      </RNAnimated.View>
                      <View className='px-4'>
                        <SearchInput value={search} setValue={setSearch} onActive={setIsSearchActive} />
                      </View>
                    </RNAnimated.View>
                  }

                  if ((section as ResultsSection).results && search.length <= 2) {
                    return <View className='px-4 mb-4 mt-10' key="searchEmpty">
                      <Text className='text-gray-800 font-semibold text-xl text-center'>Learn what you like</Text>
                      <Text className='text-gray-800 text-base text-center'>Search for titles, topics, and more</Text>
                    </View>;
                  }

                  if ((section as ResultsSection).results && isSearchLoading) {
                    return <View className='px-4 mb-4 mt-10'>
                      <View className='flex-row items-center justify-center mb-2'>
                        <ActivityIndicator size="small" color="#000000" />
                      </View>
                      <Text className='text-gray-800 font-semibold text-xl text-center'>Searching...</Text>
                      <Text className='text-gray-800 text-base text-center'>Hold tight, we're searching for lectures</Text>
                    </View>;
                  }

                  if ((section as ResultsSection).results && !isSearchLoading && section.data.length === 0) {
                    return <View className='px-4 mb-4 mt-10 items-center'>
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
                        <Text className='text-gray-800 font-bold text-2xl'>{(section as LatestSection | ResultsSection).title}</Text>
                      </View>
                    </View>
                  )
                }
              }
              keyExtractor={keyExtractor}
              onEndReached={fetchMore}
            />
          )
        }
      </ScreenLayout>
    </RNAnimated.View>
  )
}