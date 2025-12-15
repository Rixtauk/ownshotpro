"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";

interface MotionLayoutProps {
  children: React.ReactNode;
  layoutKey: string;
}

export function MotionLayout({ children, layoutKey }: MotionLayoutProps) {
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={layoutKey}
        initial={{ opacity: 0, y: 8, filter: "blur(4px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        exit={{ opacity: 0, y: -8, filter: "blur(4px)" }}
        transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
