export interface TechArea {
  label: string;
  items: string[];
  emphasis?: boolean;
}

export const techAreas: TechArea[] = [
  {
    label: "Backend",
    items: ["Java", "Spring Boot", "REST APIs", "JWT"],
    emphasis: true,
  },
  {
    label: "Data",
    items: ["PostgreSQL", "SQL / PL-pgSQL", "Redis", "Supabase"],
  },
  {
    label: "Infrastructure / Tooling",
    items: ["Docker", "Git", "GitHub", "Gradle"],
  },
  {
    label: "Frontend / Product",
    items: ["React", "Next.js", "TypeScript", "JavaScript"],
  },
];
