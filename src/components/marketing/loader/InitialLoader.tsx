"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";

const MIN_DURATION = 2000;
const HOLD_AFTER_FULL = 220;

export default function InitialLoader() {
  const [progress, setProgress] = useState(0);
  const [hide, setHide] = useState(false);

  useEffect(() => {
    let raf = 0;
    let cancelled = false;
    let loaded = document.readyState === "complete";

    const onLoad = () => {
      loaded = true;
    };
    if (!loaded) window.addEventListener("load", onLoad);

    const start = performance.now();

    const tick = (t: number) => {
      if (cancelled) return;
      const elapsed = t - start;
      const timeRatio = Math.min(elapsed / MIN_DURATION, 1);
      const eased = 1 - Math.pow(1 - timeRatio, 3);
      let pct = Math.round(eased * 100);
      if (!loaded && pct > 92) pct = 92;
      setProgress(pct);
      if (pct >= 100 && loaded) return;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      window.removeEventListener("load", onLoad);
    };
  }, []);

  useEffect(() => {
    if (progress < 100) return;
    const t = window.setTimeout(() => setHide(true), HOLD_AFTER_FULL);
    return () => window.clearTimeout(t);
  }, [progress]);

  useEffect(() => {
    if (hide) {
      document.body.style.overflow = "";
      return;
    }
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [hide]);

  return (
    <AnimatePresence>
      {!hide && (
        <motion.div
          aria-hidden
          initial={false}
          exit={{
            opacity: 0,
            scale: 1.08,
            filter: "blur(14px)",
          }}
          transition={{ duration: 0.78, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden"
          style={{
            background:
              "radial-gradient(140% 100% at 50% 0%, #1a4a37 0%, #0b2a1f 40%, #051912 70%, #020c08 100%)",
            transformOrigin: "50% 50%",
            willChange: "opacity, transform, filter",
          }}
        >
          {/* Faint grid */}
          <div
            aria-hidden
            className="absolute inset-0 opacity-[0.05] pointer-events-none"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)",
              backgroundSize: "60px 60px",
              maskImage:
                "radial-gradient(ellipse 60% 40% at 50% 50%, black 30%, transparent 70%)",
              WebkitMaskImage:
                "radial-gradient(ellipse 60% 40% at 50% 50%, black 30%, transparent 70%)",
            }}
          />

          {/* Pulsing emerald glow */}
          <motion.div
            aria-hidden
            className="absolute w-[700px] h-[700px] rounded-full pointer-events-none"
            style={{
              background:
                "radial-gradient(circle, rgba(49,155,114,0.35) 0%, transparent 60%)",
              filter: "blur(60px)",
            }}
            animate={{ scale: [1, 1.12, 1], opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* Content stack */}
          <motion.div
            className="relative z-10 flex flex-col items-center px-6"
            animate={
              progress >= 100
                ? { opacity: 0, y: -12 }
                : { opacity: 1, y: 0 }
            }
            transition={{
              duration: 0.5,
              ease: [0.22, 1, 0.36, 1],
              delay: progress >= 100 ? 0.05 : 0,
            }}
          >
            {/* Wordmark */}
            <div className="flex items-end overflow-hidden leading-[0.85]">
              {"XALE".split("").map((ch, i) => (
                <motion.span
                  key={ch + i}
                  initial={{ y: "110%", opacity: 0 }}
                  animate={{ y: "0%", opacity: 1 }}
                  transition={{
                    duration: 0.85,
                    delay: 0.18 + i * 0.07,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="inline-block text-[88px] sm:text-[120px] md:text-[160px] font-medium"
                  style={{
                    letterSpacing: "-0.06em",
                    color: "#ffffff",
                  }}
                >
                  {ch}
                </motion.span>
              ))}
            </div>

            {/* Accent line */}
            <motion.div
              aria-hidden
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{
                duration: 0.7,
                delay: 0.55,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="mt-6 h-px w-24 origin-left"
              style={{
                background:
                  "linear-gradient(90deg, transparent 0%, #319b72 50%, transparent 100%)",
              }}
            />

            {/* Tagline */}
            <motion.p
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 0.55, y: 0 }}
              transition={{
                duration: 0.6,
                delay: 0.65,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="mt-4 text-[10px] sm:text-[11px] uppercase tracking-[0.36em] text-center"
              style={{ color: "rgba(255,255,255,0.55)" }}
            >
              The CRM operating system
            </motion.p>

            {/* Progress */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.85 }}
              className="mt-14 flex items-center gap-4"
            >
              <span
                className="text-[10px] tabular-nums tracking-[0.2em]"
                style={{ color: "rgba(255,255,255,0.45)" }}
              >
                {String(progress).padStart(3, "0")}
              </span>
              <div
                className="relative w-[180px] sm:w-[240px] h-px overflow-hidden"
                style={{ backgroundColor: "rgba(255,255,255,0.12)" }}
              >
                <motion.div
                  className="absolute inset-y-0 left-0"
                  style={{
                    width: `${progress}%`,
                    background:
                      "linear-gradient(90deg, #156548 0%, #319b72 50%, #98cdb8 100%)",
                    boxShadow:
                      "0 0 12px rgba(49,155,114,0.7), 0 0 4px rgba(152,205,184,0.5)",
                  }}
                />
                {/* Leading shimmer dot */}
                <motion.div
                  className="absolute top-1/2 h-[6px] w-[6px] rounded-full -translate-y-1/2"
                  style={{
                    left: `calc(${progress}% - 3px)`,
                    background: "#98cdb8",
                    boxShadow: "0 0 12px #98cdb8",
                    opacity: progress > 0 && progress < 100 ? 1 : 0,
                  }}
                />
              </div>
              <span
                className="text-[10px] tabular-nums tracking-[0.2em]"
                style={{ color: "rgba(255,255,255,0.45)" }}
              >
                100
              </span>
            </motion.div>
          </motion.div>

          {/* Subtle bottom signature */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.35 }}
            transition={{ duration: 0.8, delay: 1.0 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 text-[10px] uppercase tracking-[0.32em]"
            style={{ color: "rgba(255,255,255,0.45)" }}
          >
            v1 · by Marketlube
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
