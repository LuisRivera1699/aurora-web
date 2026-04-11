import ReactMarkdown from "react-markdown";
import rehypeSanitize from "rehype-sanitize";
import remarkGfm from "remark-gfm";

type BlogMarkdownProps = {
  markdown: string;
};

export function BlogMarkdown({ markdown }: BlogMarkdownProps) {
  return (
    <div className="blog-md text-foreground">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeSanitize]}
        components={{
          h1: ({ children }) => (
            <h2 className="mt-10 font-display text-2xl font-semibold tracking-tight text-foreground first:mt-0 sm:text-3xl">
              {children}
            </h2>
          ),
          h2: ({ children }) => (
            <h3 className="mt-8 font-display text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
              {children}
            </h3>
          ),
          h3: ({ children }) => (
            <h4 className="mt-6 text-lg font-semibold text-foreground">{children}</h4>
          ),
          p: ({ children }) => (
            <p className="mt-4 text-base leading-relaxed text-foreground-muted first:mt-0">{children}</p>
          ),
          a: ({ children, href }) => (
            <a
              href={href}
              className="font-medium text-aurora-blue underline decoration-white/15 underline-offset-2 transition-colors hover:text-foreground hover:decoration-aurora-purple/60"
              target={href?.startsWith("http") ? "_blank" : undefined}
              rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
            >
              {children}
            </a>
          ),
          ul: ({ children }) => (
            <ul className="mt-4 list-disc space-y-2 pl-6 text-foreground-muted">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="mt-4 list-decimal space-y-2 pl-6 text-foreground-muted">{children}</ol>
          ),
          li: ({ children }) => <li className="leading-relaxed">{children}</li>,
          strong: ({ children }) => <strong className="font-semibold text-foreground">{children}</strong>,
          code: ({ className, children }) => {
            const isBlock = className?.includes("language-");
            if (isBlock) {
              return (
                <code className="block overflow-x-auto rounded-lg border border-white/10 bg-surface-850/80 p-4 text-sm text-foreground">
                  {children}
                </code>
              );
            }
            return (
              <code className="rounded border border-white/10 bg-surface-850 px-1.5 py-0.5 text-[0.9em] text-foreground">
                {children}
              </code>
            );
          },
          pre: ({ children }) => (
            <pre className="mt-4 overflow-x-auto rounded-xl border border-white/10 bg-surface-850/90 p-4 text-sm">{children}</pre>
          ),
          blockquote: ({ children }) => (
            <blockquote className="mt-4 border-l-2 border-aurora-purple/50 pl-4 text-foreground-muted italic">
              {children}
            </blockquote>
          ),
          hr: () => <hr className="my-10 border-white/10" />,
          table: ({ children }) => (
            <div className="my-6 overflow-x-auto rounded-lg border border-white/10">
              <table className="w-full min-w-[20rem] text-left text-sm text-foreground-muted">{children}</table>
            </div>
          ),
          thead: ({ children }) => <thead className="bg-white/[0.04] text-foreground">{children}</thead>,
          th: ({ children }) => (
            <th className="border-b border-white/10 px-3 py-2 font-semibold">{children}</th>
          ),
          td: ({ children }) => <td className="border-b border-white/5 px-3 py-2">{children}</td>,
        }}
      >
        {markdown}
      </ReactMarkdown>
    </div>
  );
}
