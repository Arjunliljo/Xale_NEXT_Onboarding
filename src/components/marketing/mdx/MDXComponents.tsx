import type { MDXComponents } from "mdx/types";
import Link from "next/link";

export const mdxComponents: MDXComponents = {
  h1: (props) => (
    <h1
      className="text-4xl md:text-5xl font-medium tracking-tight mt-16 mb-6"
      style={{ letterSpacing: "-0.03em", color: "var(--color-text-primary,#1e302a)" }}
      {...props}
    />
  ),
  h2: (props) => (
    <h2
      className="text-3xl font-medium tracking-tight mt-14 mb-4"
      style={{ letterSpacing: "-0.02em", color: "var(--color-text-primary,#1e302a)" }}
      {...props}
    />
  ),
  h3: (props) => (
    <h3
      className="text-2xl font-medium mt-10 mb-3"
      style={{ color: "var(--color-text-primary,#1e302a)" }}
      {...props}
    />
  ),
  p: (props) => (
    <p
      className="text-lg leading-relaxed mb-6"
      style={{ color: "var(--color-text-secondary,#505e59)" }}
      {...props}
    />
  ),
  a: ({ href = "", ...rest }) => {
    const isExternal = /^https?:\/\//.test(href);
    if (isExternal) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="underline decoration-1 underline-offset-4 hover:opacity-80"
          style={{ color: "var(--color-success,#156548)" }}
          {...rest}
        />
      );
    }
    return (
      <Link
        href={href}
        className="underline decoration-1 underline-offset-4 hover:opacity-80"
        style={{ color: "var(--color-success,#156548)" }}
        {...rest}
      />
    );
  },
  ul: (props) => (
    <ul
      className="list-disc pl-6 mb-6 space-y-2 text-lg leading-relaxed"
      style={{ color: "var(--color-text-secondary,#505e59)" }}
      {...props}
    />
  ),
  ol: (props) => (
    <ol
      className="list-decimal pl-6 mb-6 space-y-2 text-lg leading-relaxed"
      style={{ color: "var(--color-text-secondary,#505e59)" }}
      {...props}
    />
  ),
  li: (props) => <li {...props} />,
  blockquote: (props) => (
    <blockquote
      className="border-l-4 pl-6 my-8 italic text-lg"
      style={{
        borderColor: "var(--color-success,#156548)",
        color: "var(--color-text-secondary,#505e59)",
      }}
      {...props}
    />
  ),
  code: (props) => (
    <code
      className="px-1.5 py-0.5 rounded text-sm"
      style={{
        backgroundColor: "var(--color-bg-secondary,#eef3f1)",
        color: "var(--color-text-primary,#1e302a)",
        fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, monospace",
      }}
      {...props}
    />
  ),
  pre: (props) => (
    <pre
      className="rounded-xl p-5 my-6 overflow-x-auto text-sm"
      style={{ backgroundColor: "#051912", color: "#e6e8e7" }}
      {...props}
    />
  ),
  hr: () => (
    <hr
      className="my-12"
      style={{ borderColor: "var(--color-border-primary,#e6e8e7)" }}
    />
  ),
  strong: (props) => (
    <strong style={{ color: "var(--color-text-primary,#1e302a)", fontWeight: 500 }} {...props} />
  ),
};
