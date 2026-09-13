"use client";

import { useCallback, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

type RideStateKey =
  | "REQUESTED"
  | "MATCHING"
  | "DRIVER_ASSIGNED"
  | "DRIVER_ARRIVING"
  | "IN_PROGRESS"
  | "COMPLETED";

const STATES: { key: RideStateKey; optional?: boolean }[] = [
  { key: "REQUESTED" },
  { key: "MATCHING" },
  { key: "DRIVER_ASSIGNED" },
  { key: "DRIVER_ARRIVING", optional: true },
  { key: "IN_PROGRESS" },
  { key: "COMPLETED" },
];

interface ArchNode {
  key: string;
  label: string;
  description: string | null;
}

const ARCH_NODES: ArchNode[] = [
  { key: "client", label: "Client", description: null },
  {
    key: "controller",
    label: "REST Controller",
    description:
      "Receives the HTTP request and enforces role-based authorization (@PreAuthorize) before any business logic runs.",
  },
  {
    key: "service",
    label: "Ride Service",
    description:
      "Coordinates the use case — loads the ride, calls domain validation, persists the result, and triggers side effects like notifications.",
  },
  {
    key: "domain",
    label: "Domain Validation",
    description:
      "RideStateService checks the ride's current status against an explicit whitelist of allowed source states before permitting the transition.",
  },
  {
    key: "repository",
    label: "Repository",
    description:
      "Loads the ride row under a pessimistic write lock (PESSIMISTIC_WRITE) so two concurrent requests can't act on the same ride at once.",
  },
  {
    key: "database",
    label: "PostgreSQL",
    description:
      "Persists the ride's status, along with rider/driver relationships and timestamps, as the single source of truth.",
  },
];

const ACTIVITY: Record<string, string> = {
  controller: "authorizing caller",
  service: "loading ride",
  domain: "checking allowed transitions",
  repository: "locking ride row",
  database: "persisting new status",
};

interface SimStep {
  to: RideStateKey;
  passThrough?: RideStateKey[];
  endpoint: string;
  status: string;
  buttonLabel: string;
  note?: string;
}

const STEPS: SimStep[] = [
  {
    to: "MATCHING",
    passThrough: ["REQUESTED"],
    endpoint: "POST /rides/request",
    status: "201 Created",
    buttonLabel: "Request Ride",
    note: "Creates the ride as REQUESTED, then promotes it to MATCHING inside the same transaction.",
  },
  {
    to: "DRIVER_ASSIGNED",
    endpoint: "POST /rides/{id}/accept",
    status: "200 OK",
    buttonLabel: "Accept Ride",
  },
  {
    to: "IN_PROGRESS",
    endpoint: "POST /rides/{id}/start",
    status: "200 OK",
    buttonLabel: "Start Ride",
    note: "Valid directly from DRIVER_ASSIGNED — DRIVER_ARRIVING is modeled but has no REST endpoint yet, so this run skips it.",
  },
  {
    to: "COMPLETED",
    endpoint: "POST /rides/{id}/complete",
    status: "200 OK",
    buttonLabel: "Complete Ride",
  },
];

const INVALID_ATTEMPT = {
  endpoint: "POST /rides/{id}/start",
  status: "409 Conflict",
  message: "IllegalStateException: Ride cannot transition from COMPLETED to IN_PROGRESS",
};

const SUCCESS_PATH = ["client", "controller", "service", "domain", "repository", "database"];
const REJECT_PATH = ["client", "controller", "service", "domain"];

type Phase = "idle" | "running" | "rejected-flash";

export function RideBackendSimulator() {
  const prefersReducedMotion = useReducedMotion();
  const [stepIndex, setStepIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>("idle");
  const [activeNode, setActiveNode] = useState<string | null>(null);
  const [selectedNode, setSelectedNode] = useState<string>("controller");
  const [invalidAttempted, setInvalidAttempted] = useState(false);
  const [lastResult, setLastResult] = useState<
    { ok: true; endpoint: string; status: string } | { ok: false; endpoint: string; status: string; message: string } | null
  >(null);
  const runId = useRef(0);

  const currentState: RideStateKey | null = stepIndex > 0 ? STEPS[stepIndex - 1].to : null;
  const nextStep = stepIndex < STEPS.length ? STEPS[stepIndex] : null;
  const isComplete = stepIndex === STEPS.length;

  const visited = new Set<RideStateKey>();
  for (let i = 0; i < stepIndex; i++) {
    STEPS[i].passThrough?.forEach((s) => visited.add(s));
    visited.add(STEPS[i].to);
  }

  const wait = useCallback(
    (ms: number) => new Promise((resolve) => setTimeout(resolve, prefersReducedMotion ? Math.min(ms, 30) : ms)),
    [prefersReducedMotion],
  );

  const runSequence = useCallback(
    async (path: string[]) => {
      const myRun = ++runId.current;
      setPhase("running");
      for (const key of path) {
        if (runId.current !== myRun) return false;
        setActiveNode(key);
        await wait(300);
      }
      return runId.current === myRun;
    },
    [wait],
  );

  const handleAdvance = async () => {
    if (!nextStep || phase === "running") return;
    const step = nextStep;
    const ok = await runSequence(SUCCESS_PATH);
    if (!ok) return;
    setStepIndex((i) => i + 1);
    setLastResult({ ok: true, endpoint: step.endpoint, status: step.status });
    setActiveNode(null);
    setPhase("idle");
  };

  const handleInvalidAttempt = async () => {
    if (phase === "running") return;
    setInvalidAttempted(true);
    const ok = await runSequence(REJECT_PATH);
    if (!ok) return;
    const myRun = runId.current;
    setLastResult({ ok: false, ...INVALID_ATTEMPT });
    setPhase("rejected-flash");
    await wait(900);
    if (runId.current === myRun) {
      setActiveNode(null);
      setPhase("idle");
    }
  };

  const handleReset = () => {
    runId.current += 1;
    setStepIndex(0);
    setPhase("idle");
    setActiveNode(null);
    setLastResult(null);
    setInvalidAttempted(false);
  };

  const selected = ARCH_NODES.find((n) => n.key === selectedNode) ?? ARCH_NODES[1];
  const showInvalidFlash = phase === "rejected-flash";

  return (
    <div className="rounded-lg border border-border bg-surface p-6 md:p-8">
      <div className="flex items-center gap-3">
        <span className="h-px w-6 bg-accent/50" />
        <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-text-tertiary">
          Interactive — Simulate the Ride Lifecycle
        </span>
      </div>

      {/* State machine */}
      <div className="mt-7 flex flex-col gap-2 md:flex-row md:flex-wrap md:items-start md:gap-x-2 md:gap-y-3">
        {STATES.map((s, i) => {
          const isCurrent = currentState === s.key;
          const isPassed = visited.has(s.key) && !isCurrent;
          const isOptionalUnvisited = s.optional && !visited.has(s.key) && !isCurrent;
          const isLast = i === STATES.length - 1;
          const isInvalidTarget = showInvalidFlash && s.key === "IN_PROGRESS";

          return (
            <div key={s.key} className="flex items-center md:items-start">
              <div className="relative flex flex-col items-start">
                <span
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 font-mono text-[11.5px] tracking-tight transition-colors duration-200",
                    isCurrent && "border-accent/60 bg-accent-soft text-accent-strong font-medium",
                    isPassed && "border-ok/40 bg-ok/[0.06] text-ok",
                    isOptionalUnvisited && "border-dashed border-border-strong bg-transparent text-text-tertiary",
                    !isCurrent && !isPassed && !isOptionalUnvisited && "border-border bg-bg-raised text-text-tertiary",
                    isInvalidTarget && "ring-2 ring-danger/60",
                  )}
                >
                  <span aria-hidden>
                    {isCurrent ? "●" : isPassed ? "✓" : isOptionalUnvisited ? "·" : "○"}
                  </span>
                  {s.key}
                </span>
                {s.optional && (
                  <span className="mt-1 pl-1 text-[10px] leading-none text-text-tertiary">
                    not REST-exposed
                  </span>
                )}
                <AnimatePresence>
                  {isInvalidTarget && (
                    <motion.span
                      initial={{ opacity: 0, scale: 0.7 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.7 }}
                      className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-danger text-[9px] font-bold text-bg"
                    >
                      ✕
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
              {!isLast && (
                <span className="mx-2 text-text-tertiary" aria-hidden>
                  <span className="hidden md:inline">→</span>
                  <span className="md:hidden">↓</span>
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Architecture path + inspector */}
      <div className="mt-9 grid grid-cols-1 gap-6 lg:grid-cols-[280px_1fr]">
        <div className="flex flex-col">
          {ARCH_NODES.map((node, i) => {
            const isActive = activeNode === node.key;
            const isRejected = isActive && showInvalidFlash;
            const isSelected = selectedNode === node.key;
            const isLast = i === ARCH_NODES.length - 1;
            const activityLabel =
              node.key === "client" && isActive
                ? nextStep
                  ? nextStep.endpoint
                  : INVALID_ATTEMPT.endpoint
                : ACTIVITY[node.key];

            return (
              <div key={node.key} className="flex flex-col">
                <button
                  type="button"
                  disabled={!node.description}
                  onClick={() => node.description && setSelectedNode(node.key)}
                  className={cn(
                    "flex items-center gap-3 rounded-md border px-4 py-3 text-left text-[13px] transition-colors duration-200",
                    node.description ? "cursor-pointer" : "cursor-default",
                    isRejected
                      ? "border-danger/60 bg-danger-soft text-danger"
                      : isActive
                        ? "border-accent/60 bg-accent-soft text-accent-strong"
                        : isSelected
                          ? "border-border-strong bg-surface-2 text-text"
                          : "border-border bg-bg-raised text-text-secondary hover:border-border-strong",
                  )}
                >
                  <span className="font-mono text-[11px] text-text-tertiary">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className={cn("font-medium", !node.description && "text-text-tertiary")}>
                    {node.label}
                  </span>
                  <AnimatePresence>
                    {isActive && activityLabel && (
                      <motion.span
                        initial={{ opacity: 0, x: -4 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.15 }}
                        className={cn(
                          "ml-auto whitespace-nowrap font-mono text-[10.5px]",
                          isRejected ? "text-danger" : "text-accent",
                        )}
                      >
                        {isRejected ? "rejected" : activityLabel}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </button>
                {!isLast && (
                  <div className="flex items-center pl-[30px]">
                    <svg width="10" height="18" viewBox="0 0 10 18" className="text-border-strong">
                      <line x1="5" y1="0" x2="5" y2="13" stroke="currentColor" strokeWidth="1.5" />
                      <path d="M1 12 L5 17 L9 12" stroke="currentColor" strokeWidth="1.5" fill="none" />
                    </svg>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="flex flex-col gap-4">
          <div className="rounded-md border border-border bg-bg-raised p-5">
            <div className="font-mono text-[11px] uppercase tracking-widest text-text-tertiary">
              Selected — click a node to inspect
            </div>
            <AnimatePresence mode="wait">
              <motion.div
                key={selected.key}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.18 }}
              >
                <div className="mt-2 text-[14px] font-medium text-text">{selected.label}</div>
                <p className="mt-1.5 text-[13.5px] leading-relaxed text-text-secondary">
                  {selected.description}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Controls */}
          <div className="flex flex-col gap-3 rounded-md border border-border bg-bg-raised p-5">
            <div className="flex flex-wrap items-center gap-3">
              {nextStep && (
                <button
                  type="button"
                  onClick={handleAdvance}
                  disabled={phase === "running"}
                  className="rounded-full bg-accent px-5 py-2.5 text-[13px] font-medium text-bg transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {nextStep.buttonLabel}
                </button>
              )}
              {isComplete && (
                <button
                  type="button"
                  onClick={handleInvalidAttempt}
                  disabled={phase === "running"}
                  className="rounded-full border border-danger/40 px-5 py-2.5 text-[13px] font-medium text-danger transition-colors hover:bg-danger-soft disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Try an invalid transition
                </button>
              )}
              {(stepIndex > 0 || invalidAttempted) && (
                <button
                  type="button"
                  onClick={handleReset}
                  className="rounded-full border border-border-strong px-5 py-2.5 text-[13px] text-text-secondary transition-colors hover:border-accent/50 hover:text-accent"
                >
                  Reset
                </button>
              )}
            </div>
            {nextStep && (
              <div className="font-mono text-[11px] text-text-tertiary">{nextStep.endpoint}</div>
            )}
            {nextStep?.note && (
              <p className="text-[12px] leading-relaxed text-text-tertiary">{nextStep.note}</p>
            )}
            {isComplete && !invalidAttempted && (
              <p className="text-[12px] leading-relaxed text-text-tertiary">
                The lifecycle is complete. Try attempting a transition the backend won&rsquo;t allow.
              </p>
            )}
          </div>

          <AnimatePresence>
            {lastResult && (
              <motion.div
                key={lastResult.ok ? `ok-${lastResult.status}` : "rejected"}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className={cn(
                  "rounded-md border p-5",
                  lastResult.ok ? "border-ok/30 bg-ok/[0.06]" : "border-danger/30 bg-danger-soft",
                )}
              >
                <div
                  className={cn(
                    "flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest",
                    lastResult.ok ? "text-ok" : "text-danger",
                  )}
                >
                  <span aria-hidden>{lastResult.ok ? "✓" : "✕"}</span>
                  {lastResult.status}
                </div>
                <p className="mt-2 font-mono text-[12.5px] text-text-secondary">{lastResult.endpoint}</p>
                {!lastResult.ok && (
                  <p className="mt-2 text-[12.5px] leading-relaxed text-text-secondary">
                    {lastResult.message}
                  </p>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
