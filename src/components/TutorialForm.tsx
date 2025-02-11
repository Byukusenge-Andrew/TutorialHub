import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTutorialStore } from '../store/tutorial-store';
import { useAuthStore } from '../store/auth-store';
import { Plus, Save, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Editor from '@monaco-editor/react';

export function TutorialForm() {
  const navigate = useNavigate();
  const addTutorial = useTutorialStore((state) => state.addTutorial);
  const user = useAuthStore((state) => state.user);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const tutorial = {
      _id: Date.now().toString(),
      title,
      description,
      content,
      author: user,
      authorId: {
        _id: user.id,
        name: user.name,
        email: user.email
      },
      category,
      tags: tags.split(',').map((tag) => tag.trim()),
      sections: [{ _id: 'default', id: 'default', title: 'Main Content', content, order: 0 }],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      rating: 0,
      totalRatings: 0,
    };

    addTutorial(tutorial);
    navigate('/tutorials');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
          Title
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Content (Markdown)</label>
        <div className="relative">
          <Editor
            height="400px"
            defaultLanguage="markdown"
            value={content}
            onChange={(value) => setContent(value || '')}
            theme="vs-dark"
            options={{
              minimap: { enabled: false },
              lineNumbers: 'on',
              wordWrap: 'on',
            }}
          />
          <div className="absolute top-2 right-2 flex gap-2 z-50">
            <div className="flex gap-2">
              <Button
                type="button"
                onClick={() => {
                  setContent(prev => `${prev}\n\n## New Section\n\nContent here...`);
                }}
                variant="secondary"
                size="sm"
                className="bg-white dark:bg-gray-800 shadow-md hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <Plus className="w-4 h-4 mr-1" />
                Section
              </Button>
              <Button
                type="button"
                onClick={() => {
                  setContent(prev => `${prev}\n\n### New Subsection\n\nContent here...`);
                }}
                variant="secondary"
                size="sm"
                className="bg-white dark:bg-gray-800 shadow-md hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <Plus className="w-4 h-4 mr-1" />
                Subsection
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div>
        <label htmlFor="category" className="block text-sm font-medium text-gray-700">
          Category
        </label>
        <input
          id="category"
          type="text"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
        />
      </div>

      <div>
        <label htmlFor="tags" className="block text-sm font-medium text-gray-700">
          Tags (comma-separated)
        </label>
        <input
          id="tags"
          type="text"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
        />
      </div>

      <Button type="submit" className="w-full">
        <Save className="w-4 h-4 mr-2" />
        Create Tutorial
      </Button>
    </form>
  );
}