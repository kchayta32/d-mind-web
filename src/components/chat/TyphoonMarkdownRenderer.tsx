import React, { useMemo } from 'react';
import { marked } from 'marked';

export interface TyphoonMarkdownRendererProps {
  content: string;
  className?: string;
  onSelectRoadByName?: (roadName: string) => void;
}

/**
 * Configure marked options for GitHub Flavored Markdown (GFM)
 * and responsive line breaks.
 */
marked.setOptions({
  gfm: true,
  breaks: true,
});

/**
 * Sanitize HTML output to prevent script execution or unwanted injections
 */
const sanitizeHtml = (html: string): string => {
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '')
    .replace(/javascript:/gi, '');
};

export const TyphoonMarkdownRenderer: React.FC<TyphoonMarkdownRendererProps> = ({
  content,
  className = '',
  onSelectRoadByName
}) => {
  const parsedHtml = useMemo(() => {
    if (!content) return '';
    try {
      const rawHtml = marked.parse(content) as string;
      return sanitizeHtml(rawHtml);
    } catch (err) {
      console.error('Failed to parse markdown:', err);
      return content;
    }
  }, [content]);

  return (
    <div
      className={`typhoon-markdown-content text-xs sm:text-sm leading-relaxed space-y-2 select-text ${className}
        /* Headers */
        [&_h1]:text-base [&_h1]:sm:text-lg [&_h1]:font-black [&_h1]:text-slate-900 [&_h1]:dark:text-white [&_h1]:mt-3 [&_h1]:mb-2 [&_h1]:pb-1.5 [&_h1]:border-b [&_h1]:border-slate-200 [&_h1]:dark:border-slate-800 [&_h1]:tracking-tight
        [&_h2]:text-sm [&_h2]:sm:text-base [&_h2]:font-extrabold [&_h2]:text-blue-700 [&_h2]:dark:text-cyan-300 [&_h2]:mt-2.5 [&_h2]:mb-1.5 [&_h2]:flex [&_h2]:items-center [&_h2]:gap-1.5
        [&_h3]:text-xs [&_h3]:sm:text-sm [&_h3]:font-bold [&_h3]:text-indigo-700 [&_h3]:dark:text-sky-300 [&_h3]:mt-2 [&_h3]:mb-1
        [&_h4]:text-xs [&_h4]:font-bold [&_h4]:text-slate-700 [&_h4]:dark:text-slate-300 [&_h4]:mt-1.5 [&_h4]:mb-0.5
        
        /* Paragraphs */
        [&_p]:text-slate-800 [&_p]:dark:text-slate-200 [&_p]:leading-relaxed [&_p]:mb-2
        
        /* Bold / Emphasis */
        [&_strong]:font-black [&_strong]:text-slate-900 [&_strong]:dark:text-cyan-200 [&_strong]:bg-blue-500/10 [&_strong]:dark:bg-cyan-500/15 [&_strong]:px-1 [&_strong]:py-0.2 [&_strong]:rounded-md
        [&_em]:italic [&_em]:text-slate-600 [&_em]:dark:text-slate-300
        
        /* Lists */
        [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1 [&_ul]:my-2
        [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:space-y-1 [&_ol]:my-2
        [&_li]:text-slate-800 [&_li]:dark:text-slate-200 [&_li]:leading-relaxed
        [&_li_strong]:text-slate-900 [&_li_strong]:dark:text-cyan-200
        
        /* Blockquotes / Callout boxes */
        [&_blockquote]:border-l-4 [&_blockquote]:border-amber-500 [&_blockquote]:bg-amber-50/80 [&_blockquote]:dark:bg-amber-950/40 [&_blockquote]:p-2.5 [&_blockquote]:rounded-r-xl [&_blockquote]:my-2 [&_blockquote]:text-amber-900 [&_blockquote]:dark:text-amber-200 [&_blockquote]:text-xs [&_blockquote]:shadow-2xs
        [&_blockquote_p]:mb-0 [&_blockquote_p]:text-amber-900 [&_blockquote_p]:dark:text-amber-200
        
        /* Tables */
        [&_table]:w-full [&_table]:my-2.5 [&_table]:border-collapse [&_table]:rounded-xl [&_table]:overflow-hidden [&_table]:border [&_table]:border-slate-200 [&_table]:dark:border-slate-800 [&_table]:shadow-2xs
        [&_thead]:bg-slate-100 [&_thead]:dark:bg-slate-800/90
        [&_th]:px-3 [&_th]:py-1.5 [&_th]:text-[11px] [&_th]:sm:text-xs [&_th]:font-bold [&_th]:text-slate-900 [&_th]:dark:text-slate-100 [&_th]:border-b [&_th]:border-slate-200 [&_th]:dark:border-slate-700 [&_th]:text-left
        [&_td]:px-3 [&_td]:py-1.5 [&_td]:text-[11px] [&_td]:sm:text-xs [&_td]:border-b [&_td]:border-slate-100 [&_td]:dark:border-slate-800/70 [&_td]:text-slate-700 [&_td]:dark:text-slate-300
        [&_tr:last-child_td]:border-b-0
        [&_tr:hover_td]:bg-slate-50/60 [&_tr:hover_td]:dark:bg-slate-800/40
        
        /* Code */
        [&_code]:font-mono [&_code]:text-[11px] [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded-md [&_code]:bg-slate-100 [&_code]:dark:bg-slate-800 [&_code]:text-pink-600 [&_code]:dark:text-pink-400 [&_code]:border [&_code]:border-slate-200 [&_code]:dark:border-slate-700/80
        [&_pre]:my-2 [&_pre]:p-3 [&_pre]:rounded-xl [&_pre]:bg-slate-950 [&_pre]:text-slate-100 [&_pre]:overflow-x-auto [&_pre]:border [&_pre]:border-slate-800
        [&_pre_code]:bg-transparent [&_pre_code]:border-0 [&_pre_code]:p-0 [&_pre_code]:text-slate-200
        
        /* Links */
        [&_a]:text-blue-600 [&_a]:dark:text-cyan-400 [&_a]:underline [&_a]:underline-offset-2 [&_a]:font-semibold [&_a]:hover:text-blue-800 [&_a]:dark:hover:text-cyan-300
        
        /* Horizontal Rule */
        [&_hr]:my-3 [&_hr]:border-slate-200 [&_hr]:dark:border-slate-800
      `}
      dangerouslySetInnerHTML={{ __html: parsedHtml }}
    />
  );
};

export default TyphoonMarkdownRenderer;
