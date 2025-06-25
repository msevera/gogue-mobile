import React from 'react';
import { router } from 'expo-router';
import { Pressable } from 'react-native';
import { View } from 'react-native';
import { Text } from '@/components/ui/Text';
import { Lecture } from '@/apollo/__generated__/graphql';
import { Image } from 'expo-image';
import { coverBGHex } from '@/lib/utils';

export const LectureItem = ({ lecture }: { lecture: Lecture }) => {
  return (
    <Pressable onPress={() => {
      router.push(`/lectures/${lecture.id}`);
    }}>
      <View className='flex-row px-4 mb-4'>
        <View className='flex-1'>
          <View>
            <View
              className="rounded-xl px-4 py-8"
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
            </View>
          </View>
        </View>
      </View>
    </Pressable>
  )
}