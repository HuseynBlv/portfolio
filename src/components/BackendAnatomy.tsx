import { BackendAnatomy as BackendAnatomyData, FlowDiagram as FlowDiagramData } from "@/data/projects";
import { StateMachine } from "./StateMachine";

function Row({
  index,
  label,
  children,
}: {
  index: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-1 gap-2 py-5 first:pt-0 last:pb-0 md:grid-cols-[44px_180px_1fr] md:gap-6">
      <div className="hidden font-mono text-[11px] text-text-tertiary md:block">{index}</div>
      <div className="font-mono text-[11px] uppercase tracking-widest text-accent md:pt-0.5">
        {label}
      </div>
      <div className="text-[13.5px] leading-relaxed text-text-secondary">{children}</div>
    </div>
  );
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="flex flex-col gap-2.5">
      {items.map((item, i) => (
        <li key={i} className="flex gap-2.5">
          <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-text-tertiary" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export function BackendAnatomy({
  anatomy,
  stateMachine,
}: {
  anatomy: BackendAnatomyData;
  stateMachine?: FlowDiagramData;
}) {
  return (
    <div className="rounded-lg border border-border bg-surface p-6 md:p-7">
      <div className="mb-5 flex items-center gap-3">
        <span className="h-px w-6 bg-accent/50" />
        <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-text-tertiary">
          Backend Anatomy
        </span>
      </div>

      <div className="divide-y divide-border">
        <Row index="01" label="Domain modeled">
          {anatomy.domain}
        </Row>
        <Row index="02" label="Backend controls">
          {anatomy.backendControls}
        </Row>
        <Row index="03" label="Business rules">
          <BulletList items={anatomy.businessRules} />
        </Row>
        <Row index="04" label="Data storage">
          {anatomy.dataStorage}
        </Row>
        <Row index="05" label="State transitions">
          <div className="flex flex-col gap-4">
            <p>{anatomy.stateNote}</p>
            {stateMachine && (
              <div className="rounded-md border border-border bg-bg-raised p-4">
                <StateMachine data={stateMachine} />
              </div>
            )}
          </div>
        </Row>
        <Row index="06" label="What could go wrong">
          <BulletList items={anatomy.risks} />
        </Row>
        <Row index="07" label="Safeguards">
          {anatomy.safeguards}
        </Row>
      </div>
    </div>
  );
}
