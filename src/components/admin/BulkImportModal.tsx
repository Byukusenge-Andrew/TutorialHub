import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Upload, FileText, Download, Check, AlertCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { api } from '@/services/api';

interface BulkImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'tutorials' | 'dsa';
  onSuccess?: () => void;
}

const SAMPLE_TUTORIALS_JSON = JSON.stringify([
  {
    "title": "Introduction to React Hooks",
    "description": "Learn useState, useEffect, and custom hooks in modern React.",
    "category": "Frontend",
    "tags": ["react", "javascript", "frontend"],
    "sections": [
      {
        "title": "1. useState Hook",
        "content": "The useState hook lets you add state to functional components.",
        "order": 1
      },
      {
        "title": "2. useEffect Hook",
        "content": "The useEffect hook lets you perform side effects in functional components.",
        "order": 2
      }
    ]
  },
  {
    "title": "Node.js REST API Basics",
    "description": "Build scalable RESTful services using Express and Node.js.",
    "category": "Backend",
    "tags": ["nodejs", "express", "backend"],
    "sections": [
      {
        "title": "1. Express Setup",
        "content": "Initialize express application and setup middleware.",
        "order": 1
      }
    ]
  }
], null, 2);

const SAMPLE_TUTORIALS_CSV = `title,description,category,tags,content
"Introduction to React","Learn core React principles","Frontend","react,javascript","# React Basics\\nReact is a JavaScript library for building user interfaces."
"Node.js Basics","Learn backend development with Node","Backend","node,express","# Node.js Basics\\nNode.js is a JavaScript runtime environment."`;

const SAMPLE_DSA_JSON = JSON.stringify([
  {
    "title": "Two Sum",
    "description": "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
    "difficulty": "easy",
    "category": "Arrays",
    "tags": ["array", "hash-table"],
    "starterCode": "function solution(nums, target) {\n  // Write code\n}",
    "solution": "function solution(nums, target) {\n  const map = new Map();\n  for(let i=0; i<nums.length; i++) {\n    const diff = target - nums[i];\n    if(map.has(diff)) return [map.get(diff), i];\n    map.set(nums[i], i);\n  }\n  return [];\n}",
    "testCases": [
      { "input": "[2,7,11,15], 9", "expectedOutput": "[0,1]", "isHidden": false }
    ]
  },
  {
    "title": "Reverse String",
    "description": "Write a function that reverses a string.",
    "difficulty": "easy",
    "category": "Strings",
    "tags": ["string", "two-pointers"],
    "starterCode": "function solution(s) {\n  return s.split('').reverse().join('');\n}",
    "testCases": [
      { "input": "\"hello\"", "expectedOutput": "\"olleh\"", "isHidden": false }
    ]
  }
], null, 2);

const SAMPLE_DSA_CSV = `title,description,difficulty,category,tags,starterCode
"Two Sum","Find two numbers adding up to target","easy","Arrays","array,hash-table","function solution(nums, target) { return []; }"
"Reverse String","Reverse a string","easy","Strings","string","function solution(s) { return s.split('').reverse().join(''); }"`;

interface ImportItem {
  title?: string;
  category?: string;
  difficulty?: string;
  [key: string]: unknown;
}

export function BulkImportModal({ isOpen, onClose, type, onSuccess }: BulkImportModalProps) {
  const [activeTab, setActiveTab] = useState<'upload' | 'paste'>('upload');
  const [rawText, setRawText] = useState('');
  const [parsedItems, setParsedItems] = useState<ImportItem[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const sampleJson = type === 'tutorials' ? SAMPLE_TUTORIALS_JSON : SAMPLE_DSA_JSON;
  const sampleCsv = type === 'tutorials' ? SAMPLE_TUTORIALS_CSV : SAMPLE_DSA_CSV;

  // Simple CSV parser
  const parseCSV = (csvText: string): ImportItem[] => {
    const lines = csvText.split('\n').filter(line => line.trim().length > 0);
    if (lines.length < 2) return [];

    const headers = lines[0].split(',').map(h => h.trim().replace(/^"(.*)"$/, '$1'));
    const items: ImportItem[] = [];

    for (let i = 1; i < lines.length; i++) {
      const regex = /(?:,|\n|^)("(?:(?:"")*[^"]*)*"|[^",\n]*|(?:\n|$))/g;
      const row: string[] = [];
      let match;
      while ((match = regex.exec(lines[i])) !== null) {
        let val = match[1];
        if (!val && match[0] === ',') val = '';
        if (val) {
          val = val.replace(/^"(.*)"$/, '$1').replace(/""/g, '"');
          row.push(val);
        }
      }

      if (row.length >= 2) {
        const itemObj: ImportItem = {};
        headers.forEach((h, idx) => {
          if (row[idx] !== undefined) {
            itemObj[h] = row[idx];
          }
        });
        items.push(itemObj);
      }
    }
    return items;
  };

  const handleParseText = (text: string) => {
    setRawText(text);
    setErrorMsg(null);

    if (!text.trim()) {
      setParsedItems([]);
      return;
    }

    try {
      if (text.trim().startsWith('[') || text.trim().startsWith('{')) {
        let json = JSON.parse(text);
        if (!Array.isArray(json)) {
          json = [json];
        }
        setParsedItems(json);
      } else {
        const items = parseCSV(text);
        setParsedItems(items);
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Invalid format';
      setErrorMsg(`Invalid format: ${message}`);
      setParsedItems([]);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      handleParseText(content);
    };
    reader.readAsText(file);
  };

  const handleDownloadSample = (format: 'json' | 'csv') => {
    const content = format === 'json' ? sampleJson : sampleCsv;
    const blob = new Blob([content], { type: format === 'json' ? 'application/json' : 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sample_${type}.${format}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleSubmit = async () => {
    if (parsedItems.length === 0) {
      toast.error('No items to import');
      return;
    }

    setIsSubmitting(true);
    try {
      if (type === 'tutorials') {
        const res = await api.tutorials.bulkImport(parsedItems);
        toast.success(res.message || `Successfully imported ${res.count} tutorials`);
      } else {
        const res = await api.dsa.bulkImport(parsedItems);
        toast.success(res.message || `Successfully imported ${res.count} exercises`);
      }

      onSuccess?.();
      onClose();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Bulk import failed';
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl sm:max-w-3xl max-h-[85vh] flex flex-col p-4 sm:p-6 overflow-hidden">
        <DialogHeader className="shrink-0 pb-2">
          <DialogTitle className="text-lg sm:text-xl font-bold flex items-center gap-2">
            <Upload className="w-5 h-5 text-primary shrink-0" />
            Bulk Import {type === 'tutorials' ? 'Tutorials' : 'DSA Exercises'}
          </DialogTitle>
          <DialogDescription className="text-xs sm:text-sm">
            Import multiple items using a **JSON** or **CSV** file.
          </DialogDescription>
        </DialogHeader>

        {/* Scrollable content container */}
        <div className="flex-1 overflow-y-auto pr-1 space-y-4 my-2">
          {/* Sample download buttons */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-muted/60 p-3 rounded-lg border text-xs sm:text-sm gap-2">
            <span className="font-medium text-muted-foreground">Download sample templates:</span>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" className="h-8 text-xs" onClick={() => handleDownloadSample('json')}>
                <Download className="w-3.5 h-3.5 mr-1" /> JSON Template
              </Button>
              <Button size="sm" variant="outline" className="h-8 text-xs" onClick={() => handleDownloadSample('csv')}>
                <Download className="w-3.5 h-3.5 mr-1" /> CSV Template
              </Button>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={(v: string) => setActiveTab(v as 'upload' | 'paste')} className="w-full">
            <TabsList className="grid grid-cols-2 w-full mb-3">
              <TabsTrigger value="upload" className="flex items-center gap-2 text-xs sm:text-sm">
                <Upload className="w-4 h-4" /> Upload File
              </TabsTrigger>
              <TabsTrigger value="paste" className="flex items-center gap-2 text-xs sm:text-sm">
                <FileText className="w-4 h-4" /> Paste Text / Edit
              </TabsTrigger>
            </TabsList>

            <TabsContent value="upload" className="mt-0">
              <div className="border-2 border-dashed border-border rounded-xl p-6 text-center hover:border-primary/50 transition-colors flex flex-col items-center justify-center bg-muted/20">
                <Upload className="w-8 h-8 text-muted-foreground mb-2" />
                <p className="text-sm font-medium mb-1">Select or drop a .json / .csv file</p>
                <p className="text-xs text-muted-foreground mb-3">Supports structured JSON and CSV formats</p>
                <input
                  type="file"
                  accept=".json,.csv"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload-input"
                />
                <label htmlFor="file-upload-input">
                  <Button variant="default" size="sm" className="cursor-pointer" asChild>
                    <span>Choose File</span>
                  </Button>
                </label>
              </div>
            </TabsContent>

            <TabsContent value="paste" className="mt-0">
              <textarea
                value={rawText}
                onChange={(e) => handleParseText(e.target.value)}
                placeholder={`Paste your JSON or CSV content here...\n\nExample JSON:\n${sampleJson}`}
                className="w-full h-36 p-3 font-mono text-xs bg-muted/40 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-y"
              />
            </TabsContent>
          </Tabs>

          {/* Error notification */}
          {errorMsg && (
            <div className="flex items-center gap-2 p-3 bg-red-500/10 text-red-600 rounded-lg text-xs sm:text-sm">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Preview section */}
          {parsedItems.length > 0 && (
            <div className="bg-card border rounded-lg p-3 space-y-2 max-h-36 overflow-y-auto">
              <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground uppercase tracking-wider sticky top-0 bg-card pb-1">
                <span>Parsed Items ({parsedItems.length})</span>
                <span className="text-emerald-600 flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> Ready to Import
                </span>
              </div>
              <div className="space-y-1 divide-y divide-border">
                {parsedItems.map((item, idx) => (
                  <div key={idx} className="pt-1.5 flex items-center justify-between text-xs sm:text-sm">
                    <span className="font-medium truncate max-w-[200px] sm:max-w-md">{item.title || `Item ${idx + 1}`}</span>
                    <span className="text-xs text-muted-foreground capitalize shrink-0 ml-2">
                      {item.category || item.difficulty || 'General'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Fixed Footer at bottom */}
        <DialogFooter className="shrink-0 pt-3 border-t gap-2 sm:gap-0">
          <Button variant="outline" size="sm" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            size="sm"
            onClick={handleSubmit}
            disabled={parsedItems.length === 0 || isSubmitting}
            className="bg-primary text-primary-foreground"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Importing...
              </>
            ) : (
              `Import ${parsedItems.length} Item(s)`
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
