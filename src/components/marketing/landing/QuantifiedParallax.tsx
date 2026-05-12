"use client";

/**
 * QuantifiedParallax — voxr-style scroll parallax stats section.
 *
 * Pattern:
 *  - Section is ~140vh tall to give scroll room
 *  - Massive background word ("QUANTIFIED") behind everything
 *  - 4 stat cards scattered at fixed positions
 *  - Each card has a unique parallax scroll speed via useTransform
 *  - Background word also has its own (smaller) parallax
 *
 * Perf:
 *  - All scroll-tied motion via motion's useScroll + useTransform
 *    (runs on rAF, doesn't trigger re-renders)
 *  - Reduced motion: parallax disabled, cards rest at base positions
 */

import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";

type Stat = {
  value: string;
  label: string;
  pos: { top?: string; bottom?: string; left?: string; right?: string };
  parallaxRange: [number, number]; // y px shift over scroll range
  delay?: number;
  big?: boolean;
};

const STATS: Stat[] = [
  {
    value: "0",
    label: "Leads lost to slow follow-up — every lead lands the instant Meta delivers it",
    pos: { top: "20%", left: "6%" },
    parallaxRange: [120, -120],
  },
  {
    value: "24/7",
    label: "Coverage. Nights, weekends, holidays — your automation never sleeps",
    pos: { top: "8%", right: "5%" },
    parallaxRange: [-60, 60],
  },
  {
    value: "8 sec",
    label: "From Meta form submission to first WhatsApp message landing in the prospect's hand",
    pos: { bottom: "26%", left: "12%" },
    parallaxRange: [60, -180],
    big: true,
  },
  {
    value: "3.2×",
    label: "Lead-to-application conversion in our early-access partners",
    pos: { bottom: "12%", right: "8%" },
    parallaxRange: [-100, 100],
  },
];

export default function QuantifiedParallax() {
  const sectionRef = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // Background word parallaxes upward slightly faster than the cards
  const bgY = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [200, -200]);
  const bgScale = useTransform(scrollYProgress, [0, 0.5, 1], reduce ? [1, 1, 1] : [0.92, 1.0, 1.08]);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden"
      style={{
        minHeight: "140vh",
        background:
          "radial-gradient(120% 80% at 50% 0%, #ffffff 0%, #f4f9f6 55%, #e6efea 100%)",
      }}
    >
      {/* Ambient green orbs for depth (no filter blur — radial-gradient is already soft, much cheaper) */}
      <div
        aria-hidden
        className="absolute pointer-events-none"
        style={{
          top: "10%",
          left: "-8%",
          width: "520px",
          height: "520px",
          background:
            "radial-gradient(circle, rgba(49,155,114,0.28) 0%, rgba(49,155,114,0) 70%)",
          transform: "translateZ(0)",
        }}
      />
      <div
        aria-hidden
        className="absolute pointer-events-none"
        style={{
          top: "40%",
          right: "-10%",
          width: "640px",
          height: "640px",
          background:
            "radial-gradient(circle, rgba(21,101,72,0.22) 0%, rgba(21,101,72,0) 70%)",
          transform: "translateZ(0)",
        }}
      />
      <div
        aria-hidden
        className="absolute pointer-events-none"
        style={{
          bottom: "-10%",
          left: "30%",
          width: "560px",
          height: "560px",
          background:
            "radial-gradient(circle, rgba(152,205,184,0.35) 0%, rgba(152,205,184,0) 70%)",
          transform: "translateZ(0)",
        }}
      />

      {/* Subtle grid overlay */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(30,48,42,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(30,48,42,0.05) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
          maskImage:
            "radial-gradient(ellipse 70% 60% at 50% 50%, black 30%, transparent 80%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 70% 60% at 50% 50%, black 30%, transparent 80%)",
        }}
      />

      {/* Top chip */}
      <div className="relative pt-24 flex justify-center z-10">
        <span
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm"
          style={{
            border: "1px solid rgba(49,155,114,0.18)",
            backgroundColor: "#ffffff",
            color: "var(--color-text-secondary,#505e59)",
            boxShadow: "0 4px 16px -4px rgba(21,101,72,0.12)",
          }}
        >
          <span
            className="w-1.5 h-1.5 rounded-full"
            style={{
              backgroundColor: "#319b72",
              boxShadow: "0 0 10px #319b72, 0 0 4px #319b72",
            }}
          />
          The impact, quantified
        </span>
      </div>

      {/* Massive background word */}
      <motion.div
        aria-hidden
        style={{ y: bgY, scale: bgScale, willChange: "transform" }}
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
      >
        <h2
          className="text-[20vw] md:text-[18vw] font-medium leading-none"
          style={{
            letterSpacing: "-0.05em",
            background:
              "linear-gradient(180deg, #0e1f18 0%, #156548 45%, #319b72 75%, #98cdb8 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            whiteSpace: "nowrap",
          }}
        >
          Optimized
        </h2>
      </motion.div>

      {/* Scattered cards with individual parallax */}
      {STATS.map((stat, i) => (
        <ParallaxStatCard key={i} stat={stat} scrollYProgress={scrollYProgress} reduce={!!reduce} />
      ))}
    </section>
  );
}

function ParallaxStatCard({
  stat,
  scrollYProgress,
  reduce,
}: {
  stat: Stat;
  scrollYProgress: ReturnType<typeof useScroll>["scrollYProgress"];
  reduce: boolean;
}) {
  const y = useTransform(
    scrollYProgress,
    [0, 1],
    reduce ? [0, 0] : stat.parallaxRange
  );
  const opacity = useTransform(scrollYProgress, [0, 0.15, 0.85, 1], [0, 1, 1, 0.6]);

  return (
    <motion.div
      style={{ ...stat.pos, y, opacity, position: "absolute", willChange: "transform" }}
      className="z-10"
    >
      <div
        className="relative rounded-2xl px-7 py-6"
        style={{
          maxWidth: stat.big ? "440px" : "300px",
          background:
            "linear-gradient(135deg, #ffffff 0%, #f6faf8 100%)",
          border: "1px solid rgba(230,232,231,0.9)",
          boxShadow: [
            "0 24px 60px -16px rgba(21,101,72,0.22)",
            "0 8px 24px -8px rgba(21,101,72,0.12)",
            "0 0 0 1px rgba(49,155,114,0.08)",
            "inset 0 1px 0 rgba(255,255,255,0.9)",
          ].join(", "),
        }}
      >
        {/* Top accent line */}
        <div
          aria-hidden
          className="absolute top-0 left-7 right-7 h-px"
          style={{
            background:
              "linear-gradient(90deg, transparent 0%, rgba(49,155,114,0.6) 50%, transparent 100%)",
          }}
        />

        {/* Accent dot */}
        <div
          aria-hidden
          className="absolute -top-1 left-7 w-2 h-2 rounded-full"
          style={{
            backgroundColor: "#319b72",
            boxShadow: "0 0 12px #319b72, 0 0 4px #319b72",
          }}
        />

        <div
          className={
            stat.big
              ? "text-5xl md:text-6xl font-semibold mb-3"
              : "text-4xl md:text-5xl font-semibold mb-3"
          }
          style={{
            letterSpacing: "-0.035em",
            background:
              "linear-gradient(135deg, #0e3a2a 0%, #156548 40%, #319b72 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          {stat.value}
        </div>
        <p
          className="text-sm leading-relaxed"
          style={{ color: "var(--color-text-gray,#6f6f6f)" }}
        >
          {stat.label}
        </p>
      </div>
    </motion.div>
  );
}
