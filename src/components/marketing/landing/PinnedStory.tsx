"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const PHASES = [
  {
    eyebrow: "Phase 01",
    title: "Lead lands",
    body: "A Meta Lead Ads form is submitted. Xale receives a webhook, parses the form, and creates a typed lead record in seconds.",
    badge: "Anjana Pillai",
    meta: "Meta · IELTS · 0s",
    accent: "#1877F2",
  },
  {
    eyebrow: "Phase 02",
    title: "Auto-assigned",
    body: "Routing rules match the lead's country interest to a counsellor in the right branch. Devika gets a notification on her phone.",
    badge: "Assigned to Devika",
    meta: "Round-robin · 3s",
    accent: "#98cdb8",
  },
  {
    eyebrow: "Phase 03",
    title: "WhatsApp fires",
    body: "An approved template is sent to Anjana within 8 seconds of the form submission. Personalized. Variables filled. Delivered.",
    badge: "Template sent",
    meta: "WhatsApp · 8s",
    accent: "#25D366",
  },
  {
    eyebrow: "Phase 04",
    title: "Deal closes",
    body: "Three weeks later, after a smooth pipeline through qualification, application, and visa — the deal is won. Recorded. Compounding.",
    badge: "Won · Visa stamped",
    meta: "Pipeline · 22 days",
    accent: "#319b72",
  },
];

export default function PinnedStory() {
  const wrapperRef = useRef<HTMLElement>(null);
  const slidesRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const slides = slidesRef.current?.children;
      if (!slides || slides.length === 0) return;
      const count = slides.length;

      // Pin the section and scrub through phases on scroll.
      // Total scrollable distance = (count - 1) * 100vh inside the pinned section.
      const ctx = gsap.context(() => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: wrapperRef.current,
            start: "top top",
            end: `+=${(count - 1) * 100}%`,
            scrub: 0.8,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        // Cross-fade and slide each phase
        for (let i = 0; i < count - 1; i++) {
          tl.to(
            slides[i],
            { opacity: 0, y: -40, duration: 1, ease: "power2.inOut" },
            i
          ).fromTo(
            slides[i + 1],
            { opacity: 0, y: 40 },
            { opacity: 1, y: 0, duration: 1, ease: "power2.inOut" },
            i + 0.4
          );
        }

        // Animate the progress bar
        gsap.fromTo(
          ".pinned-story-progress",
          { scaleX: 0 },
          {
            scaleX: 1,
            ease: "none",
            scrollTrigger: {
              trigger: wrapperRef.current,
              start: "top top",
              end: `+=${(count - 1) * 100}%`,
              scrub: true,
            },
          }
        );
      }, wrapperRef);

      return () => ctx.revert();
    },
    { scope: wrapperRef }
  );

  return (
    <section
      ref={wrapperRef}
      className="relative h-screen overflow-hidden"
      style={{
        background:
          "radial-gradient(120% 100% at 50% 0%, #102f23 0%, #051912 60%, #020c08 100%)",
        color: "#fff",
      }}
    >
      {/* Subtle grid */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
          maskImage:
            "radial-gradient(ellipse 100% 60% at 50% 40%, black 30%, transparent 80%)",
        }}
      />

      <div className="absolute inset-0 flex flex-col">
        {/* Top tag */}
        <div className="flex justify-center pt-12">
          <span
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs"
            style={{
              border: "1px solid rgba(152, 205, 184, 0.25)",
              backgroundColor: "rgba(49,155,114,0.08)",
              color: "rgba(255,255,255,0.85)",
            }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{
                backgroundColor: "#319b72",
                boxShadow: "0 0 8px #319b72",
              }}
            />
            One lead. Four phases. Eight seconds to first touch.
          </span>
        </div>

        {/* Slides container */}
        <div
          ref={slidesRef}
          className="relative flex-1 max-w-[1200px] mx-auto w-full px-6"
        >
          {PHASES.map((phase, i) => (
            <div
              key={i}
              className="absolute inset-0 flex items-center"
              style={{
                opacity: i === 0 ? 1 : 0,
              }}
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center w-full">
                {/* Copy */}
                <div>
                  <p
                    className="text-sm uppercase tracking-[0.2em] mb-4"
                    style={{ color: phase.accent }}
                  >
                    {phase.eyebrow}
                  </p>
                  <h2
                    className="text-5xl md:text-7xl font-medium leading-[1.05] mb-6"
                    style={{ letterSpacing: "-0.03em" }}
                  >
                    {phase.title}
                  </h2>
                  <p
                    className="text-lg leading-relaxed max-w-md"
                    style={{ color: "rgba(255,255,255,0.7)" }}
                  >
                    {phase.body}
                  </p>
                </div>

                {/* Visual card */}
                <div className="flex justify-center">
                  <div
                    className="relative rounded-2xl p-6 w-full max-w-[420px]"
                    style={{
                      background:
                        "linear-gradient(180deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 100%)",
                      border: "1px solid rgba(255,255,255,0.12)",
                      boxShadow:
                        "0 30px 80px -20px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.05) inset",
                      backdropFilter: "blur(20px)",
                    }}
                  >
                    <div className="flex items-center gap-3 mb-5">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium"
                        style={{
                          background: `${phase.accent}33`,
                          border: `1px solid ${phase.accent}55`,
                          color: phase.accent,
                        }}
                      >
                        {phase.badge[0]}
                      </div>
                      <div>
                        <div
                          className="text-sm font-medium"
                          style={{ color: "#fff" }}
                        >
                          {phase.badge}
                        </div>
                        <div
                          className="text-[11px] uppercase tracking-wider"
                          style={{ color: "rgba(255,255,255,0.5)" }}
                        >
                          {phase.meta}
                        </div>
                      </div>
                    </div>

                    {/* Decorative lines representing card content */}
                    <div className="space-y-2.5">
                      {[100, 75, 90, 60].map((w, k) => (
                        <div
                          key={k}
                          className="h-2 rounded-full"
                          style={{
                            width: `${w}%`,
                            background:
                              "linear-gradient(90deg, rgba(255,255,255,0.12), rgba(255,255,255,0.04))",
                          }}
                        />
                      ))}
                    </div>

                    <div
                      className="mt-6 flex items-center gap-2 pt-4"
                      style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}
                    >
                      <span
                        className="w-1.5 h-1.5 rounded-full"
                        style={{
                          backgroundColor: phase.accent,
                          boxShadow: `0 0 8px ${phase.accent}`,
                        }}
                      />
                      <span
                        className="text-xs"
                        style={{ color: "rgba(255,255,255,0.6)" }}
                      >
                        Phase {String(i + 1).padStart(2, "0")} of 04
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Progress bar */}
        <div className="pb-10 max-w-[1200px] w-full mx-auto px-6">
          <div className="flex justify-between mb-3">
            {PHASES.map((p, i) => (
              <span
                key={i}
                className="text-[10px] uppercase tracking-wider"
                style={{ color: "rgba(255,255,255,0.4)" }}
              >
                {p.eyebrow}
              </span>
            ))}
          </div>
          <div
            className="h-px relative"
            style={{ backgroundColor: "rgba(255,255,255,0.1)" }}
          >
            <div
              className="pinned-story-progress absolute inset-0 origin-left"
              style={{
                background:
                  "linear-gradient(90deg, #98cdb8, #319b72, #156548)",
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
