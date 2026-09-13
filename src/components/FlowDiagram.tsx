"use client";

import { motion } from "framer-motion";
import { FlowDiagram as FlowDiagramData } from "@/data/projects";
import { cn } from "@/lib/utils";

export function FlowDiagram({
  data,
  className,
  compact = false,
}: {
  data: FlowDiagramData;
  className?: string;
  compact?: boolean;
}) {
  return (
    <div className={cn("w-full", className)}>
      {data.label && (
        <div className="mb-4 font-mono text-[11px] uppercase tracking-widest text-text-tertiary">
          {data.label}
        </div>
      )}
      <div className="flex flex-col">
        {data.steps.map((step, i) => {
          const isLast = i === data.steps.length - 1;
          return (
            <div key={step + i} className="flex flex-col">
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.4, delay: i * 0.07 }}
                className={cn(
                  "flex items-center gap-3 rounded-md border border-border bg-surface px-4 text-sm text-text",
                  compact ? "py-2.5" : "py-3.5",
                )}
              >
                <span className="font-mono text-[11px] text-text-tertiary">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className={cn("font-medium", compact && "text-[13px]")}>{step}</span>
              </motion.div>
              {!isLast && (
                <div className="flex items-center pl-[26px]">
                  <svg width="10" height="22" viewBox="0 0 10 22" className="text-border-strong">
                    <line
                      x1="5"
                      y1="0"
                      x2="5"
                      y2="16"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      className="draw-line"
                    />
                    <path d="M1 15 L5 21 L9 15" stroke="currentColor" strokeWidth="1.5" fill="none" />
                  </svg>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
