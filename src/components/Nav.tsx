"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { site, navLinks } from "@/data/site";
import { cn } from "@/lib/utils";

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b transition-colors duration-300",
        scrolled
          ? "border-border bg-bg/85 backdrop-blur-md"
          : "border-transparent bg-transparent",
      )}
    >
      <div className="mx-auto flex w-full max-w-[1180px] items-center justify-between px-6 py-4 md:px-10">
        <Link
          href="#home"
          className="font-mono text-[13px] tracking-tight text-text hover:text-accent transition-colors"
        >
          HB<span className="text-accent">.</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-[13px] text-text-secondary hover:text-text transition-colors"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-5">
          <a
            href={site.github}
            target="_blank"
            rel="noreferrer"
            className="text-[13px] text-text-secondary hover:text-text transition-colors"
          >
            GitHub
          </a>
          <a
            href={site.resume}
            target="_blank"
            rel="noreferrer"
            className="rounded-full border border-border-strong px-4 py-1.5 text-[13px] text-text hover:border-accent/50 hover:text-accent transition-colors"
          >
            Resume
          </a>
        </div>

        <button
          aria-label="Toggle menu"
          onClick={() => setOpen((v) => !v)}
          className="flex flex-col gap-1.5 md:hidden"
        >
          <span className={cn("h-px w-5 bg-text transition-transform", open && "translate-y-[3.5px] rotate-45")} />
          <span className={cn("h-px w-5 bg-text transition-transform", open && "-translate-y-[3.5px] -rotate-45")} />
        </button>
      </div>

      {open && (
        <div className="border-t border-border bg-bg md:hidden">
          <div className="flex flex-col gap-1 px-6 py-4">
            {navLinks.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="py-2.5 text-sm text-text-secondary hover:text-text transition-colors"
              >
                {l.label}
              </a>
            ))}
            <div className="mt-2 flex items-center gap-4 border-t border-border pt-4">
              <a href={site.github} target="_blank" rel="noreferrer" className="text-sm text-text-secondary hover:text-text">
                GitHub
              </a>
              <a href={site.resume} target="_blank" rel="noreferrer" className="text-sm text-text-secondary hover:text-text">
                Resume
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
