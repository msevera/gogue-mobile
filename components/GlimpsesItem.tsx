import { Pressable, View, Dimensions } from 'react-native';
import { Text } from './ui/Text';
import { Button } from './ui/Button';
import { Link, router } from 'expo-router';
import { Glimpse } from '@/apollo/__generated__/graphql';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useCallback, useMemo } from 'react';
import { cn } from '@/lib/utils';
import Markdown from 'react-native-markdown-display';
import * as WebBrowser from 'expo-web-browser';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { useSharedValue, runOnJS } from 'react-native-reanimated';

export const GlimpsesItem = ({ 
  item, 
  backgroundColor, 
  textColor, 
  onPauseStart, 
  onPauseEnd,
  onDecreaseTap,
  onIncreaseTap 
}: { 
  item: Glimpse, 
  backgroundColor: string, 
  textColor: string, 
  onPauseStart: () => void, 
  onPauseEnd: () => void,
  onDecreaseTap: () => void,
  onIncreaseTap: () => void
}) => {
  const inset = useSafeAreaInsets();
  const { content, annotations } = item;
  
  const screenWidth = Dimensions.get('window').width;
  const pressStart = useSharedValue(0);
  const isHolding = useSharedValue(false);
  const holdThreshold = 150; // milliseconds to distinguish tap from hold

  const text = useMemo(() => {
    if (!annotations || annotations.length === 0) {
      return content;
    }

    // Sort annotations by startIndex in descending order to avoid index shifting issues
    const sortedAnnotations = [...annotations].sort((a, b) => b.startIndex - a.startIndex);

    let text = content;

    // Remove each annotation's text portion from end to beginning
    for (const annotation of sortedAnnotations) {
      const startIndex = annotation.startIndex;
      const endIndex = annotation.endIndex;
      text = text.slice(0, startIndex) + text.slice(endIndex);
    }

    return text;
  }, [content, annotations]);

  const { domain, url } = useMemo(() => {
    const [firstAnnotation] = annotations || [];
    if (!firstAnnotation) {
      return { domain: '', url: '' };
    }
    const url = new URL(firstAnnotation.url);
    return { domain: url.hostname.replace('www.', ''), url: url.href };
  }, [annotations]);

  const onLinkPress = useCallback(async () => {
    onPauseStart();
    await WebBrowser.openBrowserAsync(url);
    onPauseEnd();
  }, [url]);

  const tapGesture = Gesture.Tap()
    .onStart((event) => {
      pressStart.value = Date.now();
    })
    .onEnd((event) => {
      const pressDuration = Date.now() - pressStart.value;
      
      // If it was a quick tap (not a hold), handle left/right tap
      if (pressDuration < holdThreshold && !isHolding.value) {
        // Use event.x which is relative to the component's coordinate system
        if (event.x < screenWidth / 2) {
          runOnJS(onDecreaseTap)();
        } else {
          runOnJS(onIncreaseTap)();
        }
      }
    });

  const longPressGesture = Gesture.LongPress()
    .minDuration(holdThreshold)
    .onStart(() => {
      isHolding.value = true;
      runOnJS(onPauseStart)();
    })
    .onEnd(() => {
      isHolding.value = false;
      runOnJS(onPauseEnd)();
    });

  const composedGesture = Gesture.Race(longPressGesture, tapGesture);

  return (
    <GestureDetector gesture={composedGesture}>
      <Animated.View
        className={cn('absolute top-0 left-0 right-0 bottom-0 w-100 h-100 px-4 py-5 item-center justify-center')}
        style={{
          backgroundColor: backgroundColor,
          paddingTop: inset.top,
          paddingBottom: inset.bottom,
        }}>
        <View onTouchEnd={(e) => {
          e.stopPropagation();
        }}>
          <Markdown
            style={{
              strong: {
                backgroundColor: textColor,
                color: backgroundColor,
                fontWeight: 'bold',
              },
              body: {
                color: textColor,
                fontSize: 20,
                lineHeight: 28,
              },

            }}
          >{text}</Markdown>
          {
            domain && (
              <View className='flex-row items-center'>
                <Pressable className='rounded-md z-40'
                  // style={{
                  //   backgroundColor: textColor,
                  // }}
                  onPress={onLinkPress}>
                  <Text className='text-xl underline' key={item.id} style={{ color: textColor }}>{domain}</Text>
                </Pressable>
              </View>
            )
          }
        </View>
      </Animated.View>
    </GestureDetector>
  );
};