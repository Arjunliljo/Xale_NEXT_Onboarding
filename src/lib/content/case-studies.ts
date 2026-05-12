import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import { z } from "zod";

const DIR = path.join(process.cwd(), "content", "case-studies");

const CaseStudyFrontmatter = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/),
  title: z.string().max(120),
  description: z.string().min(40).max(220),
  client: z.string(),
  industry: z.string(),
  period: z.string(),
  cover: z.string().optional(),
  publishedAt: z.coerce.date(),
  metrics: z.array(z.object({ value: z.string(), label: z.string() })).min(1),
  quote: z.string().optional(),
  quoteAuthor: z.string().optional(),
  quoteRole: z.string().optional(),
});

export type CaseStudyFrontmatter = z.infer<typeof CaseStudyFrontmatter>;
export type CaseStudy = CaseStudyFrontmatter & { body: string };

let cached: CaseStudy[] | null = null;

async function loadAll(): Promise<CaseStudy[]> {
  if (cached && process.env.NODE_ENV === "production") return cached;

  let entries: string[];
  try {
    entries = await fs.readdir(DIR);
  } catch {
    return [];
  }

  const items: CaseStudy[] = [];
  for (const file of entries.filter((f) => f.endsWith(".mdx"))) {
    const full = path.join(DIR, file);
    const raw = await fs.readFile(full, "utf8");
    const { data, content } = matter(raw);
    const parsed = CaseStudyFrontmatter.safeParse(data);
    if (!parsed.success) {
      throw new Error(`Invalid case-study frontmatter in ${file}: ${parsed.error.message}`);
    }
    items.push({ ...parsed.data, body: content });
  }

  items.sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime());
  cached = items;
  return items;
}

export async function getAllCaseStudies(): Promise<CaseStudy[]> {
  return loadAll();
}

export async function getCaseStudyBySlug(slug: string): Promise<CaseStudy | null> {
  const all = await loadAll();
  return all.find((c) => c.slug === slug) ?? null;
}
