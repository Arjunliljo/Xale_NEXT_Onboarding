"use client";

import {
  motion,
  useScroll,
  useMotionValueEvent,
  useReducedMotion,
  useInView,
} from "motion/react";
import dynamic from "next/dynamic";
import { useRef, useState } from "react";
import Reveal from "../motion/Reveal";
import AnimatedWaveDivider from "./AnimatedWaveDivider";

const PillarsDashboardScene = dynamic(
  () => import("../three/PillarsDashboardScene"),
  { ssr: false, loading: () => null }
);

type PillarKind =
  | "lead"
  | "whatsapp"
  | "custom"
  | "rbac"
  | "automations"
  | "reports";

type Pillar = {
  kind: PillarKind;
  title: string;
  description: string;
  accent: string;
};

const PILLARS: Pillar[] = [
  {
    kind: "lead",
    title: "Every channel, one pipeline.",
    description:
      "Meta, WhatsApp, web forms, calls, CSV, custom webhooks — leads land typed, deduped, and source-attributed in seconds. One inbox for every source.",
    accent: "#156548",
  },
  {
    kind: "whatsapp",
    title: "WhatsApp Cloud, native.",
    description:
      "Templates, broadcasts, and 1:1 chats from the same surface as your leads. Full history synced in real time — no second tab, no shared phone.",
    accent: "#25D366",
  },
  {
    kind: "custom",
    title: "One lead. Many projects.",
    description:
      "Bridge leads to courses, services, packages, or properties — whatever your industry calls them. Custom fields scoped per stage, gated per role, no engineering.",
    accent: "#5E81F4",
  },
  {
    kind: "rbac",
    title: "Permissions for complex teams.",
    description:
      "Per stage. Per source. Per action. Per branch. Compose any role from blueprints — built for organisations with dozens of roles and hundreds of users.",
    accent: "#0F766E",
  },
  {
    kind: "automations",
    title: "Routing that thinks.",
    description:
      "Matrix-based auto-assignment by role, branch, source, or load. Six triggers, twenty-three actions, zero code. When multiple owners qualify, Xale splits the deal automatically.",
    accent: "#F59E0B",
  },
  {
    kind: "reports",
    title: "Every move, on the record.",
    description:
      "Real-time dashboards on lead flow, response SLAs, stage velocity, role compliance — plus an immutable activity log of every assignment, edit, and rollback. Audit-ready, exportable.",
    accent: "#7C3AED",
  },
];

export default function Pillars() {
  const sectionRef = useRef<HTMLElement>(null);
  const progressRef = useRef(0);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    progressRef.current = v;
  });

  return (
    <section ref={sectionRef} className="relative py-32 max-md:py-12 max-sm:py-8 bg-white">
      <div
        className="relative w-full overflow-hidden max-md:[height:220px] max-sm:[height:160px]"
        style={{
          height: "360px",
          backgroundColor: "#020c08",
          backgroundImage:
            "radial-gradient(70% 100% at 50% 50%, rgba(16,47,35,0.9) 0%, transparent 75%)",
          marginTop: "-128px",
          marginBottom: "48px",
        }}
      >
        <PillarsDashboardScene progressRef={progressRef} />
        <AnimatedWaveDivider fill="#ffffff" height={120} />
      </div>

      <div className="max-w-[1200px] mx-auto px-6 max-sm:px-4">
        <div className="text-center mb-20 max-md:mb-6">
          <Reveal>
            <p
              className="text-sm uppercase tracking-[0.2em] mb-6"
              style={{ color: "var(--color-success,#156548)" }}
            >
              Everything you need
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <h2
              className="text-4xl max-sm:text-2xl md:text-6xl font-medium leading-[1.05] mb-6 max-w-3xl mx-auto"
              style={{
                letterSpacing: "-0.035em",
                color: "var(--color-text-primary,#1e302a)",
              }}
            >
              Everything you need to close{" "}
              <span
                className="italic font-normal"
                style={{
                  fontFamily: "var(--font-instrument-serif), serif",
                  letterSpacing: "-0.02em",
                }}
              >
                more deals
              </span>
              .
            </h2>
          </Reveal>
          <Reveal delay={0.2}>
            <p
              className="mx-auto max-w-2xl text-lg max-sm:text-sm leading-relaxed"
              style={{ color: "var(--color-text-gray,#6f6f6f)" }}
            >
              Sales, admissions, services, ops — any team where leads have
              multiple projects, dozens of roles, and routing rules that change
              by stage.
            </p>
          </Reveal>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-5 max-sm:gap-3">
          {PILLARS.map((p, i) => (
            <PillarCard key={p.kind} pillar={p} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function PillarCard({ pillar, index }: { pillar: Pillar; index: number }) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "-10%" });
  const [hovered, setHovered] = useState(false);
  const active = inView && !reduce;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{
        duration: 0.55,
        delay: index * 0.06,
        ease: [0.22, 1, 0.36, 1],
      }}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      animate={reduce ? {} : { y: hovered ? -4 : 0 }}
      data-cursor="link"
      style={{
        background:
          "linear-gradient(180deg, #f7f9fb 0%, #ecf0f4 100%)",
        border: "none",
        boxShadow: hovered
          ? "0 28px 56px -22px rgba(5,25,18,0.22), 0 8px 16px -8px rgba(5,25,18,0.10)"
          : "0 10px 24px -16px rgba(5,25,18,0.16), 0 2px 6px -3px rgba(5,25,18,0.06)",
        transition:
          "box-shadow 0.35s ease, transform 0.35s cubic-bezier(0.22,1,0.36,1)",
      }}
      className="relative rounded-2xl p-7 max-sm:p-3 cursor-default flex flex-col overflow-hidden"
    >
      {/* Visual zone */}
      <div
        className="relative h-[160px] max-sm:h-[80px] -mx-7 max-sm:-mx-3 -mt-7 max-sm:-mt-3 mb-6 max-sm:mb-3 overflow-hidden"
        style={{
          backgroundImage:
            "radial-gradient(rgba(5,25,18,0.06) 1px, transparent 1px)",
          backgroundSize: "16px 16px",
        }}
      >
        <PillarVisual kind={pillar.kind} accent={pillar.accent} active={active} hovered={hovered} />
      </div>

      <h3
        className="text-[22px] max-sm:text-[15px] font-medium mb-2.5 max-sm:mb-1"
        style={{
          color: "var(--color-text-primary,#1e302a)",
          letterSpacing: "-0.02em",
          lineHeight: 1.15,
        }}
      >
        {pillar.title}
      </h3>
      <p
        className="text-[14.5px] max-sm:text-[12px] leading-[1.5]"
        style={{ color: "var(--color-text-gray,#6f6f6f)" }}
      >
        {pillar.description}
      </p>
    </motion.div>
  );
}

function PillarVisual({
  kind,
  accent,
  active,
  hovered,
}: {
  kind: PillarKind;
  accent: string;
  active: boolean;
  hovered: boolean;
}) {
  switch (kind) {
    case "lead":
      return <LeadPipeline accent={accent} active={active} />;
    case "whatsapp":
      return <WhatsAppChat accent={accent} active={active} />;
    case "custom":
      return <CustomBlocks accent={accent} active={active} hovered={hovered} />;
    case "rbac":
      return <RBACGrid accent={accent} active={active} />;
    case "automations":
      return <AutomationFlow accent={accent} active={active} />;
    case "reports":
      return <ReportsChart accent={accent} active={active} />;
  }
}

/* -------- Visualizations -------- */

function LeadPipeline({ accent, active }: { accent: string; active: boolean }) {
  const stages = [20, 75, 130, 185];
  return (
    <svg viewBox="0 0 220 160" className="absolute inset-0 w-full h-full">
      {/* Connector line */}
      <line
        x1={stages[0]}
        x2={stages[stages.length - 1]}
        y1="80"
        y2="80"
        stroke="rgba(5,25,18,0.12)"
        strokeWidth="1.5"
        strokeDasharray="3 5"
      />
      {/* Stage nodes */}
      {stages.map((x, i) => (
        <g key={i}>
          <circle
            cx={x}
            cy="80"
            r="11"
            fill="#fff"
            stroke={i === stages.length - 1 ? accent : "rgba(5,25,18,0.18)"}
            strokeWidth="1.5"
          />
          {i === stages.length - 1 && (
            <circle cx={x} cy="80" r="5" fill={accent} />
          )}
          <text
            x={x}
            y="108"
            textAnchor="middle"
            fontSize="9"
            fill="rgba(5,25,18,0.55)"
            fontWeight="500"
          >
            {["New", "Qualified", "Active", "Won"][i]}
          </text>
        </g>
      ))}
      {/* Traveling lead dot */}
      <motion.circle
        r="4"
        fill={accent}
        cy="80"
        initial={{ cx: stages[0], opacity: 0 }}
        animate={
          active
            ? {
                cx: [stages[0], stages[1], stages[2], stages[3]],
                opacity: [0, 1, 1, 0],
              }
            : { cx: stages[0], opacity: 0 }
        }
        transition={{
          duration: 3.6,
          times: [0, 0.33, 0.66, 1],
          repeat: Infinity,
          repeatDelay: 0.4,
          ease: "easeInOut",
        }}
        style={{ filter: `drop-shadow(0 0 6px ${accent}88)` }}
      />
    </svg>
  );
}

function WhatsAppChat({
  accent,
  active,
}: {
  accent: string;
  active: boolean;
}) {
  return (
    <div className="absolute inset-0 flex flex-col justify-center px-6 gap-2">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={active ? { opacity: 1, y: 0 } : { opacity: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="self-end max-w-[70%] px-3 py-2 rounded-2xl rounded-br-[6px] text-[12px] font-medium"
        style={{
          backgroundColor: accent,
          color: "#fff",
          boxShadow: `0 4px 12px -4px ${accent}55`,
        }}
      >
        Hi 👋 Tell me more about your courses
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={active ? { opacity: 1, y: 0 } : { opacity: 0 }}
        transition={{ duration: 0.4, delay: 0.6 }}
        className="self-start inline-flex items-center gap-1 px-3 py-2.5 rounded-2xl rounded-bl-[6px]"
        style={{
          backgroundColor: "#fff",
          border: "1px solid rgba(230,232,231,0.9)",
        }}
      >
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="block w-1.5 h-1.5 rounded-full"
            style={{ backgroundColor: "rgba(5,25,18,0.35)" }}
            animate={
              active
                ? { y: [0, -3, 0], opacity: [0.4, 1, 0.4] }
                : { y: 0, opacity: 0.4 }
            }
            transition={{
              duration: 1.1,
              repeat: Infinity,
              delay: i * 0.18,
              ease: "easeInOut",
            }}
          />
        ))}
      </motion.div>
    </div>
  );
}

function CustomBlocks({
  accent,
  active,
  hovered,
}: {
  accent: string;
  active: boolean;
  hovered: boolean;
}) {
  const blocks = [
    { label: "Name", width: 130 },
    { label: "Source", width: 110 },
    { label: "Stage", width: 95 },
  ];
  return (
    <div className="absolute inset-0 flex flex-col justify-center items-center gap-2">
      {blocks.map((b, i) => (
        <motion.div
          key={b.label}
          initial={{ opacity: 0, x: -16 }}
          animate={active ? { opacity: 1, x: 0 } : { opacity: 0, x: -16 }}
          transition={{ duration: 0.45, delay: 0.15 + i * 0.12, ease: [0.22, 1, 0.36, 1] }}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-[11px] font-medium"
          style={{
            width: b.width,
            backgroundColor: "#fff",
            border: `1px solid ${i === 0 && hovered ? accent : "rgba(230,232,231,0.9)"}`,
            color: "rgba(5,25,18,0.7)",
            boxShadow: i === 0 ? `0 4px 12px -8px ${accent}55` : "none",
            transition: "border-color 0.3s ease",
          }}
        >
          <span
            className="w-1.5 h-1.5 rounded-full"
            style={{ backgroundColor: accent }}
          />
          {b.label}
          <span className="ml-auto" style={{ color: "rgba(5,25,18,0.25)" }}>
            ⋮⋮
          </span>
        </motion.div>
      ))}
    </div>
  );
}

function RBACGrid({ accent, active }: { accent: string; active: boolean }) {
  const rows = ["Admin", "Manager", "Staff"];
  const cols = ["View", "Edit", "Delete"];
  const perms: boolean[][] = [
    [true, true, true],
    [true, true, false],
    [true, false, false],
  ];
  return (
    <div className="absolute inset-0 flex items-center justify-center px-4">
      <div
        className="grid gap-1.5 p-3 rounded-xl"
        style={{
          gridTemplateColumns: "auto repeat(3, 24px)",
          backgroundColor: "#fff",
          border: "1px solid rgba(230,232,231,0.9)",
        }}
      >
        <span />
        {cols.map((c) => (
          <span
            key={c}
            className="text-[8px] font-semibold uppercase text-center"
            style={{ color: "rgba(5,25,18,0.45)", letterSpacing: "0.06em" }}
          >
            {c.slice(0, 3)}
          </span>
        ))}
        {rows.map((r, ri) => (
          <RowFragment
            key={r}
            label={r}
            perms={perms[ri]}
            accent={accent}
            rowIndex={ri}
            active={active}
          />
        ))}
      </div>
    </div>
  );
}

function RowFragment({
  label,
  perms,
  accent,
  rowIndex,
  active,
}: {
  label: string;
  perms: boolean[];
  accent: string;
  rowIndex: number;
  active: boolean;
}) {
  return (
    <>
      <span
        className="text-[10px] font-medium pr-2"
        style={{ color: "rgba(5,25,18,0.75)" }}
      >
        {label}
      </span>
      {perms.map((on, ci) => (
        <motion.span
          key={ci}
          className="w-5 h-5 rounded-md flex items-center justify-center"
          style={{
            backgroundColor: on ? accent : "rgba(5,25,18,0.04)",
            color: "#fff",
          }}
          animate={
            active && on
              ? { scale: [1, 1.15, 1] }
              : { scale: 1 }
          }
          transition={{
            duration: 1.4,
            repeat: Infinity,
            repeatDelay: 2.2,
            delay: rowIndex * 0.35 + ci * 0.12,
            ease: "easeInOut",
          }}
        >
          {on ? (
            <svg viewBox="0 0 24 24" width="10" height="10" fill="none">
              <path
                d="M5 12l5 5L20 7"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          ) : null}
        </motion.span>
      ))}
    </>
  );
}

function AutomationFlow({
  accent,
  active,
}: {
  accent: string;
  active: boolean;
}) {
  return (
    <svg viewBox="0 0 240 160" className="absolute inset-0 w-full h-full">
      {/* Left node — trigger */}
      <g transform="translate(28, 60)">
        <rect width="56" height="40" rx="10" fill="#fff" stroke="rgba(5,25,18,0.12)" strokeWidth="1.5" />
        <text x="28" y="18" textAnchor="middle" fontSize="8" fontWeight="600" fill="rgba(5,25,18,0.5)" letterSpacing="0.08em">TRIGGER</text>
        <text x="28" y="30" textAnchor="middle" fontSize="9" fontWeight="600" fill="rgba(5,25,18,0.85)">New Lead</text>
      </g>

      {/* Right node — action */}
      <g transform="translate(156, 60)">
        <rect width="56" height="40" rx="10" fill="#fff" stroke="rgba(5,25,18,0.12)" strokeWidth="1.5" />
        <text x="28" y="18" textAnchor="middle" fontSize="8" fontWeight="600" fill="rgba(5,25,18,0.5)" letterSpacing="0.08em">ACTION</text>
        <text x="28" y="30" textAnchor="middle" fontSize="9" fontWeight="600" fill="rgba(5,25,18,0.85)">Assign Rep</text>
      </g>

      {/* Connector */}
      <line
        x1="84"
        y1="80"
        x2="156"
        y2="80"
        stroke="rgba(5,25,18,0.16)"
        strokeWidth="1.5"
        strokeDasharray="4 4"
      />

      {/* Center bolt badge */}
      <motion.g
        animate={active ? { scale: [1, 1.08, 1] } : { scale: 1 }}
        transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        style={{ transformOrigin: "120px 80px" }}
      >
        <circle cx="120" cy="80" r="14" fill={accent} />
        <path
          d="M122 73 L114 82 L120 82 L118 87 L126 78 L120 78 Z"
          fill="#fff"
        />
      </motion.g>

      {/* Flowing dot */}
      <motion.circle
        r="3"
        cy="80"
        fill={accent}
        initial={{ cx: 84, opacity: 0 }}
        animate={
          active
            ? { cx: [84, 156], opacity: [0, 1, 1, 0] }
            : { cx: 84, opacity: 0 }
        }
        transition={{
          duration: 2,
          times: [0, 0.1, 0.9, 1],
          repeat: Infinity,
          repeatDelay: 0.8,
          ease: "linear",
        }}
      />
    </svg>
  );
}

function ReportsChart({ accent, active }: { accent: string; active: boolean }) {
  // SVG line chart path
  const path = "M10,120 L40,95 L70,105 L100,70 L130,85 L160,50 L190,60 L220,30";
  const points = [
    [10, 120],
    [40, 95],
    [70, 105],
    [100, 70],
    [130, 85],
    [160, 50],
    [190, 60],
    [220, 30],
  ];
  return (
    <svg viewBox="0 0 240 160" className="absolute inset-0 w-full h-full">
      <defs>
        <linearGradient id="rep-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={accent} stopOpacity="0.22" />
          <stop offset="100%" stopColor={accent} stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Area under curve */}
      <motion.path
        d={`${path} L220,160 L10,160 Z`}
        fill="url(#rep-grad)"
        initial={{ opacity: 0 }}
        animate={active ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
      />

      {/* Line path drawn on view */}
      <motion.path
        d={path}
        fill="none"
        stroke={accent}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={active ? { pathLength: 1 } : { pathLength: 0 }}
        transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
      />

      {/* Pulsing endpoint */}
      <motion.g
        animate={
          active
            ? { scale: [1, 1.25, 1], opacity: [0.6, 1, 0.6] }
            : { scale: 1, opacity: 0.6 }
        }
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        style={{ transformOrigin: "220px 30px" }}
      >
        <circle
          cx="220"
          cy="30"
          r="10"
          fill={accent}
          opacity="0.18"
        />
      </motion.g>
      <circle cx="220" cy="30" r="4" fill={accent} />
      <circle cx="220" cy="30" r="2" fill="#fff" />

      {/* Subtle gridline */}
      {points.slice(1, -1).map((p, i) => (
        <line
          key={i}
          x1={p[0]}
          y1={p[1]}
          x2={p[0]}
          y2="140"
          stroke="rgba(5,25,18,0.06)"
          strokeWidth="1"
          strokeDasharray="2 3"
        />
      ))}
    </svg>
  );
}
