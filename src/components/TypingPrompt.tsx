
import { useTypingPrompt } from '../hooks/use-typing-prompt';

export function TypingPrompt() {
  const { currentPrompt } = useTypingPrompt();

  return (
    <div className="p-4 bg-secondary rounded-md border border-border">
      <p className="text-lg font-mono text-foreground leading-relaxed">
        {currentPrompt}
      </p>
    </div>
  );
}