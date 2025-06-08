
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { 
  Bold, 
  Italic, 
  Underline, 
  AlignLeft, 
  AlignCenter, 
  AlignRight,
  List,
  ListOrdered,
  Link,
  Image,
  Code,
  Eye,
  EyeOff
} from 'lucide-react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({ value, onChange, placeholder }) => {
  const [isHtmlMode, setIsHtmlMode] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const insertText = (beforeText: string, afterText: string = '') => {
    if (!textareaRef.current) return;
    
    const start = textareaRef.current.selectionStart;
    const end = textareaRef.current.selectionEnd;
    const selectedText = value.substring(start, end);
    
    const newText = value.substring(0, start) + beforeText + selectedText + afterText + value.substring(end);
    onChange(newText);
    
    // Focus and set cursor position
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        textareaRef.current.setSelectionRange(
          start + beforeText.length,
          start + beforeText.length + selectedText.length
        );
      }
    }, 0);
  };

  const toolbarButtons = [
    { icon: Bold, action: () => insertText('<strong>', '</strong>'), tooltip: 'Bold' },
    { icon: Italic, action: () => insertText('<em>', '</em>'), tooltip: 'Italic' },
    { icon: Underline, action: () => insertText('<u>', '</u>'), tooltip: 'Underline' },
    { separator: true },
    { icon: AlignLeft, action: () => insertText('<div style="text-align: left;">', '</div>'), tooltip: 'Align Left' },
    { icon: AlignCenter, action: () => insertText('<div style="text-align: center;">', '</div>'), tooltip: 'Align Center' },
    { icon: AlignRight, action: () => insertText('<div style="text-align: right;">', '</div>'), tooltip: 'Align Right' },
    { separator: true },
    { icon: List, action: () => insertText('<ul>\n<li>', '</li>\n</ul>'), tooltip: 'Bullet List' },
    { icon: ListOrdered, action: () => insertText('<ol>\n<li>', '</li>\n</ol>'), tooltip: 'Numbered List' },
    { separator: true },
    { icon: Link, action: () => insertText('<a href="">', '</a>'), tooltip: 'Link' },
    { icon: Image, action: () => insertText('<img src="" alt="', '" />'), tooltip: 'Image' },
  ];

  return (
    <div className="border border-gray-300 rounded-lg">
      {/* Toolbar */}
      <div className="flex items-center gap-1 p-2 border-b border-gray-200 bg-gray-50 rounded-t-lg flex-wrap">
        {toolbarButtons.map((button, index) => {
          if (button.separator) {
            return <Separator key={index} orientation="vertical" className="h-6 mx-1" />;
          }
          
          const Icon = button.icon;
          return (
            <Button
              key={index}
              variant="ghost"
              size="sm"
              onClick={button.action}
              className="h-8 w-8 p-0"
              title={button.tooltip}
            >
              <Icon className="w-4 h-4" />
            </Button>
          );
        })}
        
        <Separator orientation="vertical" className="h-6 mx-1" />
        
        <Button
          variant={isHtmlMode ? "default" : "ghost"}
          size="sm"
          onClick={() => setIsHtmlMode(!isHtmlMode)}
          className="h-8 px-2"
        >
          <Code className="w-4 h-4 mr-1" />
          HTML
        </Button>
        
        {isHtmlMode && (
          <Button
            variant={showPreview ? "default" : "ghost"}
            size="sm"
            onClick={() => setShowPreview(!showPreview)}
            className="h-8 px-2"
          >
            {showPreview ? <EyeOff className="w-4 h-4 mr-1" /> : <Eye className="w-4 h-4 mr-1" />}
            {showPreview ? 'แก้ไข' : 'ตัวอย่าง'}
          </Button>
        )}
      </div>

      {/* Editor/Preview Area */}
      <div className="min-h-[300px]">
        {isHtmlMode && showPreview ? (
          <div 
            className="p-4 prose max-w-none"
            dangerouslySetInnerHTML={{ __html: value }}
          />
        ) : (
          <Textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder || "เขียนเนื้อหาที่นี่..."}
            className="border-0 rounded-none rounded-b-lg min-h-[300px] resize-vertical focus-visible:ring-0"
            style={{ fontFamily: isHtmlMode ? 'monospace' : 'inherit' }}
          />
        )}
      </div>
    </div>
  );
};

export default RichTextEditor;
