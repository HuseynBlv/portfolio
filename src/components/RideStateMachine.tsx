"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface RideStateInfo {
  key: string;
  allowedFrom: string[];
  trigger: string;
  effect: string;
}

const states: RideStateInfo[] = [
  {
    key: "REQUESTED",
    allowedFrom: [],
    trigger: "Rider submits pickup/dropoff coordinates to POST /rides/request.",
    effect: "A new Ride row is created with an estimated fare. Nothing is assigned yet.",
  },
  {
    key: "MATCHING",
    allowedFrom: ["REQUESTED"],
    trigger: "Happens immediately after a ride is created.",
    effect: "The backend searches for nearby available drivers and offers the ride to them.",
  },
  {
    key: "DRIVER_ASSIGNED",
    allowedFrom: ["MATCHING"],
    trigger: "A driver calls POST /rides/{id}/accept.",
    effect:
      "The ride row is locked before the check runs, so only one accept can win. The driver flips to BUSY.",
  },
  {
    key: "DRIVER_ARRIVING",
    allowedFrom: ["DRIVER_ASSIGNED"],
    trigger: "Modeled and guarded in the domain layer — not yet wired to a REST endpoint.",
    effect: "Reserved for a “driver is close to pickup” signal. The ride stays assigned to the same driver.",
  },
  {
    key: "IN_PROGRESS",
    allowedFrom: ["DRIVER_ASSIGNED", "DRIVER_ARRIVING"],
    trigger: "The assigned driver calls POST /rides/{id}/start.",
    effect: "Start time is recorded. Reachable from either prior state — arriving is optional, not required.",
  },
  {
    key: "COMPLETED",
    allowedFrom: ["IN_PROGRESS"],
    trigger: "The assigned driver calls POST /rides/{id}/complete.",
    effect: "Final fare is calculated, the driver flips back to AVAILABLE, and a payment record is captured.",
  },
];

export function RideStateMachine() {
  const [selected, setSelected] = useState<string>(states[0].key);
  const active = states.find((s) => s.key === selected)!;

  return (
    <div className="rounded-lg border border-border bg-surface p-6 md:p-7">
      <div className="mb-6 flex items-center gap-3">
        <span className="h-px w-6 bg-accent/50" />
        <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-text-tertiary">
          Ride State Machine — click a state
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-y-3 tap-highlight-none">
        {states.map((s, i) => {
          const isLast = i === states.length - 1;
          const isActive = s.key === selected;
          const isAllowedFrom = active.allowedFrom.includes(s.key);
          return (
            <div key={s.key} className="flex items-center">
              <button
                type="button"
                onClick={() => setSelected(s.key)}
                onMouseEnter={() => setSelected(s.key)}
                className={cn(
                  "rounded-full border px-3.5 py-1.5 font-mono text-[12px] tracking-tight transition-colors duration-200",
                  isActive
                    ? "border-accent/60 bg-accent-soft text-accent-strong"
                    : isAllowedFrom
                      ? "border-ok/50 bg-ok/[0.06] text-ok"
                      : "border-border bg-bg-raised text-text-secondary hover:border-border-strong",
                )}
              >
                {s.key}
              </button>
              {!isLast && (
                <span className="mx-2 text-sm text-text-tertiary">→</span>
              )}
            </div>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={active.key}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="mt-6 rounded-md border border-border bg-bg-raised p-5"
        >
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-[120px_1fr]">
            <div className="font-mono text-[11px] uppercase tracking-widest text-text-tertiary">
              Allowed from
            </div>
            <div className="font-mono text-[13px] text-text-secondary">
              {active.allowedFrom.length > 0 ? active.allowedFrom.join(", ") : "— (entry state)"}
            </div>

            <div className="font-mono text-[11px] uppercase tracking-widest text-text-tertiary">
              Trigger
            </div>
            <div className="text-[13.5px] leading-relaxed text-text-secondary">{active.trigger}</div>

            <div className="font-mono text-[11px] uppercase tracking-widest text-text-tertiary">
              What happens
            </div>
            <div className="text-[13.5px] leading-relaxed text-text-secondary">{active.effect}</div>
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="mt-6 rounded-md border border-danger/30 bg-danger-soft p-5">
        <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest text-danger">
          <span>✕</span> Invalid transition
        </div>
        <p className="mt-2.5 font-mono text-[13px] text-text-secondary">
          COMPLETED <span className="text-danger">→</span> IN_PROGRESS
        </p>
        <p className="mt-2.5 text-[13px] leading-relaxed text-text-secondary">
          COMPLETED is never in the allowed-source set for IN_PROGRESS, so the domain layer throws{" "}
          <code className="font-mono text-[12.5px] text-text">
            IllegalStateException: Ride cannot transition from COMPLETED to IN_PROGRESS
          </code>{" "}
          before anything is persisted. A global exception handler maps it to HTTP 409 Conflict — the same
          path a duplicate <code className="font-mono text-[12.5px] text-text">complete</code> call or an
          out-of-order <code className="font-mono text-[12.5px] text-text">start</code> call would hit.
        </p>
      </div>
    </div>
  );
}
