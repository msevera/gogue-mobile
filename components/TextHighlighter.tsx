import React, { useMemo } from 'react';
import { Text } from './ui/Text';
import { cn } from '@/lib/utils';

type Alignment = [number, number, string]; // [startTime, endTime, word]

interface TextHighlighterProps {
  text: string;
  alignments: Alignment[];
  currentTime: number;
}

interface HighlightState {
  word: boolean;
  sentence: boolean;
  paragraph: boolean;
  section: boolean;
}

interface TimingInfo {
  wordStartTime: number;
  wordEndTime: number;
  sentenceStartTime?: number;
  sentenceEndTime?: number;
  paragraphStartTime?: number;
  paragraphEndTime?: number;
  sectionStartTime?: number;
  sectionEndTime?: number;
}

export const TextHighlighter: React.FC<TextHighlighterProps> = ({
  text,
  alignments,
  currentTime,
}) => {
  const getHighlightClasses = (state: HighlightState): string => {
    return cn(
      // state.section && 'bg-purple-500',
      // state.paragraph && 'bg-yellow-500',
      state.sentence && 'bg-green-500',
      state.word && 'bg-blue-500'
    );
  };

  const getTimingInfo = (alignment: any): TimingInfo => {
    const { word, sentence, paragraph, section } = alignment;
    const { start_time: wordStartTime, end_time: wordEndTime } = word;

    return {
      wordStartTime,
      wordEndTime,
      sentenceStartTime: sentence?.start_time,
      sentenceEndTime: sentence?.end_time,
      paragraphStartTime: paragraph?.start_time,
      paragraphEndTime: paragraph?.end_time,
      sectionStartTime: section?.start_time,
      sectionEndTime: section?.end_time
    };
  };

  const getHighlightState = (timing: TimingInfo): HighlightState => {
    return {
      word: currentTime >= timing.wordStartTime && currentTime <= timing.wordEndTime,
      sentence: timing.sentenceStartTime ? (currentTime >= timing.sentenceStartTime && currentTime <= timing.sentenceEndTime!) : false,
      paragraph: timing.paragraphStartTime ? (currentTime >= timing.paragraphStartTime && currentTime <= timing.paragraphEndTime!) : false,
      section: timing.sectionStartTime ? (currentTime >= timing.sectionStartTime && currentTime <= timing.sectionEndTime!) : false
    };
  };

  const renderChunk = (chunk: string, state: HighlightState, key: string, offsetElement?: string): JSX.Element => {
    return (
      <Text
        key={key}
        className={getHighlightClasses(state)}
      >
        {chunk}
        {/* {offsetElement} */}
      </Text>
    );
  };

  const renderText = useMemo(() => {
    if (!alignments?.length || !text) return null;

    let result: JSX.Element[] = [];
    let currentChunk: string = '';
    let currentHighlightState: HighlightState = {
      word: false,
      sentence: false,
      paragraph: false,
      section: false
    };
    let lastEndOffset = 0;

    alignments.forEach((alignment, index) => {
      const { word, is_section_start, is_paragraph_start } = alignment as any;
      const { start_offset: wordStartOffset, end_offset: wordEndOffset } = word;

      // Add separator if needed
      if (index > 0) {
        if (is_section_start) {
          if (currentChunk) {
            result.push(renderChunk(currentChunk, currentHighlightState, `chunk-${lastEndOffset}`));
            currentChunk = '';
          }
          result.push(<Text key={`section-${wordStartOffset}`}>{'\n\n'}</Text>);
        } else if (is_paragraph_start) {
          if (currentChunk) {
            result.push(renderChunk(currentChunk, currentHighlightState, `chunk-${lastEndOffset}`));
            currentChunk = '';
          }
          result.push(<Text key={`para-${wordStartOffset}`}>{'\n'}</Text>);
        } else if (currentChunk) {
          currentChunk += ' ';
        }
      }

      const timing = getTimingInfo(alignment);
      const newHighlightState = getHighlightState(timing);
      const wordText = text.slice(wordStartOffset, wordEndOffset);

      // If any highlight state changes, flush the current chunk
      if (currentChunk && (
        currentHighlightState.word !== newHighlightState.word ||
        currentHighlightState.sentence !== newHighlightState.sentence ||
        currentHighlightState.paragraph !== newHighlightState.paragraph ||
        currentHighlightState.section !== newHighlightState.section
      )) {
        result.push(renderChunk(currentChunk, currentHighlightState, `chunk-${lastEndOffset}`));
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
      result.push(renderChunk(currentChunk, currentHighlightState, `chunk-${lastEndOffset}`));
    }

    return result;
  }, [text, alignments, currentTime]);

  return <Text>{renderText}</Text>;
};