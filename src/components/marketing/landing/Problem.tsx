"use client";

import { motion, useScroll, useMotionValueEvent } from "motion/react";
import dynamic from "next/dynamic";
import { useRef } from "react";
import Reveal from "../motion/Reveal";

const ProblemDriftScene = dynamic(
  () => import("../three/ProblemDriftScene"),
  { ssr: false, loading: () => null }
);

type ToolIcon = "sheet" | "phone" | "meta" | "mail";

const TOOLS: { name: string; icon: ToolIcon }[] = [
  { name: "Spreadsheets", icon: "sheet" },
  { name: "WhatsApp on someone's phone", icon: "phone" },
  { name: "Meta Lead Ads inbox", icon: "meta" },
  { name: "Email threads", icon: "mail" },
];

function ToolGlyph({ kind }: { kind: ToolIcon }) {
  const common = {
    width: 28,
    height: 28,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.6,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  switch (kind) {
    case "sheet":
      return (
        <svg {...common}>
          <rect x="3.5" y="4.5" width="17" height="15" rx="2" />
          <path d="M3.5 9.5h17M3.5 14.5h17M9 4.5v15M15 4.5v15" />
        </svg>
      );
    case "phone":
      return (
        <svg {...common}>
          <rect x="6.5" y="2.5" width="11" height="19" rx="2.5" />
          <path d="M10.5 18.5h3" />
        </svg>
      );
    case "meta":
      return (
        <svg {...common}>
          <path d="M3 14.5C3 9 5.5 6 8.5 6c2.4 0 4 1.8 6 5s3.6 5 6 5c1.5 0 2.5-1.1 2.5-2.7" />
          <path d="M21 9.5C21 14.5 18.5 18 15.5 18c-2.4 0-4-1.8-6-5S5.9 8 3.5 8C2 8 1 9.1 1 10.7" />
        </svg>
      );
    case "mail":
      return (
        <svg {...common}>
          <rect x="3" y="5.5" width="18" height="13" rx="2" />
          <path d="M3.5 7l8.5 6 8.5-6" />
        </svg>
      );
  }
}

export default function Problem() {
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
      className="relative py-32 overflow-hidden"
      style={{
        backgroundColor: "#020c08",
        backgroundImage:
          "radial-gradient(70% 55% at 50% 50%, rgba(16,47,35,0.9) 0%, transparent 70%)",
        color: "#fff",
        minHeight: "90vh",
      }}
    >
      {/* 3D scene — leads drift apart as you scroll */}
      <ProblemDriftScene progressRef={progressRef} />
      {/* Vignette so text stays readable */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 50%, transparent 0%, rgba(2,12,8,0.55) 90%)",
        }}
      />

      <div className="relative z-10 max-w-[1100px] mx-auto px-6 text-center">
        <Reveal>
          <p
            className="text-sm uppercase tracking-[0.2em] mb-6"
            style={{ color: "#98cdb8" }}
          >
            The problem
          </p>
        </Reveal>
        <Reveal delay={0.1}>
          <h2
            className="text-4xl md:text-6xl font-medium leading-[1.05] mb-6"
            style={{ letterSpacing: "-0.03em" }}
          >
            Your leads are leaking.
          </h2>
        </Reveal>
        <Reveal delay={0.2}>
          <p
            className="mx-auto max-w-2xl text-lg md:text-xl leading-relaxed mb-20"
            style={{ color: "rgba(255,255,255,0.65)" }}
          >
            Spreadsheets, WhatsApp on someone's phone, Meta Lead Ads in an
            inbox no one checks. Every channel, a different system. Every
            system, a missed lead.
          </p>
        </Reveal>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
          {TOOLS.map((tool, i) => (
            <motion.div
              key={tool.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{
                duration: 0.6,
                delay: i * 0.08,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="relative rounded-2xl p-6"
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <div
                className="mb-3 flex items-center justify-center h-7 w-7"
                style={{ color: "#319b72" }}
              >
                <ToolGlyph kind={tool.icon} />
              </div>
              <div
                className="text-sm leading-snug"
                style={{ color: "rgba(255,255,255,0.7)" }}
              >
                {tool.name}
              </div>
              <motion.div
                aria-hidden
                className="absolute left-1/2 -bottom-1 w-1 rounded-full"
                style={{ backgroundColor: "#da2a46", x: "-50%" }}
                initial={{ height: 0 }}
                whileInView={{ height: [0, 30, 0] }}
                viewport={{ once: false, margin: "-50px" }}
                transition={{
                  duration: 1.6,
                  delay: 1 + i * 0.3,
                  repeat: Infinity,
                  repeatDelay: 2,
                }}
              />
            </motion.div>
          ))}
        </div>

        <Reveal delay={0.4}>
          <p
            className="mt-16 text-base"
            style={{ color: "rgba(255,255,255,0.5)" }}
          >
            The average B2C team takes <strong style={{ color: "#fff" }}>47 hours</strong> to
            respond to a lead. The fastest teams respond in under{" "}
            <strong style={{ color: "#319b72" }}>60 seconds</strong>.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
