"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Search, Scale, ExternalLink, BookOpen } from "lucide-react";

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
        <p className="text-burgos-gray-400 text-sm mt-1">SAIJ · Infojus · Fallos CSJN</p>
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
              {resultados.total && ` · ${resultados.total} resultados`}
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

          {/* Link a SAIJ prominente */}
          {resultados.url && (
            <div className="bg-burgos-dark rounded-xl border border-burgos-gray-800 p-5">
              <a
                href={resultados.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-burgos-gold/10 hover:bg-burgos-gold/20 border border-burgos-gold/30 text-burgos-gold px-5 py-3 rounded-xl font-semibold text-sm transition-all"
              >
                <ExternalLink size={16} />
                Ver resultados en SAIJ
              </a>
              <p className="text-[11px] text-burgos-gray-500 mt-3">
                ⚠️ SAIJ puede estar temporalmente no disponible. Si el enlace no funciona, buscá directamente en{" "}
                <a href="http://www.saij.gob.ar" target="_blank" rel="noopener noreferrer" className="text-burgos-gold hover:underline">
                  saij.gob.ar
                </a>
              </p>
            </div>
          )}

          {resultados.mensaje && (
            <div className="bg-burgos-dark rounded-xl border border-burgos-gray-800 p-5">
              <p className="text-sm text-burgos-gray-400">{resultados.mensaje}</p>
              {resultados.url && (
                <a href={resultados.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-sm text-burgos-gold mt-2 hover:text-burgos-gold-light">
                  Buscar directamente <ExternalLink size={14} />
                </a>
              )}
            </div>
          )}

          {resultados.resultados && resultados.resultados.length > 0 && (
            <div className="space-y-3">
              {resultados.resultados.map((r: any, i: number) => (
                <div key={i} className="bg-burgos-dark rounded-xl border border-burgos-gray-800 hover:border-burgos-gold/20 p-5 transition-colors">
                  <h3 className="text-sm font-semibold text-burgos-white mb-1">{r.titulo || r.title || `Resultado ${i + 1}`}</h3>
                  {r.resumen && <p className="text-xs text-burgos-gray-400 line-clamp-3">{r.resumen}</p>}
                  {r.fecha && <p className="text-[10px] text-burgos-gray-600 mt-2">{r.fecha}</p>}
                </div>
              ))}
            </div>
          )}
        </motion.div>
      )}

      {!resultados && !loading && (
        <div className="text-center py-16">
          <Scale size={48} className="text-burgos-gray-800 mx-auto mb-4" />
          <p className="text-burgos-gray-600 text-sm">Buscá jurisprudencia por tema, artículo o carátula.</p>
          <p className="text-burgos-gray-600 text-xs mt-1">Se consulta SAIJ (Sistema Argentino de Información Jurídica).</p>
        </div>
      )}
    </div>
  );
}
