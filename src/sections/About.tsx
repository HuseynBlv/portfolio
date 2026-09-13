import { Container } from "@/components/Container";
import { SectionHeading } from "@/components/SectionHeading";
import { Reveal } from "@/components/Reveal";
import { StateMachine } from "@/components/StateMachine";

const progression = {
  label: "Progression",
  steps: [
    "Computer Science",
    "Java / Backend Development",
    "Complete Backend Applications",
    "Open-Source Contribution",
    "Real Product & Workflow Problems",
    "Backend Architecture",
  ],
};

const interests = ["State", "Data", "APIs", "Workflows", "Reliability", "Architecture"];

export function About() {
  return (
    <section id="about" className="py-24 md:py-32">
      <Container>
        <SectionHeading eyebrow="About" title="What I actually spend time on." />

        <div className="mt-14 grid grid-cols-1 gap-12 md:grid-cols-12 md:gap-8">
          <div className="md:col-span-7">
            <Reveal>
              <div className="flex flex-col gap-5 text-[15px] leading-relaxed text-text-secondary md:text-[16px]">
                <p>
                  I started in computer science the way most people do — writing
                  small programs to see what would happen. What kept my
                  attention was Java, and specifically backend development: the
                  layer of a system that decides what&rsquo;s actually allowed to
                  happen, independent of whatever interface sits on top of it.
                </p>
                <p>
                  From there, the projects got more complete — not bigger
                  demos, but systems with real state to manage: reservations
                  that can&rsquo;t double-book, rides that can&rsquo;t skip a status,
                  finances that need to stay consistent under authentication
                  and authorization. Contributing to Testcontainers Java added
                  a different dimension — working correctly inside a codebase
                  and a set of conventions I didn&rsquo;t create.
                </p>
                <p>
                  That combination — backend architecture plus real workflow
                  problems, whether that&rsquo;s a university&rsquo;s room reservations or
                  a retailer&rsquo;s transaction data — is where I want to keep
                  building. I&rsquo;m interested in what happens behind the
                  interface:
                </p>
              </div>
            </Reveal>

            <Reveal delay={0.08}>
              <div className="mt-5 flex flex-wrap gap-2">
                {interests.map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-border px-3 py-1 font-mono text-[12px] text-text-secondary"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </Reveal>
          </div>

          <div className="md:col-span-5">
            <Reveal delay={0.1}>
              <div className="rounded-lg border border-border bg-surface p-6">
                <StateMachine data={progression} />
              </div>
            </Reveal>
          </div>
        </div>
      </Container>
    </section>
  );
}
