"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { FlowDiagram as FlowDiagramData } from "@/data/projects";
import { cn } from "@/lib/utils";

export function StateMachine({
  data,
  className,
}: {
  data: FlowDiagramData;
  className?: string;
}) {
  const [active, setActive] = useState<number | null>(null);

  return (
    <div className={cn("w-full", className)}>
      {data.label && (
        <div className="mb-4 font-mono text-[11px] uppercase tracking-widest text-text-tertiary">
          {data.label}
        </div>
      )}
      <div className="flex flex-wrap items-center gap-y-3 tap-highlight-none">
        {data.steps.map((step, i) => {
          const isLast = i === data.steps.length - 1;
          const isActive = active === i;
          return (
            <div key={step + i} className="flex items-center">
              <motion.button
                type="button"
                onMouseEnter={() => setActive(i)}
                onMouseLeave={() => setActive(null)}
                onFocus={() => setActive(i)}
                onBlur={() => setActive(null)}
                initial={{ opacity: 0, y: 6 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.35, delay: i * 0.05 }}
                className={cn(
                  "rounded-full border px-3.5 py-1.5 font-mono text-[12px] tracking-tight transition-colors duration-200",
                  isActive
                    ? "border-accent/60 bg-accent-soft text-accent-strong"
                    : "border-border bg-surface text-text-secondary",
                )}
              >
                {step}
              </motion.button>
              {!isLast && (
                <span
                  className={cn(
                    "mx-2 text-sm transition-colors duration-200",
                    isActive ? "text-accent" : "text-text-tertiary",
                  )}
                >
                  →
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
