import { Container } from "@/components/Container";
import { SectionHeading } from "@/components/SectionHeading";
import { ProjectAccordion } from "@/components/ProjectAccordion";
import { TechAreas } from "@/components/TechAreas";
import { getByGroup } from "@/data/projects";

export function BackendEngineering() {
  const items = getByGroup("backend");

  return (
    <section className="py-24 md:py-32">
      <Container>
        <SectionHeading
          eyebrow="Backend Engineering"
          title="Where most of the actual work happens."
          description="Java and Spring Boot are the center of gravity — REST APIs, relational modeling, authentication, and the business rules that keep a system's state correct."
        />

        <div className="mt-14">
          <ProjectAccordion items={items} />
        </div>

        <div className="mt-20">
          <div className="mb-8 font-mono text-[11px] uppercase tracking-widest text-text-tertiary">
            Tools by engineering area
          </div>
          <TechAreas />
        </div>
      </Container>
    </section>
  );
}
