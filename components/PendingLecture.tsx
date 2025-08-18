import React, { useEffect, useRef, useState } from 'react';
import { router } from 'expo-router';
import { ActivityIndicator, LayoutAnimation, Pressable } from 'react-native';
import { View } from 'react-native';
import { Text } from '@/components/ui/Text';
import { Lecture } from '@/apollo/__generated__/graphql';
import Animated, { useAnimatedStyle, withTiming, useSharedValue } from 'react-native-reanimated';
import { Button } from './ui/Button';
import { cn } from '@/lib/utils';

export const PendingLecture = ({ lecture, tabHeight, parentPath }: { lecture?: Lecture, tabHeight: number, parentPath: string }) => {
  const [isCreating, setIsCreating] = useState(!!lecture && lecture?.creationEvent?.name !== 'DONE');
  const progressAnim = useSharedValue(0);
  const [status, setStatus] = useState<{ event: string, lecture: Lecture }>();
  const queueRef = useRef<{ event: string, lecture: Lecture }[]>([]);
  const queueIsProcessing = useRef(false);
  const timeout = 2000;

  useEffect(() => {
    if (lecture && lecture?.creationEvent?.showNotification) {
      setIsCreating(true);
    } else {
      setIsCreating(false);
    }
  }, [lecture?.creationEvent?.showNotification]);

  const calculateProgress = (state: { event: string, lecture: Lecture }) => {
    switch (state?.event) {
      case 'INIT':
        return 0;
      case 'NORMALIZING_TOPIC':
        return 10;
      case 'RESEARCHING_PLAN':
        return 20;
      case 'RESEARCHING_CONTENT': {
        const totalSections = state.lecture.research.length;
        const sectionsWithContent = state.lecture.research.filter(section => section.hasContent).length;
        return 30 + (sectionsWithContent / totalSections) * 30;
      }
      case 'COMPILING_CONTENT':
        return 60;
      case 'GENERATING_CATEGORIES':
        return 80;
      case 'FINALIZING':
        return 90;
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

  const handleOpenLecture = () => {
    setIsCreating(false);
    router.push(`${parentPath}/${lecture!.slug}`);
  }

  const getStatusComponent = (state: { event: string, lecture: Lecture }) => {
    switch (state?.event) {
      case 'NORMALIZING_TOPIC': {
        return <Text className='text-gray-500 text-sm'>Normalizing topic...</Text>;
      }
      case 'RESEARCHING_PLAN': {
        return (
          <View className="flex-row">
            <Text numberOfLines={1}>
              <Text className="text-gray-500 text-sm">Researching: </Text>
              <Text className="text-sm">{lecture?.title}</Text>
            </Text>
          </View>
        );
      }
      case 'RESEARCHING_CONTENT': {
        const sectionWithoutContent = state.lecture.research.find(section => !section.hasContent);
        return (
          <View className="flex-row">
            <Text numberOfLines={1}>
              <Text className="text-gray-500 text-sm">Researching: </Text>
              <Text className="text-sm">{sectionWithoutContent?.title}</Text>
            </Text>
          </View>
        );
      }
      case 'COMPILING_CONTENT': {
        return (
          <View className="flex-row">
            <Text className="text-gray-500 text-sm">Bringing it all together...</Text>
          </View>
        );
      }
      case 'GENERATING_CATEGORIES': {
        return (
          <View className="flex-row">
            <Text className="text-gray-500 text-sm">Bringing it all together...</Text>
          </View>
        );
      }
      case 'FINALIZING': {
        return <Text className='text-gray-500 text-sm'>Generating audio...</Text>;
      }
      case 'DONE': {
        return <Pressable className='flex-row justify-between' onPress={handleOpenLecture}>
          <Text className='text-gray-500 text-sm flex-1' numberOfLines={1}>Hurray! Lecture <Text className='text-sm font-bold'>{lecture?.title}</Text> is ready</Text>
          <Button onPress={handleOpenLecture} text="Open" sm ghost className='py-0 px-0' />
        </Pressable>;
      }
      default: {
        return <Text className='text-gray-500 text-sm'>Creating lecture...</Text>;
      }
    }
  };

  const processQueue = () => {
    if (isCreating) {
      const state = queueRef.current.shift();
      // if (state?.event === 'DONE') {
      //   setTimeout(() => {
      //     LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      //     // setIsCreating(false);
      //   }, 1000);
      // }

      if (state) {
        queueIsProcessing.current = true;
        setStatus(state);

        setTimeout(() => {
          queueIsProcessing.current = false;
          processQueue();
        }, timeout);
      }
    }
  };

  // Handle lecture updates and queue processing
  useEffect(() => {
    if (lecture?.creationEvent?.name) {
      queueRef.current.push({
        event: lecture.creationEvent.name,
        lecture: JSON.parse(JSON.stringify(lecture))
      });
    }

    if (queueRef.current.length > 0 && !queueIsProcessing.current && isCreating) {

      queueIsProcessing.current = true;
      setTimeout(() => {
        processQueue();
      }, timeout);
    }
  }, [lecture, isCreating]); // Removed isCreating dependency to avoid circular dependency

  const contentAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: withTiming(isCreating && status ? -tabHeight : 0, { duration: 500 }) }],
      opacity: withTiming(isCreating && status ? 1 : 0, { duration: 250 })
    };
  }, [isCreating, status]);


  return (
    <Animated.View className='flex-row absolute z-10 bottom-0 w-full' style={contentAnimatedStyle}>
      <View
        className='flex-1 bg-white px-4 border-t border-gray-100'     
      >
        <View className='flex-1 flex-row  w-full'>
          <View className='flex-1'>
            <View className='mt-2'>
              <View className='flex-row justify-between'>
                <View className={cn('flex-1', status?.event !== 'DONE' && 'mr-2')}>
                  {getStatusComponent(status!)}
                </View>
                <View className='flex-row justify-end items-center'>
                  {
                    status?.event !== 'DONE' && (
                      <ActivityIndicator size="small" color="#6b7280" style={{
                        transform: [{ scale: 0.7 }]
                      }} />
                    )
                  }
                </View>
              </View>
              <View className="w-full h-1 bg-gray-100 rounded-full mb-2 mt-2">
                <Animated.View
                  className="h-full bg-blue-500 rounded-full"
                  style={progressStyle}
                />
              </View>
            </View>
          </View>
        </View>
      </View>
    </Animated.View>
  )
}