import { Container } from "@/components/Container";
import { SectionHeading } from "@/components/SectionHeading";
import { Reveal } from "@/components/Reveal";
import { journey } from "@/data/journey";

export function Journey() {
  return (
    <section id="journey" className="py-24 md:py-32">
      <Container>
        <SectionHeading
          eyebrow="Engineering Journey"
          title="A short, honest timeline."
          description="Project work and coursework, not employment — the progression from coursework to backend systems to contributing inside an existing codebase."
        />

        <div className="mt-16 flex flex-col">
          {journey.map((entry, i) => (
            <Reveal key={entry.title} delay={i * 0.04}>
              <div className="grid grid-cols-[88px_1fr] gap-6 border-l border-border py-6 pl-6 first:pt-0 md:grid-cols-[140px_1fr]">
                <div className="relative">
                  <span className="absolute -left-[31px] top-1.5 h-2 w-2 rounded-full bg-accent md:-left-[31px]" />
                  <span className="font-mono text-[12px] text-text-tertiary">
                    {entry.period}
                  </span>
                </div>
                <div>
                  <h3 className="text-[15px] font-medium text-text md:text-base">
                    {entry.title}
                  </h3>
                  <p className="mt-1.5 max-w-xl text-[13.5px] leading-relaxed text-text-secondary">
                    {entry.description}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
