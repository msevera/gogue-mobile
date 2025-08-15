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

  return <View>

    <Text className='text-base text-gray-700 mb-2'>Based on</Text>
    <View className='rounded-xl justify-center bg-gray-100 p-4'>
      <View className='flex-row justify-between'>
        <View>
          <Text className='text-xl font-semibold text-gray-800 mb-1' numberOfLines={1}>{source?.title}</Text>
          <Text className='text-base text-gray-800' numberOfLines={1}>by {source?.authors?.join(', ')}</Text>        
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