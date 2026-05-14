import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { ArrowLeft, Clock, User, Share2 } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Artículo | Newsletter Burgos & Asociados",
};

export default async function ArticuloPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // TODO: Fetch del artículo desde Supabase
  return (
    <>
      <Navbar />
      <main className="flex-1 pt-20">
        <section className="py-16 bg-burgos-black min-h-screen">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <Link
              href="/newsletter"
              className="inline-flex items-center gap-2 text-burgos-gray-400 hover:text-burgos-gold text-sm mb-8 transition-colors"
            >
              <ArrowLeft size={16} />
              Volver al newsletter
            </Link>

            <article className="bg-burgos-dark rounded-2xl border border-burgos-gray-800 p-8 sm:p-10">
              <div className="flex items-center gap-3 mb-6">
                <span className="text-[10px] uppercase tracking-wider font-semibold px-2.5 py-1 rounded-full border bg-blue-500/10 text-blue-400 border-blue-500/20">
                  Novedades Normativas
                </span>
                <span className="text-burgos-gray-600 text-xs flex items-center gap-1">
                  <Clock size={10} />
                  10 May 2025
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-bold text-burgos-white mb-4">
                Artículo #{id}
              </h1>

              <div className="flex items-center justify-between mb-8 pb-6 border-b border-burgos-gray-800">
                <span className="text-sm text-burgos-gray-400 flex items-center gap-2">
                  <User size={14} />
                  Dr. Martín Burgos
                </span>
                <button className="text-burgos-gray-600 hover:text-burgos-gold transition-colors">
                  <Share2 size={18} />
                </button>
              </div>

              <div className="prose prose-invert max-w-none">
                <p className="text-burgos-gray-400 leading-relaxed">
                  Este artículo estará disponible cuando se conecte el sistema de
                  publicaciones con Supabase. Los abogados del estudio podrán
                  publicar contenido desde su panel interno del ERP.
                </p>
                <p className="text-burgos-gray-400 leading-relaxed mt-4">
                  El contenido incluirá noticias legales, análisis de
                  jurisprudencia, casos de éxito y eventos del estudio.
                </p>
              </div>
            </article>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
