import React, { useMemo } from 'react';
import { Text } from './ui/Text';
import { cn } from '@/lib/utils';
import { View } from 'react-native';
type Alignment = [number, number, string]; // [startTime, endTime, word]

interface TextHighlighterProps {
  text: string;
  alignments: Alignment[];
  currentTime: number;
  sections: string[];
}

interface HighlightState {
  word: boolean;
  sentence: boolean;
  paragraph: boolean;
  section: boolean;
  isSentenceEnd: boolean;
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
  isSentenceEnd?: boolean;
}

export const TextHighlighter: React.FC<TextHighlighterProps> = ({
  text,
  alignments,
  currentTime,
  sections
}) => {

  currentTime += 0.5;

  const getHighlightClasses = (state: HighlightState): string => {
    return cn(
      // state.section && 'bg-purple-500',
      // state.paragraph && 'bg-yellow-500',
      state.sentence && 'bg-blue-100',
      // state.word && 'bg-blue-50',
      'text-lg leading-8'
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
      sectionEndTime: section?.end_time,
      isSentenceEnd: alignment?.is_sentence_end
    };
  };

  const getHighlightState = (timing: TimingInfo): HighlightState => {
    return {
      word: currentTime >= timing.wordStartTime && currentTime <= timing.wordEndTime,
      sentence: currentTime >= timing.sentenceStartTime! && currentTime < timing.sentenceEndTime!,
      paragraph: currentTime >= timing.paragraphStartTime! && currentTime < timing.paragraphEndTime!,
      section: currentTime >= timing.sectionStartTime! && currentTime < timing.sectionEndTime!,
      isSentenceEnd: timing.isSentenceEnd!
    };
  };

  const renderChunk = (chunk: string, state: HighlightState, key: string, alignment?: any): JSX.Element => {
    return (
      <Text key={key}>
        <Text

          className={getHighlightClasses(state)}
        >
          {state.sentence && state.isSentenceEnd ? chunk.trim() : chunk}
        </Text>
        {
          state.sentence && state.isSentenceEnd && (
            <Text className="text-lg leading-8">{' '}</Text>
          )
        }
      </Text>
    );
  };

  const renderText = useMemo(() => {
    if (!alignments?.length || !text) return null;

    let sectionsIndex = 0;
    let result: JSX.Element[] = [];
    let currentChunk: string = '';
    let currentHighlightState: HighlightState = {
      word: false,
      sentence: false,
      paragraph: false,
      section: false,
      isSentenceEnd: false
    };
    let lastEndOffset = 0;

    alignments.forEach((alignment, index) => {
      const { word, is_section_start, is_paragraph_start, is_sentence_end } = alignment as any;
      const { start_offset: wordStartOffset, end_offset: wordEndOffset } = word;

      // Handle section start
      if (is_section_start && sectionsIndex < sections.length) {
        // Flush any existing chunk before adding section title
        if (currentChunk) {
          result.push(renderChunk(currentChunk, currentHighlightState, `chunk-${lastEndOffset}`));
          currentChunk = '';
        }

        // Add section title with proper spacing
        const sectionTitle = sections[sectionsIndex];
        result.push(
          <Text
            className="text-xl font-semibold leading-8 mt-4 mb-2"
            key={`section-${sectionsIndex}`}
          >
            {`${index === 0 ? '' : '\n\n'}${sectionTitle}\n`}
          </Text>
        );
        sectionsIndex++;
      }

      if (!is_section_start && is_paragraph_start) { 
        // Flush any existing chunk before adding section title
        if (currentChunk) {
          result.push(renderChunk(currentChunk, currentHighlightState, `chunk-${lastEndOffset}`));
          currentChunk = '';
        }
        
        result.push(
          <Text
            className="text-xl font-semibold leading-8 mt-4 mb-2"
            key={`paragraph-${lastEndOffset}`}
          >
            {`\n`}
          </Text>
        );
      }

      // Add separator if needed
      if (index > 0) {
        if (currentChunk) {
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
        result.push(renderChunk(currentChunk, currentHighlightState, `chunk-${lastEndOffset}`, alignment));
        currentChunk = wordText;
        currentHighlightState = newHighlightState;
      } else {
        currentChunk += wordText;
        currentHighlightState = newHighlightState;
      }

      lastEndOffset = wordEndOffset;
    });

    // Flush the final chunk if it exists
    if (currentChunk) {
      result.push(renderChunk(currentChunk, currentHighlightState, `chunk-${lastEndOffset}`));
    }

    // Add any remaining text after the last alignment
    if (lastEndOffset < text.length) {
      const remainingText = text.slice(lastEndOffset);
      if (remainingText.trim()) {
        result.push(
          <Text key={`remaining-${lastEndOffset}`} className="text-lg leading-8">
            {remainingText}
          </Text>
        );
      }
    }

    return result;
  }, [text, alignments, currentTime]);

  return <Text>{renderText}</Text>;
};