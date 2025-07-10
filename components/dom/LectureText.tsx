"use dom";

import { useEffect, useLayoutEffect, useRef, useState } from 'react';

export type Chunk = {
  key: string;
  text?: string;
  url?: string;
  isParagraph?: boolean;
  isTitle?: boolean;
  isHighlighted?: boolean;
  isPressable?: boolean;
  startTime?: number;
  isNote?: boolean;
  title?: boolean;
  isAnnotation?: boolean;
}

const font = {
  size: '18px',
  family: 'sans-serif',
  lineHeight: '1.6'
}

function renderWithBold(text: string) {
  const parts = text.split(/(\*\*.*?\*\*)/g); // Split by bold markers

  return parts.map((part, index) => {
    const match = part.match(/^\*\*(.*?)\*\*$/);
    if (match) {
      return (
        <span key={index} style={{
          fontSize: font.size,
          fontFamily: font.family,
          lineHeight: font.lineHeight,
          fontWeight: 'bold'
        }}>
          {match[1]}
        </span>
      );
    } else {
      return <span key={index}>{part}</span>;
    }
  });
}


const HighlightedSentence = ({ text, onMount }: { text: string, onMount: (y: number) => void }) => {
  const ref = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    if (ref.current && onMount) {
      let attempts = 0;
      const maxAttempts = 5;
      let timeoutId: number | null = null;

      const tryGetOffsetTop = () => {
        if (ref.current?.offsetTop) {
          onMount(ref.current.offsetTop);
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

  return <span ref={ref} style={{
    backgroundColor: '#dbeafe',
    fontSize: font.size,
    fontFamily: font.family,
    lineHeight: font.lineHeight,
    borderRadius: '4px',
  }}>
    {renderWithBold(text)}
  </span>
}

export default function LectureText({
  chunk,
  onSentencePress,
  onAnnotationPress
}: {
  chunk: Chunk[];
  onSentencePress: (time: number) => void;
  onAnnotationPress: (url: string) => void;
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
              fontSize: font.size,
              fontFamily: font.family,
              lineHeight: font.lineHeight,
              marginBottom: '12px'
            }} />
          }
          if (chunk.isTitle) {
            return <div key={chunk.key} style={{
              fontSize: '24px',
              fontFamily: font.family,
              lineHeight: font.lineHeight,
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

          if (chunk.isAnnotation) {
            return <span
              onClick={() => onAnnotationPress(chunk.url as string)}
              key={chunk.key} style={{
                fontSize: '14px',
                fontFamily: font.family,
                lineHeight: font.lineHeight,
                marginLeft: '4px',
                marginRight: '4px',
                padding: '2px 12px',
                top: '-1px',
                position: 'relative',
                backgroundColor: '#f3f4f6',
                color: '#6b7280',
                borderRadius: '4px',
              }}>
              {chunk.text}
            </span>
          }

          return (
            <span
              onClick={chunk.isPressable ? () => onSentencePress(chunk.startTime) : undefined}
              key={chunk.key}
              style={{
                fontSize: font.size,
                fontFamily: font.family,
                lineHeight: font.lineHeight,
                backgroundColor: chunk.isNote ? '#fef9c3' : 'transparent',
              }}
            >
              {chunk.text ? renderWithBold(chunk.text) : null}
            </span>
          )
        })
      }
      <div style={{
        height: '50px'
      }}></div>
    </div>
  )
}