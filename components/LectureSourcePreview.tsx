import { View } from "react-native";
import { Image } from "expo-image";
import { Text } from "./ui/Text";
import { Source as SourceType } from "@/apollo/__generated__/graphql";

export const LectureSourcePreview = ({ source }: { source: SourceType }) => {
  const height = 100;
  const imageWidth = source?.image?.width;
  const imageHeight = source?.image?.height;
  const aspectRatio = imageWidth! / imageHeight!;
  const calculatedWidth = height * aspectRatio;

  return <View className='rounded-xl justify-center bg-gray-100 p-4'>
    <View className='justify-center'>
      <View className='flex-row justify-between'>
        <View className='flex-1 mr-4'>
          <Text className='text-sm text-gray-500 mb-1'>Based on book</Text>
          <Text className='text-base font-semibold text-gray-900 mb-1' numberOfLines={2}>{source?.title}</Text>
          <Text className='text-sm text-gray-900 mb-1' numberOfLines={1}>by {source?.authors?.join(', ')}</Text>
          <Text className='text-sm text-gray-600' numberOfLines={2}>{source?.topic}</Text>
        </View>
        <View className='justify-center items-center'>
          <View>
            <Image
              source={source?.image?.url}
              contentFit="scale-down"
              transition={1000}
              style={{
                width: calculatedWidth,
                height,
                borderRadius: 8,
              }}
            />
          </View>
        </View>
      </View>
    </View>
  </View>
}