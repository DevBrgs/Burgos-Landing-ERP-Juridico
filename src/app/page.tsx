import { Hero } from "@/components/landing/Hero";
import { NewsletterSection } from "@/components/landing/NewsletterSection";
import { EquipoSection } from "@/components/landing/EquipoSection";
import { AreasSection } from "@/components/landing/AreasSection";
import { ContactoSection } from "@/components/landing/ContactoSection";
import { ChatWidget } from "@/components/landing/ChatWidget";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";

// JSON-LD Structured Data para SEO
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "LegalService",
  name: "Burgos & Asociados",
  description: "Estudio jurídico integral en Buenos Aires con más de 20 años de experiencia.",
  url: "https://erplandingburgos.vercel.app",
  telephone: "(011) 4567-8900",
  email: "contacto@burgos.com.ar",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Av. Corrientes 1234, Piso 8",
    addressLocality: "Ciudad Autónoma de Buenos Aires",
    addressRegion: "CABA",
    postalCode: "C1043",
    addressCountry: "AR",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: -34.6037,
    longitude: -58.3816,
  },
  openingHoursSpecification: {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    opens: "09:00",
    closes: "18:00",
  },
  priceRange: "$$",
  areaServed: {
    "@type": "City",
    name: "Buenos Aires",
  },
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Áreas de Práctica",
    itemListElement: [
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Derecho Civil" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Derecho Comercial" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Derecho Laboral" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Derecho Penal" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Derecho de Familia" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Derecho Administrativo" } },
    ],
  },
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
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
