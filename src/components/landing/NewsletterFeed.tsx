"use client";

import { motion } from "framer-motion";
import { Clock, User, Tag, ArrowUpRight, Search, Filter } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

// Datos placeholder — en producción vendrán de Supabase
const allPosts = [
  {
    id: "1",
    titulo: "Nuevas modificaciones al Código Procesal Civil y Comercial",
    resumen: "Análisis de las recientes reformas que impactan en los plazos procesales y la tramitación de causas civiles en el ámbito nacional. Se modifican artículos clave sobre notificaciones y plazos.",
    categoria: "Novedades Normativas",
    autor: "Dr. Martín Burgos",
    fecha: "10 May 2025",
  },
  {
    id: "2",
    titulo: "Caso de éxito: Indemnización por despido discriminatorio",
    resumen: "Sentencia favorable que reconoce el despido discriminatorio con indemnización agravada. El tribunal aplicó la doctrina de la carga dinámica de la prueba.",
    categoria: "Casos de Éxito",
    autor: "Dra. Laura Méndez",
    fecha: "5 May 2025",
  },
  {
    id: "3",
    titulo: "Charla abierta: Derechos del consumidor en la era digital",
    resumen: "El próximo jueves realizaremos una charla gratuita sobre los derechos del consumidor en compras online y plataformas digitales. Inscripción abierta.",
    categoria: "Eventos",
    autor: "Dra. Carolina Vega",
    fecha: "1 May 2025",
  },
  {
    id: "4",
    titulo: "Actualización: Nuevos montos de UMA para regulación de honorarios",
    resumen: "Se actualizaron los valores de la Unidad de Medida Arancelaria. Impacto directo en las regulaciones de honorarios profesionales en todas las jurisdicciones.",
    categoria: "Novedades Normativas",
    autor: "Dr. Alejandro Torres",
    fecha: "28 Abr 2025",
  },
  {
    id: "5",
    titulo: "Jurisprudencia: CSJN sobre prescripción en acciones laborales",
    resumen: "Análisis del reciente fallo de la Corte Suprema que modifica el criterio de prescripción en reclamos por accidentes laborales. Impacto en causas en trámite.",
    categoria: "Jurisprudencia",
    autor: "Dra. Laura Méndez",
    fecha: "22 Abr 2025",
  },
  {
    id: "6",
    titulo: "Guía práctica: Cómo constituir una SAS en Argentina",
    resumen: "Paso a paso para la constitución de una Sociedad por Acciones Simplificada. Requisitos, costos y plazos actualizados a 2025.",
    categoria: "Guías",
    autor: "Dr. Federico Ruiz",
    fecha: "15 Abr 2025",
  },
  {
    id: "7",
    titulo: "Reforma laboral: Análisis del proyecto de ley en Diputados",
    resumen: "Desglose de los puntos principales del proyecto de reforma laboral que ingresó a la Cámara de Diputados. Posibles impactos para empleadores y trabajadores.",
    categoria: "Novedades Normativas",
    autor: "Dra. Laura Méndez",
    fecha: "10 Abr 2025",
  },
  {
    id: "8",
    titulo: "Caso de éxito: Defensa penal en delito económico complejo",
    resumen: "Absolución en causa por presunta administración fraudulenta. Estrategia de defensa basada en la falta de tipicidad objetiva del delito imputado.",
    categoria: "Casos de Éxito",
    autor: "Dr. Federico Ruiz",
    fecha: "5 Abr 2025",
  },
];

const categorias = ["Todas", "Novedades Normativas", "Casos de Éxito", "Jurisprudencia", "Eventos", "Guías"];

function categoriaStyle(cat: string) {
  switch (cat) {
    case "Novedades Normativas": return "bg-blue-500/10 text-blue-400 border-blue-500/20";
    case "Casos de Éxito": return "bg-green-500/10 text-green-400 border-green-500/20";
    case "Eventos": return "bg-purple-500/10 text-purple-400 border-purple-500/20";
    case "Jurisprudencia": return "bg-amber-500/10 text-amber-400 border-amber-500/20";
    case "Guías": return "bg-cyan-500/10 text-cyan-400 border-cyan-500/20";
    default: return "bg-burgos-gold/10 text-burgos-gold border-burgos-gold/20";
  }
}

export function NewsletterFeed() {
  const [filtro, setFiltro] = useState("Todas");
  const [busqueda, setBusqueda] = useState("");

  const filtered = allPosts.filter((post) => {
    const matchCategoria = filtro === "Todas" || post.categoria === filtro;
    const matchBusqueda =
      busqueda === "" ||
      post.titulo.toLowerCase().includes(busqueda.toLowerCase()) ||
      post.autor.toLowerCase().includes(busqueda.toLowerCase());
    return matchCategoria && matchBusqueda;
  });

  return (
    <section className="py-16 bg-burgos-black min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-10"
        >
          <h1 className="text-3xl sm:text-4xl font-bold text-burgos-white mb-2">
            Newsletter Jurídico
          </h1>
          <p className="text-burgos-gray-400">
            Todas las publicaciones del estudio. Novedades, jurisprudencia, eventos y más.
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-8 space-y-4"
        >
          {/* Search */}
          <div className="relative">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-burgos-gray-600" />
            <input
              type="text"
              placeholder="Buscar por título o autor..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-burgos-dark-2 border border-burgos-gray-800 rounded-xl text-burgos-white placeholder:text-burgos-gray-600 focus:outline-none focus:border-burgos-gold/30 transition-colors text-sm"
            />
          </div>

          {/* Category pills */}
          <div className="flex flex-wrap gap-2">
            {categorias.map((cat) => (
              <button
                key={cat}
                onClick={() => setFiltro(cat)}
                className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all duration-300 border ${
                  filtro === cat
                    ? "bg-burgos-gold/10 text-burgos-gold border-burgos-gold/30"
                    : "bg-burgos-dark-2 text-burgos-gray-400 border-burgos-gray-800 hover:border-burgos-gray-600"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Posts */}
        <div className="space-y-4">
          {filtered.map((post, index) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
            >
              <Link href={`/newsletter/${post.id}`} className="block group">
                <div className="bg-burgos-dark rounded-2xl border border-burgos-gray-800 hover:border-burgos-gold/20 p-6 transition-all duration-300 hover:bg-burgos-dark-2">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <span className={`text-[10px] uppercase tracking-wider font-semibold px-2.5 py-1 rounded-full border ${categoriaStyle(post.categoria)}`}>
                          {post.categoria}
                        </span>
                        <span className="text-burgos-gray-600 text-xs flex items-center gap-1">
                          <Clock size={10} />
                          {post.fecha}
                        </span>
                      </div>
                      <h3 className="text-lg font-semibold text-burgos-white group-hover:text-burgos-gold transition-colors mb-2">
                        {post.titulo}
                      </h3>
                      <p className="text-sm text-burgos-gray-400 line-clamp-2 mb-3">
                        {post.resumen}
                      </p>
                      <span className="text-xs text-burgos-gray-600 flex items-center gap-1">
                        <User size={10} />
                        {post.autor}
                      </span>
                    </div>
                    <ArrowUpRight
                      size={20}
                      className="text-burgos-gray-600 group-hover:text-burgos-gold transition-colors flex-shrink-0 mt-1"
                    />
                  </div>
                </div>
              </Link>
            </motion.article>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <p className="text-burgos-gray-600">No se encontraron publicaciones.</p>
          </div>
        )}
      </div>
    </section>
  );
}
