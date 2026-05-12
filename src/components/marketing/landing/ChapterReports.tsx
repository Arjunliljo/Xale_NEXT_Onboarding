"use client";

import { motion } from "motion/react";
import Reveal from "../motion/Reveal";
import CountUp from "../motion/CountUp";

export default function ChapterReports() {
  return (
    <section
      data-nav-theme="dark"
      className="py-32 max-md:py-12 max-sm:py-8"
      style={{
        backgroundColor: "#020c08",
        backgroundImage:
          "radial-gradient(70% 55% at 50% 50%, rgba(16,47,35,0.9) 0%, transparent 70%)",
        color: "#fff",
      }}
    >
      <div className="max-w-[1200px] mx-auto px-6 max-sm:px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 max-md:gap-10 items-center">
          <div>
            <Reveal>
              <p
                className="text-sm uppercase tracking-[0.2em] mb-6"
                style={{ color: "#98cdb8" }}
              >
                Chapter V — Reports & Dashboard
              </p>
            </Reveal>
            <Reveal delay={0.05}>
              <h2
                className="text-4xl max-sm:text-3xl md:text-5xl font-medium leading-[1.05] mb-6"
                style={{ letterSpacing: "-0.03em" }}
              >
                Numbers that actually mean something.
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p
                className="text-lg leading-relaxed mb-8"
                style={{ color: "rgba(255,255,255,0.65)" }}
              >
                Real-time. Per branch. Per source. Per anyone you want.
                Dashboards that read like a sales playbook, not a database.
              </p>
            </Reveal>
            <Reveal delay={0.15}>
              <ul className="space-y-4">
                {[
                  "Pipeline value over time, by source and stage",
                  "Conversion funnel — where leads stick or drop",
                  "Team leaderboard with response-time SLAs",
                  "Follow-up compliance — who's overdue, who's on it",
                ].map((b) => (
                  <li
                    key={b}
                    className="flex items-start gap-3 text-base leading-relaxed"
                    style={{ color: "rgba(255,255,255,0.75)" }}
                  >
                    <span
                      className="mt-2 w-1.5 h-1.5 rounded-full flex-shrink-0"
                      style={{ backgroundColor: "#319b72" }}
                    />
                    {b}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>

          {/* Chart cards */}
          <div className="grid grid-cols-1 gap-4">
            {[
              {
                title: "Pipeline value",
                metric: 8.4,
                suffix: "M ₹",
                bars: [40, 55, 48, 70, 62, 88, 95],
              },
              {
                title: "Conversion rate",
                metric: 23.6,
                suffix: "%",
                bars: [30, 45, 38, 50, 55, 60, 68],
              },
              {
                title: "Avg response time",
                metric: 22,
                suffix: " sec",
                bars: [80, 70, 60, 50, 40, 30, 22],
              },
            ].map((card, i) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.6, delay: 0.2 + i * 0.1 }}
                className="rounded-2xl p-6 max-sm:p-4"
                style={{
                  backgroundColor: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  backdropFilter: "blur(20px)",
                }}
              >
                <div className="flex items-baseline justify-between mb-4">
                  <div
                    className="text-xs uppercase tracking-wider"
                    style={{ color: "rgba(255,255,255,0.5)" }}
                  >
                    {card.title}
                  </div>
                  <div
                    className="text-2xl font-medium"
                    style={{ color: "#fff", letterSpacing: "-0.02em" }}
                  >
                    <CountUp
                      to={card.metric}
                      suffix={card.suffix}
                      decimals={card.metric % 1 !== 0 ? 1 : 0}
                    />
                  </div>
                </div>
                <div className="flex items-end gap-1.5 h-10">
                  {card.bars.map((h, j) => (
                    <motion.div
                      key={j}
                      initial={{ height: 0 }}
                      whileInView={{ height: `${h}%` }}
                      viewport={{ once: true }}
                      transition={{
                        duration: 0.7,
                        delay: 0.4 + i * 0.1 + j * 0.05,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                      className="flex-1 rounded-t"
                      style={{
                        background:
                          "linear-gradient(180deg, #319b72 0%, #156548 100%)",
                      }}
                    />
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
