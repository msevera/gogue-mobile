import { Pressable, View } from 'react-native';
import { Text } from './ui/Text';
import { Button } from './ui/Button';
import { Link, router } from 'expo-router';
import { Glimpse } from '@/apollo/__generated__/graphql';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useCallback, useMemo } from 'react';
import { cn } from '@/lib/utils';
import Markdown from 'react-native-markdown-display';
import * as WebBrowser from 'expo-web-browser';

export const GlimpsesItem = ({ item, backgroundColor, textColor, onPauseStart, onPauseEnd }: { item: Glimpse, backgroundColor: string, textColor: string, onPauseStart: () => void, onPauseEnd: () => void }) => {
  const inset = useSafeAreaInsets();
  const { content, annotations } = item;

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

  return (
    <Pressable
      onTouchStart={onPauseStart}
      onTouchEnd={onPauseEnd}
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
    </Pressable>
  );
};