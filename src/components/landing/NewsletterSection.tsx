"use client";

import { motion } from "framer-motion";
import { Newspaper, ArrowRight, Clock, User, Tag } from "lucide-react";
import { useState } from "react";

// Datos placeholder — en producción vendrán de Supabase (últimas 3 publicaciones)
const publicaciones = [
  {
    id: "1",
    titulo: "Nuevas modificaciones al Código Procesal Civil y Comercial",
    resumen:
      "Análisis de las recientes reformas que impactan en los plazos procesales y la tramitación de causas civiles.",
    categoria: "Novedades Normativas",
    autor: "Dr. Martín Burgos",
    fecha: "10 May 2025",
    imagen: null,
  },
  {
    id: "2",
    titulo: "Caso de éxito: Indemnización laboral por despido discriminatorio",
    resumen:
      "Logramos una sentencia favorable que reconoce el despido discriminatorio y establece una indemnización agravada.",
    categoria: "Casos de Éxito",
    autor: "Dra. Laura Méndez",
    fecha: "5 May 2025",
    imagen: null,
  },
  {
    id: "3",
    titulo: "Charla abierta: Derechos del consumidor en la era digital",
    resumen:
      "El próximo jueves realizaremos una charla gratuita sobre los derechos del consumidor en compras online.",
    categoria: "Eventos",
    autor: "Dra. Carolina Vega",
    fecha: "1 May 2025",
    imagen: null,
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

function categoriaColor(cat: string) {
  switch (cat) {
    case "Novedades Normativas":
      return "bg-blue-500/10 text-blue-400";
    case "Casos de Éxito":
      return "bg-green-500/10 text-green-400";
    case "Eventos":
      return "bg-purple-500/10 text-purple-400";
    default:
      return "bg-burgos-gold/10 text-burgos-gold";
  }
}

export function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [suscrito, setSuscrito] = useState(false);

  const handleSuscripcion = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Conectar con API de suscripción (Resend)
    console.log("Suscripción:", email);
    setSuscrito(true);
    setEmail("");
    setTimeout(() => setSuscrito(false), 4000);
  };

  return (
    <section id="newsletter" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 bg-burgos-gold/10 text-burgos-gold-dark px-4 py-1.5 rounded-full text-sm font-medium mb-4">
            <Newspaper size={16} />
            Newsletter Jurídico
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-burgos-navy mb-4">
            Últimas Publicaciones
          </h2>
          <p className="text-burgos-gray-500 max-w-2xl mx-auto">
            Noticias legales, casos de éxito y eventos del estudio. Publicado
            por nuestros profesionales.
          </p>
        </motion.div>

        {/* Posts grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
        >
          {publicaciones.map((post) => (
            <motion.article
              key={post.id}
              variants={itemVariants}
              className="bg-burgos-cream rounded-xl overflow-hidden border border-burgos-gray-200 hover:shadow-lg transition-shadow group cursor-pointer"
            >
              {/* Imagen placeholder */}
              <div className="h-40 bg-burgos-navy/5 flex items-center justify-center">
                <Newspaper className="w-10 h-10 text-burgos-navy/20" />
              </div>

              <div className="p-5">
                {/* Categoría */}
                <span
                  className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full mb-3 ${categoriaColor(post.categoria)}`}
                >
                  <Tag size={10} />
                  {post.categoria}
                </span>

                {/* Título */}
                <h3 className="font-semibold text-burgos-navy mb-2 group-hover:text-burgos-gold-dark transition-colors line-clamp-2">
                  {post.titulo}
                </h3>

                {/* Resumen */}
                <p className="text-sm text-burgos-gray-500 mb-4 line-clamp-2">
                  {post.resumen}
                </p>

                {/* Meta */}
                <div className="flex items-center justify-between text-xs text-burgos-gray-500">
                  <span className="flex items-center gap-1">
                    <User size={12} />
                    {post.autor}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock size={12} />
                    {post.fecha}
                  </span>
                </div>
              </div>
            </motion.article>
          ))}
        </motion.div>

        {/* Ver más + Suscripción */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="bg-burgos-navy rounded-2xl p-8 sm:p-10"
        >
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div>
              <h3 className="text-xl font-bold text-white mb-2">
                Suscribite al newsletter
              </h3>
              <p className="text-white/50 text-sm">
                Recibí un resumen semanal con las novedades legales más
                relevantes.
              </p>
            </div>

            <form
              onSubmit={handleSuscripcion}
              className="flex w-full lg:w-auto gap-3"
            >
              <input
                type="email"
                placeholder="tu@email.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 lg:w-64 px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/30 focus:outline-none focus:border-burgos-gold/50 transition-colors"
              />
              <button
                type="submit"
                disabled={suscrito}
                className="inline-flex items-center gap-2 bg-burgos-gold hover:bg-burgos-gold-dark disabled:bg-burgos-gold/50 text-burgos-navy px-6 py-3 rounded-lg font-semibold transition-colors whitespace-nowrap"
              >
                {suscrito ? (
                  "Suscrito ✓"
                ) : (
                  <>
                    Suscribirme
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
