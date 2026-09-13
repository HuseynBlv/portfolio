"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Project } from "@/data/projects";
import { StatusBadge } from "./StatusBadge";
import { FlowDiagram } from "./FlowDiagram";
import { cn } from "@/lib/utils";

export function ProjectAccordion({ items }: { items: Project[] }) {
  const [openSlug, setOpenSlug] = useState<string | null>(items[0]?.slug ?? null);

  return (
    <div className="border-t border-border">
      {items.map((project) => {
        const isOpen = openSlug === project.slug;
        return (
          <div key={project.slug} className="border-b border-border">
            <button
              type="button"
              onClick={() => setOpenSlug(isOpen ? null : project.slug)}
              className="flex w-full items-center justify-between gap-4 py-5 text-left tap-highlight-none"
              aria-expanded={isOpen}
            >
              <div className="flex min-w-0 flex-col gap-1.5 sm:flex-row sm:items-center sm:gap-4">
                <span className="truncate text-[15px] font-medium text-text md:text-base">
                  {project.title}
                </span>
                <span className="hidden font-mono text-[11px] text-text-tertiary sm:inline">
                  {project.tech.slice(0, 3).join(" / ")}
                </span>
              </div>
              <div className="flex shrink-0 items-center gap-4">
                <StatusBadge status={project.status} className="hidden sm:inline-flex" />
                <span
                  className={cn(
                    "font-mono text-lg text-text-tertiary transition-transform duration-300",
                    isOpen && "rotate-45 text-accent",
                  )}
                >
                  +
                </span>
              </div>
            </button>

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden"
                >
                  <div className="grid grid-cols-1 gap-8 pb-8 md:grid-cols-12">
                    <div className="md:col-span-7">
                      <p className="max-w-lg text-[14px] leading-relaxed text-text-secondary">
                        {project.tagline}
                      </p>

                      <div className="mt-5 grid gap-4 sm:grid-cols-2">
                        <div>
                          <div className="font-mono text-[11px] uppercase tracking-widest text-text-tertiary">
                            Challenge
                          </div>
                          <p className="mt-1.5 text-[13px] leading-relaxed text-text-secondary">
                            {project.challenge}
                          </p>
                        </div>
                        <div>
                          <div className="font-mono text-[11px] uppercase tracking-widest text-text-tertiary">
                            Result
                          </div>
                          <p className="mt-1.5 text-[13px] leading-relaxed text-text-secondary">
                            {project.result}
                          </p>
                        </div>
                      </div>

                      <div className="mt-5 flex flex-wrap gap-2">
                        {project.tech.map((t) => (
                          <span
                            key={t}
                            className="rounded-full border border-border px-2.5 py-1 font-mono text-[11px] text-text-secondary"
                          >
                            {t}
                          </span>
                        ))}
                      </div>

                      {project.hasCaseStudy && (
                        <Link
                          href={`/projects/${project.slug}`}
                          className="mt-5 inline-flex items-center gap-1.5 text-[13px] font-medium text-accent transition-opacity hover:opacity-80"
                        >
                          Full case study
                          <span aria-hidden>→</span>
                        </Link>
                      )}
                    </div>
                    <div className="md:col-span-5">
                      <FlowDiagram data={project.architecture} compact />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
