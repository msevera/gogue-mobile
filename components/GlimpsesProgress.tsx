import { View } from 'react-native';
import { Glimpse } from '@/apollo/__generated__/graphql';
import React from 'react';
import Animated, {
  useAnimatedStyle,
  SharedValue,
} from 'react-native-reanimated';
import { cn } from '@/lib/utils';

interface GlimpsesProgressProps {
  items: Glimpse[];
  currentIndex: number;
  progress: SharedValue<number>;
  colorPair: { backgroundColor: string, textColor: string };
}

export const GlimpsesProgress = ({
  items,
  currentIndex,
  progress,
  colorPair,
}: GlimpsesProgressProps) => {
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
      <View
        className={cn(
          "flex-1 h-1 mx-0.5 rounded-full overflow-hidden",
          "bg-white"
        )}
        style={{ backgroundColor: `${colorPair.textColor}33` }}
      >
        <Animated.View
          className="h-full rounded-full"
          style={[animatedStyle, { backgroundColor: colorPair.textColor }]}
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