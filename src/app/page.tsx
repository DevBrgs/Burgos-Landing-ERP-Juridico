import { Hero } from "@/components/landing/Hero";
import { AreasSection } from "@/components/landing/AreasSection";
import { EquipoSection } from "@/components/landing/EquipoSection";
import { ContactoSection } from "@/components/landing/ContactoSection";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <Hero />
        <AreasSection />
        <EquipoSection />
        <ContactoSection />
      </main>
      <Footer />
    </>
  );
}
