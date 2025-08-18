import { Note } from '@/apollo/__generated__/graphql';
import { Alignment } from '@/components/TextHighlighter';
import { useCallback, useEffect, useMemo, useState } from 'react';

export type CurrentSentence = Alignment & {
  text: string;
}

export const useSentence = ({
  alignments,
  notes,
  currentTime,
  onSentenceChange,
  content
}: {
  alignments: any[],
  notes: Note[],
  currentTime: number,
  onSentenceChange: (sentenceIndex: number, sentenceStartTime: number) => void,
  content: string
}) => {  
  const [currentSentence, setCurrentSentence] = useState<{
    index: number;
    sentence: CurrentSentence | null;
  }>({
    index: -1,
    sentence: null
  });
  const [currentNote, setCurrentNote] = useState<Note | null>(null);

  const sentences: Alignment[] = useMemo(() => {
    return alignments.filter((alignment) => {
      return alignment.is_sentence_start;
    })
  }, [alignments]);

  useEffect(() => {
    if (!sentences?.length || !content) return;

    const sentenceIndex = sentences.findIndex((item, index) => {
      const startTime = Number(Number(item.sentence.start_time).toFixed(2));
      const endTime = Number(Number(item.sentence.end_time).toFixed(2));
      const { sentence } = item;
      if (index === sentences.length - 1) {
        return currentTime >= startTime;
      }
      return currentTime >= startTime && currentTime < endTime;
    });


    setCurrentSentence((old) => {      
      if (old.index !== sentenceIndex) {
        const currentSentence = sentences[sentenceIndex];
        if (!currentSentence) {
          // console.log('[useSentence]: currentSentence is null', sentenceIndex, currentTime, sentences[sentences.length - 1].sentence.start_time, sentences[sentences.length - 1].sentence.end_time);
          return;
        };
        const currentSentenceText = content.slice(currentSentence.sentence.start_offset, currentSentence.sentence.end_offset);
        onSentenceChange(sentenceIndex, sentences[sentenceIndex].sentence.start_time);
        return {
          ...old,
          sentence: {
            ...currentSentence,
            text: currentSentenceText
          },
          index: sentenceIndex,
        }

      }

      return old;
    })   
  }, [sentences, currentTime, content]);


  useEffect(() => {
    if (!notes.length) {
      setCurrentNote(null);
      return;
    }

    if (!currentSentence.sentence) return;

    const note = notes.find((note) => {
      return currentSentence.sentence!.sentence.start_time <= note.timestamp && currentSentence.sentence!.sentence.end_time > note.timestamp;
    });

    setCurrentNote(note || null);
  }, [notes, currentSentence]);
  
  const selectNote = useCallback((id: string) => {    
    const note = notes.find((note) => note.id === id) || null;
    
    setCurrentNote(note);
  }, [notes]);

  return {
    sentences,
    currentSentenceIndex: currentSentence.index,
    currentSentence: currentSentence.sentence,
    currentNote,
    selectNote
  }
} 