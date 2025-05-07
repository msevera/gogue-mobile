import { GenerateLectureContext } from "@/contexts/generateLectureContext";
import { useContextSelector } from 'use-context-selector';

export function useGenerateLecture(fn: (state: any) => any) {
  const value = useContextSelector(GenerateLectureContext, fn);

  return value;
}