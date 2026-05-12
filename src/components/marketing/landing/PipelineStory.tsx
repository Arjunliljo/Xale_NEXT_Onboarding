"use client";

/**
 * PipelineStory — Apple-style pinned scroll storytelling.
 *
 * Pattern (per 2026 best-practice research):
 *  - GSAP ScrollTrigger pins the section for `endDistance` of scroll and writes
 *    progress (0→1) into a useRef.
 *  - The R3F canvas reads that ref inside useFrame — never React state — so
 *    the scene re-renders zero React components per scroll tick.
 *  - DOM phase copy lives in real HTML (good for SEO + accessibility).
 *    The phase index is derived from scroll progress; only phase changes
 *    trigger a setState (≤ 4 state updates per full scroll).
 *  - The R3F scene is dynamic-imported with ssr:false from the parent.
 *  - Reduced-motion: pin disabled, phases render as a stack of cards.
 */

import { useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import dynamic from "next/dynamic";
import { AnimatePresence, motion } from "motion/react";
import { useIsMobile } from "@/src/hooks/useMediaQuery";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const PipelineScene = dynamic(
  () => import("../three/PipelineScene"),
  { ssr: false, loading: () => null }
);

const PHASES = [
  {
    eyebrow: "Phase 01 · Capture",
    title: "Every lead, every channel.",
    body: "Meta Lead Ads, WhatsApp inbound, web forms, custom webhooks — leads land in Xale within seconds of submission. Source-attributed, deduplicated, typed.",
  },
  {
    eyebrow: "Phase 02 · Align",
    title: "The pipeline takes shape.",
    body: "Routing rules match leads to counsellors by country, value, language. No drag-and-drop. No manual triage. The pipeline assembles itself.",
  },
  {
    eyebrow: "Phase 03 · Activate",
    title: "First touch in 8 seconds.",
    body: "Pre-approved WhatsApp templates fire automatically — addressed by name, referencing the form answer, delivered before the prospect closes the tab.",
  },
  {
    eyebrow: "Phase 04 · Close",
    title: "Compounding pipeline.",
    body: "Every closed deal feeds the next one. Faster response → more conversions → more data → smarter routing → faster response. The flywheel runs itself.",
  },
];

export default function PipelineStory() {
  const sectionRef = useRef<HTMLElement>(null);
  const progressRef = useRef(0);
  const [phase, setPhase] = useState(0);
  const isMobile = useIsMobile();

  useGSAP(
    () => {
      if (typeof window === "undefined") return;
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const mobile = window.matchMedia("(max-width: 768px)").matches;
      if (reduce || mobile) return;

      const ctx = gsap.context(() => {
        ScrollTrigger.create({
          trigger: sectionRef.current,
          start: "top top",
          end: "+=400%", // 4 viewports of scroll for the pinned section
          pin: true,
          scrub: 0.6,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate(self) {
            progressRef.current = self.progress;
            const next = Math.min(
              PHASES.length - 1,
              Math.floor(self.progress * PHASES.length)
            );
            setPhase((prev) => (prev === next ? prev : next));
          },
        });
      }, sectionRef);

      return () => ctx.revert();
    },
    { scope: sectionRef }
  );

  if (isMobile) {
    return (
      <section
        data-nav-theme="dark"
        className="relative overflow-hidden py-10"
        style={{
          backgroundColor: "#020c08",
          backgroundImage:
            "radial-gradient(70% 55% at 50% 50%, rgba(14,50,37,0.9) 0%, transparent 75%)",
          color: "#fff",
        }}
      >
        <div className="relative z-10 max-w-[1200px] mx-auto px-4">
          <div className="flex justify-center mb-6">
            <span
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px] text-center"
              style={{
                border: "1px solid rgba(152, 205, 184, 0.25)",
                backgroundColor: "rgba(49,155,114,0.08)",
                color: "rgba(255,255,255,0.85)",
                backdropFilter: "blur(8px)",
              }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{
                  backgroundColor: "#319b72",
                  boxShadow: "0 0 8px #319b72",
                }}
              />
              One lead. Four phases.
            </span>
          </div>
          <div className="grid grid-cols-2 gap-3">
          {PHASES.map((p, i) => (
            <div key={i} className="rounded-xl p-3" style={{ border: "1px solid rgba(255,255,255,0.08)", backgroundColor: "rgba(255,255,255,0.03)" }}>
              <p
                className="text-[10px] uppercase tracking-[0.18em] mb-1.5"
                style={{ color: "#98cdb8" }}
              >
                {p.eyebrow}
              </p>
              <h2
                className="text-base font-medium leading-tight mb-1.5"
                style={{ letterSpacing: "-0.02em" }}
              >
                {p.title}
              </h2>
              <p
                className="text-[12px] leading-snug"
                style={{ color: "rgba(255,255,255,0.7)" }}
              >
                {p.body}
              </p>
            </div>
          ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      ref={sectionRef}
      data-nav-theme="dark"
      className="relative h-screen overflow-hidden"
      style={{
        backgroundColor: "#020c08",
        backgroundImage:
          "radial-gradient(70% 55% at 50% 50%, rgba(14,50,37,0.9) 0%, transparent 75%)",
        color: "#fff",
      }}
    >
      {/* 3D canvas — absolutely positioned, full bleed, lazy-loaded */}
      <div className="absolute inset-0">
        <PipelineScene progressRef={progressRef} />
      </div>

      {/* Vignette to bring focus to text */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 50%, transparent 0%, rgba(2,12,8,0.55) 80%, rgba(2,12,8,0.85) 100%)",
        }}
      />

      {/* Top chip */}
      <div className="relative z-10 flex justify-center pt-12">
        <span
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs"
          style={{
            border: "1px solid rgba(152, 205, 184, 0.25)",
            backgroundColor: "rgba(49,155,114,0.08)",
            color: "rgba(255,255,255,0.85)",
            backdropFilter: "blur(8px)",
          }}
        >
          <span
            className="w-1.5 h-1.5 rounded-full"
            style={{
              backgroundColor: "#319b72",
              boxShadow: "0 0 8px #319b72",
            }}
          />
          One lead. Four phases. Eight seconds to first touch.
        </span>
      </div>

      {/* Text overlay (bottom-aligned so 3D scene gets the spotlight) */}
      <div className="relative z-10 h-full flex items-end pb-24">
        <div className="max-w-[1200px] mx-auto w-full px-6">
          <div className="max-w-xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={phase}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              >
                <p
                  className="text-sm uppercase tracking-[0.2em] mb-4"
                  style={{ color: "#98cdb8" }}
                >
                  {PHASES[phase].eyebrow}
                </p>
                <h2
                  className="text-5xl md:text-7xl font-medium leading-[1.02] mb-6"
                  style={{ letterSpacing: "-0.035em" }}
                >
                  {PHASES[phase].title}
                </h2>
                <p
                  className="text-base md:text-lg max-sm:text-sm leading-relaxed"
                  style={{ color: "rgba(255,255,255,0.7)" }}
                >
                  {PHASES[phase].body}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Progress dots */}
      <div className="absolute bottom-8 right-8 z-10 flex flex-col gap-2">
        {PHASES.map((_, i) => (
          <div
            key={i}
            className="w-2 h-2 rounded-full transition-all"
            style={{
              backgroundColor: i === phase ? "#319b72" : "rgba(255,255,255,0.2)",
              boxShadow: i === phase ? "0 0 10px #319b72" : "none",
              transform: i === phase ? "scale(1.2)" : "scale(1)",
            }}
          />
        ))}
      </div>
    </section>
  );
}
