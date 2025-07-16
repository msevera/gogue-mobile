import { Pressable, View } from 'react-native';
import { Text } from './ui/Text';
import { Button } from './ui/Button';
import { router } from 'expo-router';
import { Glimpse } from '@/apollo/__generated__/graphql';
import React, { useEffect } from 'react';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  runOnJS,
  cancelAnimation,
} from 'react-native-reanimated';
import { cn } from '@/lib/utils';

interface GlimpsesProgressProps {
  items: Glimpse[];
  currentIndex?: number;
  onProgressComplete: (index: number) => void;
  onAllComplete: () => void;
  isPaused?: boolean;
}

export const GlimpsesProgress = ({ 
  items, 
  currentIndex = 0, 
  onProgressComplete, 
  onAllComplete,
  isPaused = false 
}: GlimpsesProgressProps) => {
  const progress = useSharedValue(0);
  const previousIndex = React.useRef(currentIndex);
  const DURATION = 10000; // 10 seconds

  useEffect(() => {
    if (isPaused) {
      cancelAnimation(progress);
      return;
    }

    // Check if index changed
    const isIndexChange = currentIndex !== previousIndex.current;
    
    // Calculate remaining duration based on current progress BEFORE resetting
    const currentProgressValue = progress.value;
    const remainingDuration = isIndexChange 
      ? DURATION // Full duration for new index
      : DURATION * (1 - currentProgressValue); // Resume from current progress
    
    // Reset progress when index changes
    if (isIndexChange) {
      progress.value = 0;
      previousIndex.current = currentIndex;
    }
    
    // Start animation for current item from current progress
    progress.value = withTiming(1, { duration: remainingDuration }, (finished) => {
      if (finished) {
        if (currentIndex < items.length - 1) {
          runOnJS(onProgressComplete)(currentIndex);
        } else {
          runOnJS(onAllComplete)();
        }
      }
    });

    return () => {
      cancelAnimation(progress);
    };
  }, [currentIndex, isPaused, items.length]);

  const ProgressBar = ({ index }: { index: number }) => {
    const animatedStyle = useAnimatedStyle(() => {
      let width = 0;
      
      if (index < currentIndex) {
        // Completed bars
        width = 1;
      } else if (index === currentIndex) {
        // Current active bar
        width = progress.value;
      } else {
        // Future bars
        width = 0;
      }

      return {
        width: `${width * 100}%`,
      };
    });

    return (
      <View className={cn(
        "flex-1 h-1 mx-0.5 rounded-full overflow-hidden",
        "bg-white/50"
      )}>
        <Animated.View 
          className="h-full bg-white rounded-full"
          style={animatedStyle}
        />
      </View>
    );
  };

  if (items.length === 0) {
    return null;
  }

  return (
    <View className="flex-row items-center">
      {items.map((_, index) => (
        <ProgressBar key={index} index={index} />
      ))}
    </View>
  );
};