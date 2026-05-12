"use client";

import dynamic from "next/dynamic";
import Reveal from "@/src/components/marketing/motion/Reveal";

const IndustriesGlobeScene = dynamic(
  () => import("@/src/components/marketing/three/IndustriesGlobeScene"),
  { ssr: false, loading: () => null }
);

export default function IndustriesHero() {
  return (
    <section
      className="relative py-32 max-md:py-20 max-sm:py-12 overflow-hidden max-md:[min-height:60vh] max-sm:[min-height:50vh]"
      style={{
        background:
          "radial-gradient(120% 100% at 50% 0%, #1a4a37 0%, #051912 60%, #020c08 100%)",
        color: "#fff",
        minHeight: "75vh",
      }}
    >
      <IndustriesGlobeScene />

      {/* Vignette */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 50% 50%, transparent 0%, rgba(2,12,8,0.5) 100%)",
        }}
      />

      <div className="relative z-10 max-w-[1100px] mx-auto px-6 max-sm:px-4 text-center">
        <Reveal>
          <p
            className="text-sm uppercase tracking-[0.2em] mb-6"
            style={{ color: "#98cdb8" }}
          >
            Industries
          </p>
        </Reveal>
        <Reveal delay={0.05}>
          <h1
            className="text-5xl max-sm:text-4xl md:text-7xl font-medium leading-[1.05] mb-6"
            style={{ letterSpacing: "-0.035em" }}
          >
            Built for your industry.
          </h1>
        </Reveal>
        <Reveal delay={0.1}>
          <p
            className="text-lg md:text-xl mx-auto max-w-2xl"
            style={{ color: "rgba(255,255,255,0.7)" }}
          >
            Xale adapts to your niche with industry-specific modules, fields,
            and workflows out of the box.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
