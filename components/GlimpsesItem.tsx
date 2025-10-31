import { Pressable, View } from 'react-native';
import { Text } from './ui/Text';
import { Glimpse } from '@/apollo/__generated__/graphql';
import { useCallback, useEffect, useMemo } from 'react';
import Markdown from 'react-native-markdown-display';
import * as WebBrowser from 'expo-web-browser';
import { GestureDetector } from 'react-native-gesture-handler';
import { useMutation } from '@apollo/client/react';
import { SET_GLIMPSE_VIEWED } from '@/apollo/queries/glimpses';

export const GlimpsesItem = ({
  item,
  topicName,
  gesture,
  backgroundColor,
  textColor,
  onPauseStart,
  onPauseEnd
}: {
  item: Glimpse,
  topicName: string,
  gesture: any,
  backgroundColor: string,
  textColor: string,
  onPauseStart: () => void,
  onPauseEnd: () => void
}) => {
  const { content, annotations, viewed } = item;
  const [setGlimpseViewed] = useMutation(SET_GLIMPSE_VIEWED);

  useEffect(() => {
    if (!viewed) {
      setGlimpseViewed({ variables: { id: item.id } });
    }
  }, [viewed]);

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
    console.log('onLinkPress');
    onPauseStart();
    await WebBrowser.openBrowserAsync(url);
    onPauseEnd();
  }, [url]);


  return (
    <View onTouchEnd={(e) => {
      e.stopPropagation();
    }}>
      {
        topicName && (
          <Text className='text-xl font-bold' key={item.id} style={{ color: textColor }}>{topicName}</Text>
        )
      }
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
      >{text || ''}</Markdown>
      {
        domain && (
          <View className='flex-row items-center'>
            <GestureDetector gesture={gesture}>
              <Pressable className='rounded-md'                
                onPress={onLinkPress}
              >
                <Text className='text-xl underline' key={item.id} style={{ color: textColor }}>{domain}</Text>
              </Pressable>
            </GestureDetector>
          </View>
        )
      }
    </View>
  );
};