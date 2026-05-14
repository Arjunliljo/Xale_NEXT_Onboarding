"use client";

import { motion } from "motion/react";

/**
 * AnimatedWaveDivider — replaces the static fade gradient between two
 * sections with a continuously morphing SVG wave.
 *
 * Two `<motion.path>` layers wave at slightly different rates to create
 * a flowing, organic boundary. The fill color is the next section's
 * background, so the wave "eats into" the current section visually.
 */
type Props = {
  /** Color of the section BELOW (the wave fills with this) */
  fill?: string;
  height?: number;
  className?: string;
  style?: React.CSSProperties;
};

export default function AnimatedWaveDivider({
  fill = "#ffffff",
  height = 100,
  className,
  style,
}: Props) {
  // Scale wave height down on narrower viewports so it doesn't crash into
  // the bottom of mobile sections (where py is much smaller than the wave).
  const responsiveHeight =
    typeof height === "number"
      ? `clamp(40px, 7vw, ${height}px)`
      : height;
  return (
    <div
      aria-hidden
      className={className}
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        height: responsiveHeight,
        pointerEvents: "none",
        ...style,
      }}
    >
      <svg
        viewBox="0 0 1440 100"
        preserveAspectRatio="none"
        width="100%"
        height="100%"
        style={{ display: "block" }}
      >
        {/* Back wave — slower, more transparent */}
        <motion.path
          fill={fill}
          opacity={0.45}
          initial={{
            d:
              "M0,60 C240,90 480,30 720,55 C960,80 1200,30 1440,55 L1440,100 L0,100 Z",
          }}
          animate={{
            d: [
              "M0,60 C240,90 480,30 720,55 C960,80 1200,30 1440,55 L1440,100 L0,100 Z",
              "M0,55 C240,30 480,75 720,50 C960,25 1200,70 1440,45 L1440,100 L0,100 Z",
              "M0,60 C240,90 480,30 720,55 C960,80 1200,30 1440,55 L1440,100 L0,100 Z",
            ],
          }}
          transition={{
            duration: 11,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        {/* Front wave — faster, fully opaque */}
        <motion.path
          fill={fill}
          initial={{
            d:
              "M0,75 C240,55 480,90 720,70 C960,50 1200,90 1440,70 L1440,100 L0,100 Z",
          }}
          animate={{
            d: [
              "M0,75 C240,55 480,90 720,70 C960,50 1200,90 1440,70 L1440,100 L0,100 Z",
              "M0,70 C240,90 480,55 720,75 C960,95 1200,55 1440,75 L1440,100 L0,100 Z",
              "M0,75 C240,55 480,90 720,70 C960,50 1200,90 1440,70 L1440,100 L0,100 Z",
            ],
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </svg>
    </div>
  );
}
