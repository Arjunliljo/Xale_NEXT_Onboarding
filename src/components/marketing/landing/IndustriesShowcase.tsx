"use client";

import { motion } from "motion/react";
import Link from "next/link";
import Reveal from "../motion/Reveal";

const INDUSTRIES = [
  {
    slug: "study-abroad",
    name: "Study Abroad",
    tagline: "Inquiry → Visa → Travel. Every stage tracked.",
    gradient: "linear-gradient(135deg, #319b72 0%, #156548 100%)",
  },
  {
    slug: "video-production",
    name: "Video Production",
    tagline: "Reel projects, vendors, deliverables — one timeline.",
    gradient: "linear-gradient(135deg, #156548 0%, #102f23 100%)",
  },
  {
    slug: "academy",
    name: "Academy",
    tagline: "Programs, cohorts, certifications — full lifecycle.",
    gradient: "linear-gradient(135deg, #6fb99c 0%, #319b72 100%)",
  },
  {
    slug: "travel",
    name: "Travel",
    tagline: "Itineraries, vendors, multi-currency, all in sync.",
    gradient: "linear-gradient(135deg, #98cdb8 0%, #6fb99c 100%)",
  },
  {
    slug: "real-estate",
    name: "Real Estate",
    tagline: "Properties, viewings, client nurture sequences.",
    gradient: "linear-gradient(135deg, #102f23 0%, #051912 100%)",
  },
  {
    slug: "healthcare",
    name: "Healthcare",
    tagline: "Patient inquiries, appointments, follow-up SLAs.",
    gradient: "linear-gradient(135deg, #319b72 0%, #6fb99c 100%)",
  },
];

export default function IndustriesShowcase() {
  return (
    <section
      data-nav-theme="dark"
      className="py-32"
      style={{
        backgroundColor: "#020c08",
        backgroundImage:
          "radial-gradient(70% 55% at 50% 50%, rgba(5,25,18,0.95) 0%, transparent 75%)",
        color: "#fff",
      }}
    >
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="text-center mb-16">
          <Reveal>
            <p
              className="text-sm uppercase tracking-[0.2em] mb-6"
              style={{ color: "#98cdb8" }}
            >
              Industries
            </p>
          </Reveal>
          <Reveal delay={0.05}>
            <h2
              className="text-4xl md:text-6xl font-medium leading-[1.05] mb-6 max-w-3xl mx-auto"
              style={{ letterSpacing: "-0.03em" }}
            >
              Built for your industry.
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p
              className="max-w-2xl mx-auto text-lg leading-relaxed"
              style={{ color: "rgba(255,255,255,0.65)" }}
            >
              Xale adapts to your niche with industry-specific modules, fields,
              and workflows out of the box.
            </p>
          </Reveal>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {INDUSTRIES.map((ind, i) => (
            <motion.div
              key={ind.slug}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{
                duration: 0.6,
                delay: i * 0.06,
                ease: [0.22, 1, 0.36, 1],
              }}
              whileHover={{ y: -6 }}
            >
              <Link
                href={`/industries/${ind.slug}`}
                className="block rounded-2xl p-7 h-full transition-colors"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                <div
                  className="w-16 h-16 rounded-2xl mb-5"
                  style={{ background: ind.gradient }}
                />
                <h3 className="text-xl font-medium mb-2">{ind.name}</h3>
                <p
                  className="text-sm leading-relaxed mb-5"
                  style={{ color: "rgba(255,255,255,0.6)" }}
                >
                  {ind.tagline}
                </p>
                <span
                  className="text-sm"
                  style={{ color: "#98cdb8" }}
                >
                  View industry →
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
