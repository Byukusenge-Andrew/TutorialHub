import { Editor } from '@monaco-editor/react';
import { useState } from 'react';

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language?: string;
  readOnly?: boolean;
}

export function CodeEditor({ 
  value, 
  onChange, 
  language = 'javascript',
  readOnly = false 
}: CodeEditorProps) {
  const [theme] = useState('vs-dark');

  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined) {
      onChange(value);
    }
  };

  return (
    <div className="w-full h-[400px] border border-border rounded-md overflow-hidden">
      <Editor
        height="100%"
        defaultLanguage={language}
        defaultValue={value}
        theme={theme}
        onChange={handleEditorChange}
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          lineNumbers: 'on',
          readOnly,
          scrollBeyondLastLine: false,
          automaticLayout: true,
        }}
      />
    </div>
  );
}