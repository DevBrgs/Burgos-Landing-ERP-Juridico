import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { NewsletterFeed } from "@/components/landing/NewsletterFeed";

export const metadata = {
  title: "Newsletter | Burgos & Asociados",
  description: "Novedades legales, jurisprudencia, casos de éxito y eventos del estudio Burgos & Asociados.",
};

export default function NewsletterPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1 pt-20">
        <NewsletterFeed />
      </main>
      <Footer />
    </>
  );
}
