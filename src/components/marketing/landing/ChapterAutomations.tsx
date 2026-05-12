"use client";

import { motion } from "motion/react";
import Reveal from "../motion/Reveal";

type Step = { label: string; tone: "trigger" | "condition" | "action" };

const WORKFLOWS: { title: string; subtitle: string; steps: Step[] }[] = [
  {
    title: "Auto-route Meta ad leads in under 60 seconds",
    subtitle: "No more leads sitting in someone's inbox",
    steps: [
      { label: "New Meta ad lead", tone: "trigger" },
      { label: "Auto-assign to next rep", tone: "action" },
      { label: "Send WhatsApp intro", tone: "action" },
      { label: "Set 30-min follow-up reminder", tone: "action" },
    ],
  },
  {
    title: "Escalate cold leads before they go quiet",
    subtitle: "Silence kills pipeline — Xale won't let that happen",
    steps: [
      { label: "No reply in 48 hours", tone: "trigger" },
      { label: "Stage is still 'New'", tone: "condition" },
      { label: "Notify branch manager", tone: "action" },
      { label: "Reassign to senior counsellor", tone: "action" },
    ],
  },
  {
    title: "Close the loop on won deals",
    subtitle: "Everyone who needs to know, knows — instantly",
    steps: [
      { label: "Stage moves to 'Won'", tone: "trigger" },
      { label: "Notify admin + finance", tone: "action" },
      { label: "Send onboarding WhatsApp", tone: "action" },
      { label: "Sync to accounting tool", tone: "action" },
    ],
  },
];

const ROLES = [
  {
    name: "Tenant Admin",
    note: "Owns the workspace",
    perms: [true, true, true, true, true, true, true],
  },
  {
    name: "Branch Manager",
    note: "Runs a branch & team",
    perms: [true, true, true, true, false, true, true],
  },
  {
    name: "Counsellor",
    note: "Works their own leads",
    perms: [true, true, true, false, false, false, false],
  },
  {
    name: "Viewer",
    note: "Read-only access",
    perms: [true, false, false, false, false, false, false],
  },
  {
    name: "Guest",
    note: "Scoped to one source",
    perms: [true, false, false, false, false, false, false],
  },
];

const PERMS = ["View", "Create", "Edit", "Move stage", "Delete", "Assign", "Export"];

const TONE_COLOR: Record<Step["tone"], string> = {
  trigger: "#319b72",
  condition: "#98cdb8",
  action: "#156548",
};

const TONE_LABEL: Record<Step["tone"], string> = {
  trigger: "WHEN",
  condition: "IF",
  action: "THEN",
};

export default function ChapterAutomations() {
  return (
    <section className="py-32 max-md:py-12 max-sm:py-8" style={{ backgroundColor: "#ffffff" }}>
      <div className="max-w-[1200px] mx-auto px-6 max-sm:px-4">
        {/* Header */}
        <div className="text-center mb-16 max-md:mb-6">
          <Reveal>
            <p
              className="text-sm uppercase tracking-[0.2em] mb-6"
              style={{ color: "var(--color-success,#156548)" }}
            >
              Chapter IV — Automation &amp; Security
            </p>
          </Reveal>
          <Reveal delay={0.05}>
            <h2
              className="text-4xl max-sm:text-3xl md:text-5xl font-medium leading-[1.05] max-w-3xl mx-auto mb-6"
              style={{
                letterSpacing: "-0.03em",
                color: "var(--color-text-primary,#1e302a)",
              }}
            >
              Rules that route, escalate, and{" "}
              <span
                className="italic font-normal"
                style={{
                  fontFamily: "var(--font-instrument-serif), serif",
                  letterSpacing: "-0.02em",
                }}
              >
                protect
              </span>{" "}
              — all on autopilot.
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p
              className="max-w-2xl mx-auto text-lg leading-relaxed"
              style={{ color: "var(--color-text-gray,#6f6f6f)" }}
            >
              From &quot;auto-assign on new lead&quot; to &quot;keep this stage
              off-limits to interns&quot; — Xale gives you fine-grained
              automation and access control in one place. No code. No
              consultants.
            </p>
          </Reveal>
        </div>

        {/* Workflow panel */}
        <Reveal delay={0.15}>
          <div
            className="rounded-3xl p-8 md:p-10 max-sm:p-5 mb-6"
            style={{
              backgroundColor: "var(--color-bg-secondary,#eef3f1)",
              border: "1px solid var(--color-border-primary,#e6e8e7)",
            }}
          >
            <div className="flex items-end justify-between flex-wrap gap-4 mb-8">
              <div>
                <p
                  className="text-[12px] uppercase tracking-[0.14em] font-semibold mb-2"
                  style={{ color: "var(--color-success,#156548)" }}
                >
                  Workflow Automations
                </p>
                <h3
                  className="text-2xl md:text-[28px] font-medium"
                  style={{
                    color: "var(--color-text-primary,#1e302a)",
                    letterSpacing: "-0.015em",
                  }}
                >
                  Real workflows your team will actually use.
                </h3>
              </div>
              <div
                className="flex items-center gap-5 text-[13px]"
                style={{ color: "var(--color-text-gray,#6f6f6f)" }}
              >
                <Stat number="6" label="Triggers" />
                <Stat number="23" label="Actions" />
                <Stat number="∞" label="Combinations" />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {WORKFLOWS.map((wf, i) => (
                <WorkflowCard key={wf.title} workflow={wf} index={i} />
              ))}
            </div>
          </div>
        </Reveal>

        {/* Security panel */}
        <Reveal delay={0.2}>
          <div
            className="rounded-3xl p-8 md:p-10 max-sm:p-5"
            style={{
              backgroundColor: "#ffffff",
              border: "1px solid var(--color-border-primary,#e6e8e7)",
              boxShadow: "0 2px 8px -4px rgba(5,25,18,0.04)",
            }}
          >
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.4fr] gap-10 max-md:gap-6 items-start">
              {/* Left: copy */}
              <div>
                <p
                  className="text-[12px] uppercase tracking-[0.14em] font-semibold mb-2"
                  style={{ color: "var(--color-success,#156548)" }}
                >
                  Granular Permissions
                </p>
                <h3
                  className="text-2xl md:text-[28px] font-medium mb-4"
                  style={{
                    color: "var(--color-text-primary,#1e302a)",
                    letterSpacing: "-0.015em",
                  }}
                >
                  Strict enough for your CFO.
                </h3>
                <p
                  className="text-[15px] leading-[1.65] mb-6"
                  style={{ color: "var(--color-text-gray,#6f6f6f)" }}
                >
                  Decide who sees, edits, moves, or deletes — down to the
                  stage, source, branch, and field. Five preset roles, or
                  build your own.
                </p>

                <ul className="space-y-3">
                  <Bullet>
                    <strong>Branch isolation</strong> — managers only see their
                    team&apos;s leads
                  </Bullet>
                  <Bullet>
                    <strong>Stage locks</strong> — only senior reps can move
                    deals to &quot;Won&quot;
                  </Bullet>
                  <Bullet>
                    <strong>Field-level access</strong> — hide pricing notes
                    from junior staff
                  </Bullet>
                  <Bullet>
                    <strong>Full audit trail</strong> — every assignment, edit,
                    and stage change is logged
                  </Bullet>
                </ul>
              </div>

              {/* Right: permission matrix */}
              <PermissionMatrix />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Stat({ number, label }: { number: string; label: string }) {
  return (
    <div className="inline-flex flex-col">
      <span
        className="text-[22px] font-medium leading-none"
        style={{ color: "var(--color-text-primary,#1e302a)" }}
      >
        {number}
      </span>
      <span
        className="text-[11px] uppercase tracking-[0.1em] mt-1"
        style={{ color: "var(--color-text-gray,#6f6f6f)" }}
      >
        {label}
      </span>
    </div>
  );
}

function WorkflowCard({
  workflow,
  index,
}: {
  workflow: { title: string; subtitle: string; steps: Step[] };
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{
        duration: 0.55,
        delay: 0.1 + index * 0.08,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="rounded-2xl p-5 max-sm:p-4 flex flex-col"
      style={{
        backgroundColor: "#ffffff",
        border: "1px solid rgba(230,232,231,0.9)",
        boxShadow: "0 1px 2px -1px rgba(5,25,18,0.04)",
      }}
    >
      <h4
        className="text-[15px] font-semibold mb-1.5 leading-snug"
        style={{
          color: "var(--color-text-primary,#1e302a)",
          letterSpacing: "-0.01em",
        }}
      >
        {workflow.title}
      </h4>
      <p
        className="text-[13px] mb-5 leading-[1.5]"
        style={{ color: "var(--color-text-gray,#6f6f6f)" }}
      >
        {workflow.subtitle}
      </p>

      <ol className="flex flex-col gap-1.5 mt-auto">
        {workflow.steps.map((step, si) => (
          <motion.li
            key={si}
            initial={{ opacity: 0, x: -8 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{
              duration: 0.4,
              delay: 0.2 + index * 0.08 + si * 0.07,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="flex items-center gap-2.5 text-[13px]"
          >
            <span
              className="inline-flex items-center justify-center w-[42px] text-[9px] font-bold uppercase tracking-[0.06em] py-0.5 rounded shrink-0"
              style={{
                color: TONE_COLOR[step.tone],
                backgroundColor: `${TONE_COLOR[step.tone]}1a`,
                letterSpacing: "0.08em",
              }}
            >
              {TONE_LABEL[step.tone]}
            </span>
            <span
              style={{
                color: "var(--color-text-primary,#1e302a)",
                fontWeight: 500,
              }}
            >
              {step.label}
            </span>
          </motion.li>
        ))}
      </ol>
    </motion.div>
  );
}

function PermissionMatrix() {
  return (
    <div
      className="rounded-2xl overflow-hidden max-md:overflow-x-auto"
      style={{
        backgroundColor: "#fafbfb",
        border: "1px solid rgba(230,232,231,0.9)",
      }}
    >
    <div className="max-md:min-w-[640px]">
      <div
        className="grid items-center text-[10px] font-semibold uppercase tracking-[0.1em] px-4 py-3"
        style={{
          gridTemplateColumns: "minmax(140px,1.4fr) repeat(7, minmax(0,1fr))",
          color: "var(--color-text-gray,#6f6f6f)",
          borderBottom: "1px solid rgba(230,232,231,0.9)",
        }}
      >
        <span>Role</span>
        {PERMS.map((p) => (
          <span key={p} className="text-center text-[9.5px]">
            {p}
          </span>
        ))}
      </div>

      {ROLES.map((role, ri) => (
        <motion.div
          key={role.name}
          initial={{ opacity: 0, x: 12 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{
            duration: 0.4,
            delay: 0.25 + ri * 0.07,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="grid items-center px-4 py-3"
          style={{
            gridTemplateColumns: "minmax(140px,1.4fr) repeat(7, minmax(0,1fr))",
            borderBottom:
              ri === ROLES.length - 1
                ? "none"
                : "1px solid rgba(230,232,231,0.7)",
          }}
        >
          <div className="flex flex-col">
            <span
              className="text-[13px] font-medium leading-tight"
              style={{ color: "var(--color-text-primary,#1e302a)" }}
            >
              {role.name}
            </span>
            <span
              className="text-[11px]"
              style={{ color: "var(--color-text-gray,#6f6f6f)" }}
            >
              {role.note}
            </span>
          </div>
          {role.perms.map((on, ci) => (
            <div key={ci} className="flex items-center justify-center">
              <PermCell on={on} />
            </div>
          ))}
        </motion.div>
      ))}
    </div>
    </div>
  );
}

function PermCell({ on }: { on: boolean }) {
  return on ? (
    <span
      className="inline-flex items-center justify-center w-5 h-5 rounded-md"
      style={{ backgroundColor: "var(--color-success,#156548)" }}
    >
      <svg viewBox="0 0 24 24" width="11" height="11" fill="none">
        <path
          d="M5 12l5 5L20 7"
          stroke="#fff"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  ) : (
    <span
      className="inline-block w-3 h-[1.5px] rounded-full"
      style={{ backgroundColor: "rgba(5,25,18,0.18)" }}
    />
  );
}

function Bullet({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-2.5 text-[14px] leading-[1.55]">
      <span
        className="inline-flex items-center justify-center w-4 h-4 rounded-full mt-[3px] shrink-0"
        style={{ backgroundColor: "rgba(49,155,114,0.14)" }}
      >
        <svg viewBox="0 0 24 24" width="9" height="9" fill="none">
          <path
            d="M5 12l5 5L20 7"
            stroke="#156548"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      <span style={{ color: "var(--color-text-primary,#1e302a)" }}>
        {children}
      </span>
    </li>
  );
}
