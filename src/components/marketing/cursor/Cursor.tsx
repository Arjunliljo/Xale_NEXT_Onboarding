"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring, useMotionTemplate } from "motion/react";

type Variant = "default" | "link" | "text" | "hide";

type CursorState = {
  variant: Variant;
  label: string | null;
};

export default function Cursor() {
  const [active, setActive] = useState(false);
  const [state, setState] = useState<CursorState>({ variant: "default", label: null });

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);

  // Spring physics — different stiffness for the inner dot vs the outer ring
  const dotX = useSpring(x, { stiffness: 800, damping: 35, mass: 0.4 });
  const dotY = useSpring(y, { stiffness: 800, damping: 35, mass: 0.4 });
  const ringX = useSpring(x, { stiffness: 200, damping: 22, mass: 0.6 });
  const ringY = useSpring(y, { stiffness: 200, damping: 22, mass: 0.6 });

  useEffect(() => {
    // Gate: fine pointer + no reduced motion
    if (typeof window === "undefined") return;
    const finePointer = window.matchMedia("(pointer: fine) and (hover: hover)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!finePointer || reduce) return;

    setActive(true);
    document.body.classList.add("custom-cursor-active");

    let raf = 0;
    let lastEvent: PointerEvent | null = null;
    function flush() {
      if (lastEvent) {
        x.set(lastEvent.clientX);
        y.set(lastEvent.clientY);
        lastEvent = null;
      }
      raf = 0;
    }
    function onMove(e: PointerEvent) {
      lastEvent = e;
      if (!raf) raf = requestAnimationFrame(flush);
    }

    function findCursorTarget(el: EventTarget | null): HTMLElement | null {
      let node = el as HTMLElement | null;
      while (node && node !== document.body) {
        if (node.dataset?.cursor) return node;
        // Auto-detect interactives without an explicit attr
        const tag = node.tagName;
        if (tag === "A" || tag === "BUTTON" || node.getAttribute("role") === "button") {
          return node;
        }
        node = node.parentElement;
      }
      return null;
    }

    function onOver(e: PointerEvent) {
      const target = findCursorTarget(e.target);
      if (!target) {
        setState({ variant: "default", label: null });
        return;
      }
      const cursorAttr = (target.dataset.cursor as Variant) || "link";
      const label = target.dataset.cursorLabel || null;
      setState({ variant: cursorAttr, label });
    }

    function onLeaveWindow() {
      setState({ variant: "hide", label: null });
    }
    function onEnterWindow() {
      setState({ variant: "default", label: null });
    }

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerover", onOver, true);
    document.addEventListener("pointerout", onLeaveWindow);
    document.addEventListener("pointerenter", onEnterWindow);

    return () => {
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerover", onOver, true);
      document.removeEventListener("pointerout", onLeaveWindow);
      document.removeEventListener("pointerenter", onEnterWindow);
      if (raf) cancelAnimationFrame(raf);
      document.body.classList.remove("custom-cursor-active");
      setActive(false);
    };
  }, [x, y]);

  // All hooks must be called before any early return (Rules of Hooks).
  const ringTransform = useMotionTemplate`translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`;
  const dotTransform = useMotionTemplate`translate3d(${dotX}px, ${dotY}px, 0) translate(-50%, -50%)`;

  if (!active) return null;

  // Size + style per variant
  const ringSize =
    state.variant === "link" ? 56 : state.variant === "text" ? 6 : 36;
  const ringOpacity = state.variant === "hide" ? 0 : 1;
  const dotSize =
    state.variant === "text" ? 0 : state.variant === "link" ? 0 : 6;

  return (
    <>
      <motion.div
        aria-hidden
        style={{
          position: "fixed",
          left: 0,
          top: 0,
          width: ringSize,
          height: ringSize,
          borderRadius: "50%",
          border: "1.5px solid #319b72",
          pointerEvents: "none",
          zIndex: 9999,
          transform: ringTransform,
          opacity: ringOpacity,
          transition:
            "width 0.25s cubic-bezier(0.22,1,0.36,1), height 0.25s cubic-bezier(0.22,1,0.36,1), opacity 0.2s, background-color 0.2s, box-shadow 0.2s",
          backgroundColor:
            state.variant === "link" ? "rgba(49,155,114,0.18)" : "transparent",
          boxShadow:
            state.variant === "link"
              ? "0 0 24px rgba(49,155,114,0.45)"
              : "0 0 12px rgba(49,155,114,0.25)",
          willChange: "transform",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 11,
          fontWeight: 500,
          letterSpacing: "0.04em",
          textTransform: "uppercase",
          whiteSpace: "nowrap",
          color: "#319b72",
        }}
      >
        {state.label && state.variant === "link" ? state.label : null}
      </motion.div>

      <motion.div
        aria-hidden
        style={{
          position: "fixed",
          left: 0,
          top: 0,
          width: dotSize,
          height: dotSize,
          borderRadius: "50%",
          backgroundColor: "#319b72",
          boxShadow: "0 0 8px rgba(49,155,114,0.6)",
          pointerEvents: "none",
          zIndex: 9999,
          transform: dotTransform,
          opacity: state.variant === "hide" ? 0 : 1,
          transition: "width 0.2s, height 0.2s, opacity 0.2s",
          willChange: "transform",
        }}
      />

      <style>{`
        .custom-cursor-active,
        .custom-cursor-active * {
          cursor: none !important;
        }
      `}</style>
    </>
  );
}
