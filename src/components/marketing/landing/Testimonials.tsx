"use client";

import { motion } from "motion/react";
import Reveal from "../motion/Reveal";

const QUOTES = [
  {
    quote:
      "We went from 9-hour response times to 22 seconds. Our counsellors stopped firefighting and started actually selling.",
    name: "Parvathy Nair",
    role: "Founder",
    company: "Nila Study Abroad",
  },
  {
    quote:
      "I run 4 branches across 2 countries. Xale's branch-level permissions are the only reason I sleep at night.",
    name: "Hari Menon",
    role: "Director",
    company: "Kerala Wings",
  },
  {
    quote:
      "WhatsApp broadcasts that actually got delivered, templates approved without 3 weeks of back-and-forth. That alone paid for itself.",
    name: "Anjana S.",
    role: "Head of Marketing",
    company: "Kayal Studio",
  },
];

export default function Testimonials() {
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
      <div className="max-w-[1100px] mx-auto px-6">
        <div className="text-center mb-16">
          <Reveal>
            <p
              className="text-sm uppercase tracking-[0.2em] mb-6"
              style={{ color: "#98cdb8" }}
            >
              From our early-access partners
            </p>
          </Reveal>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {QUOTES.map((q, i) => (
            <motion.figure
              key={i}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, delay: i * 0.08 }}
              className="rounded-2xl p-7"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <blockquote
                className="text-lg leading-relaxed mb-6"
                style={{ color: "rgba(255,255,255,0.85)" }}
              >
                "{q.quote}"
              </blockquote>
              <figcaption
                className="flex items-center gap-3 pt-5"
                style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}
              >
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium"
                  style={{
                    background:
                      "linear-gradient(135deg, #98cdb8, #319b72)",
                    color: "#051912",
                  }}
                >
                  {q.name.split(" ").map((n) => n[0]).join("")}
                </div>
                <div>
                  <div
                    className="text-sm font-medium"
                    style={{ color: "#fff" }}
                  >
                    {q.name}
                  </div>
                  <div
                    className="text-xs"
                    style={{ color: "rgba(255,255,255,0.5)" }}
                  >
                    {q.role} · {q.company}
                  </div>
                </div>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}
