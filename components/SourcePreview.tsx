import { View, ScrollView } from 'react-native'
import { Text } from '@/components/ui/Text';
import { GlobalDrawer } from './globalDrawer/GlobalDrawer'
import { useMemo, useState } from 'react';
import { Image } from "expo-image";
import { cn, coverBGHex } from '@/lib/utils';
import { Tabs } from './Tabs';
import { Button } from './ui/Button';

export const SourcePreview = ({ visible, onClose, source }: { visible: boolean, onClose: () => void, source: any }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const drawerSettings = useMemo(() => ({
    snapPoints: visible ? ['100%'] : [0],
    backdrop: visible,
    index: 0,
    gesturesEnabled: false,
    closeByGestureEnabled: false,
    customBackground: true
  }), [visible]);


  const height = 200;
  const imageWidth = source?.image?.width;
  const imageHeight = source?.image?.height;
  const aspectRatio = imageWidth! / imageHeight!;
  const calculatedWidth = height * aspectRatio;

  const tabs = useMemo(() => {
    let initialTabs = [
      { text: 'Overview', value: 'overview' },
      { text: 'Key Takeaways', value: 'keyTakeaways' },      
    ] as { text: string, value: string, highlighted?: boolean }[];

    return initialTabs;
  }, [])

  return (
    <GlobalDrawer title="Source" headerBorder drawerSettings={drawerSettings} onBackdropPress={onClose}>
      <View className='flex-1 bg-white rounded-t-3xl overflow-hidden'>
        <View className='p-3 flex-row justify-between items-center'>
          <View className='h-6 w-6' />
          <Text numberOfLines={1} className="max-w-[75%] text-lg font-medium">{source?.title}</Text>
          <Button sm ghost icon={{ component: 'Ionicons', name: 'close' }} onPress={onClose} className="bg-gray-50" />
        </View>
        <ScrollView>
          <View className='justify-center items-center'>
            <View className='w-full justify-center items-center p-4 py-10'
              style={{
                backgroundColor: source?.image?.color ? coverBGHex(source.image?.color) : 'transparent',
              }}>
              <Image
                source={source?.image?.url}
                contentFit="scale-down"
                transition={1000}
                style={{
                  width: calculatedWidth,
                  height,
                  borderRadius: 12
                }}
              />
            </View>
          </View>
          <View className='pt-4 mb-4'>
            <Tabs
              source={tabs}
              value={activeTab}
              onChange={setActiveTab}
            />
          </View>
          {
            activeTab === 'overview' && (
              <View className='bg-white px-4'>
                <Text className='text-lg text-gray-800 mb-10'>
                  {source?.overview}
                </Text>
              </View>
            )
          }
          {
            activeTab === 'keyTakeaways' && (
              <View className='bg-white px-4'>
                {
                  source?.keyTakeaways?.map((keyTakeaway, index) => (
                    <View key={index} className={cn('mb-3 border-b border-gray-100 pb-3', {
                      'border-0': index === source?.keyInsights?.length - 1
                    })}>
                      <Text className='text-lg text-gray-800 mb-2'>{keyTakeaway}</Text>
                    </View>
                  ))
                }
              </View>
            )
          }
        </ScrollView>
      </View>
    </GlobalDrawer>
  )
}