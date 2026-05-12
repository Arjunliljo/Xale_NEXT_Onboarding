"use client";

import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import Reveal from "@/src/components/marketing/motion/Reveal";
import MagneticButton from "@/src/components/marketing/motion/MagneticButton";
import JsonLd from "@/src/components/marketing/seo/JsonLd";
import { faqPageSchema, productSchema } from "@/src/lib/seo/schemas";
import { SITE_URL } from "@/src/lib/seo/metadata";

const PLANS = [
  {
    name: "Starter",
    monthly: 0,
    yearly: 0,
    tagline: "For solo founders & small teams",
    highlight: false,
    features: [
      "Up to 3 team members",
      "Unlimited leads",
      "1 pipeline",
      "WhatsApp Business: 1,000 msgs/mo",
      "Meta Lead Ads integration",
      "Mobile apps",
      "Community support",
    ],
    cta: "Start free",
  },
  {
    name: "Growth",
    monthly: 49,
    yearly: 39,
    tagline: "For growing sales teams",
    highlight: true,
    features: [
      "Up to 20 team members",
      "Everything in Starter, plus:",
      "Unlimited pipelines",
      "WhatsApp Business: 25,000 msgs/mo",
      "Automation workflows",
      "Custom fields & modules",
      "Advanced reports",
      "Role-based access",
      "Custom domain (white-label)",
      "Email support, 24h SLA",
    ],
    cta: "Start free trial",
  },
  {
    name: "Enterprise",
    monthly: -1,
    yearly: -1,
    tagline: "For multi-region operations",
    highlight: false,
    features: [
      "Unlimited team members",
      "Everything in Growth, plus:",
      "Multi-branch with isolated data",
      "SSO (Google, Microsoft, SAML)",
      "Audit logs & compliance reports",
      "On-prem or VPC deploy option",
      "Dedicated success manager",
      "99.9% uptime SLA",
    ],
    cta: "Contact sales",
  },
];

const COMPARISON: { category: string; rows: { feature: string; starter: string | boolean; growth: string | boolean; enterprise: string | boolean }[] }[] = [
  {
    category: "Lead Management",
    rows: [
      { feature: "Leads (per workspace)", starter: "Unlimited", growth: "Unlimited", enterprise: "Unlimited" },
      { feature: "Pipelines", starter: "1", growth: "Unlimited", enterprise: "Unlimited" },
      { feature: "Custom fields", starter: "10", growth: "Unlimited", enterprise: "Unlimited" },
      { feature: "Activity timeline", starter: true, growth: true, enterprise: true },
    ],
  },
  {
    category: "Messaging",
    rows: [
      { feature: "WhatsApp Business msgs/mo", starter: "1,000", growth: "25,000", enterprise: "Custom" },
      { feature: "WhatsApp templates", starter: "5", growth: "Unlimited", enterprise: "Unlimited" },
      { feature: "Broadcast campaigns", starter: false, growth: true, enterprise: true },
      { feature: "Gmail integration", starter: false, growth: true, enterprise: true },
    ],
  },
  {
    category: "Team & Roles",
    rows: [
      { feature: "Team members", starter: "3", growth: "20", enterprise: "Unlimited" },
      { feature: "Role-based access", starter: "Preset", growth: "Custom", enterprise: "Custom + SSO" },
      { feature: "Multi-branch", starter: false, growth: true, enterprise: true },
      { feature: "Audit log", starter: false, growth: "30 days", enterprise: "Unlimited" },
    ],
  },
];

const FAQS = [
  {
    q: "Is there really a free plan?",
    a: "Yes — Starter is free forever for teams up to 3 people. No credit card required. Upgrade only when you genuinely outgrow it.",
  },
  {
    q: "Can I cancel anytime?",
    a: "Yes. Cancel from the billing settings; your subscription remains active until the end of the current period. We don't pro-rate refunds for partial months.",
  },
  {
    q: "Do you offer migration help?",
    a: "Yes — free guided migration is included on Growth and Enterprise plans. Bring your CSV from any CRM and we'll map fields, stages, and owners for you.",
  },
  {
    q: "What's the WhatsApp message cost?",
    a: "The plan limit is for conversation-initiated messages — your team replying within a 24-hour window. Marketing template messages incur per-message Meta fees on top, billed at cost.",
  },
  {
    q: "Can I use my own domain?",
    a: "Yes, on Growth and Enterprise — your team logs in at crm.yourbrand.com. Setup takes 10 minutes via Cloudflare for SaaS.",
  },
  {
    q: "What payment methods do you accept?",
    a: "Credit/debit cards, UPI, and bank transfer (Enterprise only). Powered by Razorpay; receipts and GST invoices issued automatically.",
  },
];

function PlanCard({
  plan,
  isYearly,
}: {
  plan: (typeof PLANS)[number];
  isYearly: boolean;
}) {
  const price = isYearly ? plan.yearly : plan.monthly;
  const priceDisplay =
    price === -1 ? "Custom" : price === 0 ? "Free" : `$${price}`;

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="relative rounded-3xl p-8 h-full flex flex-col"
      style={{
        backgroundColor: plan.highlight ? "#051912" : "#ffffff",
        color: plan.highlight ? "#fff" : "var(--color-text-primary,#1e302a)",
        border: plan.highlight
          ? "1px solid #156548"
          : "1px solid var(--color-border-primary,#e6e8e7)",
        boxShadow: plan.highlight
          ? "0 20px 50px -12px rgba(5,25,18,0.3)"
          : "0 4px 16px rgba(0,0,0,0.03)",
      }}
    >
      {plan.highlight && (
        <div
          className="absolute -top-3 left-1/2 transform -translate-x-1/2 px-3 py-1 rounded-full text-xs font-medium"
          style={{ backgroundColor: "#319b72", color: "#051912" }}
        >
          Most popular
        </div>
      )}
      <h3
        className="text-2xl font-medium mb-1"
        style={{ letterSpacing: "-0.01em" }}
      >
        {plan.name}
      </h3>
      <p
        className="text-sm mb-6"
        style={{
          color: plan.highlight
            ? "rgba(255,255,255,0.6)"
            : "var(--color-text-gray,#6f6f6f)",
        }}
      >
        {plan.tagline}
      </p>
      <div className="mb-6 pb-6" style={{ borderBottom: plan.highlight ? "1px solid rgba(255,255,255,0.08)" : "1px solid var(--color-border-primary,#e6e8e7)" }}>
        <div className="flex items-baseline gap-2">
          <span
            className="text-5xl font-medium"
            style={{ letterSpacing: "-0.03em" }}
          >
            {priceDisplay}
          </span>
          {price > 0 && (
            <span
              className="text-sm"
              style={{
                color: plan.highlight
                  ? "rgba(255,255,255,0.5)"
                  : "var(--color-text-gray,#6f6f6f)",
              }}
            >
              / user / mo
            </span>
          )}
        </div>
        {price > 0 && (
          <p
            className="text-xs mt-2"
            style={{
              color: plan.highlight
                ? "rgba(255,255,255,0.4)"
                : "var(--color-text-gray,#6f6f6f)",
            }}
          >
            {isYearly ? "Billed annually" : "Billed monthly"}
          </p>
        )}
      </div>
      <ul className="space-y-3 mb-8 flex-1">
        {plan.features.map((f, i) => (
          <li
            key={i}
            className="flex items-start gap-2 text-sm leading-relaxed"
            style={{
              color: plan.highlight
                ? "rgba(255,255,255,0.85)"
                : "var(--color-text-secondary,#505e59)",
            }}
          >
            <span
              className="mt-1.5 w-1 h-1 rounded-full flex-shrink-0"
              style={{
                backgroundColor: plan.highlight ? "#319b72" : "var(--color-success,#156548)",
              }}
            />
            {f}
          </li>
        ))}
      </ul>
      <a
        href={plan.name === "Enterprise" ? "mailto:sales@xale.in" : "/signup"}
        className="block text-center px-5 py-3 rounded-full text-sm font-medium transition-opacity hover:opacity-90"
        style={{
          backgroundColor: plan.highlight ? "#319b72" : "var(--color-black-10,#051912)",
          color: plan.highlight ? "#051912" : "#fff",
        }}
      >
        {plan.cta}
      </a>
    </motion.div>
  );
}

export default function PricingContent() {
  const [isYearly, setIsYearly] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const schemas = [
    productSchema({
      name: "Xale CRM",
      description:
        "Multi-tenant CRM with WhatsApp, Meta Ads, and automation built in.",
      offers: PLANS.filter((p) => p.monthly > 0).map((p) => ({
        name: p.name,
        price: isYearly ? p.yearly : p.monthly,
        currency: "USD",
        url: `${SITE_URL}/pricing`,
      })),
    }),
    faqPageSchema(FAQS.map((f) => ({ question: f.q, answer: f.a }))),
  ];

  return (
    <>
      <JsonLd data={schemas} />

      {/* Hero */}
      <section
        className="relative py-32 overflow-hidden"
        style={{
          background:
            "radial-gradient(120% 100% at 50% 0%, #1a4a37 0%, #051912 60%, #020c08 100%)",
          color: "#fff",
        }}
      >
        <div className="max-w-[1100px] mx-auto px-6 text-center">
          <Reveal>
            <p
              className="text-sm uppercase tracking-[0.2em] mb-6"
              style={{ color: "#98cdb8" }}
            >
              Pricing
            </p>
          </Reveal>
          <Reveal delay={0.05}>
            <h1
              className="text-5xl md:text-7xl font-medium leading-[1.05] mb-6"
              style={{ letterSpacing: "-0.035em" }}
            >
              Simple pricing that scales with you.
            </h1>
          </Reveal>
          <Reveal delay={0.1}>
            <p
              className="text-lg md:text-xl mx-auto max-w-2xl mb-10"
              style={{ color: "rgba(255,255,255,0.7)" }}
            >
              Start free. Pay only when you outgrow the free tier. No surprise
              fees, no per-feature add-ons.
            </p>
          </Reveal>
          <Reveal delay={0.15}>
            <div
              className="inline-flex items-center gap-1 p-1 rounded-full"
              style={{
                backgroundColor: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.1)",
              }}
            >
              <button
                onClick={() => setIsYearly(false)}
                className="px-4 py-2 rounded-full text-sm font-medium transition-all"
                style={{
                  backgroundColor: !isYearly ? "#319b72" : "transparent",
                  color: !isYearly ? "#051912" : "rgba(255,255,255,0.7)",
                }}
              >
                Monthly
              </button>
              <button
                onClick={() => setIsYearly(true)}
                className="px-4 py-2 rounded-full text-sm font-medium transition-all"
                style={{
                  backgroundColor: isYearly ? "#319b72" : "transparent",
                  color: isYearly ? "#051912" : "rgba(255,255,255,0.7)",
                }}
              >
                Yearly · save 20%
              </button>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Plan cards */}
      <section className="py-20 bg-white">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 -mt-32 relative z-10">
            {PLANS.map((plan, i) => (
              <Reveal key={plan.name} delay={i * 0.06}>
                <PlanCard plan={plan} isYearly={isYearly} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison table */}
      <section className="py-24" style={{ backgroundColor: "var(--color-bg-secondary,#eef3f1)" }}>
        <div className="max-w-[1100px] mx-auto px-6">
          <Reveal>
            <h2
              className="text-3xl md:text-4xl font-medium text-center mb-12"
              style={{
                letterSpacing: "-0.02em",
                color: "var(--color-text-primary,#1e302a)",
              }}
            >
              Compare every plan
            </h2>
          </Reveal>

          {COMPARISON.map((section) => (
            <Reveal key={section.category}>
              <div
                className="mb-8 rounded-2xl overflow-hidden"
                style={{
                  border: "1px solid var(--color-border-primary,#e6e8e7)",
                  backgroundColor: "#ffffff",
                }}
              >
                <div
                  className="px-5 py-3 text-xs uppercase tracking-wider font-medium"
                  style={{
                    backgroundColor: "var(--color-bg-secondary,#eef3f1)",
                    color: "var(--color-text-gray,#6f6f6f)",
                  }}
                >
                  {section.category}
                </div>
                <table className="w-full">
                  <thead>
                    <tr>
                      <th className="p-0"></th>
                      <th
                        className="py-3 px-4 text-center text-xs font-medium uppercase tracking-wider"
                        style={{ color: "var(--color-text-gray,#6f6f6f)" }}
                      >
                        Starter
                      </th>
                      <th
                        className="py-3 px-4 text-center text-xs font-medium uppercase tracking-wider"
                        style={{ color: "var(--color-success,#156548)" }}
                      >
                        Growth
                      </th>
                      <th
                        className="py-3 px-4 text-center text-xs font-medium uppercase tracking-wider"
                        style={{ color: "var(--color-text-gray,#6f6f6f)" }}
                      >
                        Enterprise
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {section.rows.map((row, i) => (
                      <tr
                        key={row.feature}
                        style={{
                          borderTop:
                            i === 0
                              ? "1px solid var(--color-border-primary,#e6e8e7)"
                              : "1px solid var(--color-border-primary,#e6e8e7)",
                        }}
                      >
                        <td
                          className="py-3.5 px-5 text-sm"
                          style={{ color: "var(--color-text-primary,#1e302a)" }}
                        >
                          {row.feature}
                        </td>
                        {(["starter", "growth", "enterprise"] as const).map(
                          (col) => (
                            <td
                              key={col}
                              className="py-3.5 px-4 text-center text-sm"
                              style={{
                                backgroundColor:
                                  col === "growth"
                                    ? "rgba(49,155,114,0.04)"
                                    : "transparent",
                                color: "var(--color-text-secondary,#505e59)",
                              }}
                            >
                              {row[col] === true ? (
                                <span style={{ color: "var(--color-success,#156548)", fontSize: "1.1rem" }}>
                                  ✓
                                </span>
                              ) : row[col] === false ? (
                                <span style={{ color: "var(--color-text-gray,#9ba3a0)", fontSize: "1.1rem" }}>
                                  ✕
                                </span>
                              ) : (
                                String(row[col])
                              )}
                            </td>
                          )
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 bg-white">
        <div className="max-w-[800px] mx-auto px-6">
          <Reveal>
            <h2
              className="text-3xl md:text-4xl font-medium text-center mb-12"
              style={{
                letterSpacing: "-0.02em",
                color: "var(--color-text-primary,#1e302a)",
              }}
            >
              Pricing questions
            </h2>
          </Reveal>
          <div className="space-y-3">
            {FAQS.map((faq, i) => (
              <Reveal key={i} delay={i * 0.04}>
                <div
                  className="rounded-2xl overflow-hidden"
                  style={{
                    border: "1px solid var(--color-border-primary,#e6e8e7)",
                    backgroundColor:
                      openFaq === i ? "var(--color-bg-secondary,#eef3f1)" : "#ffffff",
                  }}
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full text-left px-6 py-5 flex items-center justify-between gap-4"
                  >
                    <span
                      className="text-base font-medium"
                      style={{ color: "var(--color-text-primary,#1e302a)" }}
                    >
                      {faq.q}
                    </span>
                    <motion.span
                      animate={{ rotate: openFaq === i ? 45 : 0 }}
                      className="text-xl"
                      style={{ color: "var(--color-success,#156548)" }}
                    >
                      +
                    </motion.span>
                  </button>
                  <AnimatePresence initial={false}>
                    {openFaq === i && (
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

      {/* Enterprise CTA */}
      <section
        className="py-24"
        style={{
          background:
            "radial-gradient(120% 100% at 50% 100%, #1a4a37 0%, #051912 60%)",
          color: "#fff",
        }}
      >
        <div className="max-w-[800px] mx-auto px-6 text-center">
          <Reveal>
            <h2
              className="text-3xl md:text-4xl font-medium mb-4"
              style={{ letterSpacing: "-0.02em" }}
            >
              Need SSO, custom contracts, or on-prem?
            </h2>
          </Reveal>
          <Reveal delay={0.05}>
            <p
              className="text-lg mb-10"
              style={{ color: "rgba(255,255,255,0.7)" }}
            >
              Talk to us. We'll scope a plan that fits your team and compliance
              requirements.
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <MagneticButton href="mailto:sales@xale.in" variant="primary">
              Contact sales →
            </MagneticButton>
          </Reveal>
        </div>
      </section>
    </>
  );
}
