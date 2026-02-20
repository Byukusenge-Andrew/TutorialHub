import React from 'react';
import MonacoEditor from '@monaco-editor/react';

interface EditorProps {
  value: string;
  onChange: (value: string) => void;
  language: string;
  defaultValue?: string;
  className?: string;
}

export function Editor({ value, onChange, language, defaultValue, className }: EditorProps) {
  return (
    <MonacoEditor
      height="100%"
      language={language}
      theme="vs-dark"
      value={value}
      defaultValue={defaultValue}
      onChange={(val) => onChange(val || '')}
      className={className}
      options={{
        minimap: { enabled: false },
        fontSize: 14,
        fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', Consolas, monospace",
        fontLigatures: true,
        lineNumbers: 'on',
        automaticLayout: true,
        scrollBeyondLastLine: false,
        bracketPairColorization: { enabled: true },
        smoothScrolling: true,
        cursorSmoothCaretAnimation: 'on',
        renderLineHighlight: 'all',
        padding: { top: 12, bottom: 12 },
        tabSize: 2,
        wordWrap: 'off',
        overviewRulerBorder: false,
      }}
    />
  );
}