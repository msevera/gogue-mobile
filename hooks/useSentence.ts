import { Note } from '@/apollo/__generated__/graphql';
import { Alignment } from '@/components/TextHighlighter';
import { useEffect, useMemo, useState } from 'react';

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
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState<number>(-1);
  const [currentSentence, setCurrentSentence] = useState<CurrentSentence | null>(null);
  const [currentNote, setCurrentNote] = useState<Note | null>(null);

  const sentences: Alignment[] = useMemo(() => {
    return alignments.filter((alignment) => {
      return alignment.is_sentence_start;
    })
  }, [alignments]);

  useEffect(() => {
    if (!sentences?.length || !content) return;

    const sentenceIndex = sentences.findIndex((item) => {
      const { sentence } = item;
      return currentTime >= sentence.start_time && currentTime < sentence.end_time;
    });

    if (sentenceIndex !== currentSentenceIndex) {
      const currentSentence = sentences[sentenceIndex];
      const currentSentenceText = content.slice(currentSentence.sentence.start_offset, currentSentence.sentence.end_offset);
      setCurrentSentence({
        ...currentSentence,
        text: currentSentenceText
      });
      setCurrentSentenceIndex(sentenceIndex);
      onSentenceChange(sentenceIndex, sentences[sentenceIndex].sentence.start_time);
    }
  }, [sentences, currentTime, currentSentenceIndex, content]);


  useEffect(() => {
    if (!notes?.length || !currentSentence) return;
    
    const note = notes.find((note) => {      
      return currentSentence.sentence.start_time <= note.timestamp && currentSentence.sentence.end_time > note.timestamp;
    });
    
    setCurrentNote(note || null);
   
  }, [notes, currentTime, currentSentence]);

  return {
    sentences,
    currentSentenceIndex,
    currentSentence,
    currentNote
  }
} 