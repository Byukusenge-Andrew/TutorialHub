import React from 'react';
import MonacoEditor from '@monaco-editor/react';

interface EditorProps {
  value: string;
  onChange: (value: string) => void;
  language: string;
  defaultValue?: string;
}

export function Editor({ value, onChange, language, defaultValue }: EditorProps) {
  return (
    <MonacoEditor
      height="60vh"
      language={language}
      theme="vs-dark"
      value={value}
      defaultValue={defaultValue}
      onChange={value => onChange(value || '')}
      options={{
        minimap: { enabled: false },
        fontSize: 14,
        lineNumbers: 'on',
        automaticLayout: true,
      }}
    />
  );
} 