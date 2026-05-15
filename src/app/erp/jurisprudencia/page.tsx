"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Search, Scale, ExternalLink, BookOpen } from "lucide-react";

interface Fuente {
  nombre: string;
  descripcion: string;
  url: string;
  estado: string;
}

export default function JurisprudenciaPage() {
  const [query, setQuery] = useState("");
  const [resultados, setResultados] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const buscar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);

    try {
      const res = await fetch(`/api/integraciones?servicio=saij&q=${encodeURIComponent(query)}`);
      const data = await res.json();
      setResultados(data);
    } catch {
      setResultados({ error: "Error de conexión" });
    }
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-burgos-white flex items-center gap-2">
          <BookOpen size={24} className="text-burgos-gold" />
          Búsqueda Jurisprudencial
        </h1>
        <p className="text-burgos-gray-400 text-sm mt-1">CSJN · CIJ · SAIJ — Búsqueda orientada por IA</p>
      </motion.div>

      {/* Search */}
      <form onSubmit={buscar} className="flex gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-burgos-gray-600" />
          <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Buscar por tema, artículo, carátula..." className="w-full pl-9 pr-4 py-3 bg-burgos-dark border border-burgos-gray-800 rounded-xl text-sm text-burgos-white placeholder:text-burgos-gray-600 focus:outline-none focus:border-burgos-gold/30" />
        </div>
        <button type="submit" disabled={loading || !query.trim()} className="bg-burgos-gold hover:bg-burgos-gold-light disabled:bg-burgos-gold/30 text-burgos-black px-6 py-3 rounded-xl font-semibold text-sm transition-all">
          {loading ? "Buscando..." : "Buscar"}
        </button>
      </form>

      {/* Results */}
      {resultados && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-burgos-gray-400">
              Fuente: <span className="text-burgos-gold">{resultados.fuente}</span>
            </p>
          </div>

          {/* Resumen orientativo de IA */}
          {resultados.resumen && (
            <div className="bg-gradient-to-br from-burgos-gold/5 to-burgos-dark rounded-xl border border-burgos-gold/20 p-5">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-burgos-gold/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Scale size={16} className="text-burgos-gold" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-burgos-gold mb-2">Orientación jurídica (IA)</h3>
                  <p className="text-sm text-burgos-gray-300 leading-relaxed whitespace-pre-line">{resultados.resumen}</p>
                </div>
              </div>
            </div>
          )}

          {/* Fuentes múltiples */}
          {resultados.fuentes && resultados.fuentes.length > 0 && (
            <div className="bg-burgos-dark rounded-xl border border-burgos-gray-800 p-5">
              <h3 className="text-sm font-semibold text-burgos-white mb-3">Buscar en fuentes oficiales</h3>
              <div className="flex flex-wrap gap-3">
                {resultados.fuentes.map((fuente: Fuente, i: number) => (
                  <a
                    key={i}
                    href={fuente.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm transition-all border ${
                      fuente.estado === "activo"
                        ? "bg-burgos-gold/10 hover:bg-burgos-gold/20 border-burgos-gold/30 text-burgos-gold"
                        : "bg-burgos-gray-800/50 hover:bg-burgos-gray-800 border-burgos-gray-700 text-burgos-gray-400"
                    }`}
                  >
                    <ExternalLink size={16} />
                    {fuente.nombre}
                    {fuente.estado === "inestable" && (
                      <span className="text-[10px] bg-yellow-500/20 text-yellow-400 px-1.5 py-0.5 rounded-full">inestable</span>
                    )}
                  </a>
                ))}
              </div>
              <p className="text-[11px] text-burgos-gray-500 mt-3">
                ⚠️ SAIJ puede estar temporalmente no disponible. CSJN y CIJ funcionan correctamente.
              </p>
            </div>
          )}

          {/* Fallback: link único (compatibilidad) */}
          {!resultados.fuentes && resultados.url && (
            <div className="bg-burgos-dark rounded-xl border border-burgos-gray-800 p-5">
              <a
                href={resultados.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-burgos-gold/10 hover:bg-burgos-gold/20 border border-burgos-gold/30 text-burgos-gold px-5 py-3 rounded-xl font-semibold text-sm transition-all"
              >
                <ExternalLink size={16} />
                Ver resultados
              </a>
            </div>
          )}

          {resultados.mensaje && (
            <div className="bg-burgos-dark rounded-xl border border-burgos-gray-800 p-5">
              <p className="text-sm text-burgos-gray-400">{resultados.mensaje}</p>
            </div>
          )}
        </motion.div>
      )}

      {!resultados && !loading && (
        <div className="text-center py-16">
          <Scale size={48} className="text-burgos-gray-800 mx-auto mb-4" />
          <p className="text-burgos-gray-600 text-sm">Buscá jurisprudencia por tema, artículo o carátula.</p>
          <p className="text-burgos-gray-600 text-xs mt-1">Se consulta CSJN, CIJ y SAIJ con orientación de IA.</p>
        </div>
      )}
    </div>
  );
}
