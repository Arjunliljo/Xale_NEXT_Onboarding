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
  const stroke = {
    width: 28,
    height: 28,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.6,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  const solid = {
    width: 28,
    height: 28,
    viewBox: "0 0 24 24",
    fill: "currentColor",
  };
  switch (kind) {
    case "sheet":
      return (
        <svg {...stroke}>
          <rect x="3.5" y="4.5" width="17" height="15" rx="2" />
          <path d="M3.5 9.5h17M3.5 14.5h17M9 4.5v15M15 4.5v15" />
        </svg>
      );
    case "phone":
      // Official WhatsApp brand mark (simple-icons).
      return (
        <svg {...solid}>
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.693.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
        </svg>
      );
    case "meta":
      // Official Meta logo (simple-icons).
      return (
        <svg {...solid}>
          <path d="M6.915 4.03c-1.968 0-3.683 1.28-4.871 3.113C.704 9.208 0 11.883 0 14.449c0 .706.07 1.369.21 1.973a6.624 6.624 0 0 0 .265.86 5.297 5.297 0 0 0 .371.761c.696 1.159 1.818 1.927 3.593 1.927 1.497 0 2.633-.671 3.965-2.444.76-1.012 1.144-1.626 2.663-4.32l.756-1.339.186-.325c.061.1.121.196.183.299l2.152 3.595c.724 1.21 1.665 2.556 2.47 3.314 1.046.987 1.992 1.22 3.06 1.22 1.075 0 1.876-.355 2.455-.843a3.743 3.743 0 0 0 .81-.973c.542-.939.861-2.127.861-3.745 0-2.72-.681-5.357-2.084-7.45-1.282-1.912-2.957-2.93-4.716-2.93-1.047 0-2.088.467-3.053 1.308-.652.57-1.257 1.29-1.82 2.05-.69-.875-1.335-1.547-1.958-2.056-1.182-.966-2.315-1.303-3.454-1.303zm10.16 2.053c1.147 0 2.188.758 2.992 1.999 1.132 1.748 1.647 4.195 1.647 6.4 0 1.548-.368 2.9-1.839 2.9-.58 0-1.027-.23-1.664-1.004-.496-.601-1.343-1.878-2.832-4.358l-.617-1.028a44.908 44.908 0 0 0-1.255-1.98c.07-.109.141-.224.211-.327 1.12-1.667 2.118-2.602 3.358-2.602zm-10.201.553c1.265 0 2.058.791 2.675 1.446.307.327.737.871 1.234 1.579l-1.02 1.566c-.757 1.163-1.882 3.017-2.837 4.338-1.191 1.649-1.81 1.817-2.486 1.817-.524 0-1.038-.237-1.383-.794-.263-.426-.464-1.13-.464-2.046 0-2.221.63-4.535 1.66-6.088.454-.687.964-1.226 1.533-1.533a2.264 2.264 0 0 1 1.088-.285z" />
        </svg>
      );
    case "mail":
      return (
        <svg {...stroke}>
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
      className="relative py-32 max-md:py-20 max-sm:py-12 overflow-hidden max-md:[min-height:auto]"
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

      <div className="relative z-10 max-w-[1100px] mx-auto px-6 max-sm:px-4 text-center">
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
            className="text-4xl max-sm:text-3xl md:text-6xl font-medium leading-[1.05] mb-6"
            style={{ letterSpacing: "-0.03em" }}
          >
            Your leads are{" "}
            <span
              className="italic font-normal"
              style={{
                fontFamily: "var(--font-instrument-serif), serif",
                letterSpacing: "-0.02em",
              }}
            >
              leaking
            </span>
            .
          </h2>
        </Reveal>
        <Reveal delay={0.2}>
          <p
            className="mx-auto max-w-2xl text-lg md:text-xl leading-relaxed mb-20"
            style={{ color: "rgba(255,255,255,0.65)" }}
          >
            Spreadsheets, WhatsApp on someone's phone, Meta Lead Ads in an
            inbox no one checks. Every channel, a different system. Every
            system, a leak.
          </p>
        </Reveal>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-sm:gap-3 max-w-3xl mx-auto">
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
              className="relative rounded-2xl p-6 max-sm:p-4 overflow-hidden flex flex-col items-center justify-center text-center min-h-[140px]"
              style={{
                background: "rgba(14, 38, 30, 0.92)",
                border: "1px solid rgba(120, 200, 165, 0.18)",
                boxShadow:
                  "0 8px 24px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.04)",
                backdropFilter: "blur(12px) saturate(150%)",
                WebkitBackdropFilter: "blur(12px) saturate(150%)",
              }}
            >
              <div
                className="mb-3 mx-auto flex items-center justify-center h-7 w-7"
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
            The average inbound team takes <strong style={{ color: "#fff" }}>47 hours</strong> to
            respond to a lead. The fastest teams respond in under{" "}
            <strong style={{ color: "#319b72" }}>60 seconds</strong>.
          </p>
          <p
            className="mt-2 text-xs"
            style={{ color: "rgba(255,255,255,0.35)" }}
          >
            Source: Harvard Business Review — Lead Response Management Study
          </p>
        </Reveal>
      </div>
    </section>
  );
}
