import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";

import { buildMetadata } from "@/src/lib/seo/metadata";
import {
  getAllCaseStudies,
  getCaseStudyBySlug,
} from "@/src/lib/content/case-studies";
import { mdxComponents } from "@/src/components/marketing/mdx/MDXComponents";
import JsonLd from "@/src/components/marketing/seo/JsonLd";
import { breadcrumbSchema, blogPostingSchema } from "@/src/lib/seo/schemas";

type Params = { slug: string };

export async function generateStaticParams() {
  const all = await getAllCaseStudies();
  return all.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const c = await getCaseStudyBySlug(slug);
  if (!c) return buildMetadata({ title: "Case study not found", path: `/case-studies/${slug}` });
  return buildMetadata({
    title: c.title,
    description: c.description,
    path: `/case-studies/${c.slug}`,
    type: "article",
    publishedTime: c.publishedAt,
  });
}

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const c = await getCaseStudyBySlug(slug);
  if (!c) notFound();

  const schemas = [
    blogPostingSchema({
      title: c.title,
      description: c.description,
      slug: c.slug,
      publishedAt: c.publishedAt,
      author: { name: c.client },
      tags: [c.industry],
    }),
    breadcrumbSchema([
      { name: "Case studies", path: "/case-studies" },
      { name: c.client, path: `/case-studies/${c.slug}` },
    ]),
  ];

  return (
    <>
      <JsonLd data={schemas} />

      {/* Hero */}
      <section
        className="py-24"
        style={{
          background:
            "radial-gradient(120% 100% at 50% 0%, #1a4a37 0%, #051912 60%)",
          color: "#fff",
        }}
      >
        <div className="max-w-[1000px] mx-auto px-6">
          <nav className="mb-10 text-sm">
            <Link
              href="/case-studies"
              className="hover:underline"
              style={{ color: "rgba(255,255,255,0.55)" }}
            >
              ← All case studies
            </Link>
          </nav>
          <p
            className="text-sm uppercase tracking-[0.15em] mb-5"
            style={{ color: "#98cdb8" }}
          >
            {c.industry} · {c.client} · {c.period}
          </p>
          <h1
            className="text-4xl md:text-6xl font-medium leading-[1.05] mb-6"
            style={{ letterSpacing: "-0.03em" }}
          >
            {c.title}
          </h1>
          <p
            className="text-xl leading-relaxed"
            style={{ color: "rgba(255,255,255,0.7)" }}
          >
            {c.description}
          </p>
        </div>
      </section>

      {/* Metrics */}
      <section className="py-16 bg-white">
        <div className="max-w-[1000px] mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {c.metrics.map((m, i) => (
              <div
                key={i}
                className="text-center rounded-2xl p-8"
                style={{
                  backgroundColor: "var(--color-bg-secondary,#eef3f1)",
                  border: "1px solid var(--color-border-primary,#e6e8e7)",
                }}
              >
                <div
                  className="text-5xl md:text-6xl font-medium mb-3"
                  style={{
                    letterSpacing: "-0.03em",
                    color: "var(--color-success,#156548)",
                    fontWeight: 200,
                  }}
                >
                  {m.value}
                </div>
                <p
                  className="text-sm"
                  style={{ color: "var(--color-text-gray,#6f6f6f)" }}
                >
                  {m.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MDX body */}
      <article className="max-w-[760px] mx-auto px-6 pb-24">
        <div className="prose prose-lg max-w-none">
          <MDXRemote
            source={c.body}
            components={mdxComponents}
            options={{
              mdxOptions: {
                remarkPlugins: [remarkGfm],
                rehypePlugins: [rehypeSlug],
              },
            }}
          />
        </div>

        {c.quote && (
          <figure
            className="mt-16 p-10 rounded-3xl text-center"
            style={{
              backgroundColor: "var(--color-bg-secondary,#eef3f1)",
              border: "1px solid var(--color-border-primary,#e6e8e7)",
            }}
          >
            <blockquote
              className="text-2xl md:text-3xl font-medium leading-[1.3] mb-6"
              style={{
                letterSpacing: "-0.015em",
                color: "var(--color-text-primary,#1e302a)",
              }}
            >
              "{c.quote}"
            </blockquote>
            {c.quoteAuthor && (
              <figcaption
                className="text-sm"
                style={{ color: "var(--color-text-gray,#6f6f6f)" }}
              >
                <strong style={{ color: "var(--color-text-primary,#1e302a)" }}>
                  {c.quoteAuthor}
                </strong>
                {c.quoteRole && <> · {c.quoteRole}</>}
              </figcaption>
            )}
          </figure>
        )}
      </article>

      {/* CTA */}
      <section
        className="py-24"
        style={{
          background:
            "radial-gradient(120% 100% at 50% 100%, #1a4a37 0%, #051912 60%)",
          color: "#fff",
        }}
      >
        <div className="max-w-[800px] mx-auto px-6 text-center">
          <h2
            className="text-3xl md:text-4xl font-medium mb-4"
            style={{ letterSpacing: "-0.02em" }}
          >
            See how Xale can do this for you.
          </h2>
          <p
            className="text-lg mb-10"
            style={{ color: "rgba(255,255,255,0.7)" }}
          >
            Free to start. 10-minute setup. No credit card.
          </p>
          <Link
            href="/signup"
            className="inline-flex items-center justify-center px-6 py-3.5 rounded-full text-base font-medium"
            style={{ backgroundColor: "#319b72", color: "#051912" }}
          >
            Start free →
          </Link>
        </div>
      </section>
    </>
  );
}
