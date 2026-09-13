import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  className,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4",
        align === "center" && "items-center text-center",
        className,
      )}
    >
      <div className="flex items-center gap-3">
        <span className="h-px w-8 bg-accent/50" />
        <span className="font-mono text-xs uppercase tracking-[0.18em] text-accent">
          {eyebrow}
        </span>
      </div>
      <h2 className="max-w-2xl text-[clamp(1.75rem,3.2vw,2.75rem)] font-medium leading-[1.1] tracking-tight text-text">
        {title}
      </h2>
      {description && (
        <p className="max-w-xl text-[15px] leading-relaxed text-text-secondary">
          {description}
        </p>
      )}
    </div>
  );
}
