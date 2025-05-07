import React, { useRef, useEffect, useState } from 'react';
import { View, LayoutChangeEvent } from 'react-native';
import {
  GestureHandlerRootView,
  GestureDetector,
  Gesture,
} from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  runOnJS,
  useAnimatedReaction,
} from 'react-native-reanimated';
import { Text } from './ui/Text';

type SliderProps = {
  values: number[];
  labels?: string[];
  value?: number;
  onChange?: (value: number) => void;
  labelTemplate?: string;
};

const THUMB_SIZE = 40;
const SNAP_THRESHOLD = 5;
const PADDING = 5;

const Slider = ({ values, labels, value, onChange, labelTemplate }: SliderProps) => {
  const containerWidth = useSharedValue(0);
  const offset = useSharedValue(0);
  const containerRef = useRef<View>(null);
  const lastValue = useSharedValue(values[0]);
  const startX = useSharedValue(0);
  const currentIndex = useSharedValue(0);
  const [labelText, setLabelText] = useState(() => {
    const initialValue = labels?.[0] ?? values[0];
    return labelTemplate ? labelTemplate.replace('{value}', String(initialValue)) : String(initialValue);
  });

  // Initialize offset based on initial value
  useEffect(() => {
    if (value !== undefined) {
      const index = values.indexOf(value);
      if (index !== -1) {
        const newOffset = (index / (values.length - 1)) * (containerWidth.value - THUMB_SIZE - PADDING * 2);
        offset.value = withTiming(newOffset, {
          duration: 150,
        });
        lastValue.value = value;
        currentIndex.value = index;
        const newValue = labels?.[index] ?? values[index];
        setLabelText(labelTemplate ? labelTemplate.replace('{value}', String(newValue)) : String(newValue));
      }
    }
  }, [value, values, containerWidth.value, labelTemplate]);

  const onLayout = (event: LayoutChangeEvent) => {
    containerWidth.value = event.nativeEvent.layout.width;
  };

  const getOffsetFromValue = (val: number) => {
    'worklet';
    const index = values.indexOf(val);
    if (index === -1) return 0;
    const maxOffset = containerWidth.value - THUMB_SIZE - PADDING * 2;
    
    return (index / (values.length - 1)) * maxOffset;
  };

  const getCurrentSnapIndex = () => {
    'worklet';
    const maxOffset = containerWidth.value - THUMB_SIZE - PADDING * 2;
    const progress = offset.value / maxOffset;
    const index = Math.round(progress * (values.length - 1));
    return Math.max(0, Math.min(index, values.length - 1));
  };

  const pan = Gesture.Pan()
    .onStart(() => {
      'worklet';
      startX.value = offset.value;
    })
    .onChange((event) => {
      'worklet';
      const newOffset = startX.value + event.translationX;
      const maxOffset = containerWidth.value - THUMB_SIZE - PADDING * 2;          

      // Clamp the offset and update position
      offset.value = Math.max(0, Math.min(newOffset, maxOffset));
      
      // Only update the visual label during movement, not the actual value
      const newIndex = getCurrentSnapIndex();
      const displayValue = labels?.[newIndex] ?? values[newIndex];
      runOnJS(setLabelText)(
        labelTemplate ? labelTemplate.replace('{value}', String(displayValue)) : String(displayValue)
      );
    })
    .onEnd((event) => {
      'worklet';
      const movement = event.translationX;
      
      // Only process the movement if it exceeds the threshold
      if (Math.abs(movement) >= SNAP_THRESHOLD) {
        const direction = movement > 0 ? 1 : -1;
        const nextIndex = Math.max(0, Math.min(currentIndex.value + direction, values.length - 1));
        const nextValue = values[nextIndex];
        
        const targetOffset = getOffsetFromValue(nextValue);
        offset.value = withTiming(targetOffset, {
          duration: 150,
        });
        
        currentIndex.value = nextIndex;
        const displayValue = labels?.[nextIndex] ?? values[nextIndex];
        runOnJS(setLabelText)(
          labelTemplate ? labelTemplate.replace('{value}', String(displayValue)) : String(displayValue)
        );
        lastValue.value = nextValue;
        if (onChange) {
          runOnJS(onChange)(nextValue);
        }
      } else {
        // If movement is less than threshold, snap back to current value
        const targetOffset = getOffsetFromValue(lastValue.value);
        offset.value = withTiming(targetOffset, {
          duration: 150,
        });
      }
    });

  const thumbStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: offset.value + PADDING }],
    };
  });

  const labelStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: offset.value + PADDING + THUMB_SIZE / 2 - 20 }],
    };
  });

  // Add this new reaction to handle label updates
  useAnimatedReaction(
    () => {
      return labelText;
    },
    (currentLabel) => {
      // This will run on the UI thread whenever labelText changes
      'worklet';
    }
  );

  return (
    <GestureHandlerRootView>
      <View ref={containerRef} onLayout={onLayout} className="w-full">
        <View className="w-full h-[50px] bg-gray-100 rounded-[25px] justify-center p-[5px]">
          <GestureDetector gesture={pan}>
            <Animated.View 
              className="w-[40px] h-[40px] bg-blue-500 rounded-full absolute top-[5px] left-0" 
              style={[thumbStyle]} 
            />
          </GestureDetector>
        </View>
        <View className="h-5 mt-2">
          <Animated.View style={[labelStyle]}>
            <Text className="text-sm text-gray-600">
              {labelText}
            </Text>
          </Animated.View>
        </View>
      </View>
    </GestureHandlerRootView>
  );
};

export default Slider;