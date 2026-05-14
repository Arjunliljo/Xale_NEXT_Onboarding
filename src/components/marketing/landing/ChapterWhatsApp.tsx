"use client";

import { motion } from "motion/react";
import Reveal from "../motion/Reveal";
import AnimatedWaveDivider from "./AnimatedWaveDivider";

const MESSAGES = [
  { side: "in", text: "Hi! Is the IELTS coaching still available for May?", delay: 0.3 },
  {
    side: "out",
    text: "Hi Arjun! Yes, our May batch starts on the 20th — 6 seats left. Want me to send you the syllabus?",
    delay: 0.9,
  },
  { side: "in", text: "Yes please, and the fee structure", delay: 1.5 },
  { side: "out", text: "Sent ✓ Anything else I can help you with?", delay: 2.1 },
];

export default function ChapterWhatsApp() {
  return (
    <section
      className="relative overflow-hidden py-32 max-md:py-12 max-md:pb-20 max-sm:py-8 max-sm:pb-16"
      style={{ backgroundColor: "#ffffff" }}
    >
      <div className="max-w-[1200px] mx-auto px-6 max-sm:px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 max-md:gap-10 items-center">
          {/* Copy */}
          <div className="order-2 lg:order-1">
            <Reveal>
              <p
                className="text-sm uppercase tracking-[0.2em] mb-6"
                style={{ color: "var(--color-success,#156548)" }}
              >
                Chapter II — WhatsApp
              </p>
            </Reveal>
            <Reveal delay={0.05}>
              <h2
                className="text-4xl max-sm:text-2xl md:text-5xl font-medium leading-[1.05] mb-6 max-sm:mb-3"
                style={{
                  letterSpacing: "-0.03em",
                  color: "var(--color-text-primary,#1e302a)",
                }}
              >
                WhatsApp is your team's biggest sales channel. We made it{" "}
                <span
                  className="italic font-normal"
                  style={{
                    fontFamily: "var(--font-instrument-serif), serif",
                    letterSpacing: "-0.02em",
                  }}
                >
                  a CRM
                </span>
                .
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <ul className="space-y-4 mt-8 max-sm:space-y-2 max-sm:mt-4">
                {[
                  "Pre-approved templates with variables — sent in seconds, never flagged",
                  "Broadcasts that don't get your number banned, ever",
                  "Conversations attached to the lead record, not lost in a phone",
                ].map((bullet) => (
                  <li
                    key={bullet}
                    className="flex items-start gap-3 text-lg max-sm:text-[13px] leading-relaxed"
                    style={{ color: "var(--color-text-secondary,#505e59)" }}
                  >
                    <span
                      className="mt-2 w-1.5 h-1.5 rounded-full flex-shrink-0"
                      style={{ backgroundColor: "var(--color-success,#156548)" }}
                    />
                    {bullet}
                  </li>
                ))}
              </ul>
            </Reveal>
            <Reveal delay={0.15}>
              <div
                className="mt-8 inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs"
                style={{
                  border: "1px solid var(--color-border-green,#98cdb8)",
                  color: "var(--color-success,#156548)",
                  backgroundColor: "var(--color-bg-green,#f2f7f5)",
                }}
              >
                ✓ Officially approved by Meta as a WhatsApp Business Solution
              </div>
            </Reveal>
          </div>

          {/* Phone mockup */}
          <div className="order-1 lg:order-2 flex justify-center">
            <Reveal delay={0.1}>
              <div
                className="relative rounded-[40px] p-3 max-sm:[width:100%] max-sm:[max-width:280px]"
                style={{
                  width: "320px",
                  background:
                    "linear-gradient(180deg, #1e302a 0%, #051912 100%)",
                  boxShadow:
                    "0 30px 80px -20px rgba(5,25,18,0.4), 0 0 0 1px rgba(0,0,0,0.05)",
                }}
              >
                <div
                  className="rounded-[32px] overflow-hidden max-md:[height:420px] max-sm:[height:360px]"
                  style={{ backgroundColor: "#0a0a0a", height: "560px" }}
                >
                  {/* Status bar */}
                  <div
                    className="px-5 pt-3 pb-2 flex items-center justify-between text-xs"
                    style={{
                      backgroundColor: "#0b8d5a",
                      color: "#fff",
                    }}
                  >
                    <span>9:41</span>
                    <span>● ● ●</span>
                  </div>
                  {/* Header */}
                  <div
                    className="px-5 py-3 flex items-center gap-3"
                    style={{ backgroundColor: "#0b8d5a", color: "#fff" }}
                  >
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-medium"
                      style={{
                        background:
                          "linear-gradient(135deg, #98cdb8, #319b72)",
                      }}
                    >
                      A
                    </div>
                    <div>
                      <div className="text-sm font-medium">Arjun</div>
                      <div className="text-[11px] opacity-80">online</div>
                    </div>
                  </div>
                  {/* Messages */}
                  <div
                    className="p-4 space-y-2 overflow-hidden"
                    style={{
                      background:
                        "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 80 80'><circle cx='40' cy='40' r='1' fill='%23ffffff' opacity='0.04'/></svg>\") #102f23",
                      height: "calc(100% - 100px)",
                    }}
                  >
                    {MESSAGES.map((m, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: m.delay }}
                        className={`flex ${
                          m.side === "out" ? "justify-end" : "justify-start"
                        }`}
                      >
                        <div
                          className="max-w-[80%] px-3 py-2 rounded-lg text-[13px] leading-snug"
                          style={{
                            backgroundColor:
                              m.side === "out" ? "#054640" : "#ffffff",
                            color:
                              m.side === "out"
                                ? "#e8f4ee"
                                : "var(--color-text-primary,#1e302a)",
                            borderRadius:
                              m.side === "out"
                                ? "12px 12px 2px 12px"
                                : "12px 12px 12px 2px",
                          }}
                        >
                          {m.text}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
      <AnimatedWaveDivider fill="#020c08" height={120} />
    </section>
  );
}
