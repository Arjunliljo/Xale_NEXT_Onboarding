import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";

import { buildMetadata } from "@/src/lib/seo/metadata";
import { getAllPostSlugs, getPostBySlug } from "@/src/lib/content/posts";
import { mdxComponents } from "@/src/components/marketing/mdx/MDXComponents";
import JsonLd from "@/src/components/marketing/seo/JsonLd";
import {
  blogPostingSchema,
  breadcrumbSchema,
} from "@/src/lib/seo/schemas";

type Params = { slug: string };

export async function generateStaticParams() {
  const slugs = await getAllPostSlugs();
  return slugs.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return buildMetadata({ title: "Post not found", path: `/blog/${slug}` });

  return buildMetadata({
    title: post.title,
    description: post.description,
    path: `/blog/${post.slug}`,
    type: "article",
    publishedTime: post.publishedAt,
    modifiedTime: post.updatedAt,
    authors: [post.author],
    tags: post.tags,
  });
}

function formatDate(d: Date): string {
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const schemas = [
    blogPostingSchema({
      title: post.title,
      description: post.description,
      slug: post.slug,
      publishedAt: post.publishedAt,
      updatedAt: post.updatedAt,
      author: { name: post.author },
      cover: post.cover,
      tags: post.tags,
    }),
    breadcrumbSchema([
      { name: "Blog", path: "/blog" },
      { name: post.title, path: `/blog/${post.slug}` },
    ]),
  ];

  return (
    <article className="max-w-[760px] mx-auto px-6 pt-20 pb-32">
      <JsonLd data={schemas} />

      <nav className="mb-10 text-sm">
        <Link
          href="/blog"
          className="hover:underline"
          style={{ color: "var(--color-text-gray,#6f6f6f)" }}
        >
          ← Back to blog
        </Link>
      </nav>

      <header className="mb-12">
        <div
          className="flex items-center gap-3 text-xs uppercase tracking-wider mb-5"
          style={{ color: "var(--color-text-gray,#6f6f6f)" }}
        >
          <span>{post.category}</span>
          <span>·</span>
          <span>{post.readingTimeMinutes} min read</span>
        </div>
        <h1
          className="text-4xl md:text-5xl font-medium tracking-tight mb-6"
          style={{ letterSpacing: "-0.03em", color: "var(--color-text-primary,#1e302a)" }}
        >
          {post.title}
        </h1>
        <p
          className="text-xl leading-relaxed mb-6"
          style={{ color: "var(--color-text-gray,#6f6f6f)" }}
        >
          {post.description}
        </p>
        <div
          className="flex items-center gap-3 text-sm"
          style={{ color: "var(--color-text-gray,#6f6f6f)" }}
        >
          <span>{post.author}</span>
          <span>·</span>
          <time dateTime={post.publishedAt.toISOString()}>
            {formatDate(post.publishedAt)}
          </time>
        </div>
      </header>

      <div className="prose prose-lg max-w-none">
        <MDXRemote
          source={post.body}
          components={mdxComponents}
          options={{
            mdxOptions: {
              remarkPlugins: [remarkGfm],
              rehypePlugins: [
                rehypeSlug,
                [rehypeAutolinkHeadings, { behavior: "wrap" }],
              ],
            },
          }}
        />
      </div>

      <footer
        className="mt-20 pt-10 border-t flex flex-wrap gap-2"
        style={{ borderColor: "var(--color-border-primary,#e6e8e7)" }}
      >
        {post.tags.map((t) => (
          <span
            key={t}
            className="text-xs px-3 py-1 rounded-full"
            style={{
              backgroundColor: "var(--color-bg-secondary,#eef3f1)",
              color: "var(--color-text-secondary,#505e59)",
            }}
          >
            #{t}
          </span>
        ))}
      </footer>
    </article>
  );
}
