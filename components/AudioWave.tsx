import React from 'react';
import { Svg, Rect } from 'react-native-svg';
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';

const BAR_HEIGHT = 12;

export const AudioWave = React.memo(({ barWidth, barGap, bars }: { barWidth: number, barGap: number, bars: number[] }) => {
  const animatedStyle = useAnimatedStyle(() => {
    return {
      height: bars?.length > 0 ? withTiming(BAR_HEIGHT, { duration: 500 }) : 0,
      top: bars?.length > 0 ? withTiming(-1 * 0, { duration: 500 }) : BAR_HEIGHT
    }
  }, [bars])
  
  return (
    <Animated.View style={[animatedStyle]} className='overflow-hidden'>
      {bars && (
        <Svg width={bars.length * (barWidth + barGap)} height={BAR_HEIGHT}>
          {bars.map((v, i) => (
            <Rect
              key={i}
              x={i * (barWidth + barGap)}
              y={(1 - v) * BAR_HEIGHT}
              width={barWidth}
              height={v * BAR_HEIGHT}
              fill="#e5e7eb"
            />
          ))}               
        </Svg>
      )}
    </Animated.View>
  );
})