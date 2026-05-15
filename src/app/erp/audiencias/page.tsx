"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Gavel, Plus, X, Calendar, Clock, MapPin } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface Audiencia {
  id: string;
  tipo: string;
  fecha: string;
  hora: string | null;
  juzgado: string | null;
  notas: string | null;
  estado: string;
  expediente_id: string;
}

const estadoStyles: Record<string, string> = {
  pendiente: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  realizada: "bg-green-500/10 text-green-400 border-green-500/20",
  suspendida: "bg-red-500/10 text-red-400 border-red-500/20",
  reprogramada: "bg-blue-500/10 text-blue-400 border-blue-500/20",
};

const tiposAudiencia = [
  "Preliminar",
  "De vista",
  "Oral",
  "Pericial",
  "Conciliación",
  "Sentencia",
  "Otra",
];

export default function AudienciasPage() {
  const [audiencias, setAudiencias] = useState<Audiencia[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const supabase = createClient();

  const fetchAudiencias = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { data: abogado } = await supabase.from("abogados").select("id, rol").eq("user_id", user.id).single();
    if (!abogado) return;

    let query = supabase.from("audiencias").select("*").order("fecha", { ascending: true });
    if (abogado.rol !== "director") {
      query = query.eq("abogado_id", abogado.id);
    }

    const { data } = await query;
    if (data) setAudiencias(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchAudiencias();
  }, []);

  const updateEstado = async (id: string, estado: string) => {
    await supabase.from("audiencias").update({ estado }).eq("id", id);
    fetchAudiencias();
  };

  const hoy = new Date().toISOString().split("T")[0];
  const proximas = audiencias.filter((a) => a.fecha >= hoy && a.estado === "pendiente");
  const pasadas = audiencias.filter((a) => a.fecha < hoy || a.estado !== "pendiente");

  // Calcular días hasta la audiencia
  const diasHasta = (fecha: string) => {
    const diff = Math.ceil((new Date(fecha).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    if (diff === 0) return "Hoy";
    if (diff === 1) return "Mañana";
    if (diff < 0) return `Hace ${Math.abs(diff)} días`;
    return `En ${diff} días`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl font-bold text-burgos-white flex items-center gap-2">
            <Gavel size={24} className="text-burgos-gold" />
            Audiencias
          </h1>
          <p className="text-burgos-gray-400 text-sm mt-1">
            {proximas.length} audiencias próximas
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 bg-burgos-gold hover:bg-burgos-gold-light text-burgos-black px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300"
        >
          <Plus size={16} />
          Nueva Audiencia
        </button>
      </motion.div>

      {/* Próximas audiencias */}
      {proximas.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <h2 className="text-sm font-semibold text-burgos-white mb-3 flex items-center gap-2">
            <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" />
            Próximas
          </h2>
          <div className="space-y-3">
            {proximas.map((aud) => (
              <div
                key={aud.id}
                className="bg-burgos-dark rounded-xl border border-burgos-gray-800 hover:border-burgos-gold/20 p-5 transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full bg-burgos-gold/10 text-burgos-gold border border-burgos-gold/20">
                        {aud.tipo}
                      </span>
                      <span className={`text-[10px] font-medium ${new Date(aud.fecha).getTime() - new Date().getTime() < 3 * 24 * 60 * 60 * 1000 ? "text-red-400" : "text-burgos-gray-400"}`}>
                        {diasHasta(aud.fecha)}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-burgos-gray-400">
                      <span className="flex items-center gap-1">
                        <Calendar size={12} className="text-burgos-gold" />
                        {aud.fecha}
                      </span>
                      {aud.hora && (
                        <span className="flex items-center gap-1">
                          <Clock size={12} />
                          {aud.hora.slice(0, 5)}
                        </span>
                      )}
                      {aud.juzgado && (
                        <span className="flex items-center gap-1">
                          <MapPin size={12} />
                          {aud.juzgado}
                        </span>
                      )}
                    </div>
                    {aud.notas && (
                      <p className="text-xs text-burgos-gray-600 mt-2">{aud.notas}</p>
                    )}
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => updateEstado(aud.id, "realizada")}
                      className="text-[10px] px-2.5 py-1.5 bg-green-500/10 text-green-400 border border-green-500/20 rounded-lg hover:bg-green-500/20 transition-colors"
                    >
                      Realizada
                    </button>
                    <button
                      onClick={() => updateEstado(aud.id, "suspendida")}
                      className="text-[10px] px-2.5 py-1.5 bg-red-500/10 text-red-400 border border-red-500/20 rounded-lg hover:bg-red-500/20 transition-colors"
                    >
                      Suspendida
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Historial */}
      {pasadas.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <h2 className="text-sm font-semibold text-burgos-gray-400 mb-3">Historial</h2>
          <div className="space-y-2">
            {pasadas.slice(0, 10).map((aud) => (
              <div key={aud.id} className="bg-burgos-dark rounded-xl border border-burgos-gray-800 p-4 flex items-center justify-between opacity-60">
                <div className="flex items-center gap-3">
                  <span className="text-xs text-burgos-gray-400">{aud.fecha}</span>
                  <span className="text-xs text-burgos-white">{aud.tipo}</span>
                  {aud.juzgado && <span className="text-[10px] text-burgos-gray-600">{aud.juzgado}</span>}
                </div>
                <span className={`text-[9px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full border ${estadoStyles[aud.estado]}`}>
                  {aud.estado}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {loading && (
        <div className="text-center py-12">
          <div className="w-8 h-8 border-2 border-burgos-gold/30 border-t-burgos-gold rounded-full animate-spin mx-auto" />
        </div>
      )}

      {!loading && audiencias.length === 0 && (
        <div className="text-center py-16">
          <Gavel size={40} className="text-burgos-gray-800 mx-auto mb-3" />
          <p className="text-burgos-gray-600 text-sm">No hay audiencias cargadas.</p>
        </div>
      )}

      {showModal && (
        <NuevaAudienciaModal onClose={() => setShowModal(false)} onSuccess={() => { setShowModal(false); fetchAudiencias(); }} />
      )}
    </div>
  );
}

function NuevaAudienciaModal({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {
  const [form, setForm] = useState({ tipo: "Preliminar", fecha: "", hora: "", juzgado: "", notas: "" });
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { data: abogado } = await supabase.from("abogados").select("id").eq("user_id", user.id).single();
    if (!abogado) return;

    // Por ahora sin expediente vinculado (se puede agregar después)
    // Necesitamos un expediente para la FK, así que creamos uno genérico si no hay
    let expedienteId: string;
    const { data: exp } = await supabase.from("expedientes").select("id").limit(1).single();
    if (exp) {
      expedienteId = exp.id;
    } else {
      const { data: newExp } = await supabase.from("expedientes").insert({ caratula: "General", abogado_id: abogado.id }).select("id").single();
      expedienteId = newExp!.id;
    }

    await supabase.from("audiencias").insert({
      expediente_id: expedienteId,
      abogado_id: abogado.id,
      tipo: form.tipo,
      fecha: form.fecha,
      hora: form.hora || null,
      juzgado: form.juzgado || null,
      notas: form.notas || null,
    });

    setLoading(false);
    onSuccess();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="relative bg-burgos-dark rounded-2xl border border-burgos-gray-800 p-6 sm:p-8 w-full max-w-md">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-burgos-white">Nueva Audiencia</h2>
          <button onClick={onClose} className="text-burgos-gray-600 hover:text-burgos-white"><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-[10px] uppercase tracking-wider text-burgos-gray-600 font-medium mb-1.5 block">Tipo</label>
            <select value={form.tipo} onChange={(e) => setForm({ ...form, tipo: e.target.value })} className="w-full px-4 py-2.5 bg-burgos-black/50 border border-burgos-gray-800 rounded-xl text-burgos-white focus:outline-none focus:border-burgos-gold/40 text-sm appearance-none">
              {tiposAudiencia.map((t) => <option key={t} value={t} className="bg-burgos-dark">{t}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] uppercase tracking-wider text-burgos-gray-600 font-medium mb-1.5 block">Fecha</label>
              <input type="date" required value={form.fecha} onChange={(e) => setForm({ ...form, fecha: e.target.value })} className="w-full px-3 py-2.5 bg-burgos-black/50 border border-burgos-gray-800 rounded-xl text-burgos-white focus:outline-none focus:border-burgos-gold/40 text-sm" />
            </div>
            <div>
              <label className="text-[10px] uppercase tracking-wider text-burgos-gray-600 font-medium mb-1.5 block">Hora</label>
              <input type="time" value={form.hora} onChange={(e) => setForm({ ...form, hora: e.target.value })} className="w-full px-3 py-2.5 bg-burgos-black/50 border border-burgos-gray-800 rounded-xl text-burgos-white focus:outline-none focus:border-burgos-gold/40 text-sm" />
            </div>
          </div>
          <div>
            <label className="text-[10px] uppercase tracking-wider text-burgos-gray-600 font-medium mb-1.5 block">Juzgado</label>
            <input type="text" value={form.juzgado} onChange={(e) => setForm({ ...form, juzgado: e.target.value })} placeholder="Juzgado Civil N° 45" className="w-full px-4 py-2.5 bg-burgos-black/50 border border-burgos-gray-800 rounded-xl text-burgos-white placeholder:text-burgos-gray-600 focus:outline-none focus:border-burgos-gold/40 text-sm" />
          </div>
          <div>
            <label className="text-[10px] uppercase tracking-wider text-burgos-gray-600 font-medium mb-1.5 block">Notas</label>
            <textarea value={form.notas} onChange={(e) => setForm({ ...form, notas: e.target.value })} rows={2} placeholder="Notas..." className="w-full px-4 py-2.5 bg-burgos-black/50 border border-burgos-gray-800 rounded-xl text-burgos-white placeholder:text-burgos-gray-600 focus:outline-none focus:border-burgos-gold/40 text-sm resize-none" />
          </div>
          <button type="submit" disabled={loading} className="w-full bg-burgos-gold hover:bg-burgos-gold-light disabled:bg-burgos-gold/30 text-burgos-black py-3 rounded-xl font-semibold transition-all duration-300">
            {loading ? "Creando..." : "Crear Audiencia"}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
