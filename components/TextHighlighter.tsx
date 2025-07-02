import React, { useMemo } from 'react';
import { View } from 'react-native';
import { LectureSection, Note } from '@/apollo/__generated__/graphql';
import { CurrentSentence } from '@/hooks/useSentence';
import Editor, { Chunk } from './dom/LectureText';

export type SentenceType = {
  start_offset: number;
  end_offset: number;
  start_time: number;
  end_time: number;
  annotation: Annotation;
}

export type Alignment = {
  is_sentence_start: boolean;
  is_section_start: boolean;
  is_paragraph_start: boolean;
  sentence: SentenceType;
};

export type Annotation = {
  startIndex: number;
  endIndex: number;
  title: string;
  type: string;
  url: string;
}

interface TextHighlighterProps {
  text: string;
  notes: Note[];
  sentences: Alignment[];
  currentSentence: CurrentSentence;
  sections: LectureSection[];
  onSelect: (time: number) => void;
  onAnnotation: (url: string) => void;
}

export const TextHighlighter: React.FC<TextHighlighterProps> = ({
  text,
  notes,
  sentences,
  currentSentence,
  sections,
  onSelect,
  onAnnotation
}) => {
  const onSentencePress = (startTime: number) => {
    onSelect(startTime);
  }


  const renderText = useMemo(() => {
    if (!sentences?.length || !text) return null;

    let sectionsIndex = 0;
    const result: Chunk[] = [];
    sentences.forEach((entry, index) => {
      const { sentence, is_section_start, is_paragraph_start } = entry;
      const { start_offset, end_offset, start_time, annotation } = sentence;

      const chunk = text.slice(start_offset, end_offset);
      const { title } = sections[sectionsIndex] || {};




      if (is_section_start) {
        result.push({
          key: `section-title-${index}`,
          text: title,
          isTitle: true,
        })
        sectionsIndex++;
      } else if (is_paragraph_start) {
        result.push({
          key: `paragraph-${index}`,
          isParagraph: true,
        })
      }

      const isHighlighted = currentSentence?.sentence.start_time === start_time;
      const sentenceWithNote = notes.find((note) => note.timestamp === start_time)
      if (isHighlighted) {
        result.push({
          key: `sentence-${index}`,
          text: chunk,
          isPressable: true,
          isHighlighted: true,
          isNote: !!sentenceWithNote,
          startTime: start_time,
        })
      } else {
        result.push({
          key: `sentence-${index}`,
          text: chunk,
          isPressable: true,
          startTime: start_time,
          isNote: !!sentenceWithNote
        })
      }

      if (annotation) {
        result.push({
          key: `annotation-${index}`,
          text: (() => {
            try {
              const urlObj = new URL(annotation.url);
              return urlObj.hostname;
            } catch {
              return annotation.url;
            }
          })(),
          url: annotation.url,
          isAnnotation: true          
        })
      }

      result.push({
        key: `sentence-${index}-space`,
        text: ' '
      })
    })

    return result

  }, [text, sentences, notes, currentSentence, sections]);



  return <View className='flex-1'>
    <View className='flex-1'>
      <Editor
        chunk={renderText as any}
        onSentencePress={onSentencePress}
        onAnnotationPress={onAnnotation}
        // @ts-ignore
        dom={{
          matchContents: true,
          scrollEnabled: false,
        } as any} />
    </View>
  </View>;
};