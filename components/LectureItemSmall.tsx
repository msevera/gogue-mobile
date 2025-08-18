import React, { useMemo } from 'react';
import { router } from 'expo-router';
import { Pressable } from 'react-native';
import { View } from 'react-native';
import { Text } from '@/components/ui/Text';
import { Lecture } from '@/apollo/__generated__/graphql';
import { Image } from 'expo-image';
import { coverBGHex, formatTime } from '@/lib/utils';
import * as VectorIcons from '@expo/vector-icons';
import { Progress } from './Progress';
import { LinearGradient } from 'expo-linear-gradient';


export const LectureItemSmall = ({ lecture, parentPath }: { lecture: Lecture, parentPath: '/lectures' | '/library' }) => {
  const leftTime = useMemo(() => {
    let timeLeft = lecture?.audio?.duration! - lecture?.metadata?.playbackTimestamp!
    return {
      time: formatTime(timeLeft, true),
      percentage: Math.round(100 - (lecture?.audio?.duration! - lecture?.metadata?.playbackTimestamp!) * 100 / lecture?.audio?.duration!)
    }
  }, [lecture])

  return (
    <Pressable onPress={() => {
      router.push(`${parentPath}/${lecture.slug}`);
    }}>
      <View className='flex-row w-[146]'>
        <View className='flex-1'>
          <View
            className="rounded-xl overflow-hidden"
            style={{
              backgroundColor: coverBGHex(lecture.image?.color),
            }}
          >
            <View className='items-center justify-center'>
              <Image
                source={lecture.image?.webp}
                contentFit="fill"
                transition={1000}
                style={{
                  flex: 1,
                  width: 1024 / 7,
                  height: 1024 / 7,
                  borderRadius: 12,
                }}
              />
            </View>
            <View 
            className='pb-2 pt-2 mt-2 absolute bottom-0 left-0 right-0 px-2 z-10'
              style={{
                backgroundColor: lecture.image?.color + '4D',
              }}
            >
              {
                lecture?.metadata?.status === 'NOT_STARTED' && (
                  <>
                    {/* <Text className='text-gray-700 text-xs mb-1'>{leftTime.time}min left</Text> */}
                    <Progress total={100} current={0} />
                  </>
                )
              }
              {
                lecture?.metadata?.status === 'IN_PROGRESS' && (
                  <>
                    {/* <Text className='text-gray-700 text-xs mb-1'>{leftTime.time}min left</Text> */}
                    <Progress total={lecture?.audio?.duration!} current={lecture?.metadata?.playbackTimestamp!} />
                  </>
                )
              }
              {
                lecture?.metadata?.status === 'COMPLETED' && (
                  <>
                    {/* <Text className='text-gray-700 text-xs mb-1'>Done</Text> */}
                    <Progress total={100} current={100} />
                  </>
                )
              }
            </View>
          </View>
          <Text className="text-sm text-gray-800 mt-1" numberOfLines={2}>{lecture.topic}</Text>
        </View>
      </View>
    </Pressable>
  )
}