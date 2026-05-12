import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import readingTime from "reading-time";
import { z } from "zod";

const POSTS_DIR = path.join(process.cwd(), "content", "posts");

const PostFrontmatter = z.object({
  title: z.string().max(80),
  slug: z.string().regex(/^[a-z0-9-]+$/),
  description: z.string().min(40).max(220),
  publishedAt: z.coerce.date(),
  updatedAt: z.coerce.date().optional(),
  author: z.string(),
  cover: z.string().optional(),
  coverAlt: z.string().optional(),
  tags: z.array(z.string()).min(1).max(8),
  category: z.enum(["product", "engineering", "industry", "customer-story"]),
  featured: z.boolean().default(false),
  draft: z.boolean().default(false),
});

export type PostFrontmatter = z.infer<typeof PostFrontmatter>;

export type Post = PostFrontmatter & {
  body: string;
  readingTimeMinutes: number;
};

let cachedPosts: Post[] | null = null;

async function loadAllPostFiles(): Promise<Post[]> {
  if (cachedPosts && process.env.NODE_ENV === "production") return cachedPosts;

  let entries: string[];
  try {
    entries = await fs.readdir(POSTS_DIR);
  } catch {
    return [];
  }

  const mdxFiles = entries.filter((name) => name.endsWith(".mdx"));

  const posts: Post[] = [];
  for (const file of mdxFiles) {
    const fullPath = path.join(POSTS_DIR, file);
    const raw = await fs.readFile(fullPath, "utf8");
    const { data, content } = matter(raw);
    const parsed = PostFrontmatter.safeParse(data);
    if (!parsed.success) {
      throw new Error(
        `Invalid frontmatter in ${file}: ${parsed.error.message}`
      );
    }
    const fm = parsed.data;
    if (fm.draft && process.env.NODE_ENV === "production") continue;

    posts.push({
      ...fm,
      body: content,
      readingTimeMinutes: Math.max(1, Math.round(readingTime(content).minutes)),
    });
  }

  posts.sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime());
  cachedPosts = posts;
  return posts;
}

export async function getAllPosts(): Promise<Post[]> {
  return loadAllPostFiles();
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const all = await loadAllPostFiles();
  return all.find((p) => p.slug === slug) ?? null;
}

export async function getAllPostSlugs(): Promise<
  { slug: string; publishedAt: Date; updatedAt?: Date }[]
> {
  const all = await loadAllPostFiles();
  return all.map((p) => ({
    slug: p.slug,
    publishedAt: p.publishedAt,
    updatedAt: p.updatedAt,
  }));
}
