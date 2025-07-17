import { Platform, View, Pressable, Dimensions, FlatList, NativeSyntheticEvent, NativeScrollEvent, KeyboardAvoidingViewProps } from "react-native"
import { Text } from "./ui/Text"
import Animated, { scrollTo, Easing, runOnJS, SharedValue, useAnimatedRef, useAnimatedScrollHandler, useAnimatedStyle, useDerivedValue, useScrollViewOffset, useSharedValue, withDecay, withDelay, withSpring, withTiming, cancelAnimation } from 'react-native-reanimated';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import React from 'react';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';
import { Gesture, GestureDetector, GestureStateManager } from 'react-native-gesture-handler';
import { Button } from './ui/Button';
import { BottomSheetInternalProvider } from '@/contexts/bottomSheetInternalContext';
import { cn } from '@/lib/utils';

const { height: screenHeight } = Dimensions.get("window");
const backdropDuration = 300;
const slideDuration = 300;

type BottomSheetProps = {
  customBackground?: boolean,
  title?: string,
  headerLeft?: React.ReactNode,
  backdropClassName?: string,
  headerBorder?: boolean,
  headerContainerClassName?: string,
  headerContentClassName?: string,
  gesturesEnabled?: boolean,
  onIndexChanged?: (index: number) => void,
  snapPoints: (number | string)[],
  index: number,
  backdrop?: boolean,
  onBackdropPress?: () => void,
  children: React.ReactNode,
  yPositionShared?: SharedValue<number> | null,
  heightShared?: SharedValue<number> | null,
  onSlideAnimationCompleted?: (value: boolean) => void,
  canPanUp?: SharedValue<boolean> | null,
  canPanDown?: SharedValue<boolean> | null,
  closeByGestureEnabled?: boolean,
  onSlideAnimationStarted?: () => void,
  showCloseButton?: boolean,
  customKeyboardBehavior?: KeyboardAvoidingViewProps['behavior'] | null
}

export const BottomSheet = ({
  customBackground,
  title,
  headerLeft,
  headerBorder,
  gesturesEnabled,
  onIndexChanged,
  snapPoints,
  index,
  backdrop,
  onBackdropPress,
  children,
  yPositionShared,
  heightShared,
  onSlideAnimationCompleted,
  onSlideAnimationStarted,
  closeByGestureEnabled,
  headerContainerClassName,
  headerContentClassName,
  backdropClassName,
  showCloseButton = true,
  customKeyboardBehavior = (Platform.OS === 'ios' ? 'padding' : undefined)
}: BottomSheetProps) => {
  const { top } = useSafeAreaInsets();
  const animatedScrollableContentOffsetY = useSharedValue(0);
  const [pointRefresher, setPointRefresher] = useState(Date.now());
  const maxHeight = screenHeight - top;
  const snapPointsNumbers = useMemo(() => {
    return snapPoints.map(point => {
      if (typeof point === 'string' && point === 'full') {
        return maxHeight;
      }

      if (typeof point === 'string' && point.includes('%')) {
        return Math.round(maxHeight * (parseInt(point) / 100));
      }

      return point as number;
    });
  }, [snapPoints]);


  const newYValue = useMemo<number>(() => {
    const point = snapPointsNumbers[index];
    return point as number;
  }, [snapPointsNumbers, index]);

  const { lowerBound, upperBound } = useMemo(() => {
    const bound = screenHeight;
    const minBound = 0;
    const maxBound = maxHeight;
    const min = Math.min(...snapPointsNumbers);
    const max = Math.max(...snapPointsNumbers);
    const lowerBound = Math.max(minBound, min - bound);
    const upperBound = Math.min(maxBound, max + bound);
    return { lowerBound, upperBound };
  }, [snapPointsNumbers])

  const translateY = useSharedValue(maxHeight - newYValue);

  useEffect(() => {
    const newHeightValue = maxHeight - newYValue;
    translateY.value = withTiming(newHeightValue, { duration: slideDuration, easing: Easing.inOut(Easing.quad) }, (isFinished) => {
      if (isFinished && onSlideAnimationCompleted) {
        runOnJS(onSlideAnimationCompleted)(true);
      }
    });
  }, [newYValue, pointRefresher])

  useDerivedValue(() => {
    if (heightShared) {
      heightShared.value = maxHeight;
    }

    if (yPositionShared) {
      yPositionShared.value = translateY.value;
    }
  });

  const animatedScrollableLockedState = useDerivedValue(() => {
    if (!gesturesEnabled) {
      return false
    }

    return true;
  })

  const context = useSharedValue({
    initialPosition: 0,
    panDirection: 0,
    skipPanGesture: false
  });

  const scrollContext = useSharedValue<{
    scrollDirection: number,
    isScrollBeginning: boolean,
    scrollLocked: boolean,
    source: 'scrollable' | 'pan'
  }>({
    scrollDirection: 0,
    isScrollBeginning: false,
    scrollLocked: false,
    source: 'scrollable'
  })

  const panGesture = Gesture.Pan()
    .onTouchesDown(() => {
      scrollContext.value.source = 'pan';
      context.value.skipPanGesture = false;
    })
    .onStart((e) => {
      runOnJS(onSlideAnimationStarted)();
      context.value.initialPosition = translateY.value;
    })
    .onChange((e) => {
      const isLastSnapPoint = index === snapPoints.length - 1;
      const isScrollingUp = scrollContext.value.scrollDirection === 1;
      const isScrollingDown = scrollContext.value.scrollDirection === -1;

      if (snapPoints.length === 1) {
        scrollContext.value.scrollLocked = false;
      } else if (scrollContext.value.source === 'scrollable') {
        // Handle last snap point differently
        if (isLastSnapPoint) {
          if (isScrollingUp) {
            // Allow scrolling content when moving up at last snap point
            scrollContext.value.scrollLocked = false;
            context.value.skipPanGesture = true;
          } else if (isScrollingDown && !scrollContext.value.isScrollBeginning) {
            // Allow scrolling content when moving down and not at the beginning
            scrollContext.value.scrollLocked = false;
            context.value.skipPanGesture = true;
          } else if (isScrollingDown && scrollContext.value.isScrollBeginning) {
            // Lock scrolling to allow sheet movement when at the beginning
            scrollContext.value.scrollLocked = true;
          }
        } else {
          // For all other snap points
          if (scrollContext.value.isScrollBeginning) {
            // Prioritize pan gesture when at the beginning of scroll
            scrollContext.value.scrollLocked = true;
          } else {
            // Otherwise, allow content scrolling
            scrollContext.value.scrollLocked = false;
            context.value.skipPanGesture = true;
          }
        }
      }

      if (context.value.skipPanGesture) {
        return;
      }

      if (e.translationY > 0) {
        context.value.panDirection = -1;
      } else {
        context.value.panDirection = 1;
      }

      let yValue = 0;
      const value = maxHeight - (context.value.initialPosition + e.translationY);
      if (value < lowerBound) {
        yValue = maxHeight - lowerBound;
      } else if (value > upperBound) {
        yValue = maxHeight - upperBound;
      } else {
        yValue = maxHeight - value;
      }

      translateY.value = yValue;
    })
    .onEnd((e) => {
      if (context.value.skipPanGesture || context.value.panDirection === 0) {
        return;
      }

      const yValue = withDecay({
        velocity: e.velocityY,
        rubberBandEffect: false,
        clamp: [
          maxHeight - upperBound,
          maxHeight - lowerBound
        ],
      });

      translateY.value = yValue;
      runOnJS(setPointRefresher)(Date.now());
      const newIndex = index + context.value.panDirection;
      if (snapPointsNumbers[newIndex] && onIndexChanged) {
        runOnJS(onIndexChanged)(newIndex);
      } else if (onBackdropPress && !snapPointsNumbers[newIndex] && context.value.panDirection === -1 && closeByGestureEnabled) {
        runOnJS(onBackdropPress)();
      }
    })
    .enabled(!!gesturesEnabled);


  const nativeGesture = Gesture.Native().simultaneousWithExternalGesture(panGesture).shouldCancelWhenOutside(false)

  const sheetStyles = useAnimatedStyle(() => {
    return {
      transform: [{
        translateY: translateY.value
      }],
    }
  })

  const backdropStyles = useAnimatedStyle(() => {
    const result = {
      opacity: withTiming(backdrop ? 1 : 0, { duration: backdropDuration }),
      zIndex: backdrop ? 1 : withDelay(backdropDuration, withTiming(-1, { duration: 0 })),
      height: backdrop ? screenHeight : withDelay(backdropDuration, withTiming(0, { duration: 0 }))
    }

    return result;
  })

  const onBackdropPressHandler = useCallback(() => {
    if (onBackdropPress) {
      onBackdropPress();
    }
  }, [onBackdropPress]);

  const internalContextVariables = {
    animatedScrollableLockedState,
    animatedScrollableContentOffsetY,
    nativeGesture,
    scrollContext
  }


  return (
    <>
      <Animated.View
        style={[
          backdropStyles
        ]}
        className={cn('absolute top-[-1] left-0 right-0 bottom-0 bg-gray-950/65', backdropClassName)}
      >
        <Pressable className="absolute top-0 left-0 right-0 bottom-0" onPress={onBackdropPressHandler} />
      </Animated.View>
      <Animated.View
        style={[{
          height: maxHeight
        },
          sheetStyles
        ]}
        className={`absolute bottom-0 w-full z-[1]`}
      >
        <GestureDetector gesture={panGesture}>
          <KeyboardAvoidingView keyboardVerticalOffset={40} behavior={customKeyboardBehavior} className="flex-1">
            <BottomSheetInternalProvider value={internalContextVariables}>
              {
                customBackground ? (
                  children
                ) : (
                  <View className={cn(
                    `flex-1 bg-white rounded-t-3xl`,
                    headerContainerClassName
                  )}>
                    <View
                      className={cn(
                        `p-3 flex-row justify-between items-center`, headerContentClassName, headerBorder ? 'border-b border-gray-100' : '',
                        headerContentClassName
                      )}
                    >
                      {headerLeft || <View className='h-6 w-6' />}
                      <Text className="text-lg font-medium">
                        {title}
                      </Text>
                      {
                        showCloseButton ? (
                          <Button sm ghost icon={{ component: 'Ionicons', name: 'close' }} onPress={onBackdropPress} className="bg-gray-50" />
                        ) : <View className='h-6 w-6' />
                      }

                    </View>
                    {children}
                  </View>
                )
              }
            </BottomSheetInternalProvider>
          </KeyboardAvoidingView>
        </GestureDetector>
      </Animated.View>
    </>
  )
} 