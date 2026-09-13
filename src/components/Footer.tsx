import { site } from "@/data/site";
import { Container } from "./Container";

export function Footer() {
  return (
    <footer className="border-t border-border py-10">
      <Container className="flex flex-col items-start justify-between gap-4 text-sm text-text-tertiary md:flex-row md:items-center">
        <p>
          {site.name} — {site.location}
        </p>
        <div className="flex items-center gap-6">
          <a href={site.github} target="_blank" rel="noreferrer" className="hover:text-text-secondary transition-colors">
            GitHub
          </a>
          <a href={`mailto:${site.email}`} className="hover:text-text-secondary transition-colors">
            Email
          </a>
          <span className="font-mono text-xs text-text-tertiary">
            {new Date().getFullYear()}
          </span>
        </div>
      </Container>
    </footer>
  );
}
