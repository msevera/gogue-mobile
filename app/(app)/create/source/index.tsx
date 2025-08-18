import { ScreenLayout } from "@/components/layouts/ScreenLayout";
import { Dimensions, View } from 'react-native';
import { Text } from '@/components/ui/Text';
import { Header } from '@/components/layouts/Header';
import { Button } from '@/components/ui/Button';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useGetSourcesMatched } from '@/hooks/useGetSourcesMatched';
import { SourceItem } from '@/components/SourceItem';
import { Source } from '@/apollo/__generated__/graphql';
import { router } from "expo-router";
import Carousel from "react-native-reanimated-carousel";
import { useMemo, useState } from 'react';
import { useCreate } from '@/hooks/useCreate';
import { useAnalytics } from '@/hooks/useAnalytics';

const renderItem = ({ source }: { source: Source }) => {
  const { setPreviewSource } = useCreate();
  const { track } = useAnalytics();

  if (source.intro) {
    return (
      <View className='flex-1 px-4 mb-4'>
        <View className='flex-1 p-6 rounded-3xl justify-center bg-gray-200'>
          <Text className="text-lg text-gray-700  mb-4">
            <Text className="text-lg text-gray-700 font-bold">
              Swipe right
            </Text> to browse and select from trusted books to tailor your lecture to your goal.
          </Text>
          <Text className="text-lg text-gray-700">
            Or tap <Text className="text-lg text-gray-700 font-bold">Skip</Text> to use internet research instead.
          </Text>
        </View>
      </View>
    )
  }

  if (source.internet) {
    return (
      <View className='flex-1 px-4 mb-4'>
        <View className='flex-1 p-6 rounded-3xl justify-center bg-gray-200'>
          <Text className="text-lg text-gray-700 text-center">
            Base your lecture on <Text className="text-lg text-gray-700 font-bold">
              internet research
            </Text>
          </Text>
        </View>
      </View>
    )
  }

  return (
    <View
      className='flex-1 px-4 mb-4'
    >
      <SourceItem
        source={source}
        onPreviewPress={() => {
          track('create_lecture_source_preview', {
            source: {
              id: source?.id,
              title: source?.title,
              authors: source?.authors?.join(', '),
            }
          });
          setPreviewSource({
            visible: true,
            source
          });
        }}
      />
    </View>
  );
}

const width = Dimensions.get('window').width;

export default function Screen() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const { input, setSource } = useCreate();
  const inset = useSafeAreaInsets();
  const { items, isLoading, refetch } = useGetSourcesMatched(input as string);
  const { track } = useAnalytics();


  const data = useMemo(() => {
    return [{ intro: true }, ...items, { internet: true }]
  }, [items]);

  return <ScreenLayout
    screenOptions={{
      headerShown: true,
      header: () => <Header
        hideBorder
        title='Personalize with a book'
        showBack
        right={<Button sm ghost text='Skip' onPress={() => {
          setSource(null);
          router.push('/create/final');
        }} />}
      />,
      // animation: 'fade',
      // gestureDirection: 'vertical',
      // animationDuration: 300,
    }}
    contentLoading={false}
    contentEmpty={false}
    contentEmptyText='Create your first lecture'
    bottomPadding={false}
  >
    <View className='flex-1'>
      <View className='flex-1'>
        <Carousel
          loop={false}
          width={width}
          style={{ width, justifyContent: 'center' }}
          // height={width / 2}
          snapEnabled={true}
          // pagingEnabled={true}
          data={data}
          // style={{ alignItems: 'flex-start', width, borderWidth: 1, borderColor: 'red', justifyContent: 'flex-start' }}
          // containerStyle={{ alignItems: 'flex-start', borderWidth: 1, borderColor: 'blue', justifyContent: 'flex-start' }}
          onSnapToItem={(index) => setSelectedIndex(index)}
          renderItem={({ item }) => renderItem({ source: item })}
          mode="parallax"
          modeConfig={{
            parallaxScrollingScale: 0.95,
            parallaxScrollingOffset: 50,
          }}
        />
      </View>
      <View className='px-4 flex-row gap-4 justify-center' style={{ marginBottom: inset.bottom }}>
        <Button          
          className='w-[150]'
          text='Select'
          disabled={selectedIndex === 0}
          onPress={(e) => {
            const source = items[selectedIndex - 1];
            track('create_lecture_source_step_completed', {
              input,
              source: {
                id: source?.id || 'internet_research',
                title: source?.title,
                authors: source?.authors?.join(', '),
              }
            });
            setSource(source || null);
            router.push('/create/final');
          }} />
      </View>
    </View>
  </ScreenLayout>
}