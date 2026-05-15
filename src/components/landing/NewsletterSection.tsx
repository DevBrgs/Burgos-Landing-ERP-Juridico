"use client";

import { motion } from "framer-motion";
import { Newspaper, ArrowRight, Clock, User, Tag, ArrowUpRight } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

// Datos placeholder — en producción vendrán de Supabase (dinámico, priorizando lo más reciente)
const publicaciones = [
  {
    id: "1",
    titulo: "Nuevas modificaciones al Código Procesal Civil y Comercial",
    resumen:
      "Análisis de las recientes reformas que impactan en los plazos procesales y la tramitación de causas civiles en el ámbito nacional.",
    categoria: "Novedades Normativas",
    autor: "Dr. Martín Burgos",
    fecha: "10 May 2025",
    destacado: true,
    imagen: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&auto=format&fit=crop",
  },
  {
    id: "2",
    titulo: "Caso de éxito: Indemnización por despido discriminatorio",
    resumen:
      "Sentencia favorable que reconoce el despido discriminatorio con indemnización agravada para nuestro cliente.",
    categoria: "Casos de Éxito",
    autor: "Dra. Laura Méndez",
    fecha: "5 May 2025",
    destacado: false,
    imagen: "https://images.unsplash.com/photo-1521791055366-0d553872125f?w=800&auto=format&fit=crop",
  },
  {
    id: "3",
    titulo: "Charla abierta: Derechos del consumidor en la era digital",
    resumen:
      "El próximo jueves realizaremos una charla gratuita sobre los derechos del consumidor en compras online y plataformas digitales.",
    categoria: "Eventos",
    autor: "Dra. Carolina Vega",
    fecha: "1 May 2025",
    destacado: false,
    imagen: "https://images.unsplash.com/photo-1505664194779-8beaceb93744?w=800&auto=format&fit=crop",
  },
  {
    id: "4",
    titulo: "Actualización: Nuevos montos de UMA para regulación de honorarios",
    resumen:
      "Se actualizaron los valores de la Unidad de Medida Arancelaria. Impacto directo en las regulaciones de honorarios profesionales.",
    categoria: "Novedades Normativas",
    autor: "Dr. Alejandro Torres",
    fecha: "28 Abr 2025",
    destacado: false,
    imagen: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&auto=format&fit=crop",
  },
  {
    id: "5",
    titulo: "Jurisprudencia: CSJN sobre prescripción en acciones laborales",
    resumen:
      "Análisis del reciente fallo de la Corte Suprema que modifica el criterio de prescripción en reclamos por accidentes laborales.",
    categoria: "Jurisprudencia",
    autor: "Dra. Laura Méndez",
    fecha: "22 Abr 2025",
    destacado: false,
    imagen: "https://images.unsplash.com/photo-1436450412740-6b988f486c6b?w=800&auto=format&fit=crop",
  },
];

function categoriaStyle(cat: string) {
  switch (cat) {
    case "Novedades Normativas":
      return "bg-blue-500/10 text-blue-400 border-blue-500/20";
    case "Casos de Éxito":
      return "bg-green-500/10 text-green-400 border-green-500/20";
    case "Eventos":
      return "bg-purple-500/10 text-purple-400 border-purple-500/20";
    case "Jurisprudencia":
      return "bg-amber-500/10 text-amber-400 border-amber-500/20";
    default:
      return "bg-burgos-gold/10 text-burgos-gold border-burgos-gold/20";
  }
}

export function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [suscrito, setSuscrito] = useState(false);

  const handleSuscripcion = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Suscripción:", email);
    setSuscrito(true);
    setEmail("");
    setTimeout(() => setSuscrito(false), 4000);
  };

  const destacado = publicaciones.find((p) => p.destacado);
  const resto = publicaciones.filter((p) => !p.destacado);

  return (
    <section id="newsletter" className="py-28 bg-burgos-dark relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-burgos-gold/[0.02] rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-12"
        >
          <div>
            <span className="text-xs uppercase tracking-[0.3em] text-burgos-gold/60 font-medium">
              Newsletter Jurídico
            </span>
            <h2 className="text-3xl sm:text-5xl font-bold text-burgos-white mt-3 mb-2">
              Novedades
            </h2>
            <p className="text-burgos-gray-400 max-w-md">
              Publicado por nuestros profesionales. Noticias, jurisprudencia,
              eventos y casos de éxito.
            </p>
          </div>
          <Link
            href="/newsletter"
            className="mt-4 sm:mt-0 inline-flex items-center gap-2 text-burgos-gold hover:text-burgos-gold-light text-sm font-medium transition-colors group"
          >
            Ver todas las publicaciones
            <ArrowRight
              size={16}
              className="group-hover:translate-x-1 transition-transform"
            />
          </Link>
        </motion.div>

        {/* Layout: Destacado + Lista */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Post destacado */}
          {destacado && (
            <motion.article
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-3 group"
            >
              <Link href={`/newsletter/${destacado.id}`} className="block">
                <div className="h-full bg-burgos-dark-2 rounded-2xl border border-burgos-gray-800 hover:border-burgos-gold/20 overflow-hidden transition-all duration-500">
                  {/* Imagen destacada */}
                  <div className="relative h-52 overflow-hidden">
                    <img
                      src={destacado.imagen}
                      alt={destacado.titulo}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-burgos-dark-2 via-transparent to-transparent" />
                  </div>

                  <div className="p-8">
                    <div className="flex items-center gap-3 mb-4">
                      <span
                        className={`text-[10px] uppercase tracking-wider font-semibold px-2.5 py-1 rounded-full border ${categoriaStyle(destacado.categoria)}`}
                      >
                        {destacado.categoria}
                      </span>
                      <span className="text-burgos-gray-600 text-xs flex items-center gap-1">
                        <Clock size={10} />
                        {destacado.fecha}
                      </span>
                    </div>
                    <h3 className="text-2xl font-bold text-burgos-white group-hover:text-burgos-gold transition-colors duration-300 mb-3">
                      {destacado.titulo}
                    </h3>
                    <p className="text-burgos-gray-400 leading-relaxed">
                      {destacado.resumen}
                    </p>
                    <div className="flex items-center justify-between mt-6 pt-4 border-t border-burgos-gray-800">
                      <span className="text-sm text-burgos-gray-400 flex items-center gap-1.5">
                        <User size={12} />
                        {destacado.autor}
                      </span>
                      <span className="text-burgos-gold text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                        Leer más
                        <ArrowUpRight size={14} />
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.article>
          )}

          {/* Lista de posts */}
          <div className="lg:col-span-2 space-y-4">
            {resto.map((post, index) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Link href={`/newsletter/${post.id}`} className="block group">
                  <div className="bg-burgos-dark-2 rounded-xl border border-burgos-gray-800 hover:border-burgos-gold/20 overflow-hidden transition-all duration-300 flex">
                    {/* Thumbnail */}
                    <div className="w-24 sm:w-28 flex-shrink-0 overflow-hidden">
                      <img
                        src={post.imagen}
                        alt={post.titulo}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    {/* Content */}
                    <div className="p-4 flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span
                          className={`text-[9px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full border ${categoriaStyle(post.categoria)}`}
                        >
                          {post.categoria}
                        </span>
                      </div>
                      <h4 className="text-sm font-semibold text-burgos-white group-hover:text-burgos-gold transition-colors line-clamp-2 mb-1.5">
                        {post.titulo}
                      </h4>
                      <div className="flex items-center gap-3 text-[10px] text-burgos-gray-600">
                        <span className="flex items-center gap-1">
                          <User size={9} />
                          {post.autor}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock size={9} />
                          {post.fecha}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.article>
            ))}
          </div>
        </div>

        {/* Suscripción */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-12 bg-burgos-dark-2 rounded-2xl border border-burgos-gray-800 p-8 sm:p-10"
        >
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-lg font-bold text-burgos-white mb-1">
                Suscribite al resumen semanal
              </h3>
              <p className="text-burgos-gray-400 text-sm">
                Recibí las novedades legales más relevantes cada semana en tu
                casilla.
              </p>
            </div>

            <form
              onSubmit={handleSuscripcion}
              className="flex w-full lg:w-auto gap-2"
            >
              <input
                type="email"
                placeholder="tu@email.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 lg:w-56 px-4 py-3 bg-burgos-black/50 border border-burgos-gray-800 rounded-xl text-burgos-white placeholder:text-burgos-gray-600 focus:outline-none focus:border-burgos-gold/40 transition-colors text-sm"
              />
              <button
                type="submit"
                disabled={suscrito}
                className="inline-flex items-center gap-2 bg-burgos-gold hover:bg-burgos-gold-light disabled:bg-burgos-gold/30 text-burgos-black px-6 py-3 rounded-xl font-semibold transition-all duration-300 text-sm whitespace-nowrap"
              >
                {suscrito ? "Suscrito ✓" : "Suscribirme"}
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
