"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type LegalPageLayoutProps = {
  title: string;
  description: string;
  children: React.ReactNode;
};

const NAV_ITEMS = [
  { path: "/privacy-policy", label: "Privacy Policy" },
  { path: "/terms-of-service", label: "Terms of Service" },
  { path: "/data-deletion", label: "Data Deletion" },
];

const C = {
  black10: "#051912",
  black9: "#202926",
  black7: "#505e59",
  black5: "#828c88",
  black4: "#9ba3a0",
  textPrimary: "#1e302a",
  textSecondary: "#505e59",
  textGray: "#6f6f6f",
  bgSecondary: "#eef3f1",
  bgGreen: "#f2f7f5",
  bgHover: "#f4f6f5",
  borderPrimary: "#e6e8e7",
  borderGreen: "#98cdb8",
  borderAccent: "#add7c7",
  success: "#156548",
  green9: "#20654a",
  green: "#319b72",
};

export default function LegalPageLayout({
  title,
  description,
  children,
}: LegalPageLayoutProps) {
  const pathname = usePathname();

  return (
    <div
      style={{
        minHeight: "100vh",
        background: `radial-gradient(124.81% 124.81% at 50% 124.81%, #fff 73.57%, #eaf5f1 93.99%, #f0f8f5 100%)`,
        fontFamily: "'Helvetica Neue', sans-serif",
      }}
    >
      <div
        style={{
          backgroundColor: C.black10,
          padding: "14px 32px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Link
          href="/"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            textDecoration: "none",
          }}
        >
          <img
            src="/assets/Logo.png"
            alt="Xale"
            style={{ height: "28px", width: "28px", borderRadius: "50%" }}
          />
          <span
            style={{
              color: "#fff",
              fontSize: "17px",
              fontWeight: 600,
              letterSpacing: "-0.02em",
            }}
          >
            Xale
          </span>
        </Link>
        <Link
          href="/"
          style={{
            color: C.borderGreen,
            textDecoration: "none",
            fontSize: "13px",
            fontWeight: 400,
          }}
        >
          &larr; Back to Home
        </Link>
      </div>

      <div
        style={{
          background: `linear-gradient(135deg, ${C.black10} 0%, ${C.green9} 100%)`,
          padding: "52px 24px 60px",
          textAlign: "center",
        }}
      >
        <h1
          style={{
            fontSize: "34px",
            fontWeight: 600,
            color: "#fff",
            margin: "0 0 10px 0",
            letterSpacing: "-0.03em",
          }}
        >
          {title}
        </h1>
        <p
          style={{
            fontSize: "15px",
            color: C.borderGreen,
            margin: 0,
            letterSpacing: "-0.01em",
          }}
        >
          {description}
        </p>
      </div>

      <div
        style={{
          backgroundColor: "#fff",
          borderBottom: `1px solid ${C.borderPrimary}`,
          position: "sticky",
          top: 0,
          zIndex: 100,
        }}
      >
        <div
          style={{
            maxWidth: "780px",
            margin: "0 auto",
            padding: "0 24px",
            display: "flex",
            gap: "0",
          }}
        >
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.path;
            return (
              <Link
                key={item.path}
                href={item.path}
                style={{
                  padding: "14px 20px",
                  fontSize: "13px",
                  fontWeight: isActive ? 600 : 400,
                  color: isActive ? C.black10 : C.textGray,
                  textDecoration: "none",
                  borderBottom: isActive
                    ? `2px solid ${C.success}`
                    : "2px solid transparent",
                  transition: "all 0.15s",
                }}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>

      <div
        style={{
          maxWidth: "780px",
          margin: "0 auto",
          padding: "36px 24px 64px",
        }}
      >
        <div
          style={{
            backgroundColor: "#fff",
            borderRadius: "12px",
            border: `1px solid ${C.borderPrimary}`,
            padding: "36px 40px",
            fontSize: "15px",
            lineHeight: "1.75",
            color: C.textSecondary,
          }}
        >
          <p
            style={{
              fontSize: "12px",
              color: C.black4,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              margin: "0 0 28px 0",
            }}
          >
            Last updated: March 27, 2026
          </p>

          {children}
        </div>
      </div>

      <div
        style={{
          borderTop: `1px solid ${C.borderPrimary}`,
          backgroundColor: "#fff",
          padding: "28px 24px",
        }}
      >
        <div
          style={{
            maxWidth: "780px",
            margin: "0 auto",
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "16px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <img
              src="/assets/Logo.png"
              alt="Xale"
              style={{ height: "20px", width: "20px", borderRadius: "50%" }}
            />
            <p style={{ fontSize: "13px", color: C.black5, margin: 0 }}>
              &copy; {new Date().getFullYear()} Xale. All rights reserved.
              {" · "}
              Powered by{" "}
              <a
                href="https://marketlube.in"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: C.success, textDecoration: "none", fontWeight: 500 }}
              >
                Marketlube
              </a>
            </p>
          </div>
          <div style={{ display: "flex", gap: "20px" }}>
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                style={{
                  fontSize: "13px",
                  color: C.textGray,
                  textDecoration: "none",
                }}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2
      style={{
        fontSize: "11px",
        fontWeight: 700,
        color: C.success,
        textTransform: "uppercase",
        letterSpacing: "0.08em",
        margin: "32px 0 14px 0",
        paddingTop: "20px",
        borderTop: `1px solid ${C.bgSecondary}`,
      }}
    >
      {children}
    </h2>
  );
}

export function Paragraph({ children }: { children: React.ReactNode }) {
  return <p style={{ margin: "0 0 10px 0" }}>{children}</p>;
}

export function BulletList({ children }: { children: React.ReactNode }) {
  return (
    <ul style={{ listStyle: "none", padding: 0, margin: "10px 0" }}>
      {children}
    </ul>
  );
}

export function Bullet({ children }: { children: React.ReactNode }) {
  return (
    <li
      style={{
        display: "flex",
        gap: "12px",
        marginBottom: "8px",
        fontSize: "14px",
        lineHeight: "1.7",
      }}
    >
      <span
        style={{
          marginTop: "10px",
          height: "5px",
          width: "5px",
          minWidth: "5px",
          borderRadius: "50%",
          backgroundColor: C.borderGreen,
          flexShrink: 0,
        }}
      />
      <span>{children}</span>
    </li>
  );
}

export function Callout({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        backgroundColor: C.bgGreen,
        borderLeft: `3px solid ${C.green}`,
        borderRadius: "0 8px 8px 0",
        padding: "16px 20px",
        fontSize: "14px",
        color: C.black10,
        lineHeight: "1.65",
        margin: "16px 0",
      }}
    >
      {children}
    </div>
  );
}

export function ContactBox() {
  return (
    <div
      style={{
        backgroundColor: C.bgGreen,
        borderRadius: "10px",
        padding: "20px 24px",
        marginTop: "12px",
        border: `1px solid ${C.borderAccent}`,
      }}
    >
      <p style={{ fontWeight: 600, color: C.black10, margin: "0 0 8px 0", fontSize: "15px" }}>
        Xale
      </p>
      <p style={{ margin: "0 0 4px 0", fontSize: "14px" }}>
        Email:{" "}
        <a href="mailto:privacy@xale.in" style={{ color: C.success, textDecoration: "underline" }}>
          privacy@xale.in
        </a>
      </p>
      <p style={{ margin: 0, fontSize: "14px" }}>
        Website:{" "}
        <a href="https://xale.in" style={{ color: C.success, textDecoration: "underline" }}>
          xale.in
        </a>
      </p>
    </div>
  );
}
