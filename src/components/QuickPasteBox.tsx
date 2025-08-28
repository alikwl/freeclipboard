import React, { useState, useCallback } from 'react';
import { Zap, Loader2, Sparkles, Wand2, Languages, Eraser } from 'lucide-react';
import { saveClipboardItem } from '../lib/clipboard';
import { processWithAI } from '../lib/ai';
import { ClipboardItem } from '../lib/supabase';
import toast from 'react-hot-toast';

interface QuickPasteBoxProps {
  onItemSaved: (item: ClipboardItem) => void;
}

export default function QuickPasteBox({ onItemSaved }: QuickPasteBoxProps) {
  const [content, setContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showAIOptions, setShowAIOptions] = useState(false);

  // Debounced auto-save
  const debouncedSave = useCallback(
    debounce(async (text: string) => {
      if (text.trim() && text.length > 10) {
        try {
          const savedItem = await saveClipboardItem({
            content: text.trim(),
            title: text.trim().split('\n')[0].substring(0, 50) || 'Auto-saved',
          });
          onItemSaved(savedItem);
          toast.success('Auto-saved', { duration: 2000 });
        } catch (error) {
          // Silently fail auto-save
        }
      }
    }, 2000),
    [onItemSaved]
  );

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setContent(newContent);
    debouncedSave(newContent);
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setContent(text);
      debouncedSave(text);
    } catch (error) {
      toast.error('Failed to read clipboard');
    }
  };

  const handleManualSave = async () => {
    if (!content.trim()) {
      toast.error('Please enter some content');
      return;
    }

    setIsSaving(true);
    try {
      const savedItem = await saveClipboardItem({
        content: content.trim(),
        title: content.trim().split('\n')[0].substring(0, 50) || 'Untitled',
      });
      onItemSaved(savedItem);
      setContent('');
      toast.success('Saved successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to save');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAIProcess = async (action: 'summarize' | 'rephrase' | 'translate' | 'clean') => {
    if (!content.trim()) {
      toast.error('Please enter some content first');
      return;
    }

    setIsProcessing(true);
    try {
      const result = await processWithAI(content, { action });
      setContent(result);
      toast.success(`Text ${action}d successfully`);
      setShowAIOptions(false);
    } catch (error: any) {
      toast.error(error.message || `Failed to ${action} text`);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm mb-6">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-900">Quick Paste & Save</h3>
          <div className="flex items-center space-x-2 text-sm">
            <button
              onClick={() => setShowAIOptions(!showAIOptions)}
              className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
              title="AI Tools"
            >
              <Sparkles className="h-4 w-4" />
            </button>
            <span className="text-sm text-gray-500">{content.length} chars</span>
          </div>
        </div>
      </div>

      {showAIOptions && (
        <div className="p-3 md:p-4 bg-purple-50 border-b border-purple-200">
          <div className="flex flex-wrap gap-1 md:gap-2">
            <button
              onClick={() => handleAIProcess('summarize')}
              disabled={isProcessing}
              className="flex items-center px-2 py-1 md:px-3 md:py-1.5 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors text-xs md:text-sm disabled:opacity-50"
            >
              <Wand2 className="h-3 w-3 mr-1" />
              Summarize
            </button>
            <button
              onClick={() => handleAIProcess('rephrase')}
              disabled={isProcessing}
              className="flex items-center px-2 py-1 md:px-3 md:py-1.5 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors text-xs md:text-sm disabled:opacity-50"
            >
              <Wand2 className="h-3 w-3 mr-1" />
              Rephrase
            </button>
            <button
              onClick={() => handleAIProcess('translate')}
              disabled={isProcessing}
              className="flex items-center px-2 py-1 md:px-3 md:py-1.5 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors text-xs md:text-sm disabled:opacity-50"
            >
              <Languages className="h-3 w-3 mr-1" />
              Translate
            </button>
            <button
              onClick={() => handleAIProcess('clean')}
              disabled={isProcessing}
              className="flex items-center px-2 py-1 md:px-3 md:py-1.5 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors text-xs md:text-sm disabled:opacity-50"
            >
              <Eraser className="h-3 w-3 mr-1" />
              Clean Text
            </button>
          </div>
        </div>
      )}

      <div className="p-4">
        <textarea
          value={content}
          onChange={handleContentChange}
          placeholder="Paste or type your content here... Auto-saves as you type!"
          className="w-full h-24 md:h-32 border border-gray-300 rounded-lg p-3 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm md:text-base"
        />
        
        <div className="flex justify-between items-center mt-3">
          <button
            onClick={handlePaste}
            className="text-xs md:text-sm text-blue-600 hover:text-blue-800 transition-colors"
          >
            Paste from clipboard
          </button>
          
          <div className="flex items-center space-x-2 md:space-x-3">
            {isProcessing && (
              <div className="flex items-center text-purple-600 text-xs md:text-sm">
                <Loader2 className="h-4 w-4 animate-spin mr-1" />
                Processing...
              </div>
            )}
            <button
              onClick={handleManualSave}
              disabled={isSaving || !content.trim()}
              className="bg-blue-600 text-white px-3 py-2 md:px-4 md:py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center text-sm md:text-base"
            >
              {isSaving ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Zap className="h-4 w-4 mr-2" />
              )}
              <span className="hidden sm:inline">Paste & Save</span>
              <span className="sm:hidden">Save</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Debounce utility
function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}