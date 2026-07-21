 
const fs = require('fs');
const content = fs.readFileSync('public/dekorasi.svg', 'utf-8');
let newContent = content.replace(/<svg\b([^>]*)>/g, '<motion.svg variants={container} initial="hidden" animate="show" $1 className={className}>');
newContent = newContent.replace(/<path\b/g, '<motion.path variants={item}');
newContent = newContent.replace(/fill-rule/g, 'fillRule').replace(/clip-rule/g, 'clipRule');

const reactCode = `"use client";

import React from "react";
import { motion, Variants } from "framer-motion";

export function AnimatedDekorasi({ className }: { className?: string }) {
  const container: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.015, delayChildren: 0.2 },
    },
  };

  const item: Variants = {
    hidden: { opacity: 0, scale: 0.5, y: 30, filter: "blur(10px)" },
    show: { 
      opacity: 1, scale: 1, y: 0, filter: "blur(0px)",
      transition: { type: "spring", bounce: 0.4, duration: 0.8 }
    }
  };

  return (
${newContent.split('\\n').map(l => '    ' + l).join('\\n')}
  );
}
`;
fs.writeFileSync('src/components/ui/animated-dekorasi.tsx', reactCode);
