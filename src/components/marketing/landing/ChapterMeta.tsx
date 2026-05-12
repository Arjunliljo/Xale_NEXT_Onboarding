"use client";

import { motion } from "motion/react";
import Reveal from "../motion/Reveal";

export default function ChapterMeta() {
  return (
    <section
      data-nav-theme="dark"
      className="py-32"
      style={{
        backgroundColor: "#020c08",
        backgroundImage:
          "radial-gradient(70% 55% at 50% 50%, rgba(16,47,35,0.9) 0%, transparent 70%)",
        color: "#fff",
      }}
    >
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Animated funnel */}
          <Reveal>
            <div className="relative h-[420px] flex flex-col items-center justify-between">
              {[
                {
                  label: "Facebook Lead Ad submitted",
                  meta: "facebook · 0s",
                  color: "#1877F2",
                },
                {
                  label: "Webhook → Xale lead created",
                  meta: "xale · 2s",
                  color: "#319b72",
                },
                {
                  label: "Auto-assigned to Devika",
                  meta: "rule: round-robin · 3s",
                  color: "#319b72",
                },
                {
                  label: "WhatsApp template fired",
                  meta: "Anjana received your message · 8s",
                  color: "#25D366",
                },
              ].map((step, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.6, delay: 0.2 + i * 0.15 }}
                  className="w-full flex items-center gap-4 px-5 py-4 rounded-xl"
                  style={{
                    backgroundColor: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.08)",
                  }}
                >
                  <div
                    className="w-9 h-9 rounded-lg flex-shrink-0"
                    style={{
                      backgroundColor: step.color + "22",
                      border: `1px solid ${step.color}55`,
                    }}
                  />
                  <div className="flex-1">
                    <div
                      className="text-sm font-medium"
                      style={{ color: "rgba(255,255,255,0.9)" }}
                    >
                      {step.label}
                    </div>
                    <div
                      className="text-[11px] uppercase tracking-wider mt-1"
                      style={{ color: "rgba(255,255,255,0.4)" }}
                    >
                      {step.meta}
                    </div>
                  </div>
                  {i < 3 && (
                    <motion.div
                      aria-hidden
                      className="absolute"
                      style={{
                        left: "29px",
                        top: `${72 + i * 95}px`,
                        height: "30px",
                        width: "1px",
                        backgroundColor: "rgba(49,155,114,0.4)",
                      }}
                      initial={{ scaleY: 0 }}
                      whileInView={{ scaleY: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.3, delay: 0.5 + i * 0.15 }}
                    />
                  )}
                </motion.div>
              ))}
            </div>
          </Reveal>

          {/* Copy */}
          <div>
            <Reveal>
              <p
                className="text-sm uppercase tracking-[0.2em] mb-6"
                style={{ color: "#98cdb8" }}
              >
                Chapter III — Meta Ads
              </p>
            </Reveal>
            <Reveal delay={0.05}>
              <h2
                className="text-4xl md:text-5xl font-medium leading-[1.05] mb-6"
                style={{ letterSpacing: "-0.03em" }}
              >
                From Facebook ad to first message — in 60 seconds.
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p
                className="text-lg leading-relaxed mb-8"
                style={{ color: "rgba(255,255,255,0.65)" }}
              >
                Connect a Meta Page once. Every Lead Generation form streams
                into your pipeline by webhook — no polling, no CSV exports, no
                inbox black-hole.
              </p>
            </Reveal>
            <Reveal delay={0.15}>
              <div
                className="grid grid-cols-2 gap-4 mt-8 pt-8"
                style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}
              >
                <div>
                  <div
                    className="text-3xl font-medium mb-1"
                    style={{ color: "#fff", letterSpacing: "-0.02em" }}
                  >
                    47 hrs
                  </div>
                  <div
                    className="text-xs uppercase tracking-wider"
                    style={{ color: "rgba(255,255,255,0.5)" }}
                  >
                    Industry average response time
                  </div>
                </div>
                <div>
                  <div
                    className="text-3xl font-medium mb-1"
                    style={{ color: "#319b72", letterSpacing: "-0.02em" }}
                  >
                    &lt; 22 sec
                  </div>
                  <div
                    className="text-xs uppercase tracking-wider"
                    style={{ color: "rgba(255,255,255,0.5)" }}
                  >
                    Median Xale response time
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
