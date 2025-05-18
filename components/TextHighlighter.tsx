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
    let currentHighlightState = {
      word: false,
      sentence: false,
      paragraph: false,
      section: false
    };
    let lastEndOffset = 0;

    alignments.forEach((alignment, index) => {
      const { word, sentence, paragraph, section, is_section_start, is_paragraph_start } = alignment as any;
      const {
        start_offset: wordStartOffset,
        start_time: wordStartTime,
        end_offset: wordEndOffset,
        end_time: wordEndTime
      } = word;

      const {
        start_time: sentenceStartTime,
        end_time: sentenceEndTime
      } = sentence || {};

      const {
        start_time: paragraphStartTime,
        end_time: paragraphEndTime
      } = paragraph || {};

      const {
        start_time: sectionStartTime,
        end_time: sectionEndTime
      } = section || {};

      // Add separator if needed
      if (index > 0) {
        if (is_section_start) {
          if (currentChunk) {
            result.push(
              <Text
                key={`chunk-${lastEndOffset}`}
                className={cn(
                  currentHighlightState.section && 'bg-purple-500',
                  currentHighlightState.paragraph && 'bg-yellow-500',
                  currentHighlightState.sentence && 'bg-green-500',
                  currentHighlightState.word && 'bg-blue-500',
                )}
              >
                {currentChunk}
              </Text>
            );
            currentChunk = '';
          }
          result.push(<Text key={`section-${wordStartOffset}`}>{'\n\n'}</Text>);
        } else if (is_paragraph_start) {
          if (currentChunk) {
            result.push(
              <Text
                key={`chunk-${lastEndOffset}`}
                className={cn(
                  currentHighlightState.section && 'bg-purple-500',
                  currentHighlightState.paragraph && 'bg-yellow-500',
                  currentHighlightState.sentence && 'bg-green-500',
                  currentHighlightState.word && 'bg-blue-500',
                )}
              >
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

      const newHighlightState = {
        word: currentTime >= wordStartTime && currentTime <= wordEndTime,
        sentence: sentence ? (currentTime >= sentenceStartTime && currentTime <= sentenceEndTime) : false,
        paragraph: paragraph ? (currentTime >= paragraphStartTime && currentTime <= paragraphEndTime) : false,
        section: section ? (currentTime >= sectionStartTime && currentTime <= sectionEndTime) : false
      };

      const wordText = text.slice(wordStartOffset, wordEndOffset);

      // If any highlight state changes, flush the current chunk
      if (currentChunk && (
        currentHighlightState.word !== newHighlightState.word ||
        currentHighlightState.sentence !== newHighlightState.sentence ||
        currentHighlightState.paragraph !== newHighlightState.paragraph ||
        currentHighlightState.section !== newHighlightState.section
      )) {
        result.push(
          <Text
            key={`chunk-${lastEndOffset}`}
            className={cn(

              currentHighlightState.section && 'bg-purple-500',
              currentHighlightState.paragraph && 'bg-yellow-500',
              currentHighlightState.sentence && 'bg-green-500',
              currentHighlightState.word && 'bg-blue-500',
            )}
          >
            {currentChunk}
          </Text>
        );
        currentChunk = wordText;
        currentHighlightState = newHighlightState;
      } else {
        currentChunk += wordText;
        currentHighlightState = newHighlightState;
      }

      lastEndOffset = wordEndOffset;
    });

    // Add the last chunk if there is one
    if (currentChunk) {
      result.push(
        <Text
          key={`chunk-${lastEndOffset}`}
          className={cn(
            currentHighlightState.section && 'bg-purple-500',
            currentHighlightState.paragraph && 'bg-yellow-500',
            currentHighlightState.sentence && 'bg-green-500',
            currentHighlightState.word && 'bg-blue-500',
          )}
        >
          {currentChunk}
        </Text>
      );
    }

    return result;
  }, [text, alignments, currentTime]);

  return <Text>{renderText}</Text>;
};