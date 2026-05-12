"use client";

import { motion, useMotionValue, useSpring } from "motion/react";
import { useRef, type CSSProperties, type ReactNode } from "react";

type MagneticButtonProps = {
  href: string;
  children: ReactNode;
  variant?: "primary" | "ghost";
  className?: string;
  style?: CSSProperties;
};

export default function MagneticButton({
  href,
  children,
  variant = "primary",
  className,
  style,
}: MagneticButtonProps) {
  const ref = useRef<HTMLAnchorElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 150, damping: 15 });
  const springY = useSpring(y, { stiffness: 150, damping: 15 });

  function handleMouseMove(e: React.MouseEvent<HTMLAnchorElement>) {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) * 0.25;
    const dy = (e.clientY - cy) * 0.25;
    x.set(Math.max(-8, Math.min(8, dx)));
    y.set(Math.max(-8, Math.min(8, dy)));
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
  }

  const base =
    "inline-flex items-center justify-center px-6 py-3.5 rounded-full text-base font-medium transition-colors";
  const styles: CSSProperties =
    variant === "primary"
      ? { backgroundColor: "#319b72", color: "#051912", ...style }
      : {
          border: "1px solid rgba(255,255,255,0.2)",
          color: "#fff",
          backgroundColor: "transparent",
          ...style,
        };

  return (
    <motion.a
      ref={ref}
      href={href}
      data-cursor="link"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: springX, y: springY, ...styles }}
      className={`${base} ${className ?? ""}`}
    >
      {children}
    </motion.a>
  );
}
