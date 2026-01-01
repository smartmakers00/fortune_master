
import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface MarkdownViewProps {
  content: string;
  theme?: 'amber' | 'indigo' | 'emerald' | 'rose' | 'orange' | 'cyan';
}

const MarkdownView: React.FC<MarkdownViewProps> = ({ content, theme = 'amber' }) => {
  const themeClasses = {
    amber: 'prose-amber',
    indigo: 'prose-indigo',
    emerald: 'prose-emerald',
    rose: 'prose-rose',
    orange: 'prose-orange',
    cyan: 'prose-cyan',
  };

  return (
    <div className={`prose prose-invert max-w-none ${themeClasses[theme]} prose-headings:font-serif prose-h1:text-amber-500 prose-h2:text-amber-400 prose-h3:text-amber-300 prose-p:text-stone-300 prose-li:text-stone-300`}>
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownView;
