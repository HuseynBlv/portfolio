import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { Hero } from "@/sections/Hero";
import { SelectedWork } from "@/sections/SelectedWork";
import { BackendEngineering } from "@/sections/BackendEngineering";
import { ProductSystems } from "@/sections/ProductSystems";
import { OpenSource } from "@/sections/OpenSource";
import { Journey } from "@/sections/Journey";
import { About } from "@/sections/About";
import { Contact } from "@/sections/Contact";

export default function Home() {
  return (
    <>
      <Nav />
      <main className="flex-1">
        <Hero />
        <SelectedWork />
        <BackendEngineering />
        <ProductSystems />
        <OpenSource />
        <Journey />
        <About />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
