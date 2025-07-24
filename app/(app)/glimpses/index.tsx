import { ScreenLayout } from '@/components/layouts/ScreenLayout';
import { Dimensions, View } from 'react-native';
import { Text } from '@/components/ui/Text';
import { useGetGlimpsesLatest } from '@/hooks/useGetGlimpsesLatest';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { GlimpsesItem } from '@/components/GlimpsesItem';
import { Glimpse } from '@/apollo/__generated__/graphql';
import React, { useCallback, useMemo, useState, useEffect, useRef } from 'react';
import { GlimpsesProgress } from '@/components/GlimpsesProgress';
import {
  useSharedValue,
  withTiming,
  runOnJS,
  cancelAnimation,
} from 'react-native-reanimated';
import { router } from 'expo-router';
import { Gesture, GestureDetector, GestureStateChangeEvent, TapGestureHandlerEventPayload } from 'react-native-gesture-handler';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/hooks/useAuth';
import { useNewLecture } from '@/hooks/useNewLecture';

const colorPairs = [
  { "backgroundColor": "#dbeafe", "textColor": "#3b82f6" },
  { "backgroundColor": "#fef9c3", "textColor": "#ca8a04" },
  { "backgroundColor": "#ffedd5", "textColor": "#f97316" },
  { "backgroundColor": "#fef3c7", "textColor": "#d97706" },
  { "backgroundColor": "#ecfccb", "textColor": "#65a30d" },
  { "backgroundColor": "#dcfce7", "textColor": "#16a34a" },
  { "backgroundColor": "#e0f2fe", "textColor": "#0ea5e9" },
  { "backgroundColor": "#e0e7ff", "textColor": "#6366f1" },
  { "backgroundColor": "#ede9fe", "textColor": "#8b5cf6" },
  { "backgroundColor": "#fee2e2", "textColor": "#ef4444" },
  { "backgroundColor": "#ffe4e6", "textColor": "#f43f5e" }
]

export default function Screen() {
  const { newLectureVisible, setNewLectureVisible, setInitialDescription, createPressed, setCreatePressed } = useNewLecture();
  const { items, isLoading } = useGetGlimpsesLatest();
  const { authUser } = useAuth();
  const inset = useSafeAreaInsets();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [forceRestart, setForceRestart] = useState(false);

  const screenWidth = Dimensions.get('window').width;
  const pressStart = useSharedValue(0);
  const isHolding = useSharedValue(false);
  const holdThreshold = 150; // milliseconds to distinguish tap from hold

  // Animation logic moved from GlimpsesProgress
  const progress = useSharedValue(0);
  const previousIndex = useRef(currentIndex);
  const DURATION = 10000; // 10 seconds

  const onClose = useCallback(() => {
    router.back();
  }, []);


  useEffect(() => {
    setIsPaused(newLectureVisible);   
  }, [newLectureVisible]);

  useEffect(() => {
    if (!newLectureVisible && createPressed) {
      setCreatePressed(false);
      onClose();
    }
  }, [newLectureVisible, createPressed]);

  useEffect(() => {
    if (isPaused) {
      cancelAnimation(progress);
      return;
    }

    // Check if index changed or force restart was triggered
    const isIndexChange = currentIndex !== previousIndex.current;
    const shouldRestart = isIndexChange || forceRestart;

    // Calculate remaining duration based on current progress BEFORE resetting
    const currentProgressValue = progress.value;
    const remainingDuration = shouldRestart
      ? DURATION // Full duration for new index or restart
      : DURATION * (1 - currentProgressValue); // Resume from current progress

    // Reset progress when index changes or force restart
    if (shouldRestart) {
      progress.value = 0;
      previousIndex.current = currentIndex;
      if (forceRestart) {
        setForceRestart(false); // Reset the force restart flag
      }
    }

    // Start animation for current item from current progress
    progress.value = withTiming(1, { duration: remainingDuration }, (finished) => {
      if (finished) {
        runOnJS(increaseCurrentIndex)();
      }
    });

    return () => {
      cancelAnimation(progress);
    };
  }, [currentIndex, isPaused, items.length, forceRestart]);

  const increaseCurrentIndex = useCallback(() => {
    if (currentIndex < items.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      onClose();
    }

  }, [currentIndex, items.length]);

  const decreaseCurrentIndex = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    } else {
      // If already at index 0, restart animation on current index
      setForceRestart(true);
    }
  }, [currentIndex]);

  const { item, colorPair, topicName } = useMemo(() => {
    if (items.length === 0) {
      return {
        item: null,
        topicName: null,
        colorPair: colorPairs[0],
      };
    }
    const item = items[currentIndex];
    const topic = authUser?.topics?.find(topic => topic.id === item.topicId);
    return {
      item,
      topicName: topic?.name,
      colorPair: colorPairs[currentIndex],
    };
  }, [currentIndex, items, authUser]);

  const onPauseStart = useCallback(() => {
    console.log('onPauseStart');
    setIsPaused(true);
  }, []);

  const onPauseEnd = useCallback(() => {
    console.log('onPauseEnd');
    setIsPaused(false);
  }, []);

  const linkNative = Gesture.Tap();
  const closeNative = Gesture.Tap();
  const ctaNative = Gesture.Tap();

  const tapGesture = Gesture.Tap()
    .requireExternalGestureToFail(linkNative, closeNative)
    .onStart(() => {
      pressStart.value = Date.now();
    })
    .onEnd((event) => {
      const pressDuration = Date.now() - pressStart.value;

      // If it was a quick tap (not a hold), handle left/right tap
      if (pressDuration < holdThreshold && !isHolding.value) {
        // Calculate close button area (top-right corner)
        // Use event.x which is relative to the component's coordinate system
        if (event.x < screenWidth / 2) {
          runOnJS(decreaseCurrentIndex)();
        } else {
          runOnJS(increaseCurrentIndex)();
        }
      }
    });

  const longPressGesture = Gesture.LongPress()
    .minDuration(holdThreshold)
    .onStart(() => {
      isHolding.value = true;
      runOnJS(onPauseStart)();
    })
    .onEnd(() => {
      isHolding.value = false;
      runOnJS(onPauseEnd)();
    });

  const composedGesture = Gesture.Race(longPressGesture, tapGesture);

  return (
    <GestureDetector gesture={composedGesture}>
      <View className="flex-1" style={{ backgroundColor: colorPair.backgroundColor }}>
        <ScreenLayout
          screenOptions={{
            headerLoading: false,
            headerShown: false,
            animation: 'fade',
            animationDuration: 300, 
            gestureDirection: 'vertical',
          }}
          contentLoading={isLoading}
          contentEmpty={false}
          contentEmptyText='Create your first lecture'
          bottomPadding={false}
        >
          <View className='px-4 items-end flex-1' style={{ paddingTop: inset.top }}>
            <View className='items-end'>
              <GlimpsesProgress
                progress={progress}
                currentIndex={currentIndex}
                items={items as Glimpse[]}
                colorPair={colorPair}
              />
              <GestureDetector gesture={closeNative}>
                <Button onPress={onClose} icon={{ component: 'Ionicons', name: 'close', size: 36, color: colorPair.textColor }} ghost className='p-0 mt-2' />
              </GestureDetector>
            </View>
            {
              item && (
                <View className="flex-1 item-center justify-center absolute bottom-0 top-0 left-0 right-0 px-4">
                  <GlimpsesItem
                    gesture={linkNative}
                    onPauseStart={onPauseStart}
                    onPauseEnd={onPauseEnd}
                    item={item as Glimpse}
                    topicName={topicName as string}
                    backgroundColor={colorPair.backgroundColor}
                    textColor={colorPair.textColor}
                  />
                </View>
              )
            }
            <View className='absolute bottom-0 left-0 right-0 items-center justify-center' style={{ bottom: inset.bottom }}>
              <GestureDetector gesture={ctaNative}>
                <Button onPress={() => {
                  setInitialDescription(item?.query || '');
                  setNewLectureVisible(true);
                }} text='Create lecture' />
              </GestureDetector>
            </View>
          </View>
        </ScreenLayout>
      </View>
    </GestureDetector>
  );
}
