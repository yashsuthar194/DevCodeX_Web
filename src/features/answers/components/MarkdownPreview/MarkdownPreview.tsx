/**
 * MarkdownPreview Component
 * 
 * Read-only markdown renderer for displaying answer content.
 * Uses react-markdown with remark-gfm and syntax highlighting.
 * 
 * OPTIMIZATION: Uses PrismLight with selective language imports
 * to reduce bundle size from ~1.5MB to ~100KB.
 */

import { memo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import clsx from 'clsx';
import './MarkdownPreview.css';

// Import only the languages commonly used in a developer Q&A platform
import javascript from 'react-syntax-highlighter/dist/esm/languages/prism/javascript';
import typescript from 'react-syntax-highlighter/dist/esm/languages/prism/typescript';
import jsx from 'react-syntax-highlighter/dist/esm/languages/prism/jsx';
import tsx from 'react-syntax-highlighter/dist/esm/languages/prism/tsx';
import python from 'react-syntax-highlighter/dist/esm/languages/prism/python';
import java from 'react-syntax-highlighter/dist/esm/languages/prism/java';
import csharp from 'react-syntax-highlighter/dist/esm/languages/prism/csharp';
import cpp from 'react-syntax-highlighter/dist/esm/languages/prism/cpp';
import go from 'react-syntax-highlighter/dist/esm/languages/prism/go';
import rust from 'react-syntax-highlighter/dist/esm/languages/prism/rust';
import css from 'react-syntax-highlighter/dist/esm/languages/prism/css';
import sql from 'react-syntax-highlighter/dist/esm/languages/prism/sql';
import json from 'react-syntax-highlighter/dist/esm/languages/prism/json';
import bash from 'react-syntax-highlighter/dist/esm/languages/prism/bash';
import yaml from 'react-syntax-highlighter/dist/esm/languages/prism/yaml';
import markdown from 'react-syntax-highlighter/dist/esm/languages/prism/markdown';
import docker from 'react-syntax-highlighter/dist/esm/languages/prism/docker';

// Register languages with their common aliases
SyntaxHighlighter.registerLanguage('javascript', javascript);
SyntaxHighlighter.registerLanguage('js', javascript);
SyntaxHighlighter.registerLanguage('typescript', typescript);
SyntaxHighlighter.registerLanguage('ts', typescript);
SyntaxHighlighter.registerLanguage('jsx', jsx);
SyntaxHighlighter.registerLanguage('tsx', tsx);
SyntaxHighlighter.registerLanguage('python', python);
SyntaxHighlighter.registerLanguage('py', python);
SyntaxHighlighter.registerLanguage('java', java);
SyntaxHighlighter.registerLanguage('csharp', csharp);
SyntaxHighlighter.registerLanguage('cs', csharp);
SyntaxHighlighter.registerLanguage('cpp', cpp);
SyntaxHighlighter.registerLanguage('c++', cpp);
SyntaxHighlighter.registerLanguage('go', go);
SyntaxHighlighter.registerLanguage('rust', rust);
SyntaxHighlighter.registerLanguage('rs', rust);
SyntaxHighlighter.registerLanguage('css', css);
SyntaxHighlighter.registerLanguage('sql', sql);
SyntaxHighlighter.registerLanguage('json', json);
SyntaxHighlighter.registerLanguage('bash', bash);
SyntaxHighlighter.registerLanguage('shell', bash);
SyntaxHighlighter.registerLanguage('sh', bash);
SyntaxHighlighter.registerLanguage('yaml', yaml);
SyntaxHighlighter.registerLanguage('yml', yaml);
SyntaxHighlighter.registerLanguage('markdown', markdown);
SyntaxHighlighter.registerLanguage('md', markdown);
SyntaxHighlighter.registerLanguage('docker', docker);
SyntaxHighlighter.registerLanguage('dockerfile', docker);

export interface MarkdownPreviewProps {
  /** Markdown content to render */
  content: string;
  /** Additional CSS class */
  className?: string;
}

/**
 * Read-only markdown preview component.
 * Memoized to prevent re-renders when content hasn't changed.
 * 
 * @example
 * ```tsx
 * <MarkdownPreview content="# Hello\n**Bold** text" />
 * ```
 */
export const MarkdownPreview = memo(function MarkdownPreview({ 
  content, 
  className 
}: MarkdownPreviewProps) {
  // Detect theme for syntax highlighting
  const isDark = typeof document !== 'undefined' && 
    document.documentElement.getAttribute('data-theme') === 'dark';

  return (
    <div className={clsx('markdown-preview', className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // Custom code block renderer with syntax highlighting
          code({ className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '');
            const isInline = !match;
            
            if (isInline) {
              return (
                <code className="markdown-preview__inline-code" {...props}>
                  {children}
                </code>
              );
            }
            
            return (
              <SyntaxHighlighter
                style={isDark ? oneDark : oneLight}
                language={match[1]}
                PreTag="div"
                className="markdown-preview__code-block"
              >
                {String(children).replace(/\n$/, '')}
              </SyntaxHighlighter>
            );
          },
          // Custom link renderer for external links
          a({ href, children, ...props }) {
            const isExternal = href?.startsWith('http');
            return (
              <a
                href={href}
                target={isExternal ? '_blank' : undefined}
                rel={isExternal ? 'noopener noreferrer' : undefined}
                {...props}
              >
                {children}
              </a>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
});

