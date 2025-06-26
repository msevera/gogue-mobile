import React, { useMemo } from 'react';
import { router } from 'expo-router';
import { Pressable } from 'react-native';
import { View } from 'react-native';
import { Text } from '@/components/ui/Text';
import { Lecture } from '@/apollo/__generated__/graphql';
import { Image } from 'expo-image';
import { coverBGHex, formatTime } from '@/lib/utils';

export const LectureItem = ({ lecture }: { lecture: Lecture }) => {
  const leftTime = useMemo(() => {
    let timeLeft = lecture?.audio?.duration! - lecture?.metadata?.playbackTimestamp!
    return {
      time: formatTime(timeLeft, true, true),
      percentage: Math.round(100 - (lecture?.audio?.duration! - lecture?.metadata?.playbackTimestamp!) * 100 / lecture?.audio?.duration!)
    }
  }, [lecture])
  return (
    <Pressable onPress={() => {
      router.push(`/lectures/${lecture.id}`);
    }}>
      <View className='flex-row px-4 mb-4'>
        <View className='flex-1'>
          <View
            className="rounded-xl px-4 pt-10 py-4"
            style={{
              backgroundColor: coverBGHex(lecture.image?.color),
            }}
          >
            <View className='items-center justify-center'>
              <Image
                source={lecture.image?.webp}
                contentFit="contain"
                transition={1000}
                style={{
                  flex: 1,
                  width: 1024 / 5,
                  height: 1536 / 5,
                  borderRadius: 4,
                }}
              />
            </View>
            <Text className="text-lg text-gray-950 text-center mt-4">{lecture.title}</Text>
            <Text className="text-base text-gray-800 text-center" numberOfLines={2}>{lecture.topic}</Text>
            <View className='mt-6 flex-row items-center justify-between'>
              <View className='flex-row items-center px-2 py-1 rounded-full'
                style={{
                  backgroundColor: `${lecture.image?.color}4D`,
                }}>
                <Text className='text-gray-800 text-xs'>{formatTime(lecture?.audio?.duration!, true)}min</Text>
                <Text className='text-gray-800 ml-1 mr-1 text-xs'>•</Text>
                <Text className='text-gray-800 text-xs'>{lecture?.sections?.length} sections</Text>
              </View>
              {
                lecture?.metadata?.status === 'IN_PROGRESS' && (
                  <View className='flex-row items-center px-2 py-1 rounded-full'
                    style={{
                      backgroundColor: `${lecture.image?.color}4D`,
                    }}>
                    <Text className='text-gray-950 text-xs'>{leftTime.time}min left</Text>
                  </View>
                )
              }
            </View>
          </View>
        </View>
      </View>
    </Pressable>
  )
}