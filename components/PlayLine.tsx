import { View, Dimensions } from 'react-native'
import { Text } from './ui/Text'
import { AudioStatus } from 'expo-audio';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle, useSharedValue, withSpring, runOnJS, withDecay, withTiming, useDerivedValue, SharedValue } from 'react-native-reanimated';
import { useMemo, useEffect, forwardRef, useImperativeHandle, useState } from 'react';
import { Note } from '@/apollo/__generated__/graphql';
import { formatTime } from '@/lib/utils';

const { width: screenWidth } = Dimensions.get('window');
const LINE_WIDTH = screenWidth - 2;
const markerPosition = LINE_WIDTH / 2;

interface PlayLineProps {
  duration: number;
  onSeek?: (position: number) => void;
  onSeekEnd?: (position: number) => void;
  onSeekStart?: (position: number) => void;
  sentences: any;
  notes: Note[];
}

export interface PlayLineRef {
  setCurrentTime: (currentTime: number) => void;
}

export const PlayLine = forwardRef<PlayLineRef, PlayLineProps>(({
  duration,
  onSeek,
  onSeekEnd,
  onSeekStart,
  sentences,
  notes
}, ref) => {
  const isLoaded = duration > 0;
  const position = useSharedValue(0);
  const startPosition = useSharedValue(0);
  const closestSnapPoint = useSharedValue(0);
  const [timeLabel, setTimeLabel] = useState(0);

  useImperativeHandle(ref, () => ({
    setCurrentTime(currentTime: number) {
      closestSnapPoint.value = currentTime;
      const snappedPosition = timeToPosition(currentTime);
      position.value = snappedPosition;
    }
  }));
  
  useDerivedValue(() => {    
    runOnJS(setTimeLabel)(closestSnapPoint.value)
  }, []);

  const snapPoints = useMemo(() => {
    const result = sentences.map((alignment: any) => alignment.sentence.start_time);
    return result;
  }, [sentences]);

  const highlightNotes = useMemo(() => {
    if (sentences.length === 0 || notes.length === 0 || duration === 0) return [];

    const result = notes.map((note) => {
      const sentenceToHighlight = sentences.find((alignment: any) => alignment.sentence.start_time === note.timestamp);
      return {
        startTime: sentenceToHighlight?.sentence.start_time,
        endTime: sentenceToHighlight?.sentence.end_time,
        note
      }
    })

    return result;
  }, [sentences, notes, duration])

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
    return Number(((pos / LINE_WIDTH) * duration).toFixed(2));
  };

  const panGesture = Gesture.Pan()
    .onStart(() => {
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
      closestSnapPoint.value = snappedTime;

      // Convert back to position
      const snappedPosition = timeToPosition(snappedTime);

      position.value = snappedPosition;

      // Call onSeek with the snapped time position
      if (onSeek && isLoaded) {
        runOnJS(onSeek)(closestSnapPoint.value);
      }
    })
    .onEnd((event) => {
      if (isLoaded) {       
        // const currentTime = positionToTime(position.value);
        // const snappedTime = findClosestSnapPoint(currentTime);
        // closestSnapPoint.value = snappedTime;
        if (onSeekEnd) {
          runOnJS(onSeekEnd)(closestSnapPoint.value);
        }
      }
    });

  const progressActiveStyle = useAnimatedStyle(() => {
    return {
      width: position.value,
    };
  }, []);

  const progressInactiveStyle = useAnimatedStyle(() => {
    return {
      width: LINE_WIDTH - position.value,
    };
  }, []);

  const progressHighlightStyle = useAnimatedStyle(() => {
    return {
      left: markerPosition + 2 - position.value,
    };
  }, []);

  return (
    <GestureDetector gesture={panGesture}>
      <View className="w-full px-0 pt-5">
        <View className="h-[2] bg-gray-50 relative">
          <Animated.View
            className="h-full bg-blue-400 absolute"
            style={[{ right: markerPosition }, progressActiveStyle]}
          />
          <View
            className="w-[10] h-[10] top-[-4] bg-blue-400 absolute z-10 rounded-full"
            style={{ left: markerPosition, transform: [{ translateX: -3 }] }}
          />
          <Animated.View
            className="h-full bg-gray-200 absolute"
            style={[{ left: markerPosition }, progressInactiveStyle]}
          />
          <Animated.View
            className="h-full absolute top-[0]"
            style={[{ width: LINE_WIDTH }, progressHighlightStyle]}
          >
            {
              highlightNotes.map((highlight) => {
                const { startTime, endTime, note } = highlight;
                const startPosition = timeToPosition(startTime);
                const endPosition = timeToPosition(endTime);
                const width = endPosition - startPosition;
                return <View key={note.id} className="h-[10] top-[-10] bg-yellow-400 absolute rounded-t-sm" style={{ left: startPosition, width, zIndex: 10 }} />
              })
            }
          </Animated.View>
        </View>
        <View className="flex-row items-center justify-center mt-2">
          <Text className="text-xs text-blue-400">
            {isLoaded ? formatTime(timeLabel) : '--:--'}
          </Text>
          <View className='w-[1.5] h-[10] bg-gray-400 mr-1 ml-1' />
          <Text className="text-xs text-gray-500">
            {isLoaded ? formatTime(duration) : '--:--'}
          </Text>
        </View>
      </View>
    </GestureDetector>
  )
})