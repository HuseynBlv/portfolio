import { Container } from "@/components/Container";
import { SectionHeading } from "@/components/SectionHeading";
import { Reveal } from "@/components/Reveal";
import { StatusBadge } from "@/components/StatusBadge";
import { getProjectBySlug } from "@/data/projects";
import Link from "next/link";

const tree = [
  { text: "testcontainers-java/", indent: 0, marker: "" },
  { text: "modules/", indent: 1, marker: "" },
  { text: "mongodb/", indent: 2, marker: "" },
  { text: "src/test/java/.../MongoDBContainerTest.java", indent: 3, marker: "" },
  { text: "shouldRunInitScript()", indent: 4, marker: "+" },
];

export function OpenSource() {
  const project = getProjectBySlug("testcontainers-java");
  if (!project) return null;

  return (
    <section className="py-24 md:py-32">
      <Container>
        <SectionHeading
          eyebrow="Open Source"
          title="Contributing inside someone else's architecture."
          description="Building a project from scratch and extending an established one are different skills. This is the second one — working correctly within conventions I didn't set."
        />

        <div className="mt-14 overflow-hidden rounded-lg border border-border-strong bg-surface-2">
          <div className="flex flex-col gap-8 p-8 md:flex-row md:p-10">
            <div className="md:w-1/2">
              <Reveal>
                <div className="flex items-center gap-3">
                  <StatusBadge status={project.status} />
                  <span className="font-mono text-[11px] text-text-tertiary">
                    testcontainers/testcontainers-java
                  </span>
                </div>
              </Reveal>

              <Reveal delay={0.05}>
                <h3 className="mt-4 text-xl font-medium tracking-tight text-text">
                  {project.title}
                </h3>
              </Reveal>

              <Reveal delay={0.08}>
                <p className="mt-4 text-[14px] leading-relaxed text-text-secondary">
                  {project.contribution}
                </p>
              </Reveal>

              <Reveal delay={0.12}>
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

              <Reveal delay={0.16}>
                <div className="mt-7 flex flex-wrap items-center gap-5">
                  {project.links?.map((l) => (
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
                  <Link
                    href={`/projects/${project.slug}`}
                    className="text-[13px] font-medium text-text-secondary hover:text-text"
                  >
                    Full case study →
                  </Link>
                </div>
              </Reveal>
            </div>

            <div className="md:w-1/2">
              <Reveal delay={0.1}>
                <div className="rounded-md border border-border bg-bg-raised p-5">
                  <div className="mb-3 font-mono text-[11px] uppercase tracking-widest text-text-tertiary">
                    Contribution
                  </div>
                  <div className="flex flex-col gap-1.5 font-mono text-[13px]">
                    {tree.map((line, i) => (
                      <div
                        key={i}
                        style={{ paddingLeft: `${line.indent * 14}px` }}
                        className={
                          line.marker
                            ? "flex items-center gap-2 text-ok"
                            : "text-text-secondary"
                        }
                      >
                        {line.marker && <span>{line.marker}</span>}
                        <span>{line.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
