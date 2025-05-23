import React, { useMemo } from 'react';
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
  isSectionStart: boolean;
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
  isParagraphStart?: boolean;
  isSectionStart?: boolean;
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
      {state.isParagraphStart && !state.isSectionStart && (
        <Text className="text-lg leading-8">{'    '}</Text>
      )}
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
        {text.trim()}
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
      isParagraphStart: alignment?.is_paragraph_start,
      isSectionStart: alignment?.is_section_start
    };
  };

  const getHighlightState = (timing: TimingInfo, isFirstSentenceInParagraph: boolean, isFirstSentenceInSection: boolean): HighlightState => {
    return {
      word: false,
      sentence: currentTime >= timing.sentenceStartTime! && currentTime < timing.sentenceEndTime!,
      paragraph: false,
      section: false,
      isSentenceEnd: timing.isSentenceEnd!,
      isSentenceStart: timing.isSentenceStart!,
      startTime: timing.sentenceStartTime!,
      isParagraphStart: isFirstSentenceInParagraph,
      isSectionStart: isFirstSentenceInSection
    };
  };

  const renderText = useMemo(() => {
    if (!alignments?.length || !text) return null;

    let sectionsIndex = 0;
    let result: JSX.Element[] = [];
    let currentSentence: string = '';
    let currentTiming: TimingInfo | undefined;
    let isFirstSentenceInParagraph = true;
    let isFirstSentenceInSection = true;

    alignments.forEach((alignment, index) => {
      const { word, is_section_start, is_paragraph_start, is_sentence_end } = alignment as any;
      const { start_offset: wordStartOffset, end_offset: wordEndOffset } = word;
      const timing = getTimingInfo(alignment);
      const wordText = text.slice(wordStartOffset, wordEndOffset);

      // Handle section start
      if (is_section_start && sectionsIndex < sections.length) {
        if (currentSentence) {
          result.push(
            <Sentence
              key={`sentence-${index}`}
              text={currentSentence}
              state={getHighlightState(currentTiming!, isFirstSentenceInParagraph, isFirstSentenceInSection)}
              timing={currentTiming}
              onSelect={onSelect}
            />
          );
          currentSentence = '';
        }

        const sectionTitle = sections[sectionsIndex];
        result.push(
          <Text
            className="text-xl font-semibold leading-8 mt-4"
            key={`section-${sectionsIndex}`}
          >
            {`${index === 0 ? '' : '\n\n'}${sectionTitle}\n`}
          </Text>
        );
        sectionsIndex++;
        isFirstSentenceInParagraph = true;
        isFirstSentenceInSection = true;
      }

      // Handle paragraph start
      if (!is_section_start && is_paragraph_start) {
        if (currentSentence) {
          result.push(
            <Sentence
              key={`sentence-${index}`}
              text={currentSentence}
              state={getHighlightState(currentTiming!, isFirstSentenceInParagraph, isFirstSentenceInSection)}
              timing={currentTiming}
              onSelect={onSelect}
            />
          );
          currentSentence = '';
        }

        result.push(
          <Text key={`paragraph-${index}`}>
            {`\n`}
          </Text>
        );
        isFirstSentenceInParagraph = true;
        isFirstSentenceInSection = false;
      }

      // Add space between words
      if (currentSentence) {
        currentSentence += ' ';
      }

      currentSentence += wordText;
      currentTiming = timing;

      // If we reach the end of a sentence, render it
      if (is_sentence_end) {
        result.push(
          <Sentence
            key={`sentence-${index}`}
            text={currentSentence}
            state={getHighlightState(currentTiming, isFirstSentenceInParagraph, isFirstSentenceInSection)}
            timing={currentTiming}
            onSelect={onSelect}
          />
        );
        currentSentence = '';
        isFirstSentenceInParagraph = false;
        isFirstSentenceInSection = false;
      }
    });

    // Render any remaining sentence
    if (currentSentence) {
      result.push(
        <Sentence
          key="sentence-final"
          text={currentSentence}
          state={getHighlightState(currentTiming!, isFirstSentenceInParagraph, isFirstSentenceInSection)}
          timing={currentTiming}
          onSelect={onSelect}
        />
      );
    }

    return result;
  }, [text, alignments, currentTime, onSelect]);

  return <Text>{renderText}</Text>;
};