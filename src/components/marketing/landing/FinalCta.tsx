"use client";

import { motion } from "motion/react";
import Reveal from "../motion/Reveal";
import MagneticButton from "../motion/MagneticButton";

export default function FinalCta() {
  return (
    <section
      data-nav-theme="dark"
      className="relative py-32 max-md:py-12 max-sm:py-8 overflow-hidden"
      style={{
        backgroundColor: "#020c08",
        backgroundImage:
          "radial-gradient(70% 55% at 50% 60%, rgba(26,74,55,0.85) 0%, transparent 70%)",
        color: "#fff",
      }}
    >
      {/* Grid */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
          maskImage:
            "radial-gradient(ellipse 80% 70% at 50% 50%, black 30%, transparent 70%)",
        }}
      />
      {/* Glow */}
      <motion.div
        aria-hidden
        className="absolute left-1/2 top-1/2 w-[700px] h-[700px] rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(49,155,114,0.3) 0%, transparent 60%)",
          filter: "blur(50px)",
          transform: "translate(-50%, -50%)",
        }}
        animate={{ scale: [1, 1.08, 1] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="relative max-w-[1100px] mx-auto px-6 max-sm:px-4 text-center">
        <Reveal>
          <h2
            className="text-5xl max-sm:text-3xl md:text-7xl font-medium leading-[1.05] mb-6"
            style={{ letterSpacing: "-0.035em" }}
          >
            Ready to{" "}
            <span
              className="italic font-normal"
              style={{
                fontFamily: "var(--font-instrument-serif), serif",
                letterSpacing: "-0.025em",
              }}
            >
              grow your pipeline
            </span>
            ?
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <p
            className="text-lg max-sm:text-sm md:text-xl mx-auto max-w-xl mb-10"
            style={{ color: "rgba(255,255,255,0.7)" }}
          >
            Free to start. Scales with you. No credit card needed.
          </p>
        </Reveal>
        <Reveal delay={0.2}>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <MagneticButton href="/signup" variant="primary">
              Start free →
            </MagneticButton>
            <MagneticButton href="/pricing" variant="ghost">
              See pricing
            </MagneticButton>
          </div>
        </Reveal>
        <Reveal delay={0.3}>
          <p
            className="mt-16 text-xs uppercase tracking-wider"
            style={{ color: "rgba(255,255,255,0.4)" }}
          >
            Join hundreds of teams converting more leads with Xale.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
