"use client";

import { motion } from "motion/react";
import Reveal from "../motion/Reveal";
import CountUp from "../motion/CountUp";

const NEON = "#3dffb0";
const NEON_DIM = "#319b72";
const NEON_SOFT = "rgba(61,255,176,0.12)";
const NEON_LINE = "rgba(61,255,176,0.25)";

// Pipeline area-chart data (normalised 0–100 from bottom).
const PIPELINE = [12, 26, 18, 38, 32, 50, 44, 62, 58, 74, 82, 95];

function buildAreaPath(points: number[], w: number, h: number, pad = 0) {
  if (!points.length) return "";
  const stepX = (w - pad * 2) / (points.length - 1);
  const xy = points.map((v, i) => [
    pad + i * stepX,
    h - (v / 100) * (h - 4) - 2,
  ]);
  // Smooth-ish line via mid-point curves
  let d = `M ${xy[0][0]} ${xy[0][1]}`;
  for (let i = 1; i < xy.length; i++) {
    const [x1, y1] = xy[i - 1];
    const [x2, y2] = xy[i];
    const mx = (x1 + x2) / 2;
    d += ` Q ${mx} ${y1}, ${mx} ${(y1 + y2) / 2} T ${x2} ${y2}`;
  }
  return d;
}

function buildLinePath(points: number[], w: number, h: number, pad = 0) {
  // returns path + closed area path
  const line = buildAreaPath(points, w, h, pad);
  const stepX = (w - pad * 2) / (points.length - 1);
  const lastX = pad + (points.length - 1) * stepX;
  const area = `${line} L ${lastX} ${h} L ${pad} ${h} Z`;
  return { line, area };
}

const LEADERBOARD = [
  { initials: "AS", name: "Arjun S.", pct: 87, value: "₹ 2.4M" },
  { initials: "RP", name: "Riya P.", pct: 62, value: "₹ 1.8M" },
  { initials: "NK", name: "Nikhil K.", pct: 48, value: "₹ 1.2M" },
];

export default function ChapterReports() {
  const chartW = 460;
  const chartH = 140;
  const { line: linePath, area: areaPath } = buildLinePath(
    PIPELINE,
    chartW,
    chartH,
    4
  );

  return (
    <section
      data-nav-theme="dark"
      className="relative overflow-hidden py-32 max-md:py-16 max-sm:py-12"
      style={{
        backgroundColor: "#020c08",
        color: "#fff",
      }}
    >
      {/* Ambient backdrop: radial glow + grid floor + drifting orbs */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(60% 50% at 75% 40%, rgba(16,80,55,0.55) 0%, transparent 70%), radial-gradient(45% 40% at 20% 70%, rgba(8,40,28,0.45) 0%, transparent 70%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.18]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(61,255,176,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(61,255,176,0.12) 1px, transparent 1px)",
          backgroundSize: "44px 44px",
          maskImage:
            "radial-gradient(70% 60% at 50% 50%, #000 30%, transparent 75%)",
          WebkitMaskImage:
            "radial-gradient(70% 60% at 50% 50%, #000 30%, transparent 75%)",
        }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -top-32 -left-20 w-[440px] h-[440px] rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(61,255,176,0.18) 0%, transparent 70%)",
          filter: "blur(20px)",
        }}
        animate={{ y: [0, 30, 0], x: [0, 20, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -bottom-40 -right-10 w-[500px] h-[500px] rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(20,120,80,0.25) 0%, transparent 70%)",
          filter: "blur(30px)",
        }}
        animate={{ y: [0, -25, 0], x: [0, -15, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="relative max-w-[1240px] mx-auto px-6 max-sm:px-4">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.15fr] gap-16 max-md:gap-10 items-center">
          {/* LEFT — Copy */}
          <div>
            <Reveal>
              <div
                className="inline-flex items-center gap-2 mb-6 px-3 py-1.5 rounded-full text-[11px] uppercase tracking-[0.25em]"
                style={{
                  border: `1px solid ${NEON_LINE}`,
                  background: NEON_SOFT,
                  color: NEON,
                }}
              >
                <motion.span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{
                    backgroundColor: NEON,
                    boxShadow: `0 0 8px ${NEON}`,
                  }}
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ duration: 1.6, repeat: Infinity }}
                />
                System online · Chapter V
              </div>
            </Reveal>
            <Reveal delay={0.05}>
              <h2
                className="text-4xl max-sm:text-3xl md:text-[56px] font-medium leading-[1.02] mb-6"
                style={{ letterSpacing: "-0.035em" }}
              >
                Numbers that actually{" "}
                <span
                  className="italic font-normal"
                  style={{
                    fontFamily: "var(--font-instrument-serif), serif",
                    letterSpacing: "-0.02em",
                    color: NEON,
                    textShadow: `0 0 24px ${NEON_SOFT}`,
                  }}
                >
                  mean something
                </span>
                .
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p
                className="text-lg max-sm:text-base leading-relaxed mb-10 max-w-[480px]"
                style={{ color: "rgba(255,255,255,0.62)" }}
              >
                Real-time. Per branch. Per source. Per anyone you want.
                Dashboards that read like a sales playbook, not a database.
              </p>
            </Reveal>
            <Reveal delay={0.15}>
              <ul className="space-y-3.5">
                {[
                  "Pipeline value over time, by source and stage",
                  "Conversion funnel — where leads stick or drop",
                  "Team leaderboard with response-time SLAs",
                  "Follow-up compliance — who's overdue, who's on it",
                ].map((b, i) => (
                  <motion.li
                    key={b}
                    initial={{ opacity: 0, x: -12 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{ duration: 0.5, delay: 0.2 + i * 0.07 }}
                    className="flex items-start gap-3 text-base max-sm:text-sm leading-relaxed"
                    style={{ color: "rgba(255,255,255,0.78)" }}
                  >
                    <span
                      className="mt-1.5 flex items-center justify-center w-4 h-4 rounded-[3px] flex-shrink-0"
                      style={{
                        border: `1px solid ${NEON_LINE}`,
                        background: NEON_SOFT,
                      }}
                    >
                      <span
                        className="w-1.5 h-1.5 rounded-[1px]"
                        style={{
                          backgroundColor: NEON,
                          boxShadow: `0 0 6px ${NEON}`,
                        }}
                      />
                    </span>
                    {b}
                  </motion.li>
                ))}
              </ul>
            </Reveal>
          </div>

          {/* RIGHT — Holographic console */}
          <Reveal delay={0.1}>
            <div
              className="relative rounded-[20px] p-5 max-sm:p-4"
              style={{
                background:
                  "linear-gradient(180deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.015) 100%)",
                border: `1px solid ${NEON_LINE}`,
                backdropFilter: "blur(20px)",
                boxShadow: `0 30px 100px -20px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.02), inset 0 1px 0 rgba(255,255,255,0.04)`,
              }}
            >
              {/* Corner brackets */}
              {[
                { t: 0, l: 0, b: "auto", r: "auto", rot: 0 },
                { t: 0, r: 0, b: "auto", l: "auto", rot: 90 },
                { b: 0, r: 0, t: "auto", l: "auto", rot: 180 },
                { b: 0, l: 0, t: "auto", r: "auto", rot: 270 },
              ].map((c, i) => (
                <span
                  key={i}
                  aria-hidden
                  className="absolute w-3 h-3 pointer-events-none"
                  style={{
                    top: c.t as number | string,
                    left: c.l as number | string,
                    right: c.r as number | string,
                    bottom: c.b as number | string,
                    transform: `translate(${
                      i === 0 || i === 3 ? "-2px" : "2px"
                    }, ${i < 2 ? "-2px" : "2px"}) rotate(${c.rot}deg)`,
                    borderTop: `1.5px solid ${NEON}`,
                    borderLeft: `1.5px solid ${NEON}`,
                    boxShadow: `0 0 8px ${NEON_SOFT}`,
                  }}
                />
              ))}

              {/* HUD header */}
              <div
                className="flex items-center justify-between mb-5 pb-3"
                style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
              >
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <motion.span
                      className="w-1.5 h-1.5 rounded-full"
                      style={{
                        backgroundColor: NEON,
                        boxShadow: `0 0 8px ${NEON}`,
                      }}
                      animate={{ opacity: [1, 0.2, 1], scale: [1, 1.2, 1] }}
                      transition={{ duration: 1.4, repeat: Infinity }}
                    />
                    <span
                      className="text-[10px] uppercase tracking-[0.2em] font-medium"
                      style={{ color: NEON }}
                    >
                      Live
                    </span>
                  </div>
                  <span
                    className="text-[10px] uppercase tracking-[0.2em]"
                    style={{ color: "rgba(255,255,255,0.4)" }}
                  >
                    · Last 30 days · All branches
                  </span>
                </div>
                <div
                  className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.18em]"
                  style={{ color: "rgba(255,255,255,0.4)" }}
                >
                  <span
                    className="font-medium"
                    style={{ color: "rgba(255,255,255,0.6)" }}
                  >
                    XALE
                  </span>
                  / OPS
                </div>
              </div>

              {/* Hero metric — Pipeline value with animated area chart */}
              <div className="mb-5">
                <div className="flex items-end justify-between mb-3">
                  <div>
                    <div
                      className="text-[10px] uppercase tracking-[0.2em] mb-1.5"
                      style={{ color: "rgba(255,255,255,0.45)" }}
                    >
                      Pipeline Value
                    </div>
                    <div className="flex items-baseline gap-3">
                      <div
                        className="text-[44px] max-sm:text-3xl font-medium leading-none"
                        style={{
                          letterSpacing: "-0.04em",
                          fontVariantNumeric: "tabular-nums",
                          textShadow: `0 0 30px ${NEON_SOFT}`,
                        }}
                      >
                        ₹ <CountUp to={8.4} decimals={1} suffix="M" />
                      </div>
                      <div
                        className="flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full"
                        style={{
                          color: NEON,
                          background: NEON_SOFT,
                          border: `1px solid ${NEON_LINE}`,
                        }}
                      >
                        <span style={{ fontSize: "10px" }}>▲</span> 23.4%
                      </div>
                    </div>
                  </div>
                  <div
                    className="text-right text-[10px] uppercase tracking-[0.2em] leading-relaxed"
                    style={{ color: "rgba(255,255,255,0.35)" }}
                  >
                    <div>JAN — APR</div>
                    <div style={{ color: "rgba(255,255,255,0.55)" }}>
                      12 weeks
                    </div>
                  </div>
                </div>

                <div className="relative">
                  <svg
                    viewBox={`0 0 ${chartW} ${chartH}`}
                    className="w-full h-[140px] max-sm:h-[110px]"
                    preserveAspectRatio="none"
                  >
                    <defs>
                      <linearGradient
                        id="areaGrad"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop offset="0%" stopColor={NEON} stopOpacity="0.35" />
                        <stop
                          offset="100%"
                          stopColor={NEON}
                          stopOpacity="0"
                        />
                      </linearGradient>
                      <linearGradient
                        id="lineGrad"
                        x1="0"
                        y1="0"
                        x2="1"
                        y2="0"
                      >
                        <stop offset="0%" stopColor={NEON_DIM} />
                        <stop offset="100%" stopColor={NEON} />
                      </linearGradient>
                      <filter
                        id="glow"
                        x="-20%"
                        y="-20%"
                        width="140%"
                        height="140%"
                      >
                        <feGaussianBlur stdDeviation="3" result="blur" />
                        <feMerge>
                          <feMergeNode in="blur" />
                          <feMergeNode in="SourceGraphic" />
                        </feMerge>
                      </filter>
                    </defs>

                    {/* horizontal grid lines */}
                    {[0.25, 0.5, 0.75].map((g) => (
                      <line
                        key={g}
                        x1="0"
                        x2={chartW}
                        y1={chartH * g}
                        y2={chartH * g}
                        stroke="rgba(255,255,255,0.05)"
                        strokeDasharray="2 4"
                      />
                    ))}

                    <motion.path
                      d={areaPath}
                      fill="url(#areaGrad)"
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.2, delay: 0.6 }}
                    />
                    <motion.path
                      d={linePath}
                      fill="none"
                      stroke="url(#lineGrad)"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      filter="url(#glow)"
                      initial={{ pathLength: 0 }}
                      whileInView={{ pathLength: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
                    />
                    {/* end dot with pulse */}
                    <motion.circle
                      cx={chartW - 4}
                      cy={chartH - (PIPELINE[PIPELINE.length - 1] / 100) * (chartH - 4) - 2}
                      r="4"
                      fill={NEON}
                      filter="url(#glow)"
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: 1.6 }}
                    />
                  </svg>
                </div>
              </div>

              {/* 2-up stat row */}
              <div className="grid grid-cols-2 gap-3 mb-5">
                {/* Conversion ring */}
                <div
                  className="relative p-4 rounded-xl flex items-center gap-4"
                  style={{
                    background: "rgba(255,255,255,0.025)",
                    border: "1px solid rgba(255,255,255,0.06)",
                  }}
                >
                  <svg width="68" height="68" viewBox="0 0 68 68">
                    <defs>
                      <linearGradient id="ringGrad" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor={NEON_DIM} />
                        <stop offset="100%" stopColor={NEON} />
                      </linearGradient>
                    </defs>
                    <circle
                      cx="34"
                      cy="34"
                      r="28"
                      fill="none"
                      stroke="rgba(255,255,255,0.07)"
                      strokeWidth="4"
                    />
                    <motion.circle
                      cx="34"
                      cy="34"
                      r="28"
                      fill="none"
                      stroke="url(#ringGrad)"
                      strokeWidth="4"
                      strokeLinecap="round"
                      strokeDasharray={2 * Math.PI * 28}
                      transform="rotate(-90 34 34)"
                      style={{ filter: `drop-shadow(0 0 6px ${NEON_SOFT})` }}
                      initial={{ strokeDashoffset: 2 * Math.PI * 28 }}
                      whileInView={{
                        strokeDashoffset:
                          2 * Math.PI * 28 * (1 - 0.236),
                      }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.4, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
                    />
                    <text
                      x="34"
                      y="38"
                      textAnchor="middle"
                      fill="#fff"
                      style={{
                        fontSize: "14px",
                        fontWeight: 500,
                        letterSpacing: "-0.02em",
                        fontVariantNumeric: "tabular-nums",
                      }}
                    >
                      23.6%
                    </text>
                  </svg>
                  <div>
                    <div
                      className="text-[10px] uppercase tracking-[0.18em] mb-1"
                      style={{ color: "rgba(255,255,255,0.45)" }}
                    >
                      Conversion
                    </div>
                    <div
                      className="text-xs"
                      style={{ color: NEON }}
                    >
                      ▲ 4.2 pts
                    </div>
                  </div>
                </div>

                {/* Response time with sparkline */}
                <div
                  className="relative p-4 rounded-xl"
                  style={{
                    background: "rgba(255,255,255,0.025)",
                    border: "1px solid rgba(255,255,255,0.06)",
                  }}
                >
                  <div
                    className="text-[10px] uppercase tracking-[0.18em] mb-1"
                    style={{ color: "rgba(255,255,255,0.45)" }}
                  >
                    Avg Response
                  </div>
                  <div className="flex items-baseline gap-2 mb-2">
                    <div
                      className="text-2xl font-medium leading-none"
                      style={{
                        letterSpacing: "-0.03em",
                        fontVariantNumeric: "tabular-nums",
                      }}
                    >
                      <CountUp to={22} suffix="s" />
                    </div>
                    <div
                      className="text-[11px]"
                      style={{ color: NEON }}
                    >
                      ▼ 18%
                    </div>
                  </div>
                  <svg
                    viewBox="0 0 120 26"
                    className="w-full h-[26px]"
                    preserveAspectRatio="none"
                  >
                    <motion.path
                      d="M 0 6 L 15 10 L 30 8 L 45 14 L 60 12 L 75 18 L 90 16 L 105 22 L 120 22"
                      fill="none"
                      stroke={NEON}
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      style={{ filter: `drop-shadow(0 0 3px ${NEON_SOFT})` }}
                      initial={{ pathLength: 0 }}
                      whileInView={{ pathLength: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.2, delay: 0.9 }}
                    />
                  </svg>
                </div>
              </div>

              {/* Leaderboard */}
              <div
                className="p-4 rounded-xl"
                style={{
                  background: "rgba(255,255,255,0.025)",
                  border: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                <div className="flex items-center justify-between mb-3">
                  <div
                    className="text-[10px] uppercase tracking-[0.2em]"
                    style={{ color: "rgba(255,255,255,0.45)" }}
                  >
                    Team Leaderboard
                  </div>
                  <div
                    className="text-[10px] uppercase tracking-[0.2em]"
                    style={{ color: "rgba(255,255,255,0.3)" }}
                  >
                    This week
                  </div>
                </div>
                <div className="space-y-2.5">
                  {LEADERBOARD.map((row, i) => (
                    <motion.div
                      key={row.name}
                      initial={{ opacity: 0, x: 16 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: 0.9 + i * 0.1 }}
                      className="flex items-center gap-3"
                    >
                      <div
                        className="w-7 h-7 rounded-md flex items-center justify-center text-[10px] font-medium flex-shrink-0"
                        style={{
                          background: `linear-gradient(135deg, ${NEON_DIM}, ${NEON})`,
                          color: "#020c08",
                          boxShadow: `0 0 12px ${NEON_SOFT}`,
                        }}
                      >
                        {row.initials}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1.5">
                          <div
                            className="text-xs truncate"
                            style={{ color: "rgba(255,255,255,0.85)" }}
                          >
                            {row.name}
                          </div>
                          <div
                            className="text-[11px] font-medium flex-shrink-0 ml-2"
                            style={{
                              color: "rgba(255,255,255,0.7)",
                              fontVariantNumeric: "tabular-nums",
                            }}
                          >
                            {row.value}
                          </div>
                        </div>
                        <div
                          className="h-1 rounded-full overflow-hidden"
                          style={{
                            background: "rgba(255,255,255,0.06)",
                          }}
                        >
                          <motion.div
                            className="h-full rounded-full"
                            style={{
                              background: `linear-gradient(90deg, ${NEON_DIM}, ${NEON})`,
                              boxShadow: `0 0 8px ${NEON_SOFT}`,
                            }}
                            initial={{ width: 0 }}
                            whileInView={{ width: `${row.pct}%` }}
                            viewport={{ once: true }}
                            transition={{
                              duration: 1,
                              delay: 1 + i * 0.1,
                              ease: [0.22, 1, 0.36, 1],
                            }}
                          />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Scanline sweep */}
              <motion.div
                aria-hidden
                className="absolute left-0 right-0 h-px pointer-events-none"
                style={{
                  background: `linear-gradient(90deg, transparent, ${NEON}, transparent)`,
                  opacity: 0.4,
                }}
                animate={{ top: ["0%", "100%", "0%"] }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "linear",
                }}
              />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
