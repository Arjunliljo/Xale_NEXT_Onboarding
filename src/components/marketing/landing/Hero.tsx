"use client";

import { motion, useScroll, useMotionValueEvent } from "motion/react";
import dynamic from "next/dynamic";
import { useRef } from "react";
import MagneticButton from "../motion/MagneticButton";
import SplitText from "../motion/SplitText";

const HeroGlobeScene = dynamic(() => import("../three/HeroGlobeScene"), {
  ssr: false,
  loading: () => null,
});

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const progressRef = useRef(0);

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

      <div className="relative max-w-[1200px] mx-auto px-6 pt-28 md:pt-40 pb-32 md:pb-44 text-center">
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
          The CRM operating system · v1
        </motion.div>

        <h1
          className="text-5xl md:text-7xl lg:text-[88px] font-medium leading-[1.02]"
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
          Capture, nurture, and convert with WhatsApp, Meta Ads, and automation
          — one platform, every channel, built for teams that move fast.
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

      {/* Mock kanban floating preview */}
      <div className="relative max-w-[1100px] mx-auto px-6 -mt-8 md:-mt-12 pb-24">
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
              app.xale.in / pipeline
            </span>
          </div>
          <div className="grid grid-cols-4 gap-3 p-4">
            {[
              { stage: "New", count: 14, color: "#98cdb8" },
              { stage: "Qualified", count: 8, color: "#6fb99c" },
              { stage: "In Progress", count: 5, color: "#319b72" },
              { stage: "Won", count: 3, color: "#156548" },
            ].map((col, i) => (
              <div key={col.stage} className="space-y-2">
                <div
                  className="flex items-center justify-between text-xs px-2 py-1.5"
                  style={{ color: "rgba(255,255,255,0.7)" }}
                >
                  <span className="flex items-center gap-1.5">
                    <span
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ backgroundColor: col.color }}
                    />
                    {col.stage}
                  </span>
                  <span>{col.count}</span>
                </div>
                {[0, 1, 2].map((j) => (
                  <motion.div
                    key={j}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.5,
                      delay: 0.6 + i * 0.1 + j * 0.05,
                    }}
                    className="rounded-lg p-3 text-left"
                    style={{
                      backgroundColor: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(255,255,255,0.06)",
                    }}
                  >
                    <div
                      className="text-xs font-medium mb-1"
                      style={{ color: "rgba(255,255,255,0.85)" }}
                    >
                      {
                        [
                          "Anjana Pillai",
                          "Kayal Studio",
                          "Hari Menon",
                          "Neethu S.",
                          "Nila Academy",
                          "Arjun K.",
                          "Backwater Reels",
                          "Parvathy R.",
                          "Vembanad Films",
                          "Munnar Trails",
                          "Meera Nair",
                          "Kerala Wings",
                        ][i * 3 + j]
                      }
                    </div>
                    <div
                      className="text-[10px] uppercase tracking-wider"
                      style={{ color: "rgba(255,255,255,0.4)" }}
                    >
                      {
                        ["Meta · IELTS", "WhatsApp · Reel", "Meta · Visa"][
                          j % 3
                        ]
                      }
                    </div>
                  </motion.div>
                ))}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
