import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import { Plus, Minus, Save, ChevronRight, ChevronDown } from 'lucide-react';
import { useAuthStore } from '../store/auth-store';
import { Button } from '@/components/ui/button';
import { api } from '@/services/api';
import { Section } from '@/types';
import { CodeEditor } from '@/components/CodeEditor';

export function CreateTutorial() {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const createEmptySection = (order: number): Section => ({
    _id: crypto.randomUUID(),
    title: '',
    content: '',
    order,
    subsections: []
  });

  const [formData, setFormData] = useState<{
    title: string;
    description: string;
    category: string;
    tags: string;
    sections: Section[];
  }>({
    title: '',
    description: '',
    category: '',
    tags: '',
    sections: [createEmptySection(0)]
  });

  const [editorModes, setEditorModes] = useState<Record<string, 'markdown' | 'code'>>({});
  const [codeLanguages, setCodeLanguages] = useState<Record<string, string>>({});

  const toggleEditorMode = (sectionId: string) => {
    setEditorModes(prev => ({
      ...prev,
      [sectionId]: prev[sectionId] === 'code' ? 'markdown' : 'code'
    }));
  };

  const updateCodeLanguage = (sectionId: string, language: string) => {
    setCodeLanguages(prev => ({
      ...prev,
      [sectionId]: language
    }));
  };

  if (!user || user.role !== 'admin') {
    navigate('/tutorials');
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      const ensureValidSection = (section: Section): Section => ({
        _id: section._id || crypto.randomUUID(),
        title: section.title,
        content: section.content,
        order: section.order,
        parentId: section.parentId,
        subsections: (section.subsections || []).map(ensureValidSection)
      });

      const sectionsWithIds = formData.sections.map(ensureValidSection);

      const response = await api.tutorials.create({
        ...formData,
        sections: sectionsWithIds,
        tags: formData.tags.split(',').map(tag => tag.trim()),
        authorId: user.id
      });

      navigate(`/tutorials/${response._id}`);
    } catch (error) {
      console.error('Failed to create tutorial:', error);
    }
  };

  const addSection = (parentIndex?: number) => {
    setFormData(prev => {
      if (typeof parentIndex === 'undefined') {
        return {
          ...prev,
          sections: [...prev.sections, createEmptySection(prev.sections.length)]
        };
      } else {
        const newSections = [...prev.sections];
        newSections[parentIndex].subsections?.push(
          createEmptySection(newSections[parentIndex].subsections.length)
        );
        return { ...prev, sections: newSections };
      }
    });
  };

  const removeSection = (index: number, parentIndex?: number) => {
    setFormData(prev => {
      if (typeof parentIndex === 'undefined') {
        return {
          ...prev,
          sections: prev.sections.filter((_, i) => i !== index)
        };
      } else {
        const newSections = [...prev.sections];
        newSections[parentIndex].subsections = 
          newSections[parentIndex].subsections?.filter((_, i) => i !== index) || [];
        return { ...prev, sections: newSections };
      }
    });
  };

  const updateSection = (
    index: number, 
    field: keyof Section, 
    value: string,
    parentIndex?: number
  ) => {
    setFormData(prev => {
      if (typeof parentIndex === 'undefined') {
        return {
          ...prev,
          sections: prev.sections.map((section, i) => 
            i === index ? { ...section, [field]: value } : section
          )
        };
      } else {
        const newSections = [...prev.sections];
        newSections[parentIndex].subsections = 
          newSections[parentIndex].subsections?.map((section, i) =>
            i === index ? { ...section, [field]: value } : section
          );
        return { ...prev, sections: newSections };
      }
    });
  };

  const renderSection = (section: Section, index: number, parentIndex?: number) => (
    <div key={section._id} className="space-y-4 p-4 border border-border rounded-md">
      <div className="flex justify-between items-start gap-4">
        <div className="flex-1 space-y-4">
          <input
            type="text"
            value={section.title}
            onChange={(e) => updateSection(index, 'title', e.target.value, parentIndex)}
            placeholder={`${parentIndex !== undefined ? 'Subsection' : 'Section'} Title`}
            className="w-full px-4 py-2 border border-border rounded-md bg-background"
            required
          />
          <div className="relative space-y-2">
            {/* Editor Mode Toggle - Moved outside the editor container */}
            <div className="flex justify-end gap-2 mb-2">
              <Button
                type="button"
                onClick={() => toggleEditorMode(section._id)}
                variant="secondary"
                size="sm"
                className="z-10 bg-white dark:bg-gray-800"
              >
                {editorModes[section._id] === 'code' ? 'Switch to Markdown' : 'Switch to Code Editor'}
              </Button>
            </div>

            {/* Editor Container */}
            <div className="relative">
              {editorModes[section._id] === 'code' ? (
                <CodeEditor
                  value={section.content}
                  onChange={(value) => updateSection(index, 'content', value || '', parentIndex)}
                  language={codeLanguages[section._id] || 'javascript'}
                
                />
              ) : (
                <div className="relative">
                  <Editor
                    height="200px"
                    defaultLanguage="markdown"
                    value={section.content}
                    onChange={(value) => updateSection(index, 'content', value || '', parentIndex)}
                    theme="vs-dark"
                    options={{
                      minimap: { enabled: false },
                      lineNumbers: 'on',
                      wordWrap: 'on',
                    }}
                  />
                  {/* Section/Subsection Buttons */}
                  <div className="absolute top-2 right-2 flex gap-2">
                    <Button
                      type="button"
                      onClick={() => {
                        const cursorPosition = section.content.length;
                        updateSection(
                          index,
                          'content',
                          `${section.content}\n\n## New Section\n\nContent here...`,
                          parentIndex
                        );
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
                        const cursorPosition = section.content.length;
                        updateSection(
                          index,
                          'content',
                          `${section.content}\n\n### New Subsection\n\nContent here...`,
                          parentIndex
                        );
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
              )}
            </div>
          </div>
        </div>
        <div className="space-y-2">
          {!parentIndex && (
            <Button
              type="button"
              onClick={() => addSection(index)}
              variant="outline"
              size="sm"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Subsection
            </Button>
          )}
          {(parentIndex !== undefined || index > 0) && (
            <Button
              type="button"
              onClick={() => removeSection(index, parentIndex)}
              variant="destructive"
              size="sm"
            >
              <Minus className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
      {(section.subsections ?? []).length > 0 && (
        <div className="ml-8 space-y-4">
          {section.subsections?.map((subsection, subIndex) => 
            renderSection(subsection, subIndex, index)
          )}
        </div>
      )}
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">Create Tutorial</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <input
              title='Title'
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full px-4 py-2 border border-border rounded-md bg-background"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
            title='Description'
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={4}
              className="w-full px-4 py-2 border border-border rounded-md bg-background"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Category</label>
              <input
              title='Category'
                type="text"
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                className="w-full px-4 py-2 border border-border rounded-md bg-background"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Tags (comma-separated)</label>
              <input
                type="text"
                value={formData.tags}
                onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                className="w-full px-4 py-2 border border-border rounded-md bg-background"
                placeholder="react, javascript, web development"
                required
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Sections</h2>
            <Button
              type="button"
              onClick={() => addSection()}
              variant="outline"
              size="sm"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Section
            </Button>
          </div>

          {formData.sections.map((section, index) => renderSection(section, index))}
        </div>

        <Button type="submit" className="w-full">
          <Save className="w-4 h-4 mr-2" />
          Create Tutorial
        </Button>
      </form>
    </div>
  );
}
