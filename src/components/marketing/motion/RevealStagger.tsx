"use client";

import { motion, type Variants } from "motion/react";
import type { ReactNode } from "react";

const parent: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

const child: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

export function StaggerParent({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      variants={parent}
    >
      {children}
    </motion.div>
  );
}

export function StaggerChild({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.div className={className} variants={child}>
      {children}
    </motion.div>
  );
}
