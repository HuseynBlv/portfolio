import Link from "next/link";
import { Project } from "@/data/projects";
import { StatusBadge } from "./StatusBadge";
import { FlowDiagram } from "./FlowDiagram";
import { Reveal } from "./Reveal";

export function ProjectFeature({ project, index }: { project: Project; index: number }) {
  return (
    <div className="border-b border-border py-14 first:pt-0 last:border-b-0 md:py-16">
      <div className="grid grid-cols-1 gap-10 md:grid-cols-12 md:gap-8">
        <div className="md:col-span-7">
          <Reveal>
            <div className="flex items-center gap-3 font-mono text-xs text-text-tertiary">
              <span>{String(index).padStart(2, "0")}</span>
              <span className="h-px w-6 bg-border-strong" />
              <span className="uppercase tracking-widest">{project.eyebrow}</span>
            </div>
          </Reveal>

          <Reveal delay={0.05}>
            <h3 className="mt-4 text-2xl font-medium tracking-tight text-text md:text-[1.65rem]">
              {project.title}
            </h3>
          </Reveal>

          <Reveal delay={0.08}>
            <div className="mt-3">
              <StatusBadge status={project.status} />
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <p className="mt-5 max-w-lg text-[15px] leading-relaxed text-text-secondary">
              {project.tagline}
            </p>
          </Reveal>

          <Reveal delay={0.14}>
            <div className="mt-6 flex flex-wrap gap-2">
              {project.tech.map((t) => (
                <span
                  key={t}
                  className="rounded-full border border-border px-2.5 py-1 font-mono text-[11px] text-text-secondary"
                >
                  {t}
                </span>
              ))}
            </div>
          </Reveal>

          {project.hasCaseStudy && (
            <Reveal delay={0.18}>
              <Link
                href={`/projects/${project.slug}`}
                className="mt-6 inline-flex items-center gap-1.5 text-[14px] font-medium text-accent transition-opacity hover:opacity-80"
              >
                Read full case study
                <span aria-hidden>→</span>
              </Link>
            </Reveal>
          )}
        </div>

        <div className="md:col-span-5">
          <Reveal delay={0.12}>
            <FlowDiagram data={project.architecture} compact />
          </Reveal>
        </div>
      </div>
    </div>
  );
}
