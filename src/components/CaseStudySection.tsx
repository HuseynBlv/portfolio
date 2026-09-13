import { Reveal } from "./Reveal";

export function CaseStudySection({
  index,
  title,
  children,
}: {
  index: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-1 gap-6 border-t border-border py-12 md:grid-cols-12 md:gap-8 md:py-14">
      <div className="md:col-span-4">
        <Reveal>
          <div className="flex items-center gap-3 font-mono text-xs text-text-tertiary">
            <span className="text-accent">{index}</span>
            <span className="h-px w-6 bg-border-strong" />
          </div>
          <h2 className="mt-3 text-xl font-medium tracking-tight text-text md:text-[1.35rem]">
            {title}
          </h2>
        </Reveal>
      </div>
      <div className="md:col-span-8">{children}</div>
    </div>
  );
}
