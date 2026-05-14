"use client";

import {
  AnimatePresence,
  motion,
  useScroll,
  useMotionValueEvent,
} from "motion/react";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import MagneticButton from "../motion/MagneticButton";
import SplitText from "../motion/SplitText";
import AnimatedWaveDivider from "./AnimatedWaveDivider";

const INDUSTRY_VIEWS = [
  {
    key: "education",
    label: "Education",
    columns: ["Lead", "Program", "Destination", "Intake", "Stage"],
    rows: [
      { id: "#LD-4021", c1: "MBBS", c2: "Russia", c3: "Sep 2026", stage: "New", color: "#98cdb8" },
      { id: "#LD-4022", c1: "MBA", c2: "Australia", c3: "Jan 2027", stage: "Qualified", color: "#6fb99c" },
      { id: "#LD-4023", c1: "UG · Engineering", c2: "Canada", c3: "Sep 2026", stage: "Documents", color: "#319b72" },
      { id: "#LD-4024", c1: "PhD · Biology", c2: "Germany", c3: "Jan 2027", stage: "Visa filed", color: "#156548" },
    ],
  },
  {
    key: "travel",
    label: "Travel",
    columns: ["Lead", "Package", "Destination", "Departs", "Stage"],
    rows: [
      { id: "#LD-2204", c1: "10D · Group", c2: "Ladakh", c3: "Sep 2026", stage: "Enquiry", color: "#98cdb8" },
      { id: "#LD-2205", c1: "7D · Custom", c2: "Backwaters", c3: "Oct 2026", stage: "Itinerary", color: "#6fb99c" },
      { id: "#LD-2206", c1: "14D · Honeymoon", c2: "Bali", c3: "Dec 2026", stage: "Quoted", color: "#319b72" },
      { id: "#LD-2207", c1: "5D · Adventure", c2: "Manali", c3: "Nov 2026", stage: "Booked", color: "#156548" },
    ],
  },
  {
    key: "academy",
    label: "Academy",
    columns: ["Lead", "Program", "Variant", "Batch", "Stage"],
    rows: [
      { id: "#LD-7101", c1: "Yoga Foundation", c2: "Hatha", c3: "Batch 12", stage: "Trial", color: "#98cdb8" },
      { id: "#LD-7102", c1: "Music · Guitar", c2: "Beginner", c3: "Batch 04", stage: "Demo done", color: "#6fb99c" },
      { id: "#LD-7103", c1: "Dance · Classical", c2: "Intermediate", c3: "Batch 09", stage: "Enrolled", color: "#319b72" },
      { id: "#LD-7104", c1: "Painting · Oil", c2: "Advanced", c3: "Batch 02", stage: "Paid", color: "#156548" },
    ],
  },
  {
    key: "studio",
    label: "Video studio",
    columns: ["Lead", "Service", "Ambient", "Shoot date", "Stage"],
    rows: [
      { id: "#LD-9012", c1: "Wedding film", c2: "Indoor · 4K", c3: "Nov 2026", stage: "Brief", color: "#98cdb8" },
      { id: "#LD-9013", c1: "Brand reel", c2: "Studio · 8K", c3: "Sep 2026", stage: "Storyboard", color: "#6fb99c" },
      { id: "#LD-9014", c1: "Product shoot", c2: "Outdoor · 4K", c3: "Oct 2026", stage: "Shooting", color: "#319b72" },
      { id: "#LD-9015", c1: "Music video", c2: "Mixed · 6K", c3: "Dec 2026", stage: "Edit", color: "#156548" },
    ],
  },
] as const;

const HeroGlobeScene = dynamic(() => import("../three/HeroGlobeScene"), {
  ssr: false,
  loading: () => null,
});

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const progressRef = useRef(0);
  const [industryIdx, setIndustryIdx] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => {
      setIndustryIdx((v) => (v + 1) % INDUSTRY_VIEWS.length);
    }, 3800);
    return () => clearInterval(id);
  }, [paused]);

  const view = INDUSTRY_VIEWS[industryIdx];

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  // Write motion value to a plain ref so R3F's useFrame can read without re-renders
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    progressRef.current = v;
  });

  return (
    <section
      ref={sectionRef}
      data-nav-theme="dark"
      className="relative overflow-hidden"
      style={{
        background:
          "radial-gradient(140% 100% at 50% 0%, #1a4a37 0%, #0b2a1f 40%, #051912 70%, #020c08 100%)",
        color: "#fff",
        marginTop: -56,
        paddingTop: 56,
      }}
    >
      {/* Lazy-loaded R3F scene — vertical lead bars with climbing dots, scroll + cursor reactive */}
      <HeroGlobeScene progressRef={progressRef} />

      {/* Animated grid overlay */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
          maskImage:
            "radial-gradient(ellipse 80% 60% at 50% 30%, black 30%, transparent 70%)",
        }}
      />
      {/* Floating glass orbs */}
      <motion.div
        aria-hidden
        className="absolute -top-20 -left-20 w-[420px] h-[420px] rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(49,155,114,0.45) 0%, transparent 60%)",
          filter: "blur(40px)",
        }}
        animate={{ x: [0, 30, 0], y: [0, 20, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden
        className="absolute top-1/3 -right-20 w-[500px] h-[500px] rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(32,101,74,0.5) 0%, transparent 60%)",
          filter: "blur(50px)",
        }}
        animate={{ x: [0, -25, 0], y: [0, 30, 0] }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="relative max-w-[1200px] mx-auto px-6 max-sm:px-4 pt-28 md:pt-40 max-sm:pt-20 pb-32 md:pb-44 max-sm:pb-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-8"
          style={{
            border: "1px solid rgba(152, 205, 184, 0.25)",
            backgroundColor: "rgba(49,155,114,0.08)",
            color: "rgba(255,255,255,0.85)",
            fontSize: "13px",
          }}
        >
          <span
            className="w-1.5 h-1.5 rounded-full"
            style={{ backgroundColor: "#319b72", boxShadow: "0 0 8px #319b72" }}
          />
          The CRM operating system
        </motion.div>

        <h1
          className="text-5xl max-sm:text-[2.25rem] md:text-7xl lg:text-[88px] font-medium leading-[1.02]"
          style={{ letterSpacing: "-0.035em" }}
        >
          <SplitText
            text="Your leads deserve a "
            delay={0.1}
            stagger={0.025}
          />
          <motion.span
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.8,
              delay: 0.7,
              ease: [0.22, 1, 0.36, 1],
            }}
            style={{
              display: "inline-block",
              background:
                "linear-gradient(135deg, #319b72 0%, #98cdb8 50%, #ffffff 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            smarter CRM.
          </motion.span>
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="mt-7 mx-auto max-w-2xl text-lg md:text-xl leading-relaxed"
          style={{ color: "rgba(255,255,255,0.7)" }}
        >
          One lead. Many stages, many teams, many outcomes. Xale runs the
          layer underneath — roles, routing, hand-offs, every channel — so a
          five-person team and a 250-person org both move at the same speed.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <MagneticButton href="/signup" variant="primary">
            Start free →
          </MagneticButton>
          <MagneticButton href="/features" variant="ghost">
            See it in action ▶
          </MagneticButton>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-8 text-xs uppercase tracking-wider"
          style={{ color: "rgba(255,255,255,0.4)" }}
        >
          Free to start · No credit card · 5-minute setup
        </motion.p>
      </div>

      {/* Industry-view switcher — visually proves "one CRM, many industries" */}
      <div className="relative max-w-[980px] mx-auto px-6 max-sm:px-4 -mt-8 md:-mt-12 pb-24 max-sm:pb-16">
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="relative rounded-2xl overflow-hidden"
          style={{
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)",
            border: "1px solid rgba(255,255,255,0.1)",
            boxShadow:
              "0 30px 80px -20px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.05) inset",
            backdropFilter: "blur(20px)",
          }}
        >
          {/* Browser chrome */}
          <div
            className="flex items-center gap-1.5 px-4 py-3 border-b"
            style={{ borderColor: "rgba(255,255,255,0.06)" }}
          >
            <span className="w-2.5 h-2.5 rounded-full bg-red-400/70" />
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-400/70" />
            <span className="w-2.5 h-2.5 rounded-full bg-green-400/70" />
            <span
              className="ml-3 text-xs"
              style={{ color: "rgba(255,255,255,0.5)" }}
            >
              app.xale.in / leads
            </span>
          </div>

          {/* Industry tab strip */}
          <div
            className="flex items-center justify-between px-5 py-3 max-sm:px-3 border-b gap-3"
            style={{ borderColor: "rgba(255,255,255,0.06)" }}
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
          >
            <div
              className="text-[10px] uppercase tracking-[0.2em] shrink-0 max-sm:hidden"
              style={{ color: "rgba(255,255,255,0.4)" }}
            >
              Industry
            </div>
            <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-hide flex-1 justify-end max-sm:justify-start">
              {INDUSTRY_VIEWS.map((v, i) => {
                const active = i === industryIdx;
                return (
                  <button
                    key={v.key}
                    onClick={() => setIndustryIdx(i)}
                    className="relative shrink-0 px-3 py-1.5 max-sm:px-2.5 max-sm:py-1 text-xs max-sm:text-[11px] rounded-md transition-colors"
                    style={{
                      color: active
                        ? "rgba(255,255,255,0.95)"
                        : "rgba(255,255,255,0.5)",
                      background: active
                        ? "rgba(152,205,184,0.1)"
                        : "transparent",
                      border: active
                        ? "1px solid rgba(152,205,184,0.25)"
                        : "1px solid transparent",
                    }}
                  >
                    <span className="flex items-center gap-2">
                      <span
                        className="w-1.5 h-1.5 rounded-full"
                        style={{
                          backgroundColor: active
                            ? "#98cdb8"
                            : "rgba(255,255,255,0.3)",
                          boxShadow: active ? "0 0 6px #98cdb8" : "none",
                        }}
                      />
                      {v.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Morphing table */}
          <div className="relative min-h-[280px] max-sm:min-h-[240px]">
            {/* Column headers */}
            <div
              className="grid px-5 py-2.5 max-sm:px-3 text-[10px] uppercase tracking-wider border-b"
              style={{
                gridTemplateColumns: "0.9fr 1.3fr 1.1fr 0.9fr 0.9fr",
                color: "rgba(255,255,255,0.4)",
                borderColor: "rgba(255,255,255,0.06)",
              }}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={view.key + "-headers"}
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 4 }}
                  transition={{ duration: 0.25 }}
                  className="contents"
                >
                  {view.columns.map((col) => (
                    <div key={col} className="truncate">
                      {col}
                    </div>
                  ))}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Rows */}
            <AnimatePresence mode="wait">
              <motion.div
                key={view.key + "-rows"}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="divide-y"
                style={{ borderColor: "rgba(255,255,255,0.04)" }}
              >
                {view.rows.map((row, i) => (
                  <motion.div
                    key={row.id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.35, delay: 0.05 + i * 0.05 }}
                    className="grid items-center px-5 py-3 max-sm:px-3 max-sm:py-2.5 text-[13px] max-sm:text-xs"
                    style={{
                      gridTemplateColumns: "0.9fr 1.3fr 1.1fr 0.9fr 0.9fr",
                      borderColor: "rgba(255,255,255,0.04)",
                      color: "rgba(255,255,255,0.85)",
                    }}
                  >
                    <div
                      className="font-mono truncate"
                      style={{ color: "rgba(255,255,255,0.55)" }}
                    >
                      {row.id}
                    </div>
                    <div className="font-medium truncate">{row.c1}</div>
                    <div
                      className="truncate"
                      style={{ color: "rgba(255,255,255,0.7)" }}
                    >
                      {row.c2}
                    </div>
                    <div
                      className="truncate"
                      style={{ color: "rgba(255,255,255,0.7)" }}
                    >
                      {row.c3}
                    </div>
                    <div>
                      <span
                        className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] max-sm:text-[10px]"
                        style={{
                          background: `${row.color}1A`,
                          border: `1px solid ${row.color}40`,
                          color: row.color,
                        }}
                      >
                        <span
                          className="w-1 h-1 rounded-full"
                          style={{ backgroundColor: row.color }}
                        />
                        {row.stage}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Footer tagline */}
          <div
            className="px-5 py-3 max-sm:px-3 border-t flex items-center justify-between gap-3 text-[11px] max-sm:text-[10px]"
            style={{
              borderColor: "rgba(255,255,255,0.06)",
              color: "rgba(255,255,255,0.45)",
            }}
          >
            <span>
              Same CRM. Different shape —{" "}
              <span style={{ color: "rgba(255,255,255,0.7)" }}>
                your fields, your stages, your terminology.
              </span>
            </span>
            <span className="max-sm:hidden font-mono">
              {String(industryIdx + 1).padStart(2, "0")} /{" "}
              {String(INDUSTRY_VIEWS.length).padStart(2, "0")}
            </span>
          </div>
        </motion.div>
      </div>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { scrollbar-width: none; }
      `}</style>
      <AnimatedWaveDivider fill="#020c08" height={120} />
    </section>
  );
}
