import { useState, useCallback } from 'react';
import MDEditor from '@uiw/react-md-editor';
import '@uiw/react-md-editor/markdown-editor.css';
import '@uiw/react-markdown-preview/markdown.css';

const RichTextEditor = ({
  value = '',
  onChange,
  label,
  placeholder = 'Write your content here...',
  height = 400,
  preview = 'live', // 'edit' | 'live' | 'preview'
  className = '',
}) => {
  const [mode, setMode] = useState(preview);

  const handleChange = useCallback((val) => {
    onChange?.(val || '');
  }, [onChange]);

  return (
    <div className={`rich-text-editor ${className}`} data-color-mode="dark">
      {label && <label className="editor-label">{label}</label>}
      
      <div className="editor-toolbar">
        <button
          type="button"
          className={`toolbar-btn ${mode === 'edit' ? 'active' : ''}`}
          onClick={() => setMode('edit')}
        >
          Edit
        </button>
        <button
          type="button"
          className={`toolbar-btn ${mode === 'live' ? 'active' : ''}`}
          onClick={() => setMode('live')}
        >
          Split
        </button>
        <button
          type="button"
          className={`toolbar-btn ${mode === 'preview' ? 'active' : ''}`}
          onClick={() => setMode('preview')}
        >
          Preview
        </button>
      </div>
      
      <MDEditor
        value={value}
        onChange={handleChange}
        height={height}
        preview={mode}
        textareaProps={{
          placeholder: placeholder,
        }}
        visibleDragbar={false}
      />
    </div>
  );
};

export default RichTextEditor;
