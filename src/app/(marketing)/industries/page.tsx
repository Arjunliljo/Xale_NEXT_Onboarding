import type { Metadata } from "next";
import Link from "next/link";
import { buildMetadata } from "@/src/lib/seo/metadata";
import { getAllIndustries } from "@/src/lib/content/industries";
import IndustriesHero from "./IndustriesHero";

export const metadata: Metadata = buildMetadata({
  title: "Industries",
  description:
    "Xale ships with industry-specific modules, fields, and workflows for Study Abroad, Video Production, Academy, Travel, Real Estate, and Healthcare.",
  path: "/industries",
});

export default function IndustriesIndexPage() {
  const industries = getAllIndustries();

  return (
    <>
      <IndustriesHero />

      <section className="py-24 bg-white">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {industries.map((ind) => (
              <Link
                key={ind.slug}
                href={`/industries/${ind.slug}`}
                className="group block rounded-3xl p-8 transition-all"
                style={{
                  border: "1px solid var(--color-border-primary,#e6e8e7)",
                  backgroundColor: "#ffffff",
                }}
              >
                <div
                  className="w-20 h-20 rounded-2xl mb-6"
                  style={{ background: ind.gradient }}
                />
                <p
                  className="text-xs uppercase tracking-[0.15em] mb-2"
                  style={{ color: "var(--color-text-gray,#6f6f6f)" }}
                >
                  {ind.hero.eyebrow}
                </p>
                <h2
                  className="text-2xl md:text-3xl font-medium mb-3 transition-colors group-hover:opacity-80"
                  style={{
                    letterSpacing: "-0.02em",
                    color: "var(--color-text-primary,#1e302a)",
                  }}
                >
                  {ind.name}
                </h2>
                <p
                  className="text-base leading-relaxed mb-6"
                  style={{ color: "var(--color-text-gray,#6f6f6f)" }}
                >
                  {ind.hero.description}
                </p>
                <span
                  className="text-sm font-medium inline-flex items-center gap-1"
                  style={{ color: "var(--color-success,#156548)" }}
                >
                  View industry →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
