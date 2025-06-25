import { useLayoutEffect, useRef } from 'react';

export const HighlightedSentence = ({ text, onMount }: { text: string, onMount: (y: number) => void }) => {
  const ref = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    if (ref.current && onMount) {      
      onMount(ref.current?.offsetTop);
    }
  }, []);

  return <span ref={ref} style={{
    backgroundColor: '#dbeafe',
    fontSize: '18px',
    fontFamily: 'sans-serif',
    lineHeight: '1.5'
  }}>
    {text}
  </span>
}