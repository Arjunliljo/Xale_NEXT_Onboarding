"use client";

import { ReactLenis, type LenisRef } from "lenis/react";
import { useEffect, useRef, type ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type LenisProviderProps = { children: ReactNode };

export default function LenisProvider({ children }: LenisProviderProps) {
  const lenisRef = useRef<LenisRef>(null);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    function update(time: number) {
      lenisRef.current?.lenis?.raf(time * 1000);
    }

    gsap.ticker.add(update);
    // Clamp delta during stalls (GC, tab switch, etc.) so Lenis can't
    // catch up in one fast burst — anything past 500ms gets treated as
    // a 33ms frame. Default would be lagSmoothing(500, 33), here we
    // tighten the smoothing window for snappier recovery.
    gsap.ticker.lagSmoothing(500, 33);

    const onScroll = () => ScrollTrigger.update();
    lenisRef.current?.lenis?.on("scroll", onScroll);

    return () => {
      gsap.ticker.remove(update);
      gsap.ticker.lagSmoothing(500, 33);
      lenisRef.current?.lenis?.off("scroll", onScroll);
    };
  }, []);

  return (
    <ReactLenis
      root
      ref={lenisRef}
      options={{
        lerp: 0.1,
        duration: 1.2,
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 1.5,
      }}
    >
      {children}
    </ReactLenis>
  );
}
