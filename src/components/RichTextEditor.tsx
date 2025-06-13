'use client';

import { useState, useRef } from 'react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export default function RichTextEditor({ 
  value, 
  onChange, 
  placeholder = "Write your article content...", 
  className 
}: RichTextEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const insertMarkdown = (before: string, after: string = '', placeholder: string = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end);
    const replacement = selectedText || placeholder;
    
    const newValue = 
      textarea.value.substring(0, start) + 
      before + replacement + after + 
      textarea.value.substring(end);
    
    onChange(newValue);

    // Focus and set cursor position
    setTimeout(() => {
      textarea.focus();
      const newCursorPos = start + before.length + replacement.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  const toolbar = [
    { label: 'B', action: () => insertMarkdown('**', '**', 'bold text'), title: 'Bold' },
    { label: 'I', action: () => insertMarkdown('*', '*', 'italic text'), title: 'Italic' },
    { label: 'H1', action: () => insertMarkdown('# ', '', 'Heading 1'), title: 'Heading 1' },
    { label: 'H2', action: () => insertMarkdown('## ', '', 'Heading 2'), title: 'Heading 2' },
    { label: 'H3', action: () => insertMarkdown('### ', '', 'Heading 3'), title: 'Heading 3' },
    { label: 'UL', action: () => insertMarkdown('\n- ', '', 'List item'), title: 'Bullet List' },
    { label: 'OL', action: () => insertMarkdown('\n1. ', '', 'List item'), title: 'Numbered List' },
    { label: 'Link', action: () => {
      const url = prompt('Enter URL:') || '#';
      insertMarkdown('[', `](${url})`, 'link text');
    }, title: 'Insert Link' },
    { label: 'Img', action: () => {
      const url = prompt('Enter image URL:') || '';
      insertMarkdown('![', `](${url})`, 'alt text');
    }, title: 'Insert Image' },
    { label: 'Code', action: () => insertMarkdown('`', '`', 'code'), title: 'Code' },
    { label: 'Quote', action: () => insertMarkdown('> ', '', 'Quote text'), title: 'Quote' },
  ];

  return (
    <div className={`border border-gray-300 rounded-lg overflow-hidden ${className || ''}`}>
      {/* Toolbar */}
      <div className="bg-gray-50 border-b border-gray-200 px-3 py-2 flex items-center space-x-1 flex-wrap gap-1">
        {toolbar.map((item, index) => (
          <button
            key={index}
            type="button"
            onClick={item.action}
            className="px-3 py-1 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded transition-colors border border-transparent hover:border-gray-300"
            title={item.title}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Editor */}
      <div className="relative">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full min-h-[400px] p-4 border-0 resize-y focus:outline-none focus:ring-0"
          style={{ 
            fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace',
            fontSize: '14px', 
            lineHeight: '1.5' 
          }}
        />
        
        {/* Character count */}
        <div className="absolute bottom-2 right-2 text-xs text-gray-400 bg-white/80 px-2 py-1 rounded backdrop-blur-sm">
          {value.length} characters
        </div>
      </div>

      {/* Help text */}
      <div className="bg-gray-50 border-t border-gray-200 px-4 py-2 text-xs text-gray-500">
        <div className="flex flex-wrap gap-4">
          <span><strong>**bold**</strong></span>
          <span><em>*italic*</em></span>
          <span><code>`code`</code></span>
          <span># Heading</span>
          <span>[link](url)</span>
          <span>![img](url)</span>
          <span>&gt; quote</span>
        </div>
      </div>
    </div>
  );
} 