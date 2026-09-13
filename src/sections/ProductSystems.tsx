import { Container } from "@/components/Container";
import { SectionHeading } from "@/components/SectionHeading";
import { ProjectAccordion } from "@/components/ProjectAccordion";
import { getByGroup } from "@/data/projects";

export function ProductSystems() {
  const items = getByGroup("product");

  return (
    <section className="py-24 md:py-32">
      <Container>
        <SectionHeading
          eyebrow="Product / Applied Systems"
          title="Where backend thinking meets a real problem."
          description="Applied AI, research, and product work — secondary to backend engineering, but shaped by the same instinct to understand what's actually happening underneath an idea before building it."
        />

        <div className="mt-14">
          <ProjectAccordion items={items} />
        </div>
      </Container>
    </section>
  );
}
