import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Copy, Code } from 'lucide-react';
import toast from 'react-hot-toast';

interface CodeHighlighterProps {
  content: string;
  language: string;
  showCopy?: boolean;
}

export default function CodeHighlighter({ content, language, showCopy = true }: CodeHighlighterProps) {
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      toast.success('Code copied to clipboard');
    } catch (error) {
      toast.error('Failed to copy code');
    }
  };

  const isCodeLanguage = language !== 'text' && language !== 'plain';

  if (!isCodeLanguage) {
    return (
      <div className="bg-gray-50 rounded-lg p-4 relative group">
        {showCopy && (
          <button
            onClick={handleCopy}
            className="absolute top-2 right-2 p-2 bg-white border border-gray-200 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-50"
            title="Copy text"
          >
            <Copy className="h-4 w-4 text-gray-600" />
          </button>
        )}
        <pre className="whitespace-pre-wrap font-mono text-sm text-gray-800 leading-relaxed">
          {content}
        </pre>
      </div>
    );
  }

  return (
    <div className="relative group">
      <div className="flex items-center justify-between bg-gray-800 text-white px-4 py-2 rounded-t-lg">
        <div className="flex items-center">
          <Code className="h-4 w-4 mr-2" />
          <span className="text-sm font-medium capitalize">{language}</span>
        </div>
        {showCopy && (
          <button
            onClick={handleCopy}
            className="p-1 hover:bg-gray-700 rounded transition-colors"
            title="Copy code"
          >
            <Copy className="h-4 w-4" />
          </button>
        )}
      </div>
      <SyntaxHighlighter
        language={language}
        style={tomorrow}
        customStyle={{
          margin: 0,
          borderTopLeftRadius: 0,
          borderTopRightRadius: 0,
          fontSize: '14px',
        }}
        showLineNumbers={content.split('\n').length > 5}
      >
        {content}
      </SyntaxHighlighter>
    </div>
  );
}