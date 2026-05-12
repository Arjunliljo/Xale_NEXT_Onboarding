"use client";

import { motion } from "motion/react";
import Reveal from "../motion/Reveal";

const STEPS = [
  {
    n: "01",
    title: "Sign up",
    description: "10 seconds. Email or Google. Your workspace is ready before your coffee.",
  },
  {
    n: "02",
    title: "Connect WhatsApp & Meta",
    description: "Authorize in two clicks. Your leads start flowing in immediately.",
  },
  {
    n: "03",
    title: "Import or start fresh",
    description: "Bring your existing CSV, or let the leads roll in. Either way — you're live.",
  },
];

export default function HowItWorks() {
  return (
    <section
      data-nav-theme="dark"
      className="py-32 max-md:py-20 max-sm:py-16"
      style={{
        backgroundColor: "#020c08",
        backgroundImage:
          "radial-gradient(70% 55% at 50% 50%, rgba(26,74,55,0.85) 0%, transparent 70%)",
        color: "#fff",
      }}
    >
      <div className="max-w-[1200px] mx-auto px-6 max-sm:px-4">
        <div className="text-center mb-20 max-md:mb-12">
          <Reveal>
            <p
              className="text-sm uppercase tracking-[0.2em] mb-6"
              style={{ color: "#98cdb8" }}
            >
              How it works
            </p>
          </Reveal>
          <Reveal delay={0.05}>
            <h2
              className="text-4xl max-sm:text-3xl md:text-6xl font-medium leading-[1.05] mb-6 max-w-3xl mx-auto"
              style={{ letterSpacing: "-0.03em" }}
            >
              Up and running in three steps.
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p
              className="text-lg"
              style={{ color: "rgba(255,255,255,0.65)" }}
            >
              No complex setup. No consultants needed. Just sign up and go.
            </p>
          </Reveal>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-md:gap-10 relative">
          {/* Connecting line */}
          <div
            aria-hidden
            className="hidden md:block absolute top-12 left-0 right-0 h-px"
            style={{
              background:
                "linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)",
            }}
          />

          {STEPS.map((step, i) => (
            <motion.div
              key={step.n}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, delay: i * 0.12 }}
              className="relative text-center"
            >
              <div
                className="relative z-10 w-24 h-24 mx-auto rounded-full flex items-center justify-center text-2xl font-medium mb-6"
                style={{
                  background:
                    "linear-gradient(135deg, #319b72 0%, #156548 100%)",
                  color: "#fff",
                  boxShadow:
                    "0 20px 40px -10px rgba(49,155,114,0.4), 0 0 0 1px rgba(255,255,255,0.1) inset",
                }}
              >
                {step.n}
              </div>
              <h3
                className="text-2xl font-medium mb-3"
                style={{ letterSpacing: "-0.01em" }}
              >
                {step.title}
              </h3>
              <p
                className="text-base leading-relaxed mx-auto max-w-[280px]"
                style={{ color: "rgba(255,255,255,0.65)" }}
              >
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
