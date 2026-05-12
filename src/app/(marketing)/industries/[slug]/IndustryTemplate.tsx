"use client";

import { motion } from "motion/react";
import Link from "next/link";
import Reveal from "@/src/components/marketing/motion/Reveal";
import MagneticButton from "@/src/components/marketing/motion/MagneticButton";
import type { Industry } from "@/src/lib/content/industries";

export default function IndustryTemplate({ industry }: { industry: Industry }) {
  return (
    <>
      {/* Hero */}
      <section
        className="relative py-32 max-md:py-20 max-sm:py-12 overflow-hidden"
        style={{
          background:
            "radial-gradient(120% 100% at 50% 0%, #1a4a37 0%, #051912 60%, #020c08 100%)",
          color: "#fff",
        }}
      >
        <div className="max-w-[1100px] mx-auto px-6 max-sm:px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-md:gap-8 items-center">
            <div>
              <Reveal>
                <p
                  className="text-sm uppercase tracking-[0.2em] mb-6"
                  style={{ color: "#98cdb8" }}
                >
                  {industry.hero.eyebrow}
                </p>
              </Reveal>
              <Reveal delay={0.05}>
                <h1
                  className="text-5xl max-sm:text-4xl md:text-6xl font-medium leading-[1.05] mb-6"
                  style={{ letterSpacing: "-0.035em" }}
                >
                  {industry.hero.title}
                </h1>
              </Reveal>
              <Reveal delay={0.1}>
                <p
                  className="text-lg leading-relaxed"
                  style={{ color: "rgba(255,255,255,0.7)" }}
                >
                  {industry.hero.description}
                </p>
              </Reveal>
              <Reveal delay={0.15}>
                <div className="mt-10 flex flex-col sm:flex-row gap-4">
                  <MagneticButton href="/signup" variant="primary">
                    Try it free →
                  </MagneticButton>
                  <MagneticButton href="/case-studies" variant="ghost">
                    See case studies
                  </MagneticButton>
                </div>
              </Reveal>
            </div>
            <Reveal delay={0.1}>
              <div
                className="rounded-3xl aspect-square"
                style={{ background: industry.gradient, opacity: 0.9 }}
              />
            </Reveal>
          </div>
        </div>
      </section>

      {/* Metrics */}
      {industry.metrics && (
        <section className="py-20 max-md:py-12 bg-white">
          <div className="max-w-[1100px] mx-auto px-6 max-sm:px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {industry.metrics.map((m, i) => (
                <Reveal key={i} delay={i * 0.08}>
                  <div className="text-center">
                    <div
                      className="text-6xl max-sm:text-5xl font-medium mb-3"
                      style={{
                        letterSpacing: "-0.03em",
                        color: "var(--color-success,#156548)",
                        fontWeight: 200,
                      }}
                    >
                      {m.value}
                    </div>
                    <p
                      className="text-base mx-auto max-w-[260px]"
                      style={{ color: "var(--color-text-gray,#6f6f6f)" }}
                    >
                      {m.label}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Pipeline */}
      <section
        className="py-24 max-md:py-16"
        style={{ backgroundColor: "var(--color-bg-secondary,#eef3f1)" }}
      >
        <div className="max-w-[1100px] mx-auto px-6">
          <Reveal>
            <h2
              className="text-3xl md:text-4xl font-medium mb-4 text-center"
              style={{
                letterSpacing: "-0.02em",
                color: "var(--color-text-primary,#1e302a)",
              }}
            >
              The {industry.name.toLowerCase()} pipeline
            </h2>
          </Reveal>
          <Reveal delay={0.05}>
            <p
              className="text-base text-center mb-16 max-w-2xl mx-auto"
              style={{ color: "var(--color-text-gray,#6f6f6f)" }}
            >
              Pre-configured stages and fields, ready out of the box.
            </p>
          </Reveal>

          <div className="space-y-3 max-w-3xl mx-auto">
            {industry.pipeline.map((step, i) => (
              <motion.div
                key={step.stage}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: i * 0.06 }}
                className="flex items-start gap-5 p-5 rounded-2xl"
                style={{
                  backgroundColor: "#ffffff",
                  border: "1px solid var(--color-border-primary,#e6e8e7)",
                }}
              >
                <div
                  className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium"
                  style={{
                    backgroundColor: "var(--color-bg-green,#f2f7f5)",
                    color: "var(--color-success,#156548)",
                  }}
                >
                  {String(i + 1).padStart(2, "0")}
                </div>
                <div>
                  <h3
                    className="text-lg font-medium mb-1"
                    style={{ color: "var(--color-text-primary,#1e302a)" }}
                  >
                    {step.stage}
                  </h3>
                  <p
                    className="text-sm leading-relaxed"
                    style={{ color: "var(--color-text-gray,#6f6f6f)" }}
                  >
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 max-md:py-16 bg-white">
        <div className="max-w-[1100px] mx-auto px-6 max-sm:px-4">
          <Reveal>
            <h2
              className="text-3xl md:text-4xl font-medium mb-4 text-center"
              style={{
                letterSpacing: "-0.02em",
                color: "var(--color-text-primary,#1e302a)",
              }}
            >
              Built for {industry.name}
            </h2>
          </Reveal>
          <Reveal delay={0.05}>
            <p
              className="text-base text-center mb-16 max-w-2xl mx-auto"
              style={{ color: "var(--color-text-gray,#6f6f6f)" }}
            >
              Industry-specific features you would otherwise build yourself.
            </p>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {industry.features.map((f, i) => (
              <Reveal key={i} delay={i * 0.05}>
                <div
                  className="rounded-2xl p-7 h-full"
                  style={{
                    border: "1px solid var(--color-border-primary,#e6e8e7)",
                  }}
                >
                  <h3
                    className="text-xl font-medium mb-2"
                    style={{ color: "var(--color-text-primary,#1e302a)" }}
                  >
                    {f.title}
                  </h3>
                  <p
                    className="text-base leading-relaxed"
                    style={{ color: "var(--color-text-gray,#6f6f6f)" }}
                  >
                    {f.description}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Integrations */}
      <section
        className="py-24 max-md:py-16"
        style={{ backgroundColor: "var(--color-bg-secondary,#eef3f1)" }}
      >
        <div className="max-w-[1100px] mx-auto px-6 max-sm:px-4 text-center">
          <Reveal>
            <h2
              className="text-3xl md:text-4xl font-medium mb-12"
              style={{
                letterSpacing: "-0.02em",
                color: "var(--color-text-primary,#1e302a)",
              }}
            >
              Integrations that matter for {industry.name.toLowerCase()}
            </h2>
          </Reveal>
          <Reveal delay={0.05}>
            <div className="flex flex-wrap justify-center gap-3">
              {industry.integrations.map((name) => (
                <span
                  key={name}
                  className="px-5 py-3 rounded-xl text-sm font-medium"
                  style={{
                    backgroundColor: "#ffffff",
                    border: "1px solid var(--color-border-primary,#e6e8e7)",
                    color: "var(--color-text-primary,#1e302a)",
                  }}
                >
                  {name}
                </span>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Testimonial */}
      {industry.testimonial && (
        <section className="py-24 max-md:py-16 bg-white">
          <div className="max-w-[800px] mx-auto px-6 max-sm:px-4">
            <Reveal>
              <figure className="text-center">
                <blockquote
                  className="text-2xl md:text-3xl font-medium leading-[1.3] mb-8"
                  style={{
                    letterSpacing: "-0.015em",
                    color: "var(--color-text-primary,#1e302a)",
                  }}
                >
                  "{industry.testimonial.quote}"
                </blockquote>
                <figcaption
                  className="text-sm"
                  style={{ color: "var(--color-text-gray,#6f6f6f)" }}
                >
                  <strong style={{ color: "var(--color-text-primary,#1e302a)" }}>
                    {industry.testimonial.name}
                  </strong>{" "}
                  · {industry.testimonial.role}, {industry.testimonial.company}
                </figcaption>
              </figure>
            </Reveal>
          </div>
        </section>
      )}

      {/* CTA */}
      <section
        className="py-24 max-md:py-16"
        style={{
          background:
            "radial-gradient(120% 100% at 50% 100%, #1a4a37 0%, #051912 60%)",
          color: "#fff",
        }}
      >
        <div className="max-w-[800px] mx-auto px-6 max-sm:px-4 text-center">
          <Reveal>
            <h2
              className="text-3xl md:text-5xl font-medium mb-6"
              style={{ letterSpacing: "-0.03em" }}
            >
              Ready to run your {industry.name.toLowerCase()} on Xale?
            </h2>
          </Reveal>
          <Reveal delay={0.05}>
            <p
              className="text-lg mb-10"
              style={{ color: "rgba(255,255,255,0.7)" }}
            >
              Free to start. 10-minute setup. No credit card.
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <MagneticButton href="/signup" variant="primary">
                Start free →
              </MagneticButton>
              <Link
                href="/industries"
                className="inline-flex items-center justify-center px-6 py-3.5 rounded-full text-base font-medium border transition-colors"
                style={{
                  borderColor: "rgba(255,255,255,0.2)",
                  color: "#fff",
                }}
              >
                ← All industries
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
