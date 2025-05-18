import React, { useEffect, useMemo } from 'react';
import { View } from 'react-native';
import { Text } from './ui/Text';
import { cn } from '@/lib/utils';

type Alignment = [number, number, string]; // [startTime, endTime, word]

interface TextHighlighterProps {
  text: string;
  alignments: Alignment[];
  currentTime: number;
}

export const TextHighlighter: React.FC<TextHighlighterProps> = ({
  text,
  alignments,
  currentTime,
}) => {

  useEffect(() => {
    if (alignments && text) {

    }
  }, [text, alignments])

  const renderText = useMemo(() => {
    var currentOffset = 0;
    return alignments.map((alignment, index) => {
      const { word, sentence, paragraph, section, is_section_start, is_paragraph_start } = alignment as any;
      const { start_offset: wordStartOffset, start_time: wordStartTime, end_offset: wordEndOffset, end_time: wordEndTime } = word;
      const { start_offset: sentenceStartOffset, start_time: sentenceStartTime, end_offset: sentenceEndOffset, end_time: sentenceEndTime } = sentence;
      const { start_offset: paragraphStartOffset, start_time: paragraphStartTime, end_offset: paragraphEndOffset, end_time: paragraphEndTime } = paragraph;
      const { start_offset: sectionStartOffset, start_time: sectionStartTime, end_offset: sectionEndOffset, end_time: sectionEndTime } = section;
      const txt = text.slice(wordStartOffset, wordEndOffset);
      
      const isWordHighlighted = currentTime >= wordStartTime && currentTime <= wordEndTime;
      const isSentenceHighlighted = currentTime >= sentenceStartTime && currentTime <= sentenceEndTime;
      const isParagraphHighlighted = currentTime >= paragraphStartTime && currentTime <= paragraphEndTime;
      const isSectionHighlighted = currentTime >= sectionStartTime && currentTime <= sectionEndTime;
      return <Text>
        {
          index > 0 && (
            <>
              {
                is_section_start ? (
                  <Text>
                    {'\n\n'}
                  </Text>
                ) : is_paragraph_start ? (
                  <Text>
                    {'\n'}
                  </Text>
                ) : ' '
              }
            </>
          )
        }
        <Text className={cn(isWordHighlighted && 'bg-blue-500')}>{txt}</Text>
      </Text>
    })
  }, [text, alignments])


  console.log('renderText', currentTime)

  return <Text>{renderText}</Text>;
};