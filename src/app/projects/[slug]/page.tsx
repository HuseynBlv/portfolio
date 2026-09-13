import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { Container } from "@/components/Container";
import { Reveal } from "@/components/Reveal";
import { StatusBadge } from "@/components/StatusBadge";
import { FlowDiagram } from "@/components/FlowDiagram";
import { StateMachine } from "@/components/StateMachine";
import { BackendAnatomy } from "@/components/BackendAnatomy";
import { CaseStudySection } from "@/components/CaseStudySection";
import { getCaseStudyProjects, getProjectBySlug } from "@/data/projects";

export function generateStaticParams() {
  return getCaseStudyProjects().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) return {};
  return {
    title: project.title,
    description: project.tagline,
  };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project || !project.caseStudy) notFound();

  const cs = project.caseStudy;

  return (
    <>
      <Nav />
      <main className="flex-1">
        <Container className="pt-14 md:pt-20">
          <Reveal>
            <Link
              href="/#projects"
              className="inline-flex items-center gap-1.5 text-[13px] text-text-secondary transition-colors hover:text-text"
            >
              <span aria-hidden>←</span> All work
            </Link>
          </Reveal>

          <Reveal delay={0.05}>
            <div className="mt-8 flex items-center gap-3 font-mono text-xs uppercase tracking-widest text-text-tertiary">
              {project.eyebrow}
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <h1 className="mt-4 max-w-3xl text-[clamp(2rem,5vw,3.25rem)] font-medium leading-[1.05] tracking-tight text-text">
              {project.title}
            </h1>
          </Reveal>

          <Reveal delay={0.11}>
            <div className="mt-5">
              <StatusBadge status={project.status} />
            </div>
          </Reveal>

          <Reveal delay={0.14}>
            <p className="mt-6 max-w-2xl text-[16px] leading-relaxed text-text-secondary">
              {project.tagline}
            </p>
          </Reveal>

          <Reveal delay={0.17}>
            <div className="mt-7 flex flex-wrap gap-2">
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

          {project.links && project.links.length > 0 && (
            <Reveal delay={0.2}>
              <div className="mt-6 flex flex-wrap items-center gap-5">
                {project.links.map((l) => (
                  <a
                    key={l.href}
                    href={l.href}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[13px] font-medium text-accent hover:opacity-80"
                  >
                    {l.label} ↗
                  </a>
                ))}
              </div>
            </Reveal>
          )}

          {project.anatomy && (
            <Reveal delay={0.23}>
              <div className="mt-10">
                <BackendAnatomy anatomy={project.anatomy} stateMachine={project.stateMachine} />
              </div>
            </Reveal>
          )}
        </Container>

        <Container className="mt-16 md:mt-20">
          <CaseStudySection index="01" title="Context">
            {cs.context.map((p, i) => (
              <p key={i} className="mb-4 text-[15px] leading-relaxed text-text-secondary last:mb-0">
                {p}
              </p>
            ))}
          </CaseStudySection>

          <CaseStudySection index="02" title="Problem">
            {cs.problem.map((p, i) => (
              <p key={i} className="mb-4 text-[15px] leading-relaxed text-text-secondary last:mb-0">
                {p}
              </p>
            ))}
          </CaseStudySection>

          <CaseStudySection index="03" title="System">
            {cs.system.map((p, i) => (
              <p key={i} className="mb-4 text-[15px] leading-relaxed text-text-secondary last:mb-0">
                {p}
              </p>
            ))}
          </CaseStudySection>

          <CaseStudySection index="04" title="Engineering Challenges">
            <ul className="flex flex-col gap-4">
              {cs.engineeringChallenges.map((c, i) => (
                <li key={i} className="flex gap-3 text-[15px] leading-relaxed text-text-secondary">
                  <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-accent" />
                  {c}
                </li>
              ))}
            </ul>
          </CaseStudySection>

          <CaseStudySection index="05" title="Architecture">
            <div className="flex flex-col gap-10">
              <div className="max-w-sm">
                <FlowDiagram data={cs.architecture} />
              </div>
              {cs.secondaryDiagram && (
                <div className="rounded-lg border border-border bg-surface p-6">
                  <StateMachine data={cs.secondaryDiagram} />
                </div>
              )}
            </div>
          </CaseStudySection>

          <CaseStudySection index="06" title="Key Decisions">
            <div className="flex flex-col gap-6">
              {cs.decisions.map((d) => (
                <div key={d.title} className="border-l-2 border-accent/40 pl-5">
                  <div className="text-[14.5px] font-medium text-text">{d.title}</div>
                  <p className="mt-1.5 text-[14px] leading-relaxed text-text-secondary">
                    {d.body}
                  </p>
                </div>
              ))}
            </div>
          </CaseStudySection>

          <CaseStudySection index="07" title="Result / Current Status">
            {cs.result.map((p, i) => (
              <p key={i} className="mb-4 text-[15px] leading-relaxed text-text-secondary last:mb-0">
                {p}
              </p>
            ))}
          </CaseStudySection>

          <CaseStudySection index="08" title="What I Learned">
            <ul className="flex flex-col gap-4">
              {cs.learnings.map((l, i) => (
                <li key={i} className="flex gap-3 text-[15px] leading-relaxed text-text-secondary">
                  <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-accent" />
                  {l}
                </li>
              ))}
            </ul>
          </CaseStudySection>
        </Container>

        <Container className="py-16 md:py-20">
          <div className="flex items-center justify-between border-t border-border pt-10">
            <Link
              href="/#projects"
              className="inline-flex items-center gap-1.5 text-[14px] font-medium text-text-secondary transition-colors hover:text-text"
            >
              <span aria-hidden>←</span> Back to all work
            </Link>
            <Link
              href="/#contact"
              className="inline-flex items-center gap-1.5 text-[14px] font-medium text-accent hover:opacity-80"
            >
              Get in touch <span aria-hidden>→</span>
            </Link>
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
}
