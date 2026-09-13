import { Container } from "@/components/Container";
import { Reveal } from "@/components/Reveal";
import { site } from "@/data/site";

export function Contact() {
  return (
    <section id="contact" className="py-24 md:py-32">
      <Container>
        <div className="flex flex-col items-start gap-3">
          <Reveal>
            <span className="font-mono text-xs uppercase tracking-[0.18em] text-accent">
              Contact
            </span>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="max-w-2xl text-[clamp(1.9rem,4.4vw,3.25rem)] font-medium leading-[1.08] tracking-tight text-text">
              Open to backend / software engineering roles and conversations
              about systems worth building.
            </h2>
          </Reveal>
        </div>

        <Reveal delay={0.1}>
          <a
            href={`mailto:${site.email}`}
            className="mt-10 inline-block text-[clamp(1.4rem,3vw,2rem)] font-medium tracking-tight text-text underline decoration-border-strong decoration-2 underline-offset-8 transition-colors hover:text-accent hover:decoration-accent"
          >
            {site.email}
          </a>
        </Reveal>

        <Reveal delay={0.14}>
          <div className="mt-10 flex flex-wrap items-center gap-6 border-t border-border pt-8">
            <a
              href={site.github}
              target="_blank"
              rel="noreferrer"
              className="text-[14px] text-text-secondary transition-colors hover:text-text"
            >
              GitHub ↗
            </a>
            <a
              href={site.linkedin}
              target="_blank"
              rel="noreferrer"
              className="text-[14px] text-text-secondary transition-colors hover:text-text"
            >
              LinkedIn ↗
            </a>
            <a
              href={site.resume}
              target="_blank"
              rel="noreferrer"
              className="text-[14px] text-text-secondary transition-colors hover:text-text"
            >
              Resume ↗
            </a>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
