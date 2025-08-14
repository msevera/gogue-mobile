import { View } from "react-native";
import { Text } from "@/components/ui/Text";
import { Image } from "expo-image";
import { ScreenLayout } from '@/components/layouts/ScreenLayout';
import { Header } from '@/components/layouts/Header';
import { Button } from '@/components/ui/Button';
import { router } from 'expo-router';
import { useCreate } from '@/hooks/useCreate';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { cn } from '@/lib/utils';
import { useCreateLecture } from '@/hooks/useCreateLecture';

export default function Screen() {
  const inset = useSafeAreaInsets();
  const { input, source, setPreviewSource } = useCreate();
  const { createLectureAsyncMut } = useCreateLecture();
  const width = 120;
  const imageWidth = source?.image?.width;
  const imageHeight = source?.image?.height;
  const aspectRatio = imageHeight! / imageWidth!;
  const calculatedHeight = width * aspectRatio;

  return <ScreenLayout
    screenOptions={{
      headerShown: true,
      header: () => <Header
        hideBorder
        title='Final step'
        showBack
      />,
    }}
    contentLoading={false}
    contentEmpty={false}
    contentEmptyText='Create your first lecture'
    bottomPadding={false}
  >
    <View className='flex-1 px-4 mt-2'>
      <View className='p-4 bg-blue-50 rounded-2xl mb-6'>
        <Text className="text-base text-gray-700">
          {
            source ?
              'We will personalize your lecture based on your input and the selected source' :
              'We will personalize your lecture based on your input and internet research'
          }
        </Text>
      </View>
      <View className='flex-1'>
        <View className='mb-6'>
          <Text className="text-base text-gray-700 mb-1">Input</Text>
          <Text className="text-lg">{input}</Text>
        </View>
        <View>
          <Text className={cn("text-base text-gray-700", source ? 'mb-2' : 'mb-1')}>Source</Text>
          <View>
            {
              source ? (
                <View className='flex-row'>
                  <Image
                    source={source?.image?.url}
                    contentFit="scale-down"
                    transition={1000}
                    style={{
                      width,
                      height: calculatedHeight,
                      borderRadius: 12
                    }}
                  />
                  <View className='flex-1 ml-4'>
                    <Text className="text-lg text-gray-950">{source?.title}</Text>
                    <Text className="text-base text-gray-700 mb-4" numberOfLines={3}>{source?.overview}</Text>
                    <Button text='Preview source' ghost className='p-0 self-start'
                      onPress={() => {
                        setPreviewSource({
                          visible: true,
                          source
                        });
                      }}
                    />
                  </View>
                </View>
              ) : (
                <View>
                  <Text className='text-lg text-gray-950'>Internet research</Text>
                </View>
              )
            }
          </View>
        </View>
      </View>
      <View style={{ marginBottom: inset.bottom }}>
        <Button text='Create' onPress={() => {
          createLectureAsyncMut(input, source?.id as string);
          router.dismissTo('/lectures');
        }} />
      </View>
    </View>
  </ScreenLayout>
}