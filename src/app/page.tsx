import { Hero } from "@/components/landing/Hero";
import { NewsletterSection } from "@/components/landing/NewsletterSection";
import { EquipoSection } from "@/components/landing/EquipoSection";
import { AreasSection } from "@/components/landing/AreasSection";
import { ContactoSection } from "@/components/landing/ContactoSection";
import { ChatWidget } from "@/components/landing/ChatWidget";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <Hero />
        <NewsletterSection />
        <EquipoSection />
        <AreasSection />
        <ContactoSection />
      </main>
      <Footer />
      <ChatWidget />
    </>
  );
}
