"use client";

/**
 * PipelineStory — four phases a lead moves through, shown as cards.
 *
 * Why this shape:
 *  - Previous version pinned the section and cross-faded text between phases.
 *    Users couldn't compare phases side-by-side, and the swap fought with
 *    the snappy reveal pattern used elsewhere on the page.
 *  - Now all four phases reveal as cards on scroll (same pattern as Pillars).
 *  - 3D PipelineScene stays as a hero band at the top, driven by section
 *    scroll progress (Framer Motion useScroll) instead of GSAP pin.
 */

import { useRef } from "react";
import dynamic from "next/dynamic";
import { motion, useScroll, useMotionValueEvent } from "motion/react";
import Reveal from "../motion/Reveal";
import AnimatedWaveDivider from "./AnimatedWaveDivider";

const PipelineScene = dynamic(
  () => import("../three/PipelineScene"),
  { ssr: false, loading: () => null }
);

const PHASES = [
  {
    num: "01",
    eyebrow: "Capture",
    title: "It lands, no matter where it came from.",
    body: "A Meta ad. A WhatsApp chat. A web form. A custom webhook. Xale picks it up in seconds — source-tagged, deduplicated, and ready to work.",
  },
  {
    num: "02",
    eyebrow: "Align",
    title: "It finds the right person.",
    body: "Your routing rules — country, language, value, who's free — decide where it goes. No drag-and-drop, no manual triage, no lead sitting in someone's inbox.",
  },
  {
    num: "03",
    eyebrow: "Activate",
    title: "It gets a reply before the tab closes.",
    body: "A WhatsApp template fires the moment they submit — calling them by name, referencing what they asked about. They're talking to you in seconds, not hours.",
  },
  {
    num: "04",
    eyebrow: "Compound",
    title: "It makes the next lead faster.",
    body: "Every closed deal feeds the next one. Faster response → more conversions → more data → smarter routing. The flywheel runs itself.",
  },
];

export default function PipelineStory() {
  const sectionRef = useRef<HTMLElement>(null);
  const progressRef = useRef(0);

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
      className="relative overflow-hidden pt-24 pb-32 max-md:pt-16 max-md:pb-24"
      style={{
        backgroundColor: "#020c08",
        backgroundImage:
          "radial-gradient(70% 55% at 50% 50%, rgba(14,50,37,0.9) 0%, transparent 75%)",
        color: "#fff",
      }}
    >
      <div className="relative z-10 max-w-[1200px] mx-auto px-6 max-sm:px-4">
        {/* Top chip */}
        <Reveal>
          <div className="flex justify-center mb-8">
            <span
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs"
              style={{
                border: "1px solid rgba(152, 205, 184, 0.25)",
                backgroundColor: "rgba(49,155,114,0.08)",
                color: "rgba(255,255,255,0.85)",
                backdropFilter: "blur(8px)",
                WebkitBackdropFilter: "blur(8px)",
              }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{
                  backgroundColor: "#319b72",
                  boxShadow: "0 0 8px #319b72",
                }}
              />
              How a lead becomes a deal
            </span>
          </div>
        </Reveal>

        {/* Headline */}
        <Reveal delay={0.1}>
          <h2
            className="text-4xl max-sm:text-3xl md:text-6xl font-medium leading-[1.05] mb-6 max-w-3xl mx-auto text-center"
            style={{ letterSpacing: "-0.035em" }}
          >
            From click to conversation in{" "}
            <span
              className="italic font-normal"
              style={{
                fontFamily: "var(--font-instrument-serif), serif",
                letterSpacing: "-0.02em",
              }}
            >
              eight seconds
            </span>
            .
          </h2>
        </Reveal>

        {/* Subhead */}
        <Reveal delay={0.2}>
          <p
            className="mx-auto max-w-2xl text-lg max-sm:text-sm leading-relaxed text-center mb-10 max-md:mb-8"
            style={{ color: "rgba(255,255,255,0.7)" }}
          >
            Every lead moves through four phases. You write the rules once.
            Xale does the running — capture, route, reply, learn — and your
            team just shows up for the conversation.
          </p>
        </Reveal>

        {/* 3D Scene — hero band, scroll-progress driven */}
        <Reveal delay={0.25}>
          <div
            className="relative w-full mb-10 max-md:mb-8 max-md:h-[180px] max-sm:h-[140px]"
            style={{ height: "240px" }}
          >
            <PipelineScene progressRef={progressRef} />
          </div>
        </Reveal>

        {/* Phase cards — animation triggers ~300px before they enter the
            viewport, with a gentle ease and a wave-style stagger so the four
            cards have already settled by the time the reader is looking at
            them. */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 max-sm:gap-3">
          {PHASES.map((p, i) => (
            <motion.div
              key={p.num}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "1600px 0px 1600px 0px" }}
              transition={{
                duration: 1.4,
                delay: 0.05 + i * 0.18,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="relative rounded-2xl p-7 max-sm:p-4 h-full flex flex-col overflow-hidden"
              style={{
                background:
                  "linear-gradient(135deg, rgba(14,38,30,0.78) 0%, rgba(8,26,20,0.82) 100%)",
                border: "1px solid rgba(120,200,165,0.18)",
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
                boxShadow:
                  "0 12px 32px -12px rgba(0,0,0,0.5), 0 4px 12px -4px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)",
              }}
            >
                {/* Top accent line */}
                <div
                  aria-hidden
                  className="absolute top-0 left-8 right-8 h-px"
                  style={{
                    background:
                      "linear-gradient(90deg, transparent 0%, rgba(120,200,165,0.55) 50%, transparent 100%)",
                  }}
                />

                <div className="mb-5 max-sm:mb-3">
                  <span
                    className="block text-[10px] uppercase tracking-[0.24em] mb-2 max-sm:mb-1.5"
                    style={{ color: "#98cdb8" }}
                  >
                    {p.eyebrow}
                  </span>
                  <span
                    className="block text-[44px] max-sm:text-[32px] font-semibold leading-none"
                    style={{
                      letterSpacing: "-0.04em",
                      background:
                        "linear-gradient(135deg, #d1e4d9 0%, #6fb99c 50%, #319b72 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}
                  >
                    {p.num}
                  </span>
                </div>

                <h3
                  className="text-base max-sm:text-[14px] font-medium mb-2.5 max-sm:mb-1.5 leading-snug"
                  style={{ letterSpacing: "-0.01em" }}
                >
                  {p.title}
                </h3>
                <p
                  className="text-[13px] max-sm:text-[11.5px] leading-relaxed max-sm:leading-snug"
                  style={{ color: "rgba(255,255,255,0.65)" }}
                >
                  {p.body}
                </p>
            </motion.div>
          ))}
        </div>
      </div>

      <AnimatedWaveDivider fill="#ffffff" height={120} />
    </section>
  );
}
