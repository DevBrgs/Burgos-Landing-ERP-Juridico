"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { CheckSquare, Plus, X, AlertTriangle, Clock, MessageSquare, Paperclip, Users, Tag, Send, Link2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { FileUpload } from "@/components/ui/FileUpload";

interface Tarea {
  id: string;
  titulo: string;
  descripcion: string | null;
  prioridad: string;
  estado: string;
  vence_en: string | null;
  expediente_id: string | null;
  etiquetas: string[];
  subtareas: { texto: string; completada: boolean }[];
  adjunto_url: string | null;
  adjunto_nombre: string | null;
  creado_en: string;
}

interface Comentario {
  id: string;
  contenido: string;
  creado_en: string;
  abogado_id: string;
  autor_nombre?: string;
}

const prioridadStyles: Record<string, string> = {
  urgente: "bg-red-500/10 text-red-400 border-red-500/20",
  normal: "bg-burgos-gold/10 text-burgos-gold border-burgos-gold/20",
  baja: "bg-burgos-gray-600/10 text-burgos-gray-400 border-burgos-gray-600/20",
};

export default function TareasPage() {
  const [tareas, setTareas] = useState<Tarea[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [filtroEstado, setFiltroEstado] = useState("todas");
  const [selectedTarea, setSelectedTarea] = useState<Tarea | null>(null);
  const supabase = createClient();

  const fetchTareas = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setLoading(false); return; }
    const { data: abogado } = await supabase.from("abogados").select("id, rol").eq("user_id", user.id).single();
    if (!abogado) { setLoading(false); return; }

    const { data } = await supabase.from("tareas").select("*").order("vence_en", { ascending: true, nullsFirst: false }).order("creado_en", { ascending: false });
    if (data) setTareas(data);
    setLoading(false);
  };

  useEffect(() => { fetchTareas(); }, []);

  const updateEstado = async (id: string, estado: string) => {
    const updates: Record<string, unknown> = { estado };
    if (estado === "completada") updates.completada_en = new Date().toISOString();
    await supabase.from("tareas").update(updates).eq("id", id);
    fetchTareas();
  };

  const toggleSubtarea = async (tareaId: string, index: number) => {
    const tarea = tareas.find(t => t.id === tareaId);
    if (!tarea) return;
    const subtareas = [...(tarea.subtareas || [])];
    subtareas[index] = { ...subtareas[index], completada: !subtareas[index].completada };
    await supabase.from("tareas").update({ subtareas }).eq("id", tareaId);
    fetchTareas();
  };

  const filtered = tareas.filter(t => filtroEstado === "todas" || t.estado === filtroEstado);
  const pendientes = filtered.filter(t => t.estado === "pendiente");
  const enCurso = filtered.filter(t => t.estado === "en_curso");
  const completadas = filtered.filter(t => t.estado === "completada");

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-burgos-white flex items-center gap-2">
            <CheckSquare size={24} className="text-burgos-gold" />
            Tareas
          </h1>
          <p className="text-burgos-gray-400 text-sm mt-1">{tareas.filter(t => t.estado !== "completada").length} pendientes</p>
        </div>
        <button onClick={() => setShowModal(true)} className="inline-flex items-center gap-2 bg-burgos-gold hover:bg-burgos-gold-light text-burgos-black px-5 py-2.5 rounded-xl font-semibold text-sm transition-all">
          <Plus size={16} /> Nueva Tarea
        </button>
      </motion.div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        {["todas", "pendiente", "en_curso", "completada"].map((estado) => (
          <button key={estado} onClick={() => setFiltroEstado(estado)} className={`px-4 py-2 rounded-xl text-xs font-medium transition-all border ${filtroEstado === estado ? "bg-burgos-gold/10 text-burgos-gold border-burgos-gold/30" : "bg-burgos-dark text-burgos-gray-400 border-burgos-gray-800"}`}>
            {estado === "todas" ? "Todas" : estado === "en_curso" ? "En curso" : estado.charAt(0).toUpperCase() + estado.slice(1)}
          </button>
        ))}
      </div>

      {/* Kanban */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <KanbanColumn title="Pendientes" count={pendientes.length} color="amber" tareas={pendientes} onUpdate={updateEstado} onSelect={setSelectedTarea} onToggleSub={toggleSubtarea} />
        <KanbanColumn title="En curso" count={enCurso.length} color="blue" tareas={enCurso} onUpdate={updateEstado} onSelect={setSelectedTarea} onToggleSub={toggleSubtarea} />
        <KanbanColumn title="Completadas" count={completadas.length} color="green" tareas={completadas.slice(0, 8)} onUpdate={updateEstado} onSelect={setSelectedTarea} onToggleSub={toggleSubtarea} />
      </div>

      {loading && <div className="text-center py-12"><div className="w-8 h-8 border-2 border-burgos-gold/30 border-t-burgos-gold rounded-full animate-spin mx-auto" /></div>}

      {showModal && <NuevaTareaModal onClose={() => setShowModal(false)} onSuccess={() => { setShowModal(false); fetchTareas(); }} />}
    </div>
  );
}

function KanbanColumn({ title, count, color, tareas, onUpdate, onSelect, onToggleSub }: any) {
  const [expandedComments, setExpandedComments] = useState<string | null>(null);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <div className="flex items-center gap-2 mb-3">
        <div className={`w-2 h-2 bg-${color}-400 rounded-full`} />
        <h3 className="text-xs font-semibold text-burgos-gray-400 uppercase tracking-wider">{title} ({count})</h3>
      </div>
      <div className="space-y-2">
        {tareas.map((tarea: Tarea) => {
          const isVencida = tarea.vence_en && new Date(tarea.vence_en) < new Date() && tarea.estado !== "completada";
          const subtareasTotal = tarea.subtareas?.length || 0;
          const subtareasCompletadas = tarea.subtareas?.filter((s: any) => s.completada).length || 0;
          const showComments = expandedComments === tarea.id;

          return (
            <div key={tarea.id} className={`bg-burgos-dark rounded-xl border p-4 transition-colors ${isVencida ? "border-red-500/30" : "border-burgos-gray-800 hover:border-burgos-gold/20"}`}>
              <div className="cursor-pointer" onClick={() => onSelect(tarea)}>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h4 className="text-sm text-burgos-white font-medium flex-1">{tarea.titulo}</h4>
                  <span className={`text-[9px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full border ${prioridadStyles[tarea.prioridad]}`}>{tarea.prioridad}</span>
                </div>
                {tarea.descripcion && <p className="text-xs text-burgos-gray-400 mb-2 line-clamp-2">{tarea.descripcion}</p>}

                {/* Subtareas progress */}
                {subtareasTotal > 0 && (
                  <div className="mb-2">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="flex-1 h-1 bg-gray-300 dark:bg-burgos-gray-800 rounded-full overflow-hidden">
                        <div className="h-full bg-burgos-gold rounded-full transition-all" style={{ width: `${(subtareasCompletadas / subtareasTotal) * 100}%` }} />
                      </div>
                      <span className="text-[9px] text-burgos-gray-600">{subtareasCompletadas}/{subtareasTotal}</span>
                    </div>
                  </div>
                )}

                {/* Tags */}
                {tarea.etiquetas && tarea.etiquetas.length > 0 && (
                  <div className="flex gap-1 mb-2 flex-wrap">
                    {tarea.etiquetas.map((tag: string) => (
                      <span key={tag} className="text-[8px] px-1.5 py-0.5 bg-burgos-dark-2 border border-burgos-gray-800 rounded text-burgos-gray-400">{tag}</span>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {tarea.vence_en && (
                    <span className={`text-[10px] flex items-center gap-1 ${isVencida ? "text-red-400" : "text-burgos-gray-600"}`}>
                      {isVencida && <AlertTriangle size={10} />}
                      <Clock size={10} /> {tarea.vence_en}
                    </span>
                  )}
                  {/* Attachment indicator */}
                  {tarea.adjunto_url && (
                    <a href={tarea.adjunto_url} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="text-[10px] flex items-center gap-0.5 text-burgos-gold hover:text-burgos-gold-light" title={tarea.adjunto_nombre || "Adjunto"}>
                      <Paperclip size={10} />
                    </a>
                  )}
                  {/* Expediente link indicator */}
                  {tarea.expediente_id && (
                    <Link href={`/erp/expedientes/${tarea.expediente_id}`} onClick={(e) => e.stopPropagation()} className="text-[10px] flex items-center gap-0.5 text-blue-400 hover:text-blue-300 transition-colors" title="Ver expediente vinculado">
                      <Link2 size={10} />
                    </Link>
                  )}
                  {/* Comments toggle */}
                  <button onClick={(e) => { e.stopPropagation(); setExpandedComments(showComments ? null : tarea.id); }} className="text-[10px] flex items-center gap-0.5 text-burgos-gray-600 hover:text-burgos-gold transition-colors">
                    <MessageSquare size={10} />
                  </button>
                </div>
                <div className="flex gap-1 ml-auto">
                  {tarea.estado === "pendiente" && (
                    <button onClick={(e) => { e.stopPropagation(); onUpdate(tarea.id, "en_curso"); }} className="text-[10px] px-2 py-1 bg-blue-500/10 text-blue-400 rounded-md hover:bg-blue-500/20">Iniciar</button>
                  )}
                  {tarea.estado === "en_curso" && (
                    <button onClick={(e) => { e.stopPropagation(); onUpdate(tarea.id, "completada"); }} className="text-[10px] px-2 py-1 bg-green-500/10 text-green-400 rounded-md hover:bg-green-500/20">Completar</button>
                  )}
                </div>
              </div>

              {/* Expandable comments section */}
              <AnimatePresence>
                {showComments && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <ComentariosTarea tareaId={tarea.id} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}

function ComentariosTarea({ tareaId }: { tareaId: string }) {
  const [comentarios, setComentarios] = useState<Comentario[]>([]);
  const [nuevoComentario, setNuevoComentario] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const supabase = createClient();

  const fetchComentarios = async () => {
    const { data } = await supabase
      .from("comentarios")
      .select("id, contenido, creado_en, abogado_id")
      .eq("entidad", "tarea")
      .eq("entidad_id", tareaId)
      .order("creado_en", { ascending: true });

    if (data) {
      // Fetch author names
      const autorIds = [...new Set(data.map(c => c.abogado_id))];
      const { data: abogados } = await supabase.from("abogados").select("id, nombre").in("id", autorIds);
      const nombresMap = new Map(abogados?.map(a => [a.id, a.nombre]) || []);

      setComentarios(data.map(c => ({ ...c, autor_nombre: nombresMap.get(c.abogado_id) || "Usuario" })));
    }
    setLoading(false);
  };

  useEffect(() => { fetchComentarios(); }, [tareaId]);

  const enviarComentario = async () => {
    if (!nuevoComentario.trim()) return;
    setSending(true);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setSending(false); return; }
    const { data: abogado } = await supabase.from("abogados").select("id").eq("user_id", user.id).single();
    if (!abogado) { setSending(false); return; }

    await supabase.from("comentarios").insert({
      entidad: "tarea",
      entidad_id: tareaId,
      contenido: nuevoComentario.trim(),
      abogado_id: abogado.id,
    });

    setNuevoComentario("");
    setSending(false);
    fetchComentarios();
  };

  return (
    <div className="mt-3 pt-3 border-t border-burgos-gray-800">
      {loading ? (
        <div className="flex justify-center py-2">
          <div className="w-4 h-4 border border-burgos-gold/30 border-t-burgos-gold rounded-full animate-spin" />
        </div>
      ) : (
        <>
          {comentarios.length > 0 && (
            <div className="space-y-2 mb-2 max-h-32 overflow-y-auto">
              {comentarios.map((c) => (
                <div key={c.id} className="text-[10px]">
                  <span className="text-burgos-gold font-medium">{c.autor_nombre}</span>
                  <span className="text-burgos-gray-600 ml-1.5">{new Date(c.creado_en).toLocaleDateString("es-AR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" })}</span>
                  <p className="text-burgos-gray-400 mt-0.5">{c.contenido}</p>
                </div>
              ))}
            </div>
          )}
          {comentarios.length === 0 && (
            <p className="text-[10px] text-burgos-gray-600 mb-2">Sin comentarios aún</p>
          )}
          <div className="flex gap-1.5">
            <input
              type="text"
              value={nuevoComentario}
              onChange={(e) => setNuevoComentario(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") enviarComentario(); }}
              placeholder="Escribir comentario..."
              className="flex-1 px-2.5 py-1.5 bg-burgos-black/50 border border-burgos-gray-800 rounded-lg text-[10px] text-burgos-white placeholder:text-burgos-gray-600 focus:outline-none focus:border-burgos-gold/40"
            />
            <button
              onClick={enviarComentario}
              disabled={sending || !nuevoComentario.trim()}
              className="px-2 py-1.5 bg-burgos-gold/10 text-burgos-gold border border-burgos-gold/20 rounded-lg hover:bg-burgos-gold/20 disabled:opacity-40 transition-colors"
            >
              <Send size={10} />
            </button>
          </div>
        </>
      )}
    </div>
  );
}

function NuevaTareaModal({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {
  const [form, setForm] = useState({ titulo: "", descripcion: "", prioridad: "normal", vence_en: "", asignado_a: "", expediente_id: "", etiquetas: "", subtareas: "" });
  const [adjuntoUrl, setAdjuntoUrl] = useState("");
  const [adjuntoNombre, setAdjuntoNombre] = useState("");
  const [loading, setLoading] = useState(false);
  const [abogados, setAbogados] = useState<{ id: string; nombre: string }[]>([]);
  const [expedientes, setExpedientes] = useState<{ id: string; caratula: string; numero: string }[]>([]);
  const supabase = createClient();

  useEffect(() => {
    const fetchData = async () => {
      const { data: abogadosData } = await supabase.from("abogados").select("id, nombre").eq("activo", true);
      if (abogadosData) setAbogados(abogadosData);

      const { data: expedientesData } = await supabase.from("expedientes").select("id, caratula, numero").order("creado_en", { ascending: false });
      if (expedientesData) setExpedientes(expedientesData);
    };
    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { data: abogado } = await supabase.from("abogados").select("id").eq("user_id", user.id).single();
    if (!abogado) return;

    const subtareasArr = form.subtareas.split("\n").filter(Boolean).map(s => ({ texto: s.trim(), completada: false }));
    const etiquetasArr = form.etiquetas.split(",").map(t => t.trim()).filter(Boolean);

    await supabase.from("tareas").insert({
      asignado_a: form.asignado_a || abogado.id,
      creado_por: abogado.id,
      titulo: form.titulo,
      descripcion: form.descripcion || null,
      prioridad: form.prioridad,
      vence_en: form.vence_en || null,
      expediente_id: form.expediente_id || null,
      etiquetas: etiquetasArr,
      subtareas: subtareasArr,
      adjunto_url: adjuntoUrl || null,
      adjunto_nombre: adjuntoNombre || null,
    });

    setLoading(false);
    onSuccess();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="relative bg-burgos-dark rounded-2xl border border-burgos-gray-800 p-6 sm:p-8 w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-burgos-white">Nueva Tarea</h2>
          <button onClick={onClose} className="text-burgos-gray-600 hover:text-burgos-white"><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-[10px] uppercase tracking-wider text-burgos-gray-600 font-medium mb-1.5 block">Título *</label>
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
          <div>
            <label className="text-[10px] uppercase tracking-wider text-burgos-gray-600 font-medium mb-1.5 block">Vincular a expediente (opcional)</label>
            <select value={form.expediente_id} onChange={(e) => setForm({ ...form, expediente_id: e.target.value })} className="w-full px-4 py-2.5 bg-burgos-black/50 border border-burgos-gray-800 rounded-xl text-burgos-white focus:outline-none focus:border-burgos-gold/40 text-sm appearance-none">
              <option value="" className="bg-burgos-dark">Sin expediente</option>
              {expedientes.map((exp) => <option key={exp.id} value={exp.id} className="bg-burgos-dark">{exp.numero} — {exp.caratula}</option>)}
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
          <div>
            <label className="text-[10px] uppercase tracking-wider text-burgos-gray-600 font-medium mb-1.5 block">Subtareas (una por línea)</label>
            <textarea value={form.subtareas} onChange={(e) => setForm({ ...form, subtareas: e.target.value })} rows={3} placeholder="Revisar documentación&#10;Redactar escrito&#10;Presentar en juzgado" className="w-full px-4 py-2.5 bg-burgos-black/50 border border-burgos-gray-800 rounded-xl text-burgos-white placeholder:text-burgos-gray-600 focus:outline-none focus:border-burgos-gold/40 text-sm resize-none" />
          </div>
          <div>
            <label className="text-[10px] uppercase tracking-wider text-burgos-gray-600 font-medium mb-1.5 block">Etiquetas (separadas por coma)</label>
            <input type="text" value={form.etiquetas} onChange={(e) => setForm({ ...form, etiquetas: e.target.value })} placeholder="urgente, civil, García" className="w-full px-4 py-2.5 bg-burgos-black/50 border border-burgos-gray-800 rounded-xl text-burgos-white placeholder:text-burgos-gray-600 focus:outline-none focus:border-burgos-gold/40 text-sm" />
          </div>
          {/* File attachment */}
          <div>
            <label className="text-[10px] uppercase tracking-wider text-burgos-gray-600 font-medium mb-1.5 block">Adjunto</label>
            {adjuntoUrl ? (
              <div className="flex items-center gap-2 px-3 py-2 bg-burgos-black/50 border border-burgos-gray-800 rounded-xl">
                <Paperclip size={12} className="text-burgos-gold" />
                <span className="text-xs text-burgos-white flex-1 truncate">{adjuntoNombre}</span>
                <button type="button" onClick={() => { setAdjuntoUrl(""); setAdjuntoNombre(""); }} className="text-burgos-gray-600 hover:text-red-400">
                  <X size={14} />
                </button>
              </div>
            ) : (
              <FileUpload
                bucket="expedientes-docs"
                folder="tareas"
                accept=".pdf,.doc,.docx,.jpg,.png,.xls,.xlsx"
                onUpload={(url, fileName) => { setAdjuntoUrl(url); setAdjuntoNombre(fileName); }}
                label="Adjuntar archivo"
                compact
              />
            )}
          </div>
          <button type="submit" disabled={loading} className="w-full bg-burgos-gold hover:bg-burgos-gold-light disabled:bg-burgos-gold/30 text-burgos-black py-3 rounded-xl font-semibold transition-all">
            {loading ? "Creando..." : "Crear Tarea"}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
