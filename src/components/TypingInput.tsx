import React, { useState, useEffect, useRef } from 'react';
import { useTypingPrompt } from '../hooks/use-typing-prompt';

interface TypingInputProps {
  isActive: boolean;
  timeLeft: number;
  onStart: () => void;
  onComplete: (completed: boolean, text?: string, errors?: number) => void;
}

export function TypingInput({ isActive, timeLeft, onStart, onComplete }: TypingInputProps) {
  const [input, setInput] = useState('');
  const [errors, setErrors] = useState(0);
  const [wordCount, setWordCount] = useState(0);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const { currentPrompt } = useTypingPrompt();

  useEffect(() => {
    if (isActive && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isActive]);

  useEffect(() => {
    if (timeLeft === 0) {
      onComplete(false, input, errors);
      setInput('');
      setErrors(0);
      setWordCount(0);
    }
  }, [timeLeft, input, errors, onComplete]);

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newInput = e.target.value;
    
    if (!isActive && newInput.length === 1) {
      onStart();
    }
    
    setInput(newInput);
    
    // Count words (space or newline separated)
    const words = newInput.trim().split(/\s+/).length;
    setWordCount(words);
    
    // Check for errors only up to the current input length
    const newErrors = [...newInput].reduce((count, char, index) => {
      // Only check characters that have been typed
      if (index < currentPrompt.length) {
        return count + (char !== currentPrompt[index] ? 1 : 0);
      }
      return count;
    }, 0);
    setErrors(newErrors);

    // Check for completion
    if (newInput.length === currentPrompt.length) {
      onComplete(true, newInput, newErrors);
      setInput('');
      setErrors(0);
      setWordCount(0);
    }
  };

  return (
    <div className="space-y-2">
      <textarea
        ref={inputRef}
        value={input}
        onChange={handleInput}
        disabled={timeLeft === 0}
        className="w-full h-32 p-4 bg-secondary text-foreground rounded-md border border-border focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
        placeholder="Start typing to begin..."
      />
      <div className="flex justify-between text-sm text-foreground/60">
        <div>
          Words: <span className="font-medium">{wordCount}</span>
        </div>
        <div>
          Errors: <span className="font-medium text-red-500">{errors}</span>
        </div>
      </div>
    </div>
  );
}