"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Building2, Plus, X, Globe, Check, Settings } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface Estudio {
  id: string;
  nombre: string;
  slug: string;
  logo_url: string | null;
  dominio: string | null;
  activo: boolean;
  creado_en: string;
}

export default function EstudiosPage() {
  const [estudios, setEstudios] = useState<Estudio[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [esDirector, setEsDirector] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data: abogado } = await supabase.from("abogados").select("rol").eq("user_id", user.id).single();
      if (abogado?.rol === "director") setEsDirector(true);

      const { data } = await supabase.from("estudios").select("*").order("creado_en", { ascending: true });
      if (data) setEstudios(data);
      setLoading(false);
    };
    init();
  }, []);

  const toggleActivo = async (id: string, activo: boolean) => {
    await supabase.from("estudios").update({ activo: !activo }).eq("id", id);
    const { data } = await supabase.from("estudios").select("*").order("creado_en", { ascending: true });
    if (data) setEstudios(data);
  };

  if (!esDirector) {
    return (
      <div className="text-center py-16">
        <Building2 size={40} className="text-burgos-gray-800 mx-auto mb-3" />
        <p className="text-burgos-gray-600 text-sm">Solo el director puede gestionar estudios.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-burgos-white flex items-center gap-2">
            <Building2 size={24} className="text-burgos-gold" />
            Estudios
          </h1>
          <p className="text-burgos-gray-400 text-sm mt-1">Gestión multi-estudio · {estudios.length} registrados</p>
        </div>
        <button onClick={() => setShowModal(true)} className="inline-flex items-center gap-2 bg-burgos-gold hover:bg-burgos-gold-light text-burgos-black px-5 py-2.5 rounded-xl font-semibold text-sm transition-all">
          <Plus size={16} /> Nuevo Estudio
        </button>
      </motion.div>

      {loading ? (
        <div className="text-center py-12"><div className="w-8 h-8 border-2 border-burgos-gold/30 border-t-burgos-gold rounded-full animate-spin mx-auto" /></div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {estudios.map((estudio) => (
            <motion.div key={estudio.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className={`bg-burgos-dark rounded-2xl border p-6 transition-all ${estudio.activo ? "border-burgos-gray-800 hover:border-burgos-gold/20" : "border-red-500/20 opacity-60"}`}>
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-burgos-gold/5 border border-burgos-gold/10 rounded-xl flex items-center justify-center">
                  <Building2 size={20} className="text-burgos-gold" />
                </div>
                <span className={`text-[9px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full ${estudio.activo ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"}`}>
                  {estudio.activo ? "Activo" : "Inactivo"}
                </span>
              </div>
              <h3 className="text-sm font-semibold text-burgos-white mb-1">{estudio.nombre}</h3>
              <p className="text-[10px] text-burgos-gray-600 mb-1">Slug: {estudio.slug}</p>
              {estudio.dominio && <p className="text-[10px] text-burgos-gray-400 flex items-center gap-1"><Globe size={9} /> {estudio.dominio}</p>}
              <p className="text-[10px] text-burgos-gray-600 mt-2">Creado: {new Date(estudio.creado_en).toLocaleDateString()}</p>
              <button onClick={() => toggleActivo(estudio.id, estudio.activo)} className={`mt-4 w-full text-xs py-2 rounded-lg font-medium transition-all border ${estudio.activo ? "bg-red-500/5 border-red-500/20 text-red-400" : "bg-green-500/5 border-green-500/20 text-green-400"}`}>
                {estudio.activo ? "Desactivar" : "Reactivar"}
              </button>
            </motion.div>
          ))}
        </div>
      )}

      {showModal && <NuevoEstudioModal onClose={() => setShowModal(false)} onSuccess={() => { setShowModal(false); window.location.reload(); }} />}
    </div>
  );
}

function NuevoEstudioModal({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {
  const [form, setForm] = useState({ nombre: "", slug: "", dominio: "" });
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await supabase.from("estudios").insert({
      nombre: form.nombre,
      slug: form.slug.toLowerCase().replace(/[^a-z0-9-]/g, ""),
      dominio: form.dominio || null,
    });
    setLoading(false);
    onSuccess();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="relative bg-burgos-dark rounded-2xl border border-burgos-gray-800 p-6 sm:p-8 w-full max-w-md">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-burgos-white">Nuevo Estudio</h2>
          <button onClick={onClose} className="text-burgos-gray-600 hover:text-burgos-white"><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-[10px] uppercase tracking-wider text-burgos-gray-600 font-medium mb-1.5 block">Nombre del estudio</label>
            <input type="text" required value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} placeholder="Pérez & Asociados" className="w-full px-4 py-2.5 bg-burgos-black/50 border border-burgos-gray-800 rounded-xl text-burgos-white placeholder:text-burgos-gray-600 focus:outline-none focus:border-burgos-gold/40 text-sm" />
          </div>
          <div>
            <label className="text-[10px] uppercase tracking-wider text-burgos-gray-600 font-medium mb-1.5 block">Slug (identificador único)</label>
            <input type="text" required value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder="perez-asociados" className="w-full px-4 py-2.5 bg-burgos-black/50 border border-burgos-gray-800 rounded-xl text-burgos-white placeholder:text-burgos-gray-600 focus:outline-none focus:border-burgos-gold/40 text-sm" />
          </div>
          <div>
            <label className="text-[10px] uppercase tracking-wider text-burgos-gray-600 font-medium mb-1.5 block">Dominio (opcional)</label>
            <input type="text" value={form.dominio} onChange={(e) => setForm({ ...form, dominio: e.target.value })} placeholder="perez.com.ar" className="w-full px-4 py-2.5 bg-burgos-black/50 border border-burgos-gray-800 rounded-xl text-burgos-white placeholder:text-burgos-gray-600 focus:outline-none focus:border-burgos-gold/40 text-sm" />
          </div>
          <button type="submit" disabled={loading} className="w-full bg-burgos-gold hover:bg-burgos-gold-light disabled:bg-burgos-gold/30 text-burgos-black py-3 rounded-xl font-semibold transition-all">
            {loading ? "Creando..." : "Crear Estudio"}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
