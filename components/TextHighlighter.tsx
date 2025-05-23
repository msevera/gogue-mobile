import React, { useMemo, useRef } from 'react';
import { Text } from './ui/Text';
import { cn } from '@/lib/utils';

type Alignment = [number, number, string]; // [startTime, endTime, word]

interface TextHighlighterProps {
  text: string;
  alignments: Alignment[];
  currentTime: number;
  sections: string[];
  onSelect: (time: number) => void;
}

interface HighlightState {
  word: boolean;
  sentence: boolean;
  paragraph: boolean;
  section: boolean;
  isSentenceEnd: boolean;
  isSentenceStart: boolean;
  startTime: number;
  isParagraphStart: boolean;
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
  isSentenceStart?: boolean;
}

interface SentenceProps {
  text: string;
  state: HighlightState;
  timing?: TimingInfo;
  onSelect: (time: number) => void;
}

const Sentence: React.FC<SentenceProps> = ({ text, state, timing, onSelect }) => {
  const isClickable = timing?.sentenceStartTime !== undefined;
  
  const getHighlightClasses = (state: HighlightState): string => {
    return cn(
      state.sentence && 'bg-blue-100',
      'text-lg leading-8'
    );
  };

  return (
    <Text className="text-lg leading-8" suppressHighlighting>
      <Text
        className={cn(
          getHighlightClasses(state),
          isClickable && 'cursor-pointer hover:bg-blue-200'
        )}
        onPress={() => {
          if (isClickable && timing?.sentenceStartTime !== undefined) {
            onSelect(timing.sentenceStartTime);
          }
        }}
        suppressHighlighting
      >
        {state.isParagraphStart ? '    ' : ''}{text.trim()}
      </Text>
      {' '}
    </Text>
  );
};

export const TextHighlighter: React.FC<TextHighlighterProps> = ({
  text,
  alignments,
  currentTime,
  sections,
  onSelect
}) => {
  currentTime += 0.5;

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
      isSentenceEnd: alignment?.is_sentence_end,
      isSentenceStart: alignment?.is_sentence_start,
      isParagraphStart: alignment?.is_paragraph_start
    };
  };

  const getHighlightState = (timing: TimingInfo, isParagraphStart: boolean): HighlightState => {    
    return {
      word: false,
      sentence: currentTime >= timing.sentenceStartTime! && currentTime < timing.sentenceEndTime!,
      paragraph: false,
      section: false,
      isSentenceEnd: timing.isSentenceEnd!,
      isSentenceStart: timing.isSentenceStart!,
      startTime: timing.sentenceStartTime!,
      isParagraphStart: timing.isParagraphStart
    };
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
      isSentenceEnd: false,
      isSentenceStart: false,
      startTime: 0,
      isParagraphStart: false
    };
    let lastEndOffset = 0;
    let currentTiming: TimingInfo | undefined;
    let isParagraphStart = true;

    alignments.forEach((alignment, index) => {
      const { word, is_section_start, is_paragraph_start, is_sentence_end } = alignment as any;
      const { start_offset: wordStartOffset, end_offset: wordEndOffset } = word;
      const timing = getTimingInfo(alignment);
      const newHighlightState = getHighlightState(timing, isParagraphStart);
      const wordText = text.slice(wordStartOffset, wordEndOffset);

      // Handle section start
      if (is_section_start && sectionsIndex < sections.length) {
        if (currentChunk) {
          result.push(
            <Sentence
              key={`chunk-${lastEndOffset}`}
              text={currentChunk}
              state={currentHighlightState}
              timing={currentTiming}
              onSelect={onSelect}
            />
          );
          currentChunk = '';
        }

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
        isParagraphStart = true;
      }

      if (!is_section_start && is_paragraph_start) {
        if (currentChunk) {
          result.push(
            <Sentence
              key={`chunk-${lastEndOffset}`}
              text={currentChunk}
              state={currentHighlightState}
              timing={currentTiming}
              onSelect={onSelect}
            />
          );
          currentChunk = '';
        }

        result.push(
          <Text key={`paragraph-${lastEndOffset}`}>
            {`\n`}
          </Text>
        );
        isParagraphStart = true;
      }

      if (index > 0) {
        if (currentChunk) {
          currentChunk += ' ';
        }
      }

      // If we reach the end of a sentence or if the highlight state changes, render the current chunk
      if (is_sentence_end || (currentChunk && (
        currentHighlightState.word !== newHighlightState.word ||
        currentHighlightState.sentence !== newHighlightState.sentence ||
        currentHighlightState.paragraph !== newHighlightState.paragraph ||
        currentHighlightState.section !== newHighlightState.section
      ))) {
        if (currentChunk) {
          result.push(
            <Sentence
              key={`chunk-${lastEndOffset}`}
              text={currentChunk}
              state={currentHighlightState}
              timing={currentTiming}
              onSelect={onSelect}
            />
          );
          currentChunk = '';
        }
      }

      currentChunk += wordText;
      currentHighlightState = newHighlightState;
      currentTiming = timing;
      isParagraphStart = false;

      lastEndOffset = wordEndOffset;
    });

    if (currentChunk) {
      result.push(
        <Sentence
          key={`chunk-${lastEndOffset}`}
          text={currentChunk}
          state={currentHighlightState}
          timing={currentTiming}
          onSelect={onSelect}
        />
      );
    }

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
  }, [text, alignments, currentTime, onSelect]);

  return <Text>{renderText}</Text>;
};