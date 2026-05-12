"use client";

import { motion } from "motion/react";
import Reveal from "../motion/Reveal";

type Row = { feature: string; xale: string | true; generic: string | boolean; spreadsheet: string | boolean };

const ROWS: Row[] = [
  { feature: "WhatsApp Business native", xale: true, generic: "Add-on", spreadsheet: false },
  { feature: "Meta Lead Ads native", xale: true, generic: "Zap required", spreadsheet: false },
  { feature: "Pre-built industry modules", xale: "6 verticals", generic: "Generic", spreadsheet: false },
  { feature: "Role-based access (per stage)", xale: true, generic: "Limited", spreadsheet: false },
  { feature: "Multi-tenant data isolation", xale: true, generic: true, spreadsheet: false },
  { feature: "Mobile app (iOS + Android)", xale: true, generic: "Some plans", spreadsheet: false },
  { feature: "Time to first lead", xale: "10 min", generic: "Days", spreadsheet: "Hours" },
  { feature: "Custom domain (white-label)", xale: true, generic: "Enterprise only", spreadsheet: false },
  { feature: "Pricing transparency", xale: true, generic: "Hidden tiers", spreadsheet: "Free 😅" },
];

function Cell({ value }: { value: string | boolean }) {
  if (value === true) {
    return (
      <span style={{ color: "var(--color-success,#156548)" }} className="text-lg">
        ✓
      </span>
    );
  }
  if (value === false) {
    return (
      <span style={{ color: "var(--color-error,#da2a46)" }} className="text-lg">
        ✕
      </span>
    );
  }
  return (
    <span className="text-sm" style={{ color: "var(--color-text-secondary,#505e59)" }}>
      {value}
    </span>
  );
}

export default function Comparison() {
  return (
    <section className="py-32 max-md:py-12 max-sm:py-8" style={{ backgroundColor: "#ffffff" }}>
      <div className="max-w-[1100px] mx-auto px-6 max-sm:px-4">
        <div className="text-center mb-16 max-md:mb-6">
          <Reveal>
            <p
              className="text-sm uppercase tracking-[0.2em] mb-6"
              style={{ color: "var(--color-success,#156548)" }}
            >
              Comparison
            </p>
          </Reveal>
          <Reveal delay={0.05}>
            <h2
              className="text-4xl max-sm:text-3xl md:text-5xl font-medium leading-[1.05] mb-6 max-w-3xl mx-auto"
              style={{
                letterSpacing: "-0.03em",
                color: "var(--color-text-primary,#1e302a)",
              }}
            >
              Why teams switch to Xale.
            </h2>
          </Reveal>
        </div>

        <Reveal delay={0.1}>
          <div
            className="rounded-2xl overflow-hidden max-md:overflow-x-auto"
            style={{
              border: "1px solid var(--color-border-primary,#e6e8e7)",
              backgroundColor: "#ffffff",
            }}
          >
            <table className="w-full max-md:min-w-[640px]">
              <thead>
                <tr
                  style={{
                    backgroundColor: "var(--color-bg-secondary,#eef3f1)",
                  }}
                >
                  <th
                    className="text-left text-xs uppercase tracking-wider py-4 px-5 font-medium"
                    style={{ color: "var(--color-text-gray,#6f6f6f)" }}
                  >
                    Feature
                  </th>
                  <th
                    className="text-center text-xs uppercase tracking-wider py-4 px-5 font-medium"
                    style={{ color: "var(--color-success,#156548)" }}
                  >
                    Xale
                  </th>
                  <th
                    className="text-center text-xs uppercase tracking-wider py-4 px-5 font-medium"
                    style={{ color: "var(--color-text-gray,#6f6f6f)" }}
                  >
                    Generic CRM
                  </th>
                  <th
                    className="text-center text-xs uppercase tracking-wider py-4 px-5 font-medium"
                    style={{ color: "var(--color-text-gray,#6f6f6f)" }}
                  >
                    Spreadsheets
                  </th>
                </tr>
              </thead>
              <tbody>
                {ROWS.map((row, i) => (
                  <motion.tr
                    key={row.feature}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.4, delay: i * 0.04 }}
                    style={{
                      borderTop:
                        i === 0
                          ? "none"
                          : "1px solid var(--color-border-primary,#e6e8e7)",
                    }}
                  >
                    <td
                      className="py-4 px-5 text-sm"
                      style={{ color: "var(--color-text-primary,#1e302a)" }}
                    >
                      {row.feature}
                    </td>
                    <td
                      className="py-4 px-5 text-center"
                      style={{
                        backgroundColor: "rgba(49,155,114,0.04)",
                      }}
                    >
                      <Cell value={row.xale} />
                    </td>
                    <td className="py-4 px-5 text-center">
                      <Cell value={row.generic} />
                    </td>
                    <td className="py-4 px-5 text-center">
                      <Cell value={row.spreadsheet} />
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
