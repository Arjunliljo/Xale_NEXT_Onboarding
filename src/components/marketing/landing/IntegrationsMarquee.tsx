"use client";

import Reveal from "../motion/Reveal";

const INTEGRATIONS = [
  "WhatsApp Business",
  "Meta Lead Ads",
  "Gmail",
  "Google OAuth",
  "TeleCMI",
  "Razorpay",
  "S3 Storage",
  "Webhooks",
  "Zapier",
  "Cal.com",
];

export default function IntegrationsMarquee() {
  // Duplicate the list to enable seamless looping
  const items = [...INTEGRATIONS, ...INTEGRATIONS];

  return (
    <section
      className="py-24 max-md:py-10 overflow-hidden"
      style={{ backgroundColor: "#ffffff" }}
    >
      <div className="text-center mb-12 max-md:mb-8 max-sm:px-4">
        <Reveal>
          <p
            className="text-sm uppercase tracking-[0.2em]"
            style={{ color: "var(--color-success,#156548)" }}
          >
            Integrations
          </p>
        </Reveal>
        <Reveal delay={0.05}>
          <h2
            className="text-3xl max-sm:text-2xl md:text-4xl font-medium mt-4"
            style={{
              color: "var(--color-text-primary,#1e302a)",
              letterSpacing: "-0.02em",
            }}
          >
            Plays well with{" "}
            <span
              className="italic font-normal"
              style={{
                fontFamily: "var(--font-instrument-serif), serif",
                letterSpacing: "-0.015em",
              }}
            >
              your stack
            </span>
            .
          </h2>
        </Reveal>
      </div>

      <div
        className="relative"
        style={{
          maskImage:
            "linear-gradient(90deg, transparent, black 10%, black 90%, transparent)",
        }}
      >
        <div className="flex gap-4 animate-marquee whitespace-nowrap">
          {items.map((name, i) => (
            <div
              key={i}
              className="flex-shrink-0 px-6 py-4 rounded-xl text-base font-medium"
              style={{
                backgroundColor: "var(--color-bg-secondary,#eef3f1)",
                color: "var(--color-text-primary,#1e302a)",
                border: "1px solid var(--color-border-primary,#e6e8e7)",
              }}
            >
              {name}
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 40s linear infinite;
          width: max-content;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
}
