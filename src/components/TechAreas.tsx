import { techAreas } from "@/data/tech";
import { cn } from "@/lib/utils";

export function TechAreas() {
  return (
    <div className="grid grid-cols-1 gap-x-8 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
      {techAreas.map((area) => (
        <div key={area.label}>
          <div className="font-mono text-[11px] uppercase tracking-widest text-text-tertiary">
            {area.label}
          </div>
          <ul className="mt-3 flex flex-col gap-2">
            {area.items.map((item) => (
              <li
                key={item}
                className={cn(
                  "text-[14px] leading-tight",
                  area.emphasis && item === "Java"
                    ? "font-semibold text-accent-strong text-[16px]"
                    : "text-text-secondary",
                )}
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
