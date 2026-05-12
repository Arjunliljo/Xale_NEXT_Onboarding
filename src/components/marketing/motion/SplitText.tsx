"use client";

import { motion, type Variants } from "motion/react";
import type { CSSProperties } from "react";

type SplitTextProps = {
  text: string;
  className?: string;
  style?: CSSProperties;
  delay?: number;
  stagger?: number;
  duration?: number;
  as?: "h1" | "h2" | "h3" | "p" | "span";
};

const wordVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.04 } },
};

const charVariants: Variants = {
  hidden: { y: "110%" },
  visible: {
    y: "0%",
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function SplitText({
  text,
  className,
  style,
  delay = 0,
  stagger = 0.025,
  duration = 0.7,
  as = "span",
}: SplitTextProps) {
  const words = text.split(/(\s+)/);

  // We render each char wrapped in an overflow-hidden span so the inner span can
  // translate from below 100% up to 0% to create the mask-reveal effect.
  // Whole words are kept together with display:inline-block + white-space:nowrap
  // so they don't break mid-word.
  const Tag = motion[as] as typeof motion.span;

  return (
    <Tag
      className={className}
      style={{
        ...style,
        display: "inline-block",
      }}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-10%" }}
      variants={{
        hidden: {},
        visible: {
          transition: {
            delayChildren: delay,
            staggerChildren: 0, // we do per-char stagger inside word groups
          },
        },
      }}
    >
      {words.map((wordOrSpace, wi) => {
        if (/^\s+$/.test(wordOrSpace)) {
          // Render whitespace as-is (don't animate)
          return <span key={`s-${wi}`}>{wordOrSpace}</span>;
        }
        const chars = Array.from(wordOrSpace);
        return (
          <motion.span
            key={`w-${wi}`}
            style={{
              display: "inline-block",
              whiteSpace: "nowrap",
            }}
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: stagger } },
            }}
          >
            {chars.map((ch, ci) => (
              <span
                key={`c-${wi}-${ci}`}
                style={{
                  display: "inline-block",
                  overflow: "hidden",
                  verticalAlign: "bottom",
                  lineHeight: 1,
                }}
              >
                <motion.span
                  style={{
                    display: "inline-block",
                    willChange: "transform",
                  }}
                  variants={{
                    hidden: { y: "110%" },
                    visible: {
                      y: "0%",
                      transition: {
                        duration,
                        ease: [0.22, 1, 0.36, 1],
                      },
                    },
                  }}
                >
                  {ch}
                </motion.span>
              </span>
            ))}
          </motion.span>
        );
      })}
    </Tag>
  );
}
