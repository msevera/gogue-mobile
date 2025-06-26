import { useRef, useCallback } from 'react';

/**
 * Returns a debounced version of the provided callback.
 *
 * @param {Function} callback - The function to debounce.
 * @param {number} delay - Delay in milliseconds (default: 300).
 * @returns {Function} - Debounced function.
 */
function useDebounce(callback: (...args: any[]) => void, delay = 300) {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const debouncedFunction = useCallback((...args: any[]) => {
    // Clear any existing timer to reset the delay
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    // Set a new timer to invoke the callback after the delay
    timeoutRef.current = setTimeout(() => {
      callback(...args);
    }, delay);
  }, [callback, delay]);

  return debouncedFunction;
}

export default useDebounce;
