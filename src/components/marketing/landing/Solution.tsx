"use client";

import { useScroll, useMotionValueEvent } from "motion/react";
import dynamic from "next/dynamic";
import { useRef } from "react";
import Reveal from "../motion/Reveal";

const SolutionStackScene = dynamic(
  () => import("../three/SolutionStackScene"),
  { ssr: false, loading: () => null }
);

export default function Solution() {
  const sectionRef = useRef<HTMLElement>(null);
  const progressRef = useRef(0);

  // Progress goes 0 → 1 as the section transits the viewport.
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    progressRef.current = v;
  });

  return (
    <section
      ref={sectionRef}
      data-nav-theme="dark"
      className="story-section relative overflow-hidden"
      style={{
        backgroundColor: "#020c08",
        backgroundImage:
          "radial-gradient(70% 55% at 50% 50%, rgba(26,74,55,0.9) 0%, transparent 70%)",
        color: "#fff",
        height: "100vh", // exact — no remainder, no trailing gap
        minHeight: "640px",
      }}
    >
      {/* 3D dashboard stack — fills the section */}
      <SolutionStackScene progressRef={progressRef} />

      {/* Vignette */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 50% 55%, transparent 0%, rgba(2,12,8,0.5) 95%)",
        }}
      />

      {/* Top header */}
      <div className="absolute inset-x-0 top-0 z-10 pt-16 md:pt-24 max-sm:pt-12">
        <div className="max-w-[1100px] mx-auto px-6 max-sm:px-4 text-center">
          <Reveal>
            <p
              className="text-sm uppercase tracking-[0.2em] mb-4"
              style={{ color: "#98cdb8" }}
            >
              The answer
            </p>
          </Reveal>
          <Reveal delay={0.05}>
            <h2
              className="text-4xl max-sm:text-3xl md:text-6xl font-medium leading-[1.05] mb-4"
              style={{ letterSpacing: "-0.03em", color: "#ffffff" }}
            >
              Every channel.
              <br />
              One stack.
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p
              className="mx-auto max-w-xl text-sm md:text-base leading-relaxed"
              style={{ color: "rgba(255,255,255,0.7)" }}
            >
              Your scattered inboxes, ad platforms, and call logs collapse into
              a single layered view. Scroll to assemble.
            </p>
          </Reveal>
        </div>
      </div>

      {/* Channel labels at bottom */}
      <div className="absolute inset-x-0 bottom-8 z-10">
        <div className="max-w-[1100px] mx-auto px-6">
          <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10">
            {[
              { label: "Meta", color: "#1877F2" },
              { label: "WhatsApp", color: "#25D366" },
              { label: "Gmail", color: "#EA4335" },
              { label: "Calls", color: "#319b72" },
              { label: "Xale", color: "#98cdb8", strong: true },
            ].map((c) => (
              <div
                key={c.label}
                className="flex items-center gap-2"
                style={{
                  color: c.strong ? "#ffffff" : "rgba(255,255,255,0.55)",
                  fontWeight: c.strong ? 500 : 400,
                }}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{
                    backgroundColor: c.color,
                    boxShadow: c.strong ? `0 0 10px ${c.color}` : "none",
                  }}
                />
                <span className="text-[11px] md:text-xs uppercase tracking-[0.15em]">
                  {c.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
