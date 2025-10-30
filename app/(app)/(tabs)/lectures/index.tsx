import { View, FlatList, SectionList, ActivityIndicator } from 'react-native';
import { Text } from '@/components/ui/Text';
import { useCallback, useState, useRef } from 'react';
import { ScreenLayout } from '@/components/layouts/ScreenLayout';
import { Lecture } from '@/apollo/__generated__/graphql';
import { RootSettings } from '@/components/RootSettings';
import { LectureItem } from '@/components/LectureItem';
import { Header } from '@/components/layouts/Header';
import { LectureItemSmall } from '@/components/LectureItemSmall';
import { useGetLecturesRecentlyPlayed } from '@/hooks/useGetLecturesRecentlyPlayed';
import { GlimpsesBlock } from '@/components/GlimpsesBlock';
import { useGetLecturesRecommended } from '@/hooks/useGetLecturesRecommended';
import Animated, { Extrapolation, ExtrapolationType, interpolate, useAnimatedScrollHandler, useAnimatedStyle, useSharedValue, runOnJS } from 'react-native-reanimated';
import { useAuth } from '@/hooks/useAuth';
const AnimatedSectionList = Animated.createAnimatedComponent(SectionList);

const keyExtractor = (item: Lecture) => {
  return item.id;
};

export default function Screen() {
  const { authUser } = useAuth();
  const { items: itemsRecentlyPlayed, isLoading: isLoadingRecentlyPlayed } = useGetLecturesRecentlyPlayed({ skip: !authUser?.id });
  const { items: itemsRecommended, isLoading: isLoadingRecommended, refetch: refetchRecommended } = useGetLecturesRecommended();

  const [settingsVisible, setSettingsVisible] = useState(false);
  const pullTriggeredRef = useRef(false);

  const onMenuPressHandler = useCallback(() => {
    setSettingsVisible(!settingsVisible);
  }, [settingsVisible]);

  const refresh = useCallback(() => {
    refetchRecommended();
  }, []);

  const renderItem = useCallback(({ item }: { item: Lecture, index: number }) => {
    return <View className='mr-5'>
      <LectureItemSmall lecture={item} parentPath='/lectures' />
    </View>;
  }, []);

  const data = [
    // {
    //   title: 'Glimpses',
    //   type: 'glimpses',
    //   data: []
    // },
    {
      title: 'Jump back in',
      horizontal: true,
      data: itemsRecentlyPlayed as Lecture[]
    },
    {
      title: 'You might like',
      data: itemsRecommended as Lecture[]
    }]

  const scrollY = useSharedValue(0);
  const onScroll = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;

      // Check if user pulled down more than 20px
      if (scrollY.value < -50 && !pullTriggeredRef.current) {
        pullTriggeredRef.current = true;
        runOnJS(refresh)();
      }

      // Reset trigger when user scrolls back up
      if (scrollY.value >= 0) {
        pullTriggeredRef.current = false;
      }
    },
  });

  const refreshAnimation = useAnimatedStyle(() => {
    return {
      opacity: interpolate(scrollY.value, [-100, -20, 0], [1, 0, 0], Extrapolation.CLAMP),
      transform: [{
        translateY: scrollY.value + 10
      }]
    }
  })


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
        <AnimatedSectionList
          onScroll={onScroll}
          refreshControl={
            <Animated.View style={[refreshAnimation]} className='mb-0'>
              <ActivityIndicator size='small' color='#000' />
            </Animated.View>
          }
          className='pt-4'
          stickySectionHeadersEnabled={false}
          sections={data}
          renderItem={({ item, section }) => {
            if (section.horizontal || section.type === 'glimpses') {
              return null;
            }
            return <LectureItem lecture={item as Lecture} parentPath='/lectures' />;
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
    </View>
  );
}
