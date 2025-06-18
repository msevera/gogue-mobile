import React, { useEffect, useRef, useState } from 'react';
import { router } from 'expo-router';
import { LayoutAnimation, Pressable } from 'react-native';
import { View } from 'react-native';
import { Text } from '@/components/ui/Text';
import { Lecture } from '@/apollo/__generated__/graphql';
import Animated, { useAnimatedStyle, withTiming, useSharedValue, runOnJS } from 'react-native-reanimated';

export const LectureItem = ({ lecture }: { lecture: Lecture }) => {
  const [isCreating, setIsCreating] = useState(lecture.creationEvent?.name !== 'DONE');
  const fadeAnim = useSharedValue(1);
  const progressAnim = useSharedValue(0);
  const contentOpacity = useSharedValue(1);
  const [status, setStatus] = useState<{ event: string, lecture: Lecture }>();
  const queueRef = useRef<{ event: string, lecture: Lecture }[]>([]);
  const queueIsProcessing = useRef(false);
  const timeout = 2000;

  const calculateProgress = (state: { event: string, lecture: Lecture }) => {
    switch (state?.event) {
      case 'NORMALIZING_TOPIC':
        return 10;
      case 'GENERATING_PLAN':
        return 30;
      case 'GENERATING_CONTENT': {
        const totalSections = state.lecture.sections.length;
        const sectionsWithContent = state.lecture.sections.filter(section => section.hasContent).length;
        return 40 + (sectionsWithContent / totalSections) * 40;
      }
      case 'FINALIZING':
        return 100;
      case 'DONE':
        return 100;
      default:
        return 0;
    }
  };

  const progress = calculateProgress(status!);

  useEffect(() => {
    progressAnim.value = withTiming(progress, { duration: 500 });
  }, [progress]);

  const progressStyle = useAnimatedStyle(() => {
    return {
      width: `${progressAnim.value}%`,
    };
  });

  const getStatusComponent = (state: { event: string, lecture: Lecture }) => {
    switch (state?.event) {
      case 'NORMALIZING_TOPIC': {
        return <Text className='text-gray-500 text-sm'>Normalizing topic...</Text>;
      }
      case 'GENERATING_PLAN': {
        return (
          <View className="flex-col">
            <Text className="text-gray-500 text-sm">Creating outline for</Text>
            <Text className="text-sm" numberOfLines={1}>{lecture.title}</Text>
          </View>
        );
      }
      case 'GENERATING_CONTENT': {
        const sectionWithoutContent = state.lecture.sections.find(section => !section.hasContent);
        return (
          <View className="flex-col">
            <Text className="text-gray-500 text-sm">Adding section</Text>
            <Text className="text-sm" numberOfLines={1}>{sectionWithoutContent?.title}</Text>
          </View>
        );
      }
      case 'FINALIZING': {
        return <Text className='text-gray-500 text-sm'>Generating audio...</Text>;
      }
      default: {
        return <Text className='text-gray-500 text-sm'>Creating lecture...</Text>;
      }
    }
  };

  const processQueue = () => {
    if (isCreating) {
      const state = queueRef.current.shift();
      if (state?.event === 'DONE') {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setIsCreating(false);
        return;
      }

      if (state) {
        queueIsProcessing.current = true;
        fadeAnim.value = withTiming(0, { duration: 200 }, () => {
          runOnJS(setStatus)(state);
          fadeAnim.value = withTiming(1, { duration: 200 });
        });

        setTimeout(() => {
          queueIsProcessing.current = false;
          processQueue();
        }, timeout);
      }
    }
  };

  useEffect(() => {
    if (lecture?.creationEvent?.name) {
      queueRef.current.push({
        event: lecture.creationEvent.name,
        lecture: JSON.parse(JSON.stringify(lecture))
      });
    }

    if (queueRef.current.length > 0 && !queueIsProcessing.current) {
      queueIsProcessing.current = true;
      setTimeout(() => {
        processQueue();
      }, timeout);
    }
  }, [lecture]);

  useEffect(() => {
    contentOpacity.value = withTiming(isCreating ? 0 : 1, { duration: 500 });
  }, [isCreating]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: fadeAnim.value,
    };
  });

  const contentAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: contentOpacity.value,
    };
  });

  return (
    <Pressable onPress={() => {
      if (isCreating) return;
      router.push(`/lectures/${lecture.id}`);
    }}>
      <View className='flex-row px-5 py-4 '>
        <View className="mr-4">
          {
            isCreating ? (
              <View className='w-6 h-6 bg-gray-100 rounded-sm mt-1' />
            ) : (
              <Animated.View style={contentAnimatedStyle}>
                <Text className='text-xl top-[1]'>{lecture.emoji}</Text>
              </Animated.View>
            )
          }
        </View>
        <View className='flex-1'>
          {
            isCreating ? (
              <>
                <View className='w-52 h-5 bg-gray-100 rounded-sm mt-1' />
                <View className='w-36 h-5 bg-gray-100 rounded-sm mt-2' />
                <View className='mt-2'>
                  <View className="w-full h-1 bg-gray-100 rounded-full mb-2 mt-2">
                    <Animated.View
                      className="h-full bg-blue-500 rounded-full"
                      style={progressStyle}
                    />
                  </View>
                  <Animated.View style={animatedStyle}>
                    {getStatusComponent(status!)}
                  </Animated.View>
                </View>
              </>
            ) : (
              <Animated.View style={contentAnimatedStyle}>
                <Text className="text-lg text-gray-950">{lecture.title}</Text>
                <Text className="text-base text-gray-500" numberOfLines={2}>{lecture.topic}</Text>
              </Animated.View>
            )
          }
        </View>
      </View>
    </Pressable>
  )
}