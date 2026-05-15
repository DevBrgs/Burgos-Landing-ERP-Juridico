"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import {
  CheckSquare,
  Plus,
  X,
  AlertTriangle,
  Clock,
  Filter,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface Tarea {
  id: string;
  titulo: string;
  descripcion: string | null;
  prioridad: string;
  estado: string;
  vence_en: string | null;
  expediente_id: string | null;
  creado_en: string;
}

const prioridadStyles: Record<string, string> = {
  urgente: "bg-red-500/10 text-red-400 border-red-500/20",
  normal: "bg-burgos-gold/10 text-burgos-gold border-burgos-gold/20",
  baja: "bg-burgos-gray-600/10 text-burgos-gray-400 border-burgos-gray-600/20",
};

const estadoStyles: Record<string, string> = {
  pendiente: "bg-amber-500/10 text-amber-400",
  en_curso: "bg-blue-500/10 text-blue-400",
  completada: "bg-green-500/10 text-green-400",
};

export default function TareasPage() {
  const [tareas, setTareas] = useState<Tarea[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [filtroEstado, setFiltroEstado] = useState("todas");
  const supabase = createClient();

  const fetchTareas = async () => {
    const { data } = await supabase
      .from("tareas")
      .select("*")
      .order("vence_en", { ascending: true, nullsFirst: false })
      .order("creado_en", { ascending: false });
    if (data) setTareas(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchTareas();
  }, []);

  const updateEstado = async (id: string, estado: string) => {
    const updates: Record<string, unknown> = { estado };
    if (estado === "completada") updates.completada_en = new Date().toISOString();
    await supabase.from("tareas").update(updates).eq("id", id);
    fetchTareas();
  };

  const filtered = tareas.filter(
    (t) => filtroEstado === "todas" || t.estado === filtroEstado
  );

  const pendientes = filtered.filter((t) => t.estado === "pendiente");
  const enCurso = filtered.filter((t) => t.estado === "en_curso");
  const completadas = filtered.filter((t) => t.estado === "completada");

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
            <CheckSquare size={24} className="text-burgos-gold" />
            Tareas
          </h1>
          <p className="text-burgos-gray-400 text-sm mt-1">
            {tareas.filter((t) => t.estado !== "completada").length} pendientes
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 bg-burgos-gold hover:bg-burgos-gold-light text-burgos-black px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300"
        >
          <Plus size={16} />
          Nueva Tarea
        </button>
      </motion.div>

      {/* Filters */}
      <div className="flex gap-2">
        {["todas", "pendiente", "en_curso", "completada"].map((estado) => (
          <button
            key={estado}
            onClick={() => setFiltroEstado(estado)}
            className={`px-4 py-2 rounded-xl text-xs font-medium transition-all border ${
              filtroEstado === estado
                ? "bg-burgos-gold/10 text-burgos-gold border-burgos-gold/30"
                : "bg-burgos-dark text-burgos-gray-400 border-burgos-gray-800 hover:border-burgos-gray-600"
            }`}
          >
            {estado === "todas" ? "Todas" : estado === "en_curso" ? "En curso" : estado.charAt(0).toUpperCase() + estado.slice(1)}
          </button>
        ))}
      </div>

      {/* Kanban-style columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pendientes */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-2 h-2 bg-amber-400 rounded-full" />
            <h3 className="text-xs font-semibold text-burgos-gray-400 uppercase tracking-wider">
              Pendientes ({pendientes.length})
            </h3>
          </div>
          <div className="space-y-2">
            {pendientes.map((tarea) => (
              <TareaCard key={tarea.id} tarea={tarea} onUpdate={updateEstado} />
            ))}
          </div>
        </motion.div>

        {/* En curso */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-2 h-2 bg-blue-400 rounded-full" />
            <h3 className="text-xs font-semibold text-burgos-gray-400 uppercase tracking-wider">
              En curso ({enCurso.length})
            </h3>
          </div>
          <div className="space-y-2">
            {enCurso.map((tarea) => (
              <TareaCard key={tarea.id} tarea={tarea} onUpdate={updateEstado} />
            ))}
          </div>
        </motion.div>

        {/* Completadas */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-2 h-2 bg-green-400 rounded-full" />
            <h3 className="text-xs font-semibold text-burgos-gray-400 uppercase tracking-wider">
              Completadas ({completadas.length})
            </h3>
          </div>
          <div className="space-y-2">
            {completadas.slice(0, 5).map((tarea) => (
              <TareaCard key={tarea.id} tarea={tarea} onUpdate={updateEstado} />
            ))}
          </div>
        </motion.div>
      </div>

      {loading && (
        <div className="text-center py-12">
          <div className="w-8 h-8 border-2 border-burgos-gold/30 border-t-burgos-gold rounded-full animate-spin mx-auto" />
        </div>
      )}

      {!loading && tareas.length === 0 && (
        <div className="text-center py-16">
          <CheckSquare size={40} className="text-burgos-gray-800 mx-auto mb-3" />
          <p className="text-burgos-gray-600 text-sm">No hay tareas. Creá la primera.</p>
        </div>
      )}

      {showModal && (
        <NuevaTareaModal
          onClose={() => setShowModal(false)}
          onSuccess={() => { setShowModal(false); fetchTareas(); }}
        />
      )}
    </div>
  );
}

function TareaCard({ tarea, onUpdate }: { tarea: Tarea; onUpdate: (id: string, estado: string) => void }) {
  const isVencida = tarea.vence_en && new Date(tarea.vence_en) < new Date() && tarea.estado !== "completada";

  return (
    <div className={`bg-burgos-dark rounded-xl border p-4 transition-colors ${isVencida ? "border-red-500/30" : "border-burgos-gray-800 hover:border-burgos-gold/20"}`}>
      <div className="flex items-start justify-between gap-2 mb-2">
        <h4 className="text-sm text-burgos-white font-medium flex-1">{tarea.titulo}</h4>
        <span className={`text-[9px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full border ${prioridadStyles[tarea.prioridad]}`}>
          {tarea.prioridad}
        </span>
      </div>
      {tarea.descripcion && (
        <p className="text-xs text-burgos-gray-400 mb-2 line-clamp-2">{tarea.descripcion}</p>
      )}
      <div className="flex items-center justify-between">
        {tarea.vence_en && (
          <span className={`text-[10px] flex items-center gap-1 ${isVencida ? "text-red-400" : "text-burgos-gray-600"}`}>
            {isVencida && <AlertTriangle size={10} />}
            <Clock size={10} />
            {tarea.vence_en}
          </span>
        )}
        <div className="flex gap-1 ml-auto">
          {tarea.estado === "pendiente" && (
            <button onClick={() => onUpdate(tarea.id, "en_curso")} className="text-[10px] px-2 py-1 bg-blue-500/10 text-blue-400 rounded-md hover:bg-blue-500/20 transition-colors">
              Iniciar
            </button>
          )}
          {tarea.estado === "en_curso" && (
            <button onClick={() => onUpdate(tarea.id, "completada")} className="text-[10px] px-2 py-1 bg-green-500/10 text-green-400 rounded-md hover:bg-green-500/20 transition-colors">
              Completar
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function NuevaTareaModal({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {
  const [form, setForm] = useState({ titulo: "", descripcion: "", prioridad: "normal", vence_en: "", asignado_a: "" });
  const [loading, setLoading] = useState(false);
  const [abogados, setAbogados] = useState<{ id: string; nombre: string }[]>([]);
  const supabase = createClient();

  useEffect(() => {
    const fetchAbogados = async () => {
      const { data } = await supabase.from("abogados").select("id, nombre").eq("activo", true);
      if (data) setAbogados(data);
    };
    fetchAbogados();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: abogado } = await supabase.from("abogados").select("id").eq("user_id", user.id).single();
    if (!abogado) return;

    await supabase.from("tareas").insert({
      asignado_a: form.asignado_a || abogado.id,
      creado_por: abogado.id,
      titulo: form.titulo,
      descripcion: form.descripcion || null,
      prioridad: form.prioridad,
      vence_en: form.vence_en || null,
    });

    setLoading(false);
    onSuccess();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="relative bg-burgos-dark rounded-2xl border border-burgos-gray-800 p-6 sm:p-8 w-full max-w-md">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-burgos-white">Nueva Tarea</h2>
          <button onClick={onClose} className="text-burgos-gray-600 hover:text-burgos-white"><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-[10px] uppercase tracking-wider text-burgos-gray-600 font-medium mb-1.5 block">Título</label>
            <input type="text" required value={form.titulo} onChange={(e) => setForm({ ...form, titulo: e.target.value })} placeholder="Contestar demanda..." className="w-full px-4 py-2.5 bg-burgos-black/50 border border-burgos-gray-800 rounded-xl text-burgos-white placeholder:text-burgos-gray-600 focus:outline-none focus:border-burgos-gold/40 text-sm" />
          </div>
          <div>
            <label className="text-[10px] uppercase tracking-wider text-burgos-gray-600 font-medium mb-1.5 block">Descripción</label>
            <textarea value={form.descripcion} onChange={(e) => setForm({ ...form, descripcion: e.target.value })} rows={2} placeholder="Detalles..." className="w-full px-4 py-2.5 bg-burgos-black/50 border border-burgos-gray-800 rounded-xl text-burgos-white placeholder:text-burgos-gray-600 focus:outline-none focus:border-burgos-gold/40 text-sm resize-none" />
          </div>
          <div>
            <label className="text-[10px] uppercase tracking-wider text-burgos-gray-600 font-medium mb-1.5 block">Asignar a</label>
            <select value={form.asignado_a} onChange={(e) => setForm({ ...form, asignado_a: e.target.value })} className="w-full px-4 py-2.5 bg-burgos-black/50 border border-burgos-gray-800 rounded-xl text-burgos-white focus:outline-none focus:border-burgos-gold/40 text-sm appearance-none">
              <option value="" className="bg-burgos-dark">Yo mismo</option>
              {abogados.map((a) => <option key={a.id} value={a.id} className="bg-burgos-dark">{a.nombre}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] uppercase tracking-wider text-burgos-gray-600 font-medium mb-1.5 block">Prioridad</label>
              <select value={form.prioridad} onChange={(e) => setForm({ ...form, prioridad: e.target.value })} className="w-full px-3 py-2.5 bg-burgos-black/50 border border-burgos-gray-800 rounded-xl text-burgos-white focus:outline-none focus:border-burgos-gold/40 text-sm appearance-none">
                <option value="baja" className="bg-burgos-dark">Baja</option>
                <option value="normal" className="bg-burgos-dark">Normal</option>
                <option value="urgente" className="bg-burgos-dark">Urgente</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] uppercase tracking-wider text-burgos-gray-600 font-medium mb-1.5 block">Vence</label>
              <input type="date" value={form.vence_en} onChange={(e) => setForm({ ...form, vence_en: e.target.value })} className="w-full px-3 py-2.5 bg-burgos-black/50 border border-burgos-gray-800 rounded-xl text-burgos-white focus:outline-none focus:border-burgos-gold/40 text-sm" />
            </div>
          </div>
          <button type="submit" disabled={loading} className="w-full bg-burgos-gold hover:bg-burgos-gold-light disabled:bg-burgos-gold/30 text-burgos-black py-3 rounded-xl font-semibold transition-all duration-300">
            {loading ? "Creando..." : "Crear Tarea"}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
