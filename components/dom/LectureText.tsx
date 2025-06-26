"use dom";

import { HighlightedSentence } from './HighlightedSentence';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';

export type Chunk = {
  key: string;
  text?: string;
  isParagraph?: boolean;
  isTitle?: boolean;
  isHighlighted?: boolean;
  isPressable?: boolean;
  startTime?: number;
  isNote?: boolean;
  title?: boolean;
}

export default function LectureText({
  chunk,
  onSentencePress
}: {
  chunk: Chunk[];
  onSentencePress: (time: number) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [scrollViewHeight, setScrollViewHeight] = useState(0);
  const [sentenceOffsetTop, setSentenceOffsetTop] = useState(null);

  useLayoutEffect(() => {
    if (ref.current) {
      let attempts = 0;
      const maxAttempts = 5;
      let timeoutId: number | null = null;

      const tryGetOffsetTop = () => {
        const { height } = ref?.current?.getBoundingClientRect() || {};
        if (height) {
          setScrollViewHeight(height);
        } else if (attempts < maxAttempts) {
          attempts++;
          timeoutId = setTimeout(tryGetOffsetTop, 500);
        }
      };

      tryGetOffsetTop();

      // Cleanup function to clear timeout
      return () => {
        if (timeoutId) {
          clearTimeout(timeoutId);
        }
      };
    }
  }, []);

  useEffect(() => {
    if (sentenceOffsetTop && scrollViewHeight) {
      ref.current?.scroll({
        top: sentenceOffsetTop - (scrollViewHeight! / 2),
        behavior: 'smooth'
      });
    }
  }, [sentenceOffsetTop, scrollViewHeight])


  return (
    <div
      ref={ref}
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
            return <HighlightedSentence
              key={chunk.key}
              onMount={(y) => {
                if (typeof y === 'number') {
                  if (sentenceOffsetTop === null) {
                    setSentenceOffsetTop(y);
                  }
                  if (typeof scrollViewHeight === 'number') {
                    ref.current?.scroll({
                      top: y - (scrollViewHeight! / 2),
                      behavior: 'smooth'
                    });
                  }
                }
              }}
              text={chunk.text as string}
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