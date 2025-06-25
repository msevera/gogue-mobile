"use dom";

import { HighlightedSentence } from './HighlightedSentence';
import { useRef } from 'react';

type Chunk = {
  key: string;
  text: string;
  isParagraph: boolean;
  isTitle: boolean;
  isHighlighted: boolean;
  isPressable: boolean;
  startTime: number;
  isNote: boolean;
  title: boolean;
}

export default function LectureText({
  chunk,
  onSentencePress
}: {
  chunk: Chunk[];
  onSentencePress: (time: number) => void;
}) {

  const divRef = useRef<HTMLDivElement>(null);
  return (
    <div
      ref={divRef}
      style={{
        whiteSpace: 'pre-wrap',
        height: 'calc(100vh - 180px)',
        maxHeight: '100%',        
        overflowY: 'auto',
        padding: '12px'
      }}
    >
      {
        chunk.map((chunk, index) => {
          if (chunk.isParagraph) {
            return <div key={chunk.key} style={{
              fontSize: '18px',
              fontFamily: 'sans-serif',
              marginBottom: '12px'
            }} />
          }
          if (chunk.isTitle) {
            return <div key={chunk.key} style={{
              fontSize: '24px',
              fontFamily: 'sans-serif',
              lineHeight: '1.5',
              marginTop: index > 0 ? '36px' : '0px',
              marginBottom: '12px'
            }}>
              {chunk.text}
            </div>
          }

          if (chunk.isHighlighted) {
            return <HighlightedSentence key={chunk.key} onMount={(y) => {
              const { height: scrollViewHeight } = divRef?.current?.getBoundingClientRect() || {};
              divRef.current?.scroll({
                top: y - (scrollViewHeight! / 2),
                behavior: 'smooth'
              });
            }}
              text={chunk.text}
            />
          }

          return <span
            onClick={chunk.isPressable ? () => onSentencePress(chunk.startTime) : undefined}
            key={chunk.key}
            style={{
              fontSize: '18px',
              fontFamily: 'sans-serif',
              lineHeight: '1.5',
              backgroundColor: chunk.isNote ? '#fef9c3' : 'transparent',
            }}
          >
            {chunk.text}
          </span>
        })
      }
      <div style={{
        height: '50px'
      }}></div>
    </div>

  )

}