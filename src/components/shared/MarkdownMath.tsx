import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import remarkGfm from "remark-gfm";
import rehypeKatex from "rehype-katex";

interface Props {
  source: string;
  className?: string;
}

// Renders Markdown with LaTeX ($...$ inline, $$...$$ block) using KaTeX.
export const MarkdownMath = ({ source, className }: Props) => (
  <div
    className={
      "prose prose-sm dark:prose-invert max-w-none " +
      "prose-headings:font-display prose-headings:font-semibold " +
      "prose-p:text-muted-foreground prose-li:text-muted-foreground " +
      "prose-strong:text-foreground prose-code:text-foreground " +
      "prose-pre:bg-muted prose-pre:text-foreground prose-pre:rounded-md " +
      (className ?? "")
    }
  >
    <ReactMarkdown
      remarkPlugins={[remarkGfm, remarkMath]}
      rehypePlugins={[rehypeKatex]}
    >
      {source}
    </ReactMarkdown>
  </div>
);