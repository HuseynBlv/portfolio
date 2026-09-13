import { site } from "@/data/site";
import { Container } from "@/components/Container";
import { Reveal } from "@/components/Reveal";

export function Hero() {
  return (
    <section id="home" className="relative overflow-hidden pt-16 pb-20 md:pt-24 md:pb-28">
      <Container>
        <Reveal>
          <div className="mb-8 flex flex-wrap items-center gap-x-3 gap-y-2 font-mono text-[12px] uppercase tracking-widest text-text-tertiary">
            <span>{site.location}</span>
            <span className="text-border-strong">/</span>
            <span>Computer Science, UFAZ</span>
          </div>
        </Reveal>

        <Reveal delay={0.05}>
          <h1 className="text-[clamp(2.6rem,7vw,5rem)] font-medium leading-[0.98] tracking-tight text-text">
            Huseyn Balayev
          </h1>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-2">
            <span className="text-xl text-text-secondary md:text-2xl">Software Engineer</span>
          </div>
        </Reveal>

        <Reveal delay={0.14}>
          <p className="mt-3 font-mono text-[13px] tracking-tight text-accent">
            Java Backend <span className="text-text-tertiary">·</span> Systems{" "}
            <span className="text-text-tertiary">·</span> Product Engineering
          </p>
        </Reveal>

        <Reveal delay={0.18}>
          <p className="mt-7 max-w-xl text-[16px] leading-relaxed text-text-secondary md:text-[17px]">
            I build backend systems around real workflows — from reservations
            and ride management to retail data and open-source Java.
          </p>
        </Reveal>

        <Reveal delay={0.24}>
          <div className="mt-9 flex flex-wrap items-center gap-4">
            <a
              href="#projects"
              className="rounded-full bg-accent px-5 py-2.5 text-[14px] font-medium text-bg transition-opacity hover:opacity-90"
            >
              View Engineering Work
            </a>
            <a
              href={site.github}
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-border-strong px-5 py-2.5 text-[14px] text-text transition-colors hover:border-accent/50 hover:text-accent"
            >
              GitHub
            </a>
            <a
              href={site.resume}
              target="_blank"
              rel="noreferrer"
              className="group flex items-center gap-1.5 px-1 py-2.5 text-[14px] text-text-secondary transition-colors hover:text-text"
            >
              Resume
              <span className="transition-transform group-hover:translate-x-0.5">→</span>
            </a>
          </div>
        </Reveal>

        <Reveal delay={0.3}>
          <div className="mt-14 flex flex-wrap gap-x-8 gap-y-3 border-t border-border pt-6 font-mono text-[11px] uppercase tracking-widest text-text-tertiary">
            <span>UFAZ · Strasbourg dual-degree</span>
            <span>~98/100 GPA</span>
            <span>Java-first backend engineering</span>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
