import React, { useState, useEffect } from 'react';
import { Snippet } from '../lib/supabase';
import { Plus, Trash2, Copy, GripVertical, Code } from 'lucide-react';
import { copyToClipboard } from '../lib/clipboard';
import CodeHighlighter from './CodeHighlighter';
import toast from 'react-hot-toast';

interface MultiSnippetEditorProps {
  snippets: Omit<Snippet, 'id' | 'item_id' | 'created_at'>[];
  onChange: (snippets: Omit<Snippet, 'id' | 'item_id' | 'created_at'>[]) => void;
  isEditing: boolean;
}

const LANGUAGE_OPTIONS = [
  { value: 'text', label: 'Plain Text' },
  { value: 'javascript', label: 'JavaScript' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'python', label: 'Python' },
  { value: 'java', label: 'Java' },
  { value: 'html', label: 'HTML' },
  { value: 'css', label: 'CSS' },
  { value: 'sql', label: 'SQL' },
  { value: 'json', label: 'JSON' },
  { value: 'markdown', label: 'Markdown' },
  { value: 'bash', label: 'Bash' },
  { value: 'php', label: 'PHP' },
];

export default function MultiSnippetEditor({ snippets, onChange, isEditing }: MultiSnippetEditorProps) {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const addSnippet = () => {
    const newSnippet = {
      title: `Snippet ${snippets.length + 1}`,
      content: '',
      language: 'text',
      order_index: snippets.length,
    };
    onChange([...snippets, newSnippet]);
  };

  const updateSnippet = (index: number, updates: Partial<Omit<Snippet, 'id' | 'item_id' | 'created_at'>>) => {
    const updated = snippets.map((snippet, i) => 
      i === index ? { ...snippet, ...updates } : snippet
    );
    onChange(updated);
  };

  const removeSnippet = (index: number) => {
    if (snippets.length <= 1) {
      toast.error('Must have at least one snippet');
      return;
    }
    
    const filtered = snippets.filter((_, i) => i !== index);
    onChange(filtered);
  };

  const handleCopy = async (content: string) => {
    try {
      await copyToClipboard(content);
      toast.success('Snippet copied to clipboard');
    } catch (error) {
      toast.error('Failed to copy snippet');
    }
  };

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    
    if (draggedIndex === null || draggedIndex === dropIndex) {
      setDraggedIndex(null);
      return;
    }

    const reordered = [...snippets];
    const [draggedItem] = reordered.splice(draggedIndex, 1);
    reordered.splice(dropIndex, 0, draggedItem);
    
    onChange(reordered);
    setDraggedIndex(null);
  };

  if (snippets.length === 0) {
    return (
      <div className="text-center py-8">
        <Code className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600 mb-4">No snippets yet</p>
        {isEditing && (
          <button
            onClick={addSnippet}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center mx-auto"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add First Snippet
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {snippets.map((snippet, index) => (
        <div
          key={index}
          draggable={isEditing}
          onDragStart={() => handleDragStart(index)}
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, index)}
          className={`border border-gray-200 rounded-lg overflow-hidden ${
            draggedIndex === index ? 'opacity-50' : ''
          }`}
        >
          <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {isEditing && (
                  <GripVertical className="h-4 w-4 text-gray-400 cursor-move" />
                )}
                {isEditing ? (
                  <input
                    type="text"
                    value={snippet.title}
                    onChange={(e) => updateSnippet(index, { title: e.target.value })}
                    className="font-medium text-gray-900 bg-transparent border-none outline-none"
                    placeholder="Snippet title"
                  />
                ) : (
                  <h4 className="font-medium text-gray-900">{snippet.title}</h4>
                )}
                
                {isEditing ? (
                  <select
                    value={snippet.language}
                    onChange={(e) => updateSnippet(index, { language: e.target.value })}
                    className="text-sm border border-gray-300 rounded px-2 py-1"
                  >
                    {LANGUAGE_OPTIONS.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                ) : (
                  <span className="text-sm text-gray-500 bg-gray-200 px-2 py-1 rounded">
                    {LANGUAGE_OPTIONS.find(opt => opt.value === snippet.language)?.label || snippet.language}
                  </span>
                )}
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleCopy(snippet.content)}
                  className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                  title="Copy snippet"
                >
                  <Copy className="h-4 w-4" />
                </button>
                
                {isEditing && snippets.length > 1 && (
                  <button
                    onClick={() => removeSnippet(index)}
                    className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                    title="Remove snippet"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
          
          <div className="p-4">
            {isEditing ? (
              <textarea
                value={snippet.content}
                onChange={(e) => updateSnippet(index, { content: e.target.value })}
                placeholder="Enter snippet content..."
                className="w-full h-32 border border-gray-300 rounded-lg px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
              />
            ) : (
              <div className="min-h-[100px]">
                {snippet.language && snippet.language !== 'text' ? (
                  <CodeHighlighter 
                    content={snippet.content} 
                    language={snippet.language}
                    showCopy={false}
                  />
                ) : (
                  <div className="bg-gray-50 rounded-lg p-3">
                    <pre className="whitespace-pre-wrap font-mono text-sm text-gray-800">
                      {snippet.content}
                    </pre>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      ))}
      
      {isEditing && (
        <button
          onClick={addSnippet}
          className="w-full border-2 border-dashed border-gray-300 rounded-lg py-4 text-gray-500 hover:border-blue-400 hover:text-blue-600 transition-colors flex items-center justify-center"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Another Snippet
        </button>
      )}
    </div>
  );
}