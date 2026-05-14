"use client";

import { motion } from "motion/react";
import Link from "next/link";
import Reveal from "../motion/Reveal";

type GlyphKind =
  | "study"
  | "video"
  | "academy"
  | "travel"
  | "realestate"
  | "health";

type Industry = {
  slug: string;
  code: string;
  name: string;
  tagline: string;
  glyph: GlyphKind;
  accent: string;
  metric: { value: string; label: string };
  featured?: boolean;
};

const INDUSTRIES: Industry[] = [
  {
    slug: "study-abroad",
    code: "MOD-001",
    name: "Study Abroad",
    tagline:
      "Inquiry → counsellor → application → visa → travel. Every stage instrumented, every hand-off automated.",
    glyph: "study",
    accent: "#319b72",
    metric: { value: "42", label: "Pre-built stages" },
    featured: true,
  },
  {
    slug: "video-production",
    code: "MOD-002",
    name: "Video Production",
    tagline: "Projects, vendors, deliverables — one timeline.",
    glyph: "video",
    accent: "#6fb99c",
    metric: { value: "18", label: "Asset states" },
  },
  {
    slug: "academy",
    code: "MOD-003",
    name: "Academy",
    tagline: "Programs, cohorts, certifications — full lifecycle.",
    glyph: "academy",
    accent: "#98cdb8",
    metric: { value: "24", label: "Cohort flows" },
  },
  {
    slug: "travel",
    code: "MOD-004",
    name: "Travel",
    tagline: "Itineraries, vendors, multi-currency, in sync.",
    glyph: "travel",
    accent: "#319b72",
    metric: { value: "12", label: "Currencies live" },
  },
  {
    slug: "real-estate",
    code: "MOD-005",
    name: "Real Estate",
    tagline: "Properties, viewings, nurture sequences.",
    glyph: "realestate",
    accent: "#6fb99c",
    metric: { value: "30", label: "Listing states" },
  },
  {
    slug: "healthcare",
    code: "MOD-006",
    name: "Healthcare",
    tagline: "Patient inquiries, appointments, follow-up SLAs.",
    glyph: "health",
    accent: "#319b72",
    metric: { value: "08", label: "SLA tiers" },
  },
];

const MONO =
  'ui-monospace, SFMono-Regular, "JetBrains Mono", Menlo, Consolas, monospace';

function Glyph({ kind, accent }: { kind: GlyphKind; accent: string }) {
  const common = {
    width: 40,
    height: 40,
    viewBox: "0 0 40 40",
    fill: "none",
    stroke: accent,
    strokeWidth: 1.4,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  switch (kind) {
    case "study":
      return (
        <svg {...common}>
          <circle cx="20" cy="20" r="13" />
          <path d="M7 20h26M20 7c4 4 4 22 0 26M20 7c-4 4-4 22 0 26" />
          <circle cx="28" cy="14" r="2" fill={accent} stroke="none" />
        </svg>
      );
    case "video":
      return (
        <svg {...common}>
          <rect x="6" y="10" width="28" height="20" rx="2" />
          <path d="M17 16l8 4-8 4z" fill={accent} stroke="none" />
          <path d="M6 16h28M6 24h28" opacity="0.35" />
        </svg>
      );
    case "academy":
      return (
        <svg {...common}>
          <path d="M6 17l14-7 14 7-14 7z" />
          <path d="M11 19v6c0 2.4 4 4 9 4s9-1.6 9-4v-6" />
          <path d="M34 17v8" />
        </svg>
      );
    case "travel":
      return (
        <svg {...common}>
          <path d="M8 30c4-6 8-12 14-12s10 6 14 12" />
          <circle cx="8" cy="30" r="2.5" fill={accent} stroke="none" />
          <circle cx="36" cy="30" r="2.5" fill={accent} stroke="none" />
          <path d="M22 18l3-6m-3 6l-3-6" />
        </svg>
      );
    case "realestate":
      return (
        <svg {...common}>
          <path d="M8 30V18l12-9 12 9v12" />
          <path d="M16 30V22h8v8" />
        </svg>
      );
    case "health":
      return (
        <svg {...common}>
          <path d="M5 20h6l3-7 5 14 4-10 3 3h9" />
        </svg>
      );
  }
}

function CornerBrackets({ accent }: { accent: string }) {
  const size = 14;
  const base = {
    position: "absolute" as const,
    width: size,
    height: size,
    opacity: 0.55,
    transition: "opacity 0.3s ease",
  };
  return (
    <>
      <span
        aria-hidden
        className="group-hover:!opacity-100"
        style={{
          ...base,
          top: 8,
          left: 8,
          borderTop: `1px solid ${accent}`,
          borderLeft: `1px solid ${accent}`,
        }}
      />
      <span
        aria-hidden
        className="group-hover:!opacity-100"
        style={{
          ...base,
          top: 8,
          right: 8,
          borderTop: `1px solid ${accent}`,
          borderRight: `1px solid ${accent}`,
        }}
      />
      <span
        aria-hidden
        className="group-hover:!opacity-100"
        style={{
          ...base,
          bottom: 8,
          left: 8,
          borderBottom: `1px solid ${accent}`,
          borderLeft: `1px solid ${accent}`,
        }}
      />
      <span
        aria-hidden
        className="group-hover:!opacity-100"
        style={{
          ...base,
          bottom: 8,
          right: 8,
          borderBottom: `1px solid ${accent}`,
          borderRight: `1px solid ${accent}`,
        }}
      />
    </>
  );
}

function IndustryModule({
  industry,
  index,
}: {
  industry: Industry;
  index: number;
}) {
  const pad = industry.featured ? "p-9 max-md:p-7 max-sm:p-5" : "p-6 max-sm:p-5";
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "300px 0px 300px 0px" }}
      transition={{
        duration: 0.9,
        delay: index * 0.08,
        ease: [0.16, 1, 0.3, 1],
      }}
      whileHover={{ y: -4 }}
      className={
        industry.featured
          ? "lg:col-span-2 lg:row-span-2"
          : ""
      }
    >
      <Link
        href={`/industries/${industry.slug}`}
        className={`group relative block h-full overflow-hidden rounded-2xl ${pad}`}
        style={{
          background:
            "linear-gradient(135deg, rgba(14,38,30,0.55) 0%, rgba(5,25,18,0.75) 100%)",
          border: `1px solid ${industry.accent}24`,
          backdropFilter: "blur(14px)",
          WebkitBackdropFilter: "blur(14px)",
          minHeight: industry.featured ? 360 : 240,
          transition: "border-color 0.35s ease, box-shadow 0.35s ease",
        }}
      >
        {/* Corner brackets */}
        <CornerBrackets accent={industry.accent} />

        {/* Hover scanline */}
        <motion.div
          aria-hidden
          className="absolute left-0 right-0 h-px opacity-0 group-hover:opacity-90 pointer-events-none"
          style={{
            background: `linear-gradient(90deg, transparent, ${industry.accent}, transparent)`,
            boxShadow: `0 0 12px ${industry.accent}`,
          }}
          initial={{ top: "10%" }}
          animate={{ top: ["10%", "90%", "10%"] }}
          transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Top row: code + status pulse */}
        <div className="relative z-10 flex items-center justify-between mb-6 max-sm:mb-4">
          <span
            className="text-[10px] tracking-[0.22em] uppercase"
            style={{ color: "rgba(152,205,184,0.7)", fontFamily: MONO }}
          >
            {industry.code}
          </span>
          <span
            className="flex items-center gap-2 text-[10px] uppercase tracking-[0.18em]"
            style={{ color: "rgba(152,205,184,0.65)", fontFamily: MONO }}
          >
            <span className="relative inline-flex w-1.5 h-1.5">
              <span
                className="absolute inset-0 rounded-full animate-ping"
                style={{ backgroundColor: industry.accent, opacity: 0.6 }}
              />
              <span
                className="relative inline-block w-1.5 h-1.5 rounded-full"
                style={{
                  backgroundColor: industry.accent,
                  boxShadow: `0 0 8px ${industry.accent}`,
                }}
              />
            </span>
            Active
          </span>
        </div>

        {/* Glyph */}
        <div
          className="relative z-10 mb-6 max-sm:mb-4 inline-flex items-center justify-center"
          style={{
            width: industry.featured ? 72 : 56,
            height: industry.featured ? 72 : 56,
            borderRadius: 14,
            background: `linear-gradient(135deg, ${industry.accent}22 0%, ${industry.accent}06 100%)`,
            border: `1px solid ${industry.accent}30`,
          }}
        >
          <div
            style={{
              transform: industry.featured ? "scale(1.15)" : "scale(1)",
              transformOrigin: "center",
            }}
          >
            <Glyph kind={industry.glyph} accent={industry.accent} />
          </div>
        </div>

        {/* Title */}
        <h3
          className={`relative z-10 ${
            industry.featured
              ? "text-3xl md:text-[40px]"
              : "text-xl max-sm:text-[17px]"
          } font-medium mb-3 max-sm:mb-2`}
          style={{ letterSpacing: "-0.025em", color: "#ffffff" }}
        >
          {industry.name}
        </h3>

        {/* Tagline */}
        <p
          className={`relative z-10 ${
            industry.featured
              ? "text-base md:text-lg max-w-md"
              : "text-[13px]"
          } leading-relaxed mb-8 max-sm:mb-6`}
          style={{ color: "rgba(255,255,255,0.62)" }}
        >
          {industry.tagline}
        </p>

        {/* Bottom: metric + CTA */}
        <div
          className="absolute left-0 right-0 bottom-0 flex items-end justify-between"
          style={{
            paddingLeft: industry.featured ? 36 : 24,
            paddingRight: industry.featured ? 36 : 24,
            paddingBottom: industry.featured ? 36 : 24,
          }}
        >
          <div>
            <div
              className={industry.featured ? "text-3xl" : "text-2xl"}
              style={{
                color: industry.accent,
                fontFamily: MONO,
                letterSpacing: "-0.02em",
                lineHeight: 1,
              }}
            >
              {industry.metric.value}
            </div>
            <div
              className="text-[9px] uppercase tracking-[0.18em] mt-1.5"
              style={{
                color: "rgba(255,255,255,0.42)",
                fontFamily: MONO,
              }}
            >
              {industry.metric.label}
            </div>
          </div>
          <span
            className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.2em] transition-transform group-hover:translate-x-1"
            style={{ color: industry.accent, fontFamily: MONO }}
          >
            Configure
            <svg width="14" height="10" viewBox="0 0 14 10" fill="none">
              <path
                d="M1 5h11m-4-4l4 4-4 4"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </div>
      </Link>
    </motion.div>
  );
}

export default function IndustriesShowcase() {
  return (
    <section
      data-nav-theme="dark"
      className="relative overflow-hidden py-32 max-md:py-16 max-sm:py-10"
      style={{
        backgroundColor: "#020c08",
        color: "#fff",
        marginTop: "-1px",
      }}
    >
      {/* Grid pattern */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(152,205,184,0.045) 1px, transparent 1px), linear-gradient(90deg, rgba(152,205,184,0.045) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
          maskImage:
            "radial-gradient(ellipse 90% 70% at 50% 50%, black 30%, transparent 92%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 90% 70% at 50% 50%, black 30%, transparent 92%)",
        }}
      />

      {/* Ambient orbs */}
      <div
        aria-hidden
        className="absolute pointer-events-none"
        style={{
          top: "8%",
          left: "-10%",
          width: "520px",
          height: "520px",
          background:
            "radial-gradient(circle, rgba(49,155,114,0.20) 0%, transparent 70%)",
        }}
      />
      <div
        aria-hidden
        className="absolute pointer-events-none"
        style={{
          bottom: "0%",
          right: "-12%",
          width: "640px",
          height: "640px",
          background:
            "radial-gradient(circle, rgba(21,101,72,0.18) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 max-w-[1200px] mx-auto px-6 max-sm:px-4">
        {/* Header */}
        <div className="text-center mb-16 max-md:mb-10">
          <Reveal>
            <div className="inline-flex items-center gap-3 mb-6">
              <span
                className="w-8 h-px"
                style={{ backgroundColor: "rgba(152,205,184,0.4)" }}
              />
              <p
                className="text-[11px] uppercase tracking-[0.3em]"
                style={{ color: "#98cdb8", fontFamily: MONO }}
              >
                System // Deployed Verticals
              </p>
              <span
                className="w-8 h-px"
                style={{ backgroundColor: "rgba(152,205,184,0.4)" }}
              />
            </div>
          </Reveal>
          <Reveal delay={0.05}>
            <h2
              className="text-4xl max-sm:text-3xl md:text-6xl font-medium leading-[1.05] mb-6 max-w-3xl mx-auto"
              style={{ letterSpacing: "-0.035em" }}
            >
              Built for the shape of{" "}
              <span
                className="italic font-normal"
                style={{
                  fontFamily: "var(--font-instrument-serif), serif",
                  letterSpacing: "-0.02em",
                }}
              >
                your business
              </span>
              .
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p
              className="max-w-2xl mx-auto text-base max-sm:text-sm leading-relaxed"
              style={{ color: "rgba(255,255,255,0.6)" }}
            >
              Six pre-built verticals ship with industry-specific stages,
              fields, and workflows. Configure in minutes — extend to anything
              else in days.
            </p>
          </Reveal>
        </div>

        {/* Bento grid — featured spans 2x2 on lg, single col on sm */}
        <div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-sm:gap-3"
          style={{
            gridAutoRows: "minmax(260px, auto)",
          }}
        >
          {INDUSTRIES.map((ind, i) => (
            <IndustryModule key={ind.slug} industry={ind} index={i} />
          ))}
        </div>

        {/* Footer link */}
        <Reveal delay={0.3}>
          <div className="mt-14 max-md:mt-10 text-center">
            <p
              className="text-[10px] uppercase tracking-[0.28em] mb-3"
              style={{
                color: "rgba(255,255,255,0.4)",
                fontFamily: MONO,
              }}
            >
              Not on the list?
            </p>
            <Link
              href="/industries"
              className="inline-flex items-center gap-2 text-sm group"
              style={{ color: "#98cdb8" }}
            >
              <span>Custom modules ship in days, not quarters</span>
              <span className="transition-transform group-hover:translate-x-1">
                →
              </span>
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
