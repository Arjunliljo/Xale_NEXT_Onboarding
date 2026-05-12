import type { Metadata } from "next";
import Link from "next/link";
import { buildMetadata } from "@/src/lib/seo/metadata";

const COMPETITORS = [
  {
    slug: "hubspot",
    name: "HubSpot",
    tagline: "When you need a marketing suite, vs. when you need a CRM that just works.",
  },
  {
    slug: "zoho",
    name: "Zoho CRM",
    tagline: "Zoho's breadth vs. Xale's depth in WhatsApp and lead automation.",
  },
  {
    slug: "pipedrive",
    name: "Pipedrive",
    tagline: "Pipedrive's pipeline vs. Xale's multi-channel capture and industry modules.",
  },
  {
    slug: "salesforce",
    name: "Salesforce",
    tagline: "When you need 12 months of implementation, vs. when you need leads tomorrow.",
  },
  {
    slug: "spreadsheets",
    name: "Spreadsheets",
    tagline: "The honest pros and cons of moving off Google Sheets and Excel.",
  },
];

export const metadata: Metadata = buildMetadata({
  title: "Compare Xale",
  description:
    "Honest, side-by-side comparisons of Xale against HubSpot, Zoho, Pipedrive, Salesforce, and spreadsheets.",
  path: "/compare",
});

export default function ComparePage() {
  return (
    <>
      <section
        className="py-32 max-md:py-20 max-sm:py-12"
        style={{
          background:
            "radial-gradient(120% 100% at 50% 0%, #1a4a37 0%, #051912 60%)",
          color: "#fff",
        }}
      >
        <div className="max-w-[1100px] mx-auto px-6 max-sm:px-4 text-center">
          <p
            className="text-sm uppercase tracking-[0.2em] mb-6"
            style={{ color: "#98cdb8" }}
          >
            Comparisons
          </p>
          <h1
            className="text-5xl max-sm:text-4xl md:text-7xl font-medium leading-[1.05] mb-6"
            style={{ letterSpacing: "-0.035em" }}
          >
            Honest comparisons, not puffery.
          </h1>
          <p
            className="text-lg md:text-xl mx-auto max-w-2xl"
            style={{ color: "rgba(255,255,255,0.7)" }}
          >
            See where Xale beats the rest — and where the rest still wins. No
            cherry-picking.
          </p>
        </div>
      </section>

      <section className="py-24 max-md:py-16 bg-white">
        <div className="max-w-[1100px] mx-auto px-6 max-sm:px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {COMPETITORS.map((c) => (
              <Link
                key={c.slug}
                href={`/compare/${c.slug}`}
                className="group block rounded-2xl p-8 transition-all"
                style={{
                  border: "1px solid var(--color-border-primary,#e6e8e7)",
                  backgroundColor: "#ffffff",
                }}
              >
                <h2
                  className="text-2xl font-medium mb-3 transition-colors group-hover:opacity-80"
                  style={{
                    letterSpacing: "-0.02em",
                    color: "var(--color-text-primary,#1e302a)",
                  }}
                >
                  Xale vs {c.name}
                </h2>
                <p
                  className="text-sm leading-relaxed mb-5"
                  style={{ color: "var(--color-text-gray,#6f6f6f)" }}
                >
                  {c.tagline}
                </p>
                <span
                  className="text-sm font-medium"
                  style={{ color: "var(--color-success,#156548)" }}
                >
                  Compare →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
