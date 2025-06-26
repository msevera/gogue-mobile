import { useLayoutEffect, useRef } from 'react';

export const HighlightedSentence = ({ text, onMount }: { text: string, onMount: (y: number) => void }) => {
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
    fontSize: '18px',
    fontFamily: 'sans-serif',
    lineHeight: '1.5'
  }}>
    {text}
  </span>
}