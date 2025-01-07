import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Haptic feedback patterns
export const hapticPatterns = {
  light: 10,
  medium: 25,
  heavy: 50,
  success: [10, 50, 10],
  error: [50, 100, 50],
  warning: [30, 100, 30],
  selection: [15],
} as const;

export type HapticPattern = keyof typeof hapticPatterns;

export function triggerHaptic(pattern: HapticPattern = 'light') {
  // Check if vibration is supported
  if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
    try {
      navigator.vibrate(hapticPatterns[pattern]);
    } catch (error) {
      console.warn('Haptic feedback failed:', error);
    }
  }
}