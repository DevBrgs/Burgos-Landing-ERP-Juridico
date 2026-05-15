import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { ArrowLeft, Clock, User } from "lucide-react";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
import { ShareButton } from "./ShareButton";
import Image from "next/image";

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = getSupabase();
  const { data: post } = await supabase
    .from("posts")
    .select("titulo, resumen")
    .eq("id", id)
    .single();

  return {
    title: post?.titulo
      ? `${post.titulo} | Burgos & Asociados`
      : "Artículo | Newsletter Burgos & Asociados",
    description: post?.resumen || "",
  };
}

export default async function ArticuloPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const supabase = getSupabase();
  const { data: post } = await supabase
    .from("posts")
    .select(
      "id, titulo, resumen, contenido, categoria, imagen_url, publicado_en, autor_id, abogados(nombre)"
    )
    .eq("id", id)
    .single();

  if (!post) {
    return (
      <>
        <Navbar />
        <main className="flex-1 pt-20">
          <section className="py-16 bg-burgos-black min-h-screen">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <p className="text-burgos-gray-400 mb-4">
                Artículo no encontrado
              </p>
              <Link
                href="/#newsletter"
                className="text-burgos-gold hover:text-burgos-gold-light text-sm"
              >
                ← Volver a novedades
              </Link>
            </div>
          </section>
        </main>
        <Footer />
      </>
    );
  }

  const autorNombre =
    (post.abogados as any)?.nombre || "Burgos & Asociados";
  const fechaPublicacion = post.publicado_en
    ? new Date(post.publicado_en).toLocaleDateString("es-AR", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : null;

  return (
    <>
      <Navbar />
      <main className="flex-1 pt-20">
        <section className="py-16 bg-burgos-black min-h-screen">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <Link
              href="/#newsletter"
              className="inline-flex items-center gap-2 text-burgos-gray-400 hover:text-burgos-gold text-sm mb-8 transition-colors"
            >
              <ArrowLeft size={16} />
              Volver a novedades
            </Link>

            <article className="bg-burgos-dark rounded-2xl border border-burgos-gray-800 overflow-hidden">
              {/* Article Image */}
              {post.imagen_url && (
                <div className="relative w-full h-56 sm:h-72 md:h-80">
                  <Image
                    src={post.imagen_url}
                    alt={post.titulo || "Imagen del artículo"}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 768px"
                  />
                </div>
              )}

              <div className="p-8 sm:p-10">
                <div className="flex items-center gap-3 mb-6">
                  {post.categoria && (
                    <span className="text-[10px] uppercase tracking-wider font-semibold px-2.5 py-1 rounded-full border bg-blue-500/10 text-blue-400 border-blue-500/20">
                      {post.categoria}
                    </span>
                  )}
                  {fechaPublicacion && (
                    <span className="text-burgos-gray-600 text-xs flex items-center gap-1">
                      <Clock size={10} />
                      {fechaPublicacion}
                    </span>
                  )}
                </div>

                <h1 className="text-2xl sm:text-3xl font-bold text-burgos-white mb-4">
                  {post.titulo}
                </h1>

                {post.resumen && (
                  <p className="text-burgos-gray-400 text-base mb-6 italic">
                    {post.resumen}
                  </p>
                )}

                <div className="flex items-center justify-between mb-8 pb-6 border-b border-burgos-gray-800">
                  <span className="text-sm text-burgos-gray-400 flex items-center gap-2">
                    <User size={14} />
                    {autorNombre}
                  </span>
                  <ShareButton
                    title={post.titulo || "Artículo"}
                    text={post.resumen || ""}
                  />
                </div>

                <div className="prose prose-invert max-w-none">
                  {post.contenido ? (
                    <div
                      className="text-burgos-gray-400 leading-relaxed [&>p]:mb-4 [&>h2]:text-burgos-white [&>h2]:font-bold [&>h2]:text-xl [&>h2]:mt-8 [&>h2]:mb-4 [&>h3]:text-burgos-white [&>h3]:font-semibold [&>h3]:text-lg [&>h3]:mt-6 [&>h3]:mb-3 [&>ul]:list-disc [&>ul]:pl-6 [&>ul]:mb-4 [&>ol]:list-decimal [&>ol]:pl-6 [&>ol]:mb-4"
                      dangerouslySetInnerHTML={{ __html: post.contenido }}
                    />
                  ) : (
                    <p className="text-burgos-gray-400 leading-relaxed">
                      {post.resumen || "Contenido no disponible."}
                    </p>
                  )}
                </div>
              </div>
            </article>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
