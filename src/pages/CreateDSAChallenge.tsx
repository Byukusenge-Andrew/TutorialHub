import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import { Plus, Trash2 } from 'lucide-react';
import { useDSAStore } from '../store/dsa-store';
import { useAuthStore } from '../store/auth-store';
import { TestCase } from '../types';
import { api } from '@/services/api';

export function CreateDSAChallenge() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { addChallenge } = useDSAStore();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy');
  const [tags, setTags] = useState('');
  const [testCases, setTestCases] = useState<TestCase[]>([]);
  const [newTestCase, setNewTestCase] = useState({ input: '', output: '', isHidden: false });


  if (!user || user.role !== 'admin') {
    navigate('/dsa');
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const challenge = {
      _id: Date.now().toString(),
      title,
      description,
      difficulty,
      tags: tags.split(',').map((tag) => tag.trim()),
      testCases,
      timeLimit: 2000,
      memoryLimit: 128, 
      submissions: 0,
      successfulSubmissions: 0,
      successRate: 0,
      authorId: user.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    addChallenge(challenge);
    await api.dsa.createChallenge(challenge);
    navigate('/dsa');
  };

  const addTestCase = () => {
    try {
      const input = JSON.parse(newTestCase.input);
      const output = JSON.parse(newTestCase.output);
      setTestCases([...testCases, { ...newTestCase, input, output }]);
      setNewTestCase({ input: '', output: '', isHidden: false });
    } catch (error) {
      alert('Invalid JSON format in test case');
    }
  };

  const removeTestCase = (index: number) => {
    setTestCases(testCases.filter((_, i) => i !== index));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">Create DSA Challenge</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 border border-border rounded-md bg-background"
              required
               placeholder="Enter challenge title"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full px-4 py-2 border border-border rounded-md bg-background"
              required
               title="Enter the challenge description"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Difficulty</label>
              <select
                title='difficulty'
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as any)}
                className="w-full px-4 py-2 border border-border rounded-md bg-background"
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Tags (comma-separated)</label>
              <input
                title='tags'
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className="w-full px-4 py-2 border border-border rounded-md bg-background"
                required
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Test Cases</h2>
          
          <div className="space-y-4">
            {testCases.map((testCase, index) => (
              <div key={index} className="p-4 border border-border rounded-md">
                <div className="flex justify-between items-start mb-2">
                  <span className="font-medium">Test Case {index + 1}</span>
                  <button
                    title="Remove Test Case"
                    type="button"
                    onClick={() => removeTestCase(index)}
                    className="text-red-500 hover:text-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <pre className="text-sm bg-secondary p-2 rounded-md mb-2">
                  Input: {JSON.stringify(testCase.input, null, 2)}
                </pre>
                <pre className="text-sm bg-secondary p-2 rounded-md">
                  Output: {JSON.stringify(testCase.output, null, 2)}
                </pre>
              </div>
            ))}
          </div>

          <div className="p-4 border border-border rounded-md space-y-4">
            <h3 className="font-medium">Add Test Case</h3>
            <div className="space-y-2">
              <label className="block text-sm">Input (JSON format)</label>
              <input
                title='input'
                type="text"
                value={newTestCase.input}
                onChange={(e) => setNewTestCase({ ...newTestCase, input: e.target.value })}
                className="w-full px-4 py-2 border border-border rounded-md bg-background"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm">Output (JSON format)</label>
              <input
                title='output'
                type="text"
                value={newTestCase.output}
                onChange={(e) => setNewTestCase({ ...newTestCase, output: e.target.value })}
                className="w-full px-4 py-2 border border-border rounded-md bg-background"
              />
            </div>
            <div className="flex items-center">
              <input
                title='isHidden'
                type="checkbox"
                checked={newTestCase.isHidden}
                onChange={(e) => setNewTestCase({ ...newTestCase, isHidden: e.target.checked })}
                className="mr-2"
              />
              <label className="text-sm">Hidden test case</label>
            </div>
            <button
              type="button"
              onClick={addTestCase}
              className="w-full py-2 px-4 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90 flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Test Case
            </button>
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-2 px-4 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
        >
          Create Challenge
        </button>
      </form>
    </div>
  );
}