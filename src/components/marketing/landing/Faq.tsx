"use client";

import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import Reveal from "../motion/Reveal";
import JsonLd from "../seo/JsonLd";
import { faqPageSchema } from "@/src/lib/seo/schemas";

const FAQS = [
  {
    q: "How long does setup take?",
    a: "Most teams are live in 10 minutes. Sign up, connect WhatsApp and Meta in two clicks each, and you're capturing leads. Migrating from another CRM? Plan on 30–60 minutes for a CSV import.",
  },
  {
    q: "Do you offer migration from HubSpot, Pipedrive, or Zoho?",
    a: "Yes — bring your CSV export from any CRM and our import wizard maps fields, stages, and owners automatically. For complex migrations (custom fields, automations), our team can help — included free on Growth and Enterprise plans.",
  },
  {
    q: "Is my data isolated from other tenants?",
    a: "Strictly. Xale is built on a multi-tenant architecture with row-level isolation enforced at the database layer. No tenant can ever query another tenant's data — not even by mistake.",
  },
  {
    q: "Can I use my own domain?",
    a: "Yes. Xale supports custom domains via Cloudflare for SaaS — your team logs in at crm.yourbrand.com with your logo and theme. Available on the Growth and Enterprise plans.",
  },
  {
    q: "What's the WhatsApp Business approval process?",
    a: "We're an officially approved Meta Business Solutions Provider, so onboarding takes 24–72 hours instead of the usual 2–3 weeks. We handle the Meta-side paperwork; you focus on writing templates.",
  },
  {
    q: "Is there a free trial?",
    a: "Better — the Starter plan is free, forever. No credit card. Unlimited leads on a single pipeline, up to 3 team members. Upgrade only when you genuinely outgrow it.",
  },
  {
    q: "Where is my data hosted?",
    a: "On AWS / DigitalOcean infrastructure with daily encrypted backups. We can host in India (Mumbai), the EU (Frankfurt), or the US (Virginia) depending on your compliance needs.",
  },
  {
    q: "What about SOC 2 / GDPR / DPDP?",
    a: "GDPR and India's DPDP Act compliant out of the box. SOC 2 Type II is in progress — our security questionnaire is available on request.",
  },
];

export default function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="py-32" style={{ backgroundColor: "#ffffff" }}>
      <JsonLd data={faqPageSchema(FAQS.map((f) => ({ question: f.q, answer: f.a })))} />
      <div className="max-w-[800px] mx-auto px-6">
        <div className="text-center mb-16">
          <Reveal>
            <p
              className="text-sm uppercase tracking-[0.2em] mb-6"
              style={{ color: "var(--color-success,#156548)" }}
            >
              FAQ
            </p>
          </Reveal>
          <Reveal delay={0.05}>
            <h2
              className="text-4xl md:text-5xl font-medium leading-[1.05]"
              style={{
                letterSpacing: "-0.03em",
                color: "var(--color-text-primary,#1e302a)",
              }}
            >
              Frequently asked questions.
            </h2>
          </Reveal>
        </div>

        <div className="space-y-3">
          {FAQS.map((faq, i) => (
            <Reveal key={i} delay={i * 0.03}>
              <div
                className="rounded-2xl overflow-hidden"
                style={{
                  border: "1px solid var(--color-border-primary,#e6e8e7)",
                  backgroundColor: open === i ? "var(--color-bg-secondary,#eef3f1)" : "#ffffff",
                }}
              >
                <button
                  onClick={() => setOpen(open === i ? null : i)}
                  className="w-full text-left px-6 py-5 flex items-center justify-between gap-4"
                >
                  <span
                    className="text-base font-medium"
                    style={{ color: "var(--color-text-primary,#1e302a)" }}
                  >
                    {faq.q}
                  </span>
                  <motion.span
                    animate={{ rotate: open === i ? 45 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="text-xl flex-shrink-0"
                    style={{ color: "var(--color-success,#156548)" }}
                  >
                    +
                  </motion.span>
                </button>
                <AnimatePresence initial={false}>
                  {open === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                      style={{ overflow: "hidden" }}
                    >
                      <p
                        className="px-6 pb-5 text-base leading-relaxed"
                        style={{ color: "var(--color-text-gray,#6f6f6f)" }}
                      >
                        {faq.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
