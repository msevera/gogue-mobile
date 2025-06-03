import React, { useMemo, useRef, useState } from 'react';
import { Text } from './ui/Text';
import { cn } from '@/lib/utils';
import { Dimensions, LayoutChangeEvent, ScrollView, View } from 'react-native';

const { height: screenHeight } = Dimensions.get("window");
type SentenceType = {
  start_offset: number;
  end_offset: number;
  start_time: number;
  end_time: number;
}

type Alignment = {
  is_sentence_start: boolean;
  is_section_start: boolean;
  sentence: SentenceType;
};

interface TextHighlighterProps {
  text: string;
  alignments: Alignment[];
  currentTime: number;
  sections: string[];
  onSelect: (time: number) => void;
  scrollViewRef: React.RefObject<ScrollView>;
  scrollViewHeight: number;
}

export const TextHighlighter: React.FC<TextHighlighterProps> = ({
  text,
  alignments,
  currentTime,
  sections,
  onSelect,
  scrollViewRef,
  scrollViewHeight
}) => {
  currentTime += 0.5;

  const sentences: Alignment[] = useMemo(() => {
    return alignments.filter((alignment) => {
      return alignment.is_sentence_start;
    })
  }, [alignments])

  const measureViewRef = useRef<View>(null);


  const onSentencePress = (startTime: number) => {
    onSelect(startTime);
  }

  const onLayoutHandler = (event: LayoutChangeEvent) => {
    measureViewRef.current?.measure((x, y) => {
      if (!scrollViewHeight) {
        return;
      }
      
      scrollViewRef.current?.scrollTo({ y: y - (scrollViewHeight / 2), animated: true });     
    });
  }

  const renderText = useMemo(() => {
    if (!sentences?.length || !text) return null;

    let sectionsIndex = 0;

    const result: JSX.Element[] = [];
    sentences.forEach((entry, index) => {
      const { sentence, is_section_start, is_paragraph_start } = entry;
      const { start_offset, end_offset, start_time, end_time } = sentence;

      const chunk = text.slice(start_offset, end_offset);

      if (is_section_start) {
        const sectionTitle = sections[sectionsIndex];
        result.push(<Text key={`section-title-${index}`} className="text-xl font-semibold leading-8">
          {`${index === 0 ? '' : '\n\n'}${sectionTitle}\n`}
        </Text>)
        sectionsIndex++;
      } else if (is_paragraph_start) {
        result.push(<Text key={`paragraph-${index}`}>{`\n`}</Text>)
      }



      const isHighlighted = currentTime >= start_time && currentTime < end_time;
      if (isHighlighted) {
        const firstChar = chunk.slice(0, 1);
        const lastPart = chunk.slice(1);
        result.push(<Text
          suppressHighlighting
          onPress={() => onSentencePress(start_time)}
          key={`sentence-${index}`}
          className={cn("text-lg leading-8 bg-blue-100 flex-row")}>
          {firstChar}
          <View ref={measureViewRef} onLayout={onLayoutHandler} />
          {lastPart}
        </Text>)
      } else {
        result.push(<Text suppressHighlighting onPress={() => onSentencePress(start_time)} key={`sentence-${index}`} className={cn("text-lg leading-8")}>
          {chunk}
        </Text>)
      }

      result.push(<Text key={`sentence-${index}-space`}> </Text>)
    })

    return result

  }, [text, sentences, currentTime, sections]);

  return <View className='pt-[2]'>
    <Text>
      {renderText}
    </Text>
  </View>;
};