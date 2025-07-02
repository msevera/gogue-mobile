import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatTime(seconds: number, munutesOnly?: boolean) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  if (munutesOnly) {   
    return `${minutes + 1}`;
  }
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}


export function coverBGHex(hex: string) {
  return `${hex}66`;
}