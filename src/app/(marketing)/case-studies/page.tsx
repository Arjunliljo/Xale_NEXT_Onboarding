import type { Metadata } from "next";
import Link from "next/link";
import { buildMetadata } from "@/src/lib/seo/metadata";
import { getAllCaseStudies } from "@/src/lib/content/case-studies";

export const metadata: Metadata = buildMetadata({
  title: "Case studies",
  description:
    "Real teams. Real numbers. See how teams across study abroad, video production, and travel are converting more leads with Xale.",
  path: "/case-studies",
});

export default async function CaseStudiesPage() {
  const cases = await getAllCaseStudies();

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
            Case studies
          </p>
          <h1
            className="text-5xl max-sm:text-4xl md:text-7xl font-medium leading-[1.05] mb-6"
            style={{ letterSpacing: "-0.035em" }}
          >
            Real teams. Real numbers.
          </h1>
          <p
            className="text-lg md:text-xl mx-auto max-w-2xl"
            style={{ color: "rgba(255,255,255,0.7)" }}
          >
            How teams across study abroad, video production, and travel are
            converting more leads — and what they wish they'd known earlier.
          </p>
        </div>
      </section>

      <section className="py-24 max-md:py-16 bg-white">
        <div className="max-w-[1200px] mx-auto px-6 max-sm:px-4">
          {cases.length === 0 ? (
            <p
              className="text-center"
              style={{ color: "var(--color-text-gray,#6f6f6f)" }}
            >
              Case studies coming soon.
            </p>
          ) : (
            <div className="space-y-6">
              {cases.map((c) => (
                <Link
                  key={c.slug}
                  href={`/case-studies/${c.slug}`}
                  className="group block rounded-3xl p-8 md:p-10 max-sm:p-5 transition-all"
                  style={{
                    border: "1px solid var(--color-border-primary,#e6e8e7)",
                    backgroundColor: "#ffffff",
                  }}
                >
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                    <div className="lg:col-span-7">
                      <p
                        className="text-xs uppercase tracking-[0.15em] mb-3"
                        style={{ color: "var(--color-success,#156548)" }}
                      >
                        {c.industry} · {c.client}
                      </p>
                      <h2
                        className="text-2xl md:text-3xl font-medium mb-3 transition-colors group-hover:opacity-80"
                        style={{
                          letterSpacing: "-0.02em",
                          color: "var(--color-text-primary,#1e302a)",
                        }}
                      >
                        {c.title}
                      </h2>
                      <p
                        className="text-base leading-relaxed mb-6"
                        style={{ color: "var(--color-text-gray,#6f6f6f)" }}
                      >
                        {c.description}
                      </p>
                      <span
                        className="text-sm font-medium inline-flex items-center gap-1"
                        style={{ color: "var(--color-success,#156548)" }}
                      >
                        Read the case study →
                      </span>
                    </div>
                    <div className="lg:col-span-5">
                      <div className="grid grid-cols-3 gap-4">
                        {c.metrics.slice(0, 3).map((m, j) => (
                          <div key={j}>
                            <div
                              className="text-2xl md:text-3xl font-medium mb-1"
                              style={{
                                letterSpacing: "-0.02em",
                                color: "var(--color-success,#156548)",
                              }}
                            >
                              {m.value}
                            </div>
                            <p
                              className="text-xs leading-snug"
                              style={{ color: "var(--color-text-gray,#6f6f6f)" }}
                            >
                              {m.label}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
