import React, { useMemo } from 'react';
import { router } from 'expo-router';
import { Pressable } from 'react-native';
import { View } from 'react-native';
import { Text } from '@/components/ui/Text';
import { Lecture } from '@/apollo/__generated__/graphql';
import { Image } from 'expo-image';
import { coverBGHex, formatTime } from '@/lib/utils';
import * as VectorIcons from '@expo/vector-icons';


export const LectureItem = ({ lecture, parentPath }: { lecture: Lecture, parentPath: '/lectures' | '/library' }) => { 
  return (
    <Pressable onPress={() => {
      router.push(`${parentPath}/${lecture.id}`);
    }}>
      <View className='flex-row px-4 mb-4'>
        <View className='flex-1'>
          <View
            className="rounded-xl px-6 pt-6 py-4"
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
                  // flex: 1,
                  width: '100%',
                  // height: 1024 / 3,
                  aspectRatio: 1,
                  borderRadius: 12,
                  // borderWidth: 1,
                  // borderColor: 'red',
                }}                
              />
            </View>
            {/* <Text className="text-lg text-gray-950 text-center mt-4">{lecture.title}</Text> */}
            <Text className="text-lg text-gray-800 text-center mt-4" numberOfLines={2}>{lecture.topic}</Text>
            <View className='mt-6 flex-row items-center justify-between'>
              <View className='flex-row items-center gap-2'>
                <View className='flex-row items-center px-2 py-1 rounded-full'
                  style={{
                    backgroundColor: `${lecture.image?.color}4D`,
                  }}>
                  <Text className='text-gray-800 text-xs'>{formatTime(lecture?.audio?.duration!, true)}min</Text>                 
                </View>
                {
                  lecture?.metadata?.addedToLibrary && (
                    <View className='flex-row items-center px-2 py-1 rounded-full justify-center'
                      style={{
                        backgroundColor: `${lecture.image?.color}4D`,
                      }}>
                      <VectorIcons.MaterialIcons name="done" size={16} color="#1f2937" />
                      <Text className='text-gray-950 text-xs ml-1'>In library</Text>
                    </View>
                  )
                }
              </View>
              {
                lecture?.metadata?.status === 'IN_PROGRESS' && (
                  <View className='flex-row items-center px-2 py-1 rounded-full'
                    style={{
                      backgroundColor: `${lecture.image?.color}4D`,
                    }}>
                    <Text className='text-gray-950 text-xs'>Continue</Text>
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