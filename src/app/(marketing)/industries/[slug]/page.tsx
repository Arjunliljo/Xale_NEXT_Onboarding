import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { buildMetadata } from "@/src/lib/seo/metadata";
import { getIndustry, getAllIndustries, INDUSTRIES } from "@/src/lib/content/industries";
import IndustryTemplate from "./IndustryTemplate";

type Params = { slug: string };

export async function generateStaticParams() {
  return Object.keys(INDUSTRIES).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const ind = getIndustry(slug);
  if (!ind) return buildMetadata({ title: "Industry not found", path: `/industries/${slug}` });

  return buildMetadata({
    title: `${ind.name} CRM`,
    description: ind.hero.description.slice(0, 180),
    path: `/industries/${ind.slug}`,
  });
}

export default async function IndustryPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const industry = getIndustry(slug);
  if (!industry) notFound();

  return <IndustryTemplate industry={industry} />;
}
