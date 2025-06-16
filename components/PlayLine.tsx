import { View, Dimensions } from 'react-native'
import { Text } from './ui/Text'
import { AudioStatus } from 'expo-audio';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle, useSharedValue, withSpring, runOnJS, withDecay, withTiming } from 'react-native-reanimated';
import { useMemo, useEffect } from 'react';
import { Note } from '@/apollo/__generated__/graphql';

const { width: screenWidth } = Dimensions.get('window');
const LINE_WIDTH = screenWidth - 2;

interface PlayLineProps {
  currentTime: number;
  duration: number;
  onSeek?: (position: number) => void;
  onSeekEnd?: (position: number) => void;
  onSeekStart?: (position: number) => void;
  sentences: any;
  notes: Note[];
}

export const PlayLine = ({
  currentTime,
  duration,
  onSeek,
  onSeekEnd,
  onSeekStart,
  sentences,
  notes
}: PlayLineProps
) => {
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

  const isLoaded = duration > 0;
  const progress = isLoaded ? currentTime / duration : 0;

  // Calculate the position of the current time marker
  const markerPosition = LINE_WIDTH / 2;

  // Shared value for the current position
  const position = useSharedValue(progress * LINE_WIDTH);
  const startPosition = useSharedValue(0);

  // Shared value for the progress width
  const progressWidth = useSharedValue(progress * LINE_WIDTH);

  // Update position when currentTime changes
  useEffect(() => {
    if (isLoaded) {
      position.value = progress * LINE_WIDTH;
    }
  }, [currentTime, duration, isLoaded]);

  // Update progress width when currentTime changes
  useEffect(() => {
    if (isLoaded) {
      progressWidth.value = withTiming(progress * LINE_WIDTH, { duration: 150 });
    }
  }, [currentTime, duration, isLoaded]);

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
    .onEnd((event) => {
      if (isLoaded) {
        position.value = withDecay({
          velocity: event.velocityX,
          velocityFactor: 1,
          deceleration: 1,
          rubberBandEffect: true,
          rubberBandFactor: 0.6,
          clamp: [0, LINE_WIDTH]
        });
        // We'll let the decay animation determine the final position
        const finalTime = positionToTime(position.value);
        if (onSeekEnd) {
          runOnJS(onSeekEnd)(finalTime);
        }
      }
    });

  const progressActiveStyle = useAnimatedStyle(() => {
    return {
      width: progressWidth.value,
    };
  });

  const progressInactiveStyle = useAnimatedStyle(() => {
    return {
      width: LINE_WIDTH - progressWidth.value,
    };
  });

  const progressHighlightStyle = useAnimatedStyle(() => {
    return {
      left: markerPosition + 2 - progressWidth.value,     
    };
  });

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