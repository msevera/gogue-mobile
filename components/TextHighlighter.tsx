import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Text } from './ui/Text';
import { cn } from '@/lib/utils';
import { LayoutChangeEvent, ScrollView, View, TextInput, Pressable } from 'react-native';
import { Note } from '@/apollo/__generated__/graphql';
import { CurrentSentence } from '@/hooks/useSentence';
import Editor from './dom/LectureText';

export type SentenceType = {
  start_offset: number;
  end_offset: number;
  start_time: number;
  end_time: number;
}

export type Alignment = {
  is_sentence_start: boolean;
  is_section_start: boolean;
  sentence: SentenceType;
};

interface TextHighlighterProps {
  text: string;
  notes: Note[];
  sentences: Alignment[];
  currentSentence: CurrentSentence;
  sections: string[];
  onSelect: (time: number) => void;
  scrollViewRef: React.RefObject<ScrollView>;
  scrollViewHeight: number;
}

export const TextHighlighter: React.FC<TextHighlighterProps> = ({
  text,
  notes,
  sentences,
  currentSentence,
  sections,
  onSelect,
  scrollViewRef,
  scrollViewHeight
}) => {
  const measureViewRef = useRef<View>(null);
  const onSentencePress = (startTime: number) => {
    onSelect(startTime);
  }

  const onLayoutHandler = (event: LayoutChangeEvent) => {
    console.log('onLayoutHandler')
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
    const resultChunks = [];
    sentences.forEach((entry, index) => {
      const { sentence, is_section_start, is_paragraph_start } = entry;
      const { start_offset, end_offset, start_time, end_time } = sentence;

      const chunk = text.slice(start_offset, end_offset);

      if (is_section_start) {
        const sectionTitle = sections[sectionsIndex];
        result.push(<Text key={`section-title-${index}`} className="text-xl font-semibold leading-8">
          {`${index === 0 ? '' : '\n\n'}${sectionTitle}\n`}
        </Text>)
        resultChunks.push({
          key: `section-title-${index}`,
          text: sectionTitle,
          isTitle: true,
        })
        sectionsIndex++;
      } else if (is_paragraph_start) {
        result.push(<Text key={`paragraph-${index}`}>{`\n`}</Text>)
        resultChunks.push({
          key: `paragraph-${index}`,          
          isParagraph: true,
        })
      }

      const isHighlighted = currentSentence?.sentence.start_time === start_time;
      const sentenceWithNote = notes.find((note) => note.timestamp === start_time)
      if (isHighlighted) {       
        result.push(<Text
          suppressHighlighting
          onPress={() => onSentencePress(start_time)}
          key={`sentence-${index}`}
          className={cn(
            sentenceWithNote && 'bg-yellow-100',
            "text-lg leading-8 bg-blue-100 flex-row",
          )}
        >         
          {chunk}
        </Text>)

        resultChunks.push({
          key: `sentence-${index}`,
          text: chunk,
          isPressable: true,
          isHighlighted: true,
          isNote: sentenceWithNote,
          startTime: start_time,
        })
      } else {
        result.push(<Text
          suppressHighlighting
          onPress={() => onSentencePress(start_time)}
          key={`sentence-${index}`}
          className={cn(
            "text-lg leading-8",
            sentenceWithNote && 'bg-yellow-100'
          )}
        >
          {chunk}
        </Text>)

        resultChunks.push({
          key: `sentence-${index}`,
          text: chunk,
          isPressable: true,
          startTime: start_time,
          isNote: sentenceWithNote
        })
      }

      result.push(<Text key={`sentence-${index}-space`}> </Text>)
      resultChunks.push({
        key: `sentence-${index}-space`,
        text: ' '
      })
    })

    return resultChunks

  }, [text, sentences, notes, currentSentence, sections]);

 

  return <View className='flex-1'>
    <View className='flex-1'>
      <Editor
        chunk={renderText as any}
        onSentencePress={onSentencePress}              
        dom={{
          matchContents: true,
          scrollEnabled: false,       
        } as any} />
    </View>
    {/* <Text>
      {renderText}
    </Text> */}
  </View>;
};