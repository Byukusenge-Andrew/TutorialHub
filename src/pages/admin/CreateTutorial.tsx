import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Minus } from 'lucide-react';
import { api } from '@/services/api';
import { useAuthStore } from '@/store/auth-store';

interface Section {
  title: string;
  content: string;
  order: number;
}

export function CreateTutorial() {
  const { user } = useAuthStore();
  const userId = user?.id || '';
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    tags: '',
    sections: [{ title: '', content: '', order: 0 }]
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await api.tutorials.create({
        title: formData.title,
        description: formData.description,
        category: formData.category,
        tags: formData.tags.split(',').map(tag => tag.trim()),
        authorId: userId,
        sections: formData.sections.map((section, index) => ({
          ...section,
          id: `temp-${index}`,
          order: index
        }))
      });
      navigate(`/tutorials/${response._id}`);
    } catch (error) {
      console.error('Failed to create tutorial:', error);
    }
  };

  const addSection = () => {
    setFormData(prev => ({
      ...prev,
      sections: [...prev.sections, { title: '', content: '', order: prev.sections.length }]
    }));
  };

  const removeSection = (index: number) => {
    setFormData(prev => ({
      ...prev,
      sections: prev.sections.filter((_, i) => i !== index)
    }));
  };

  const updateSection = (index: number, field: keyof Section, value: string) => {
    setFormData(prev => ({
      ...prev,
      sections: prev.sections.map((section, i) => 
        i === index ? { ...section, [field]: value } : section
      )
    }));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">Create Tutorial</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <input
            title='title'
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full p-2 border border-border rounded-md"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
            title='description'
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full p-2 border border-border rounded-md h-32"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Category</label>
            <input
              title='category'
              type="text"
              value={formData.category}
              onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
              className="w-full p-2 border border-border rounded-md"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Tags (comma-separated)</label>
            <input
              type="text"
              value={formData.tags}
              onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
              className="w-full p-2 border border-border rounded-md"
              placeholder="react, javascript, web development"
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Sections</h2>
            <button
            title='add-section'
              type="button"
              onClick={addSection}
              className="text-primary hover:text-primary/90"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>

          {formData.sections.map((section, index) => (
            <div key={index} className="space-y-4 p-4 border border-border rounded-md">
              <div className="flex justify-between items-start">
                <div className="flex-1 space-y-4">
                  <input
                    type="text"
                    value={section.title}
                    onChange={(e) => updateSection(index, 'title', e.target.value)}
                    placeholder="Section Title"
                    className="w-full p-2 border border-border rounded-md"
                    required
                  />
                  <textarea
                    value={section.content}
                    onChange={(e) => updateSection(index, 'content', e.target.value)}
                    placeholder="Section Content"
                    className="w-full p-2 border border-border rounded-md h-32"
                    required
                  />
                </div>
                {index > 0 && (
                  <button
                    title='remove-section'
                    type="button"
                    onClick={() => removeSection(index)}
                    className="ml-4 text-red-500 hover:text-red-700"
                  >
                    <Minus className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        <button
          type="submit"
          className="w-full py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
        >
          Create Tutorial
        </button>
      </form>
    </div>
  );
} 