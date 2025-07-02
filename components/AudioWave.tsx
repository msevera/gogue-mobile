import React from 'react';
import { Svg, Rect } from 'react-native-svg';
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';

export const AudioWave = React.memo(({ barHeight, barWidth, barGap, bars }: { barHeight: number, barWidth: number, barGap: number, bars: number[] }) => {
  const animatedStyle = useAnimatedStyle(() => {
    return {
      height: bars?.length > 0 ? withTiming(barHeight, { duration: 500 }) : 0,
      top: bars?.length > 0 ? withTiming(-1 * 0, { duration: 500 }) : barHeight
    }
  }, [bars])
  
  return (
    <Animated.View style={[animatedStyle]} className='overflow-hidden'>
      {bars && (
        <Svg width={bars.length * (barWidth + barGap)} height={barHeight}>
          {bars.map((v, i) => (
            <Rect
              key={i}
              x={i * (barWidth + barGap)}
              y={(1 - v) * barHeight}
              width={barWidth}
              height={v * barHeight}
              fill="#e5e7eb"
            />
          ))}               
        </Svg>
      )}
    </Animated.View>
  );
})