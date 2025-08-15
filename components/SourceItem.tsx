import { Pressable, TextStyle, View } from "react-native";
import { Image } from "expo-image";
import { Text } from "./ui/Text";
import { Source as SourceType } from "@/apollo/__generated__/graphql";
import { coverBGHex } from '@/lib/utils';
import { Button } from './ui/Button';

export const SourceItem = ({ source, onPreviewPress }: { source: SourceType, onPreviewPress: () => void }) => {
  const height = 300;
  const imageWidth = source?.image?.width;
  const imageHeight = source?.image?.height;
  const aspectRatio = imageWidth! / imageHeight!;
  const calculatedWidth = height * aspectRatio;

  return <Pressable className='flex-1 p-6 rounded-3xl justify-center'
  onPress={onPreviewPress}
    style={{
      backgroundColor: source.image?.color ? coverBGHex(source.image?.color) : 'transparent',
    }}>
    <View className='flex-1'>
      <View className='flex-1 justify-center items-center'>
        <View className='mb-10'>
          <Image
            source={source?.image?.url}
            contentFit="scale-down"
            transition={1000}
            style={{
              width: calculatedWidth,
              height,
              borderRadius: 12,
              // borderWidth: 1,
              // borderColor: 'red',
            }}
          />
        </View>
        <Text className='text-2xl text-center text-gray-950 mb-4' numberOfLines={2}>{source.title}</Text>
        <Text className='text-lg text-center text-gray-700' numberOfLines={2}>{source.overview}</Text>
      </View>
    </View>
    <View className='justify-center items-center'>
      <Button
        className='w-[200] mb-4'
        text='Tap to preview'
        onPress={onPreviewPress}
        ghost
      />
    </View>
  </Pressable>
}