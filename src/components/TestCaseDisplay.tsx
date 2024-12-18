import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Code } from 'lucide-react';

interface TestCaseDisplayProps {
  input: any;
  output: any;
  explanation?: string;
}

export function TestCaseDisplay({ input, output, explanation }: TestCaseDisplayProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showCode, setShowCode] = useState(false);

  const formatTestCase = () => {
    // Convert input to function parameters
    const params = Array.isArray(input) ? input : [input];
    const paramsStr = params.map(p => JSON.stringify(p)).join(', ');
    
    // Generate example code
    return `// Example usage:
function solution(${Array.isArray(input) ? '...args' : 'input'}) {
  // Your code here
  // Must return a value that matches the expected output format:
  // ${JSON.stringify(output)}
  
  return null; // Replace with your solution
}

// Test case:
const result = solution(${paramsStr});
console.log(result);
// Expected: ${JSON.stringify(output)}`;
  };

  return (
    <div className="border border-border rounded-md overflow-hidden">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 bg-muted hover:bg-muted/80 text-left"
      >
        <span className="font-medium">Test Case</span>
        {isExpanded ? (
          <ChevronDown className="w-4 h-4" />
        ) : (
          <ChevronRight className="w-4 h-4" />
        )}
      </button>

      {isExpanded && (
        <div className="p-4 space-y-4">
          <div>
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-sm font-medium text-muted-foreground">Input:</h3>
              <button
                onClick={() => setShowCode(!showCode)}
                className="text-sm text-primary hover:text-primary/90 flex items-center gap-1"
              >
                <Code className="w-4 h-4" />
                {showCode ? 'Hide Code' : 'Show Code'}
              </button>
            </div>
            <pre className="text-sm bg-background p-3 rounded-md font-mono whitespace-pre-wrap break-words">
              {JSON.stringify(input, null, 2)}
            </pre>
          </div>

          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-2">Expected Output:</h3>
            <pre className="text-sm bg-background p-3 rounded-md font-mono whitespace-pre-wrap break-words">
              {JSON.stringify(output, null, 2)}
            </pre>
          </div>

          {explanation && (
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Explanation:</h3>
              <p className="text-sm text-muted-foreground">{explanation}</p>
            </div>
          )}

          {showCode && (
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Example Code:</h3>
              <pre className="text-sm bg-background p-3 rounded-md font-mono whitespace-pre-wrap break-words">
                {formatTestCase()}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
}