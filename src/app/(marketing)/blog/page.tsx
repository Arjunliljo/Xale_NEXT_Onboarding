import type { Metadata } from "next";
import Link from "next/link";
import { buildMetadata } from "@/src/lib/seo/metadata";
import { getAllPosts } from "@/src/lib/content/posts";

export const metadata: Metadata = buildMetadata({
  title: "Blog",
  description: "Product updates, engineering deep-dives, and sales playbooks from the Xale team.",
  path: "/blog",
});

function formatDate(d: Date): string {
  return d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

export default async function BlogIndexPage() {
  const posts = await getAllPosts();

  return (
    <div className="max-w-[1100px] mx-auto px-6 pt-24 pb-32">
      <header className="mb-16">
        <h1 className="text-5xl md:text-6xl font-medium tracking-tight" style={{ letterSpacing: "-0.03em", color: "var(--color-text-primary,#1e302a)" }}>
          The Xale blog
        </h1>
        <p className="mt-4 text-lg" style={{ color: "var(--color-text-gray,#6f6f6f)" }}>
          Product, engineering, and sales playbooks for teams running a CRM at scale.
        </p>
      </header>

      {posts.length === 0 ? (
        <p style={{ color: "var(--color-text-gray,#6f6f6f)" }}>No posts yet — check back soon.</p>
      ) : (
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {posts.map((post) => (
            <li key={post.slug}>
              <Link href={`/blog/${post.slug}`} className="group block">
                <div
                  className="aspect-[16/9] rounded-2xl mb-5 overflow-hidden"
                  style={{
                    background:
                      "radial-gradient(120% 120% at 30% 20%, #319b72 0%, #156548 60%, #102f23 100%)",
                  }}
                />
                <div className="flex items-center gap-3 text-xs uppercase tracking-wider mb-3" style={{ color: "var(--color-text-gray,#6f6f6f)" }}>
                  <span>{post.category}</span>
                  <span>·</span>
                  <span>{post.readingTimeMinutes} min read</span>
                </div>
                <h2 className="text-2xl font-medium mb-3 transition-colors group-hover:opacity-80" style={{ color: "var(--color-text-primary,#1e302a)", letterSpacing: "-0.02em" }}>
                  {post.title}
                </h2>
                <p className="text-base leading-relaxed mb-4" style={{ color: "var(--color-text-gray,#6f6f6f)" }}>
                  {post.description}
                </p>
                <p className="text-sm" style={{ color: "var(--color-text-gray,#6f6f6f)" }}>
                  {formatDate(post.publishedAt)}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
