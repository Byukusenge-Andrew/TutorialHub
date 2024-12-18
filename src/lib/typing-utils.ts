export interface TypingStats {
  wpm: number;
  accuracy: number;
  time: number;
  totalWords: number;
  errors: number;
}

export function calculateTypingStats(
  text: string,
  duration: number,
  errors: number
): TypingStats {
  // Count actual words
  const words = text.trim().split(/\s+/).length;
  
  // Words per minute calculation
  const minutes = duration / 60;
  const wpm = Math.round(words / minutes);

  // Accuracy calculation
  const totalCharacters = text.length;
  const accuracy = Math.round(((totalCharacters - errors) / totalCharacters) * 100);

  return {
    wpm,
    accuracy,
    time: Math.round(duration),
    totalWords: words,
    errors,
  };
}