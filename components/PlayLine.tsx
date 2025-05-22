import { View, Dimensions } from 'react-native'
import { Text } from './ui/Text'
import { AudioStatus } from 'expo-audio';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle, useSharedValue, withSpring, runOnJS } from 'react-native-reanimated';
import { useMemo } from 'react';

const { width: screenWidth } = Dimensions.get('window');
const LINE_WIDTH = screenWidth - 2;

interface PlayLineProps {
  currentTime: number;  
  duration: number;
  onSeek?: (position: number) => void;
  onSeekEnd?: (position: number) => void;
  onSeekStart?: (position: number) => void;
  alignments: any;
}

export const PlayLine = ({ currentTime, duration, onSeek, onSeekEnd, onSeekStart, alignments }: PlayLineProps) => {
  console.log('currentTime 2', currentTime)
  const snapPoints = useMemo(() => {
    const result = alignments.filter((alignment: any) => alignment.is_sentence_start).map((alignment: any) => alignment.sentence.start_time);
    console.log('snapPoints', result)
    return result;
  }, [alignments]);

  const isLoaded = duration > 0;
  const progress = isLoaded ? currentTime / duration : 0;

  // Calculate the position of the current time marker
  const markerPosition = LINE_WIDTH / 2;

  // Shared value for the current position
  const position = useSharedValue(progress * LINE_WIDTH);
  const startPosition = useSharedValue(0);

  const findClosestSnapPoint = (currentTime: number) => {
    'worklet';
    if (!snapPoints.length) return currentTime;
    
    return snapPoints.reduce((prev: number, curr: number) => {
      return Math.abs(curr - currentTime) < Math.abs(prev - currentTime) ? curr : prev;
    });
  };

  const timeToPosition = (time: number) => {
    'worklet';
    return (time / duration) * LINE_WIDTH;
  };

  const positionToTime = (pos: number) => {
    'worklet';
    return (pos / LINE_WIDTH) * duration;
  };

  const panGesture = Gesture.Pan()
    .onStart(() => {
      console.log('onStart', position.value)
      startPosition.value = position.value;
      if (onSeekStart) {
        runOnJS(onSeekStart)(position.value);
      }
    })
    .onUpdate((event) => {
      // Calculate new position based on the gesture
      const newPosition = Math.max(0, Math.min(LINE_WIDTH, startPosition.value - event.translationX));
      
      // Convert position to time
      const currentTime = positionToTime(newPosition);
      
      // Find closest snap point
      const snappedTime = findClosestSnapPoint(currentTime);
      
      // Convert back to position
      const snappedPosition = timeToPosition(snappedTime);
      
      position.value = snappedPosition;
      
      // Call onSeek with the snapped time position
      if (onSeek && isLoaded) {
        runOnJS(onSeek)(snappedTime);
      }
    })
    .onEnd(() => {
      // Calculate the final progress (0 to 1)
      if (onSeekEnd && isLoaded) {
        const finalTime = positionToTime(position.value);
        runOnJS(onSeekEnd)(finalTime);
      }
    });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      width: position.value,
    };
  });

  return (
    <GestureDetector gesture={panGesture}>
      <View className="w-full px-0 pt-5">
        <View className="h-[2] bg-gray-50 overflow-hidden relative">
          <Animated.View
            className="h-full bg-blue-400 absolute"
            style={[{ right: markerPosition }, animatedStyle]}
          />
          {/* <View 
            className="w-1 h-full bg-black absolute z-10" 
            style={{ left: markerPosition, transform: [{ translateX: -1 }] }} 
          /> */}
          <View
            className="h-full bg-gray-200 absolute"
            style={{ left: markerPosition, width: LINE_WIDTH - position.value }}
          />
        </View>
        <View className="flex-row items-center justify-center mt-2">
          <Text className="text-xs text-blue-400">
            {isLoaded ? formatTime(currentTime) : '--:--'}
          </Text>
          <View className='w-[1.5] h-[10] bg-gray-400 mr-1 ml-1' />
          <Text className="text-xs text-gray-500">
            {isLoaded ? formatTime(duration) : '--:--'}
          </Text>
        </View>
      </View>
    </GestureDetector>
  )
}

const formatTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};