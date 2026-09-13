import { Container } from "@/components/Container";
import { SectionHeading } from "@/components/SectionHeading";
import { ProjectFeature } from "@/components/ProjectFeature";
import { getCaseStudyProjects } from "@/data/projects";

export function SelectedWork() {
  const items = getCaseStudyProjects();

  return (
    <section id="projects" className="py-24 md:py-32">
      <Container>
        <SectionHeading
          eyebrow="Selected Engineering Work"
          title="Systems, not screens."
          description="Four projects that best represent how I think about backend engineering — workflow correctness, domain modeling, and contributing inside code I didn't write."
        />

        <div className="mt-16">
          {items.map((project, i) => (
            <ProjectFeature key={project.slug} project={project} index={i + 1} />
          ))}
        </div>
      </Container>
    </section>
  );
}
