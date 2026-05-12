"use client";

import { motion } from "motion/react";
import dynamic from "next/dynamic";
import Reveal from "@/src/components/marketing/motion/Reveal";
import MagneticButton from "@/src/components/marketing/motion/MagneticButton";

const FeaturesHeroScene = dynamic(
  () => import("@/src/components/marketing/three/FeaturesHeroScene"),
  { ssr: false, loading: () => null }
);

const FEATURES = [
  {
    id: "leads",
    eyebrow: "Lead capture",
    title: "Every lead. Every channel. One pipeline.",
    body: "Capture from Meta Lead Ads, WhatsApp inbound, web forms, custom webhooks, manual entry, CSV import — all into the same pipeline, attributed to the right source, deduplicated by phone and email.",
    bullets: [
      "Multi-source capture with native integrations",
      "Auto-enrichment from form fields and webhook payloads",
      "Smart assignment by source, geography, or workload",
      "Activity timeline showing every touch from every channel",
    ],
  },
  {
    id: "whatsapp",
    eyebrow: "Messaging",
    title: "WhatsApp Business, fully integrated.",
    body: "Approved templates, broadcast campaigns, two-way chat — all attached to the lead record. Your whole team sees the same conversation history, even if the lead changes hands.",
    bullets: [
      "Pre-approved templates with variables and media",
      "Broadcasts with smart segmentation and opt-out tracking",
      "Two-way conversations attached to the lead record",
      "Read receipts, delivery state, and full audit trail",
    ],
  },
  {
    id: "meta",
    eyebrow: "Meta Ads",
    title: "Facebook & Instagram leads, in seconds.",
    body: "Connect a Meta Page once and every Lead Generation form on it streams into your pipeline by webhook — no polling, no CSV exports, no Zapier middleman.",
    bullets: [
      "Direct webhook integration with Meta Lead Ads",
      "Field mapping wizard maps form questions to CRM fields",
      "Auto-respond with WhatsApp template in under 60 seconds",
      "Page-level attribution and ROI tracking",
    ],
  },
  {
    id: "automations",
    eyebrow: "Workflows",
    title: "Rules that work like your best sales op.",
    body: "Six trigger types, twenty-three action types. Build automations visually — auto-assign by source, fire follow-ups by stage, escalate stale leads to managers, send WhatsApp on milestones.",
    bullets: [
      "Visual workflow builder, no code",
      "Triggers on lead create, stage change, field update, time-based",
      "Actions: assign, notify, send WhatsApp, set field, create task",
      "Branching conditions with AND/OR logic",
    ],
  },
  {
    id: "reports",
    eyebrow: "Analytics",
    title: "Dashboards that read like a sales playbook.",
    body: "Real-time pipeline value, conversion funnels, team leaderboards, response-time SLAs, follow-up compliance — all sliceable by branch, source, owner, or any custom field.",
    bullets: [
      "Pipeline value over time, by source and stage",
      "Conversion funnel showing where leads stick or drop",
      "Team leaderboard with response-time SLAs",
      "Follow-up compliance — who's overdue, who's on it",
    ],
  },
  {
    id: "rbac",
    eyebrow: "Permissions",
    title: "Fine-grained without being a headache.",
    body: "Five preset roles (Owner, Admin, Manager, Staff, Viewer) or build your own. Permissions per stage, per source, per branch — restrict who sees what, who can move what, who can delete what.",
    bullets: [
      "Five preset roles + custom role builder",
      "Per-stage and per-source permission overrides",
      "Branch-level data scoping for multi-region teams",
      "Audit log of every permission change",
    ],
  },
  {
    id: "custom-fields",
    eyebrow: "Customization",
    title: "Fields that fit your business.",
    body: "Add text, number, selector, tag, and reference fields without engineering. Make them mandatory, conditional, or industry-specific. Sensitive fields can be gated to specific roles.",
    bullets: [
      "Text, number, selector, tag, reference fields",
      "Mandatory, conditional, and quick-add field rules",
      "Sensitive fields gated to specific users",
      "Industry-specific modules (universities, courses, etc.)",
    ],
  },
  {
    id: "multi-tenant",
    eyebrow: "Architecture",
    title: "Multi-tenant from day one.",
    body: "Row-level data isolation enforced at the database layer. No tenant can ever query another tenant's data. White-label support via custom domains — your team logs in at crm.yourbrand.com.",
    bullets: [
      "Database-level tenant isolation, not application logic",
      "Custom domain support via Cloudflare for SaaS",
      "Per-tenant branding (logo, color, login page)",
      "Independent rate limits and resource quotas",
    ],
  },
  {
    id: "mobile",
    eyebrow: "Mobile",
    title: "Your CRM in your pocket.",
    body: "Real iOS + Android apps, not a wrapper. View leads, send WhatsApp, take calls, log activity — everything offline-capable, syncs when you're back online.",
    bullets: [
      "Native iOS + Android (Expo)",
      "Built-in call dialer with TeleCMI integration",
      "Push notifications for assignments and replies",
      "Offline-capable, syncs on reconnect",
    ],
  },
  {
    id: "security",
    eyebrow: "Security",
    title: "Built on a security-first foundation.",
    body: "GDPR and DPDP compliant out of the box. SOC 2 Type II in progress. JWT auth with rotating refresh tokens, bcrypt password hashing, AES-256 encryption at rest.",
    bullets: [
      "GDPR + DPDP compliant",
      "SOC 2 Type II in progress",
      "JWT auth, bcrypt hashing, AES-256 at rest",
      "Daily encrypted backups, point-in-time recovery",
    ],
  },
];

export default function FeaturesContent() {
  return (
    <>
      {/* Hero */}
      <section
        className="relative py-32 max-md:py-20 max-sm:py-12 overflow-hidden"
        style={{
          background:
            "radial-gradient(120% 100% at 50% 0%, #1a4a37 0%, #051912 60%, #020c08 100%)",
          color: "#fff",
          minHeight: "80vh",
        }}
      >
        {/* 3D scene fills the section background */}
        <FeaturesHeroScene />

        {/* Vignette so text stays readable */}
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 60% 50% at 50% 50%, transparent 0%, rgba(2,12,8,0.55) 90%)",
          }}
        />

        <div className="relative z-10 max-w-[1100px] mx-auto px-6 max-sm:px-4 text-center">
          <Reveal>
            <p
              className="text-sm uppercase tracking-[0.2em] mb-6"
              style={{ color: "#98cdb8" }}
            >
              Features
            </p>
          </Reveal>
          <Reveal delay={0.05}>
            <h1
              className="text-5xl max-sm:text-4xl md:text-7xl font-medium leading-[1.05] mb-6"
              style={{ letterSpacing: "-0.035em" }}
            >
              Every feature, in detail.
            </h1>
          </Reveal>
          <Reveal delay={0.1}>
            <p
              className="text-lg md:text-xl mx-auto max-w-2xl"
              style={{ color: "rgba(255,255,255,0.7)" }}
            >
              The complete toolkit for modern sales teams — built to be
              flexible, fast, and ridiculously easy to use.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Feature sections */}
      <div className="bg-white">
        {FEATURES.map((feat, i) => {
          const isAlt = i % 2 === 1;
          return (
            <section
              key={feat.id}
              id={feat.id}
              className="py-24 max-md:py-16"
              style={{
                backgroundColor: isAlt ? "var(--color-bg-secondary,#eef3f1)" : "#ffffff",
              }}
            >
              <div className="max-w-[1100px] mx-auto px-6 max-sm:px-4">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 max-md:gap-6">
                  <Reveal className="lg:col-span-5">
                    <p
                      className="text-xs uppercase tracking-[0.2em] mb-4"
                      style={{ color: "var(--color-success,#156548)" }}
                    >
                      {feat.eyebrow}
                    </p>
                    <h2
                      className="text-3xl md:text-4xl font-medium leading-[1.1] mb-5"
                      style={{
                        letterSpacing: "-0.025em",
                        color: "var(--color-text-primary,#1e302a)",
                      }}
                    >
                      {feat.title}
                    </h2>
                    <p
                      className="text-base leading-relaxed"
                      style={{ color: "var(--color-text-gray,#6f6f6f)" }}
                    >
                      {feat.body}
                    </p>
                  </Reveal>

                  <Reveal delay={0.05} className="lg:col-span-7">
                    <div
                      className="rounded-2xl p-7"
                      style={{
                        backgroundColor: "#ffffff",
                        border: "1px solid var(--color-border-primary,#e6e8e7)",
                        boxShadow: "0 4px 24px rgba(0,0,0,0.04)",
                      }}
                    >
                      <ul className="space-y-4">
                        {feat.bullets.map((b, j) => (
                          <motion.li
                            key={j}
                            initial={{ opacity: 0, x: -10 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ duration: 0.4, delay: 0.1 + j * 0.06 }}
                            className="flex items-start gap-3 text-base leading-relaxed"
                            style={{ color: "var(--color-text-secondary,#505e59)" }}
                          >
                            <span
                              className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0"
                              style={{
                                backgroundColor: "var(--color-success,#156548)",
                              }}
                            />
                            {b}
                          </motion.li>
                        ))}
                      </ul>
                    </div>
                  </Reveal>
                </div>
              </div>
            </section>
          );
        })}
      </div>

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
              className="text-4xl max-sm:text-3xl md:text-5xl font-medium mb-6"
              style={{ letterSpacing: "-0.03em" }}
            >
              See it for yourself.
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
              <MagneticButton href="/pricing" variant="ghost">
                See pricing
              </MagneticButton>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
