import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jbMono = JetBrains_Mono({
  variable: "--font-jbmono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://huseynbalayev.dev"),
  title: {
    default: "Huseyn Balayev — Software Engineer",
    template: "%s — Huseyn Balayev",
  },
  description:
    "Software engineer focused on backend systems — Java, Spring Boot, PostgreSQL, and the architecture behind reservation, ride-management, and retail-analytics workflows.",
  openGraph: {
    title: "Huseyn Balayev — Software Engineer",
    description:
      "Backend-focused software engineer. Java, Spring Boot, PostgreSQL, workflow systems, and open-source contribution.",
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jbMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-bg text-text">
        {children}
      </body>
    </html>
  );
}
