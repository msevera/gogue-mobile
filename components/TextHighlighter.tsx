import React, { useMemo } from 'react';
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
  const renderText = useMemo(() => {
    if (!alignments?.length || !text) return null;

    let result: JSX.Element[] = [];
    let currentChunk: string = '';
    let currentChunkHighlighted = false;
    let lastEndOffset = 0;

    alignments.forEach((alignment, index) => {
      const { word, is_section_start, is_paragraph_start } = alignment as any;
      const { start_offset: wordStartOffset, start_time: wordStartTime, end_offset: wordEndOffset, end_time: wordEndTime } = word;
      
      // Add separator if needed
      if (index > 0) {
        if (is_section_start) {
          if (currentChunk) {
            result.push(
              <Text key={`chunk-${lastEndOffset}`} className={cn(currentChunkHighlighted && 'bg-blue-500')}>
                {currentChunk}
              </Text>
            );
            currentChunk = '';
          }
          result.push(<Text key={`section-${wordStartOffset}`}>{'\n\n'}</Text>);
        } else if (is_paragraph_start) {
          if (currentChunk) {
            result.push(
              <Text key={`chunk-${lastEndOffset}`} className={cn(currentChunkHighlighted && 'bg-blue-500')}>
                {currentChunk}
              </Text>
            );
            currentChunk = '';
          }
          result.push(<Text key={`para-${wordStartOffset}`}>{'\n'}</Text>);
        } else if (currentChunk) {
          currentChunk += ' ';
        }
      }

      const isWordHighlighted = currentTime >= wordStartTime && currentTime <= wordEndTime;
      const wordText = text.slice(wordStartOffset, wordEndOffset);

      // If the highlight state changes, flush the current chunk
      if (currentChunk && currentChunkHighlighted !== isWordHighlighted) {
        result.push(
          <Text key={`chunk-${lastEndOffset}`} className={cn(currentChunkHighlighted && 'bg-blue-500')}>
            {currentChunk}
          </Text>
        );
        currentChunk = wordText;
        currentChunkHighlighted = isWordHighlighted;
      } else {
        currentChunk += wordText;
        currentChunkHighlighted = isWordHighlighted;
      }

      lastEndOffset = wordEndOffset;
    });

    // Add the last chunk if there is one
    if (currentChunk) {
      result.push(
        <Text key={`chunk-${lastEndOffset}`} className={cn(currentChunkHighlighted && 'bg-blue-500')}>
          {currentChunk}
        </Text>
      );
    }

    return result;
  }, [text, alignments, currentTime]);

  return <Text>{renderText}</Text>;
};