import React, { useMemo } from 'react';
import { router } from 'expo-router';
import { Pressable } from 'react-native';
import { View } from 'react-native';
import { Text } from '@/components/ui/Text';
import { Lecture } from '@/apollo/__generated__/graphql';
import { Image } from 'expo-image';
import { coverBGHex, formatTime } from '@/lib/utils';
import { Progress } from './Progress';


export const LectureItemSearch = ({ lecture, parentPath }: { lecture: Lecture, parentPath: '/lectures' | '/library' | '/search' }) => {
  const leftTime = useMemo(() => {
    let timeLeft = lecture?.audio?.duration! - lecture?.metadata?.playbackTimestamp!
    return {
      time: formatTime(timeLeft, true),
      percentage: Math.round(100 - (lecture?.audio?.duration! - lecture?.metadata?.playbackTimestamp!) * 100 / lecture?.audio?.duration!)
    }
  }, [lecture])

  return (
    <Pressable onPress={() => {
      router.push(`${parentPath}/${lecture.id}`);
    }}>
      <View className='flex-row px-4 mb-4'>
        <View className='flex-1'>
          <View
            className="flex flex-row rounded-xl py-2 gap-4"
          >
            <View className='items-center justify-center rounded-md overflow-hidden'
              style={{
                backgroundColor: coverBGHex(lecture.image?.color),
              }}
            >
              <Image
                source={lecture.image?.webp}
                contentFit="scale-down"
                transition={1000}
                style={{
                  // flex: 1,
                  width: 1024 / 8,
                  height: 1024 / 8,
                }}
              />
            </View>
            <View className='flex-1'>
              <View className='flex-1'>
                <Text className="text-lg text-gray-950">{lecture.title}</Text>
                <Text className="text-base text-gray-700" numberOfLines={2}>{lecture.topic}</Text>
                <View className='flex-row items-center mt-2'>
                      <Text className='text-gray-500 text-sm'>{formatTime(lecture?.audio?.duration!, true)}min</Text>
                      <Text className='text-gray-500 ml-1 mr-1'>•</Text>
                      <Text className='text-gray-500 text-sm'>{lecture?.sections?.length} sections</Text>
                    </View>
              </View>             
            </View>
          </View>
        </View>
      </View>
    </Pressable>
  )
}