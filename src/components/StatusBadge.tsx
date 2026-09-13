import { cn } from "@/lib/utils";
import { ProjectStatus } from "@/data/projects";

const toneMap: Record<ProjectStatus, string> = {
  Built: "text-ok border-ok/25 bg-ok/[0.06]",
  Deployed: "text-ok border-ok/25 bg-ok/[0.06]",
  "Open Source": "text-accent border-accent/30 bg-accent-soft",
  "Pilot-stage": "text-accent border-accent/30 bg-accent-soft",
  Prototype: "text-text-secondary border-border-strong bg-surface-2",
  Concept: "text-text-secondary border-border-strong bg-surface-2",
  Hackathon: "text-text-secondary border-border-strong bg-surface-2",
};

export function StatusBadge({
  status,
  className,
}: {
  status: ProjectStatus;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[11px] uppercase tracking-wider",
        toneMap[status],
        className,
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {status}
    </span>
  );
}
