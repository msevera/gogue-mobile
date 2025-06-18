import React, { useEffect, useState, useMemo } from 'react';
import { View, StyleSheet, ActivityIndicator, Dimensions } from 'react-native';
import { AudioContext } from 'react-native-audio-api';
import { Svg, Rect } from 'react-native-svg';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { b } from 'graphql-ws/dist/server-CRG3y31G';



const BAR_HEIGHT = 12;

export const AudioWave = React.memo(({ barWidth, barGap, bars, position, highlightNotes }: { barWidth: number, barGap: number, bars: number[], position: number, highlightNotes: { startTime: number, endTime: number, startPosition: number, endPosition: number, note: any }[] }) => {
  // Precompute bar colors for performance
  const barColors = useMemo(() => {
    return bars.map((_, i) => {
      const barX = i * (barWidth + barGap);
      const isHighlighted = highlightNotes.some(note => barX >= note.startPosition && barX <= note.endPosition);
      if (isHighlighted) return "#facc15";
      if (barX < position) return "#60a5fa";
      return "#e5e7eb";
    });
  }, [bars, position, highlightNotes]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      height: bars?.length > 0 ? withTiming(BAR_HEIGHT, { duration: 500 }) : 0,
      top: bars?.length > 0 ? withTiming(-1 * 0, { duration: 500 }) : BAR_HEIGHT
    }
  }, [bars])

  console.log('waveform', bars?.length)
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
          {bars.map((v, i) => (
            i * (barWidth + barGap) < position && (
              <Rect
                key={`played-${i}`}
                x={i * (barWidth + barGap)}
                y={(1 - v) * BAR_HEIGHT}
                width={barWidth}
                height={v * BAR_HEIGHT}
                fill="#60a5fa"
              />
            )
          ))}
          {bars.map((v, i) => (
            highlightNotes.some(note => {
              const barX = i * (barWidth + barGap);
              return barX >= note.startPosition && barX <= note.endPosition;
            }) && (
              <Rect
                key={`highlight-${i}`}
                x={i * (barWidth + barGap)}
                y={(1 - v) * BAR_HEIGHT}
                width={barWidth}
                height={v * BAR_HEIGHT}
                fill="#facc15"
              />
            )
          ))}
        </Svg>
      )}
    </Animated.View>
  );
})