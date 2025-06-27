import React, { useMemo } from 'react';
import { router } from 'expo-router';
import { Pressable } from 'react-native';
import { View } from 'react-native';
import { Text } from '@/components/ui/Text';
import { Lecture } from '@/apollo/__generated__/graphql';
import { Image } from 'expo-image';
import { coverBGHex, formatTime } from '@/lib/utils';
import { Progress } from './Progress';


export const LectureItemLibrary = ({ lecture, parentPath }: { lecture: Lecture, parentPath: '/lectures' | '/library' }) => {
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
                contentFit="contain"
                transition={1000}
                style={{
                  flex: 1,
                  width: 1024 / 10,
                  height: 1536 / 10,
                }}
              />
            </View>
            <View className='flex-1'>
              <View className='flex-1'>
                <Text className="text-lg text-gray-950">{lecture.title}</Text>
                <Text className="text-base text-gray-700">{lecture.topic}</Text>
              </View>
              <View className='mt-6 flex-row items-center justify-between'>
                <View className='flex-row items-center gap-2'>
                  <View className='w-full'>
                    {
                      lecture?.metadata?.status === 'NOT_STARTED' && (
                        <>
                          <Text className='text-gray-700 text-xs mb-1'>{leftTime.time}min left</Text>
                          <Progress className='bg-gray-100' total={100} current={0} />
                        </>
                      )
                    }
                    {
                      lecture?.metadata?.status === 'IN_PROGRESS' && (
                        <>
                          <Text className='text-gray-700 text-xs mb-1'>{leftTime.time}min left</Text>
                          <Progress className='bg-gray-100' total={lecture?.audio?.duration!} current={lecture?.metadata?.playbackTimestamp!} />
                        </>
                      )
                    }
                    {
                      lecture?.metadata?.status === 'COMPLETED' && (
                        <>
                          <Text className='text-gray-700 text-xs mb-1'>Done</Text>
                          <Progress className='bg-gray-100' total={100} current={100} />
                        </>
                      )
                    }
                  </View>
                </View>
              </View>
            </View>
          </View>
        </View>
      </View>
    </Pressable>
  )
}