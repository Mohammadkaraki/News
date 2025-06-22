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
    { label: 'ع', action: () => insertMarkdown('**', '**', 'نص عريض'), title: 'عريض' },
    { label: 'م', action: () => insertMarkdown('*', '*', 'نص مائل'), title: 'مائل' },
    { label: 'ع1', action: () => insertMarkdown('# ', '', 'عنوان 1'), title: 'عنوان 1' },
    { label: 'ع2', action: () => insertMarkdown('## ', '', 'عنوان 2'), title: 'عنوان 2' },
    { label: 'ع3', action: () => insertMarkdown('### ', '', 'عنوان 3'), title: 'عنوان 3' },
    { label: '•', action: () => insertMarkdown('\n- ', '', 'عنصر القائمة'), title: 'قائمة نقطية' },
    { label: '1.', action: () => insertMarkdown('\n1. ', '', 'عنصر القائمة'), title: 'قائمة مرقمة' },
    { label: 'رابط', action: () => {
      const url = prompt('أدخل الرابط:') || '#';
      insertMarkdown('[', `](${url})`, 'نص الرابط');
    }, title: 'إدراج رابط' },
    { label: 'صورة', action: () => {
      const url = prompt('أدخل رابط الصورة:') || '';
      insertMarkdown('![', `](${url})`, 'النص البديل');
    }, title: 'إدراج صورة' },
    { label: 'كود', action: () => insertMarkdown('`', '`', 'كود'), title: 'كود' },
    { label: '"', action: () => insertMarkdown('> ', '', 'نص الاقتباس'), title: 'اقتباس' },
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
        <div className="absolute bottom-2 left-2 text-xs text-gray-400 bg-white/80 px-2 py-1 rounded backdrop-blur-sm">
          {value.length} أحرف
        </div>
      </div>

      {/* Help text */}
      <div className="bg-gray-50 border-t border-gray-200 px-4 py-2 text-xs text-gray-500">
        <div className="flex flex-wrap gap-4">
          <span><strong>**عريض**</strong></span>
          <span><em>*مائل*</em></span>
          <span><code>`كود`</code></span>
          <span># عنوان</span>
          <span>[رابط](url)</span>
          <span>![صورة](url)</span>
          <span>&gt; اقتباس</span>
        </div>
      </div>
    </div>
  );
} 