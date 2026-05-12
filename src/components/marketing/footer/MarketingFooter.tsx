"use client";

import Link from "next/link";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
  type MotionValue,
} from "motion/react";
import { useRef } from "react";

const COLUMNS = [
  {
    title: "Product",
    links: [
      { href: "/features", label: "Features" },
      { href: "/pricing", label: "Pricing" },
      { href: "/industries", label: "Industries" },
      { href: "/compare", label: "Compare" },
    ],
  },
  {
    title: "Resources",
    links: [
      { href: "/blog", label: "Blog" },
      { href: "/case-studies", label: "Case studies" },
      { href: "/guides", label: "Guides" },
      { href: "/glossary", label: "Glossary" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/about", label: "About" },
      { href: "/contact", label: "Contact" },
      { href: "https://marketlube.in", label: "Marketlube" },
    ],
  },
  {
    title: "Legal",
    links: [
      { href: "/privacy-policy", label: "Privacy Policy" },
      { href: "/terms-of-service", label: "Terms of Service" },
      { href: "/data-deletion", label: "Data Deletion" },
    ],
  },
];

const PARTICLES = Array.from({ length: 14 }, (_, i) => ({
  // Pseudo-random but deterministic positions for SSR safety
  left: `${(i * 67) % 100}%`,
  top: `${(i * 41 + 12) % 90}%`,
  size: 2 + (i % 3) * 1.5,
  delay: (i * 0.7) % 5,
  duration: 8 + (i % 4) * 2,
}));

export default function MarketingFooter() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end end"],
  });

  // Massive background word — translates up + scales as user scrolls into footer
  const wordY = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [120, -60]);
  const wordScale = useTransform(scrollYProgress, [0, 1], reduce ? [1, 1] : [0.85, 1.05]);
  const wordOpacity = useTransform(scrollYProgress, [0, 0.5, 1], reduce ? [0.08, 0.08, 0.08] : [0, 0.06, 0.1]);

  // Columns rise from below with parallax — each column moves slightly differently
  const colY = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [80, -20]);
  const logoY = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [60, -10]);
  const bottomY = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [40, 0]);

  // Top hairline gradient mask
  const hairlineOpacity = useTransform(scrollYProgress, [0, 0.5], [0, 1]);

  return (
    <footer
      ref={ref}
      className="relative overflow-hidden"
      style={{
        backgroundColor: "#020c08",
        color: "rgba(255,255,255,0.7)",
      }}
    >
      {/* Top hairline — fades in as footer enters viewport */}
      <motion.div
        aria-hidden
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          opacity: hairlineOpacity,
          background:
            "linear-gradient(90deg, transparent, rgba(49,155,114,0.4) 50%, transparent)",
        }}
      />

      {/* Soft radial brand glow at top */}
      <div
        aria-hidden
        className="absolute -top-32 left-1/2 w-[900px] h-[600px] pointer-events-none"
        style={{
          transform: "translateX(-50%)",
          background:
            "radial-gradient(ellipse at center, rgba(49,155,114,0.18) 0%, transparent 60%)",
          filter: "blur(40px)",
        }}
      />

      {/* Background grid */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
          maskImage:
            "radial-gradient(ellipse 80% 100% at 50% 30%, black 30%, transparent 80%)",
        }}
      />

      {/* Floating dot particles */}
      {!reduce &&
        PARTICLES.map((p, i) => (
          <motion.span
            key={i}
            aria-hidden
            className="absolute rounded-full"
            style={{
              left: p.left,
              top: p.top,
              width: p.size,
              height: p.size,
              backgroundColor: "rgba(152,205,184,0.4)",
              boxShadow: "0 0 8px rgba(49,155,114,0.6)",
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: p.duration,
              delay: p.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}

      {/* Massive parallax background wordmark — desktop only, hidden on mobile */}
      <motion.div
        aria-hidden
        style={{
          y: wordY,
          scale: wordScale,
          opacity: wordOpacity,
        }}
        className="hidden md:flex absolute inset-x-0 bottom-0 justify-center pointer-events-none select-none"
      >
        <h2
          className="font-medium max-md:!text-[120px] max-sm:!text-[88px]"
          style={{
            fontSize: "clamp(180px, 24vw, 380px)",
            lineHeight: 0.85,
            letterSpacing: "-0.06em",
            background:
              "linear-gradient(180deg, #319b72 0%, #156548 70%, transparent 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            whiteSpace: "nowrap",
            marginBottom: "-0.18em",
          }}
        >
          XALE
        </h2>
      </motion.div>

      {/* Content */}
      <div className="relative z-10 max-w-[1200px] mx-auto px-6 max-sm:px-4 pt-24 max-md:pt-10 max-sm:pt-8 pb-12 max-md:pb-6">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10 max-md:gap-5 max-sm:gap-4">
          <motion.div
            style={{ y: logoY }}
            className="col-span-2 md:col-span-1"
          >
            <Link href="/" className="flex items-center gap-2.5 mb-4 max-sm:mb-2">
              <img src="/assets/Logo.png" alt="Xale" className="h-8 w-8 max-sm:h-7 max-sm:w-7 rounded-full" />
              <span className="text-white text-xl max-sm:text-lg font-medium tracking-tight">
                Xale
              </span>
            </Link>
            <p
              className="text-sm max-sm:text-[12px] leading-relaxed max-w-[240px]"
              style={{ color: "rgba(255,255,255,0.55)" }}
            >
              The CRM operating system for teams that move fast.
            </p>
            <div className="mt-6 max-sm:mt-3 flex items-center gap-2">
              <span
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px]"
                style={{
                  border: "1px solid rgba(152, 205, 184, 0.25)",
                  backgroundColor: "rgba(49,155,114,0.06)",
                  color: "rgba(255,255,255,0.7)",
                }}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{
                    backgroundColor: "#319b72",
                    boxShadow: "0 0 8px #319b72",
                  }}
                />
                All systems operational
              </span>
            </div>
          </motion.div>

          {COLUMNS.map((col, ci) => (
            <FooterColumn
              key={col.title}
              col={col}
              index={ci}
              scrollYProgress={scrollYProgress}
              reduce={!!reduce}
            />
          ))}
        </div>

        {/* Spacer that lets the giant XALE wordmark breathe behind everything — desktop only */}
        <div className="max-md:hidden" style={{ height: "clamp(120px, 18vw, 280px)" }} aria-hidden />

        <motion.div
          style={{ y: bottomY }}
          className="pt-8 max-md:pt-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 max-md:gap-3 border-t"
        >
          <p className="text-xs" style={{ color: "rgba(255,255,255,0.45)" }}>
            &copy; {new Date().getFullYear()} Xale. All rights reserved. Powered by{" "}
            <a
              href="https://marketlube.in"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white"
              style={{ color: "rgba(255,255,255,0.7)" }}
            >
              Marketlube
            </a>
            .
          </p>
          <div className="flex items-center gap-5 text-xs">
            <a
              href="https://twitter.com/xalecrm"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "rgba(255,255,255,0.55)" }}
              className="hover:text-white transition-colors"
            >
              Twitter
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "rgba(255,255,255,0.55)" }}
              className="hover:text-white transition-colors"
            >
              LinkedIn
            </a>
            <a
              href="mailto:hello@xale.in"
              style={{ color: "rgba(255,255,255,0.55)" }}
              className="hover:text-white transition-colors"
            >
              hello@xale.in
            </a>
          </div>
        </motion.div>
      </div>

      <style>{`
        footer > div > div:last-of-type {
          border-color: rgba(255,255,255,0.06);
        }
      `}</style>
    </footer>
  );
}

function FooterColumn({
  col,
  index,
  scrollYProgress,
  reduce,
}: {
  col: (typeof COLUMNS)[number];
  index: number;
  scrollYProgress: MotionValue<number>;
  reduce: boolean;
}) {
  const y = useTransform(
    scrollYProgress,
    [0, 1],
    reduce ? [0, 0] : [80 + index * 12, -10 - index * 4]
  );

  return (
    <motion.div style={{ y }}>
      <h3 className="text-white text-sm font-medium mb-5 max-md:mb-3">{col.title}</h3>
      <ul className="space-y-3 max-md:space-y-2">
        {col.links.map((l) => (
          <li key={l.href}>
            <Link
              href={l.href}
              className="text-sm max-md:text-[13px] transition-colors hover:text-white"
              style={{ color: "rgba(255,255,255,0.55)" }}
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </motion.div>
  );
}
