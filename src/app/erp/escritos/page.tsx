"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { FileText, Sparkles, Download, Copy, Check, Plus, Edit, Trash2, BookOpen, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const tiposEscrito = [
  { id: "demanda", label: "Demanda", desc: "Escrito de inicio de demanda" },
  { id: "contestacion", label: "Contestación de demanda", desc: "Respuesta a una demanda" },
  { id: "apelacion", label: "Recurso de apelación", desc: "Impugnación de resolución" },
  { id: "alegato", label: "Alegato", desc: "Argumentación final" },
  { id: "cedula", label: "Cédula de notificación", desc: "Notificación judicial" },
  { id: "oficio", label: "Oficio", desc: "Comunicación a organismos" },
  { id: "contrato", label: "Contrato", desc: "Acuerdo entre partes" },
  { id: "poder", label: "Poder", desc: "Representación legal" },
];

interface Plantilla {
  id: string;
  titulo: string;
  contenido: string;
  categoria: string;
  abogado_id: string;
  creado_en: string;
}

export default function EscritosPage() {
  const [tab, setTab] = useState<"generador" | "plantillas">("generador");
  const [tipo, setTipo] = useState("");
  const [expedienteId, setExpedienteId] = useState("");
  const [contexto, setContexto] = useState("");
  const [resultado, setResultado] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [expedientes, setExpedientes] = useState<{ id: string; caratula: string }[]>([]);
  const [abogadoId, setAbogadoId] = useState<string | null>(null);

  // Plantillas state
  const [plantillas, setPlantillas] = useState<Plantilla[]>([]);
  const [plantillasLoading, setPlantillasLoading] = useState(false);
  const [showPlantillaModal, setShowPlantillaModal] = useState(false);
  const [editingPlantilla, setEditingPlantilla] = useState<Plantilla | null>(null);
  const [copiedPlantilla, setCopiedPlantilla] = useState<string | null>(null);

  const supabase = createClient();

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data: abogado } = await supabase.from("abogados").select("id").eq("user_id", user.id).single();
      if (abogado) setAbogadoId(abogado.id);
      const { data: exps } = await supabase.from("expedientes").select("id, caratula").order("creado_en", { ascending: false }).limit(20);
      if (exps) setExpedientes(exps);
    };
    init();
  }, []);

  useEffect(() => {
    if (abogadoId) fetchPlantillas();
  }, [abogadoId]);

  const fetchPlantillas = async () => {
    if (!abogadoId) return;
    setPlantillasLoading(true);
    const { data } = await supabase
      .from("plantillas_escritos")
      .select("*")
      .eq("abogado_id", abogadoId)
      .order("creado_en", { ascending: false });
    if (data) setPlantillas(data);
    setPlantillasLoading(false);
  };

  const generar = async () => {
    if (!tipo) return;
    setLoading(true);
    setResultado("");

    const expediente = expedientes.find(e => e.id === expedienteId);
    const prompt = `Redactá un ${tiposEscrito.find(t => t.id === tipo)?.label || tipo} judicial para el derecho argentino.
${expediente ? `Expediente: ${expediente.caratula}` : ""}
${contexto ? `Contexto adicional: ${contexto}` : ""}

Requisitos:
- Formato judicial argentino estándar
- Incluir encabezado con datos del juzgado (placeholder)
- Usar terminología procesal argentina
- Incluir petitorio al final
- Ser completo y profesional`;

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: prompt, abogadoId, tipo: "privada" }),
      });
      const data = await res.json();
      setResultado(data.reply || "Error al generar el escrito.");
    } catch {
      setResultado("Error de conexión.");
    }
    setLoading(false);
  };

  const copiar = () => {
    navigator.clipboard.writeText(resultado);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const copiarPlantilla = (plantilla: Plantilla) => {
    navigator.clipboard.writeText(plantilla.contenido);
    setCopiedPlantilla(plantilla.id);
    setTimeout(() => setCopiedPlantilla(null), 2000);
  };

  const deletePlantilla = async (id: string) => {
    if (!confirm("¿Eliminar esta plantilla?")) return;
    await supabase.from("plantillas_escritos").delete().eq("id", id);
    fetchPlantillas();
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-burgos-white flex items-center gap-2">
          <FileText size={24} className="text-burgos-gold" />
          Generador de Escritos
        </h1>
        <p className="text-burgos-gray-400 text-sm mt-1">Redacción asistida por IA · Llama 3.3 70B</p>
      </motion.div>

      {/* Tabs */}
      <div className="flex gap-2">
        <button onClick={() => setTab("generador")} className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all border ${tab === "generador" ? "bg-burgos-gold/10 text-burgos-gold border-burgos-gold/30" : "text-burgos-gray-400 border-burgos-gray-800 hover:border-burgos-gray-600"}`}>
          <Sparkles size={14} /> Generador IA
        </button>
        <button onClick={() => setTab("plantillas")} className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all border ${tab === "plantillas" ? "bg-burgos-gold/10 text-burgos-gold border-burgos-gold/30" : "text-burgos-gray-400 border-burgos-gray-800 hover:border-burgos-gray-600"}`}>
          <BookOpen size={14} /> Mis Plantillas ({plantillas.length})
        </button>
      </div>

      {tab === "generador" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Formulario */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-burgos-dark rounded-2xl border border-burgos-gray-800 p-6 space-y-4">
            <div>
              <label className="text-[10px] uppercase tracking-wider text-burgos-gray-600 font-medium mb-2 block">Tipo de escrito</label>
              <div className="grid grid-cols-2 gap-2">
                {tiposEscrito.map((t) => (
                  <button key={t.id} onClick={() => setTipo(t.id)} className={`text-left p-3 rounded-xl border transition-all text-xs ${tipo === t.id ? "bg-burgos-gold/10 border-burgos-gold/30 text-burgos-gold" : "border-burgos-gray-800 text-burgos-gray-400 hover:border-burgos-gray-600"}`}>
                    <p className="font-medium">{t.label}</p>
                    <p className="text-[9px] text-burgos-gray-600 mt-0.5">{t.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-[10px] uppercase tracking-wider text-burgos-gray-600 font-medium mb-1.5 block">Expediente (opcional)</label>
              <select value={expedienteId} onChange={(e) => setExpedienteId(e.target.value)} className="w-full px-4 py-2.5 bg-burgos-black/50 border border-burgos-gray-800 rounded-xl text-burgos-white focus:outline-none focus:border-burgos-gold/40 text-sm appearance-none">
                <option value="" className="bg-burgos-dark">Sin expediente</option>
                {expedientes.map((exp) => <option key={exp.id} value={exp.id} className="bg-burgos-dark">{exp.caratula}</option>)}
              </select>
            </div>

            <div>
              <label className="text-[10px] uppercase tracking-wider text-burgos-gray-600 font-medium mb-1.5 block">Contexto adicional</label>
              <textarea value={contexto} onChange={(e) => setContexto(e.target.value)} rows={4} placeholder="Hechos del caso, datos de las partes, petitorio deseado..." className="w-full px-4 py-2.5 bg-burgos-black/50 border border-burgos-gray-800 rounded-xl text-burgos-white placeholder:text-burgos-gray-600 focus:outline-none focus:border-burgos-gold/40 text-sm resize-none" />
            </div>

            <button onClick={generar} disabled={!tipo || loading} className="w-full inline-flex items-center justify-center gap-2 bg-burgos-gold hover:bg-burgos-gold-light disabled:bg-burgos-gold/30 text-burgos-black py-3 rounded-xl font-semibold transition-all">
              {loading ? (
                <><span className="w-4 h-4 border-2 border-burgos-black/30 border-t-burgos-black rounded-full animate-spin" /> Generando...</>
              ) : (
                <><Sparkles size={16} /> Generar Escrito</>
              )}
            </button>
          </motion.div>

          {/* Resultado */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-burgos-dark rounded-2xl border border-burgos-gray-800 p-6 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-burgos-white">Resultado</h2>
              {resultado && (
                <button onClick={copiar} className="inline-flex items-center gap-1 text-xs text-burgos-gold hover:text-burgos-gold-light transition-colors">
                  {copied ? <Check size={12} /> : <Copy size={12} />}
                  {copied ? "Copiado" : "Copiar"}
                </button>
              )}
            </div>
            <div className="flex-1 overflow-y-auto">
              {!resultado && !loading && (
                <div className="h-full flex items-center justify-center">
                  <p className="text-burgos-gray-600 text-sm text-center">Seleccioná un tipo de escrito y hacé click en &quot;Generar&quot;</p>
                </div>
              )}
              {loading && (
                <div className="h-full flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-8 h-8 border-2 border-burgos-gold/30 border-t-burgos-gold rounded-full animate-spin mx-auto mb-3" />
                    <p className="text-burgos-gray-400 text-sm">Redactando escrito...</p>
                  </div>
                </div>
              )}
              {resultado && (
                <pre className="text-sm text-burgos-gray-200 whitespace-pre-wrap font-sans leading-relaxed">{resultado}</pre>
              )}
            </div>
          </motion.div>
        </div>
      )}

      {tab === "plantillas" && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <div className="flex justify-end mb-4">
            <button onClick={() => { setEditingPlantilla(null); setShowPlantillaModal(true); }} className="inline-flex items-center gap-2 bg-burgos-gold hover:bg-burgos-gold-light text-burgos-black px-4 py-2 rounded-xl font-semibold text-sm transition-all">
              <Plus size={16} /> Nueva Plantilla
            </button>
          </div>

          {plantillasLoading ? (
            <div className="text-center py-12"><div className="w-8 h-8 border-2 border-burgos-gold/30 border-t-burgos-gold rounded-full animate-spin mx-auto" /></div>
          ) : plantillas.length === 0 ? (
            <div className="bg-burgos-dark rounded-2xl border border-burgos-gray-800 p-12 text-center">
              <BookOpen size={40} className="text-burgos-gray-800 mx-auto mb-3" />
              <p className="text-burgos-gray-600 text-sm">No tenés plantillas guardadas.</p>
              <p className="text-burgos-gray-700 text-xs mt-1">Creá tu primera plantilla para reutilizar escritos frecuentes.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {plantillas.map((p) => (
                <div key={p.id} className="bg-burgos-dark rounded-xl border border-burgos-gray-800 hover:border-burgos-gold/20 p-5 transition-colors">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-semibold text-burgos-white truncate">{p.titulo}</h3>
                        {p.categoria && (
                          <span className="text-[9px] uppercase tracking-wider font-medium px-2 py-0.5 rounded-full bg-burgos-gold/10 text-burgos-gold border border-burgos-gold/20">
                            {p.categoria}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-burgos-gray-400 mt-1 line-clamp-2">{p.contenido}</p>
                      <p className="text-[10px] text-burgos-gray-700 mt-2">{new Date(p.creado_en).toLocaleDateString("es-AR")}</p>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button onClick={() => copiarPlantilla(p)} className="w-8 h-8 flex items-center justify-center rounded-lg border border-burgos-gray-800 hover:border-burgos-gold/30 text-burgos-gray-400 hover:text-burgos-gold transition-all" title="Usar (copiar al portapapeles)">
                        {copiedPlantilla === p.id ? <Check size={14} /> : <Copy size={14} />}
                      </button>
                      <button onClick={() => { setEditingPlantilla(p); setShowPlantillaModal(true); }} className="w-8 h-8 flex items-center justify-center rounded-lg border border-burgos-gray-800 hover:border-blue-500/30 text-burgos-gray-400 hover:text-blue-400 transition-all" title="Editar">
                        <Edit size={14} />
                      </button>
                      <button onClick={() => deletePlantilla(p.id)} className="w-8 h-8 flex items-center justify-center rounded-lg border border-burgos-gray-800 hover:border-red-500/30 text-burgos-gray-400 hover:text-red-400 transition-all" title="Eliminar">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      )}

      {showPlantillaModal && (
        <PlantillaModal
          abogadoId={abogadoId}
          plantilla={editingPlantilla}
          onClose={() => { setShowPlantillaModal(false); setEditingPlantilla(null); }}
          onSuccess={() => { setShowPlantillaModal(false); setEditingPlantilla(null); fetchPlantillas(); }}
        />
      )}
    </div>
  );
}

function PlantillaModal({ abogadoId, plantilla, onClose, onSuccess }: { abogadoId: string | null; plantilla: Plantilla | null; onClose: () => void; onSuccess: () => void }) {
  const [form, setForm] = useState({
    titulo: plantilla?.titulo || "",
    contenido: plantilla?.contenido || "",
    categoria: plantilla?.categoria || "",
  });
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!abogadoId) return;
    setLoading(true);

    if (plantilla) {
      await supabase.from("plantillas_escritos").update({
        titulo: form.titulo,
        contenido: form.contenido,
        categoria: form.categoria || null,
      }).eq("id", plantilla.id);
    } else {
      await supabase.from("plantillas_escritos").insert({
        titulo: form.titulo,
        contenido: form.contenido,
        categoria: form.categoria || null,
        abogado_id: abogadoId,
      });
    }

    setLoading(false);
    onSuccess();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="relative bg-burgos-dark rounded-2xl border border-burgos-gray-800 p-6 sm:p-8 w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-burgos-white">{plantilla ? "Editar Plantilla" : "Nueva Plantilla"}</h2>
          <button onClick={onClose} className="text-burgos-gray-600 hover:text-burgos-white"><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-[10px] uppercase tracking-wider text-burgos-gray-600 font-medium mb-1.5 block">Título *</label>
            <input type="text" required value={form.titulo} onChange={(e) => setForm({ ...form, titulo: e.target.value })} placeholder="Ej: Modelo de demanda por daños" className="w-full px-4 py-2.5 bg-burgos-black/50 border border-burgos-gray-800 rounded-xl text-burgos-white placeholder:text-burgos-gray-600 focus:outline-none focus:border-burgos-gold/40 text-sm" />
          </div>
          <div>
            <label className="text-[10px] uppercase tracking-wider text-burgos-gray-600 font-medium mb-1.5 block">Categoría</label>
            <input type="text" value={form.categoria} onChange={(e) => setForm({ ...form, categoria: e.target.value })} placeholder="Ej: Civil, Laboral, Penal..." className="w-full px-4 py-2.5 bg-burgos-black/50 border border-burgos-gray-800 rounded-xl text-burgos-white placeholder:text-burgos-gray-600 focus:outline-none focus:border-burgos-gold/40 text-sm" />
          </div>
          <div>
            <label className="text-[10px] uppercase tracking-wider text-burgos-gray-600 font-medium mb-1.5 block">Contenido *</label>
            <textarea required value={form.contenido} onChange={(e) => setForm({ ...form, contenido: e.target.value })} rows={10} placeholder="Contenido de la plantilla..." className="w-full px-4 py-2.5 bg-burgos-black/50 border border-burgos-gray-800 rounded-xl text-burgos-white placeholder:text-burgos-gray-600 focus:outline-none focus:border-burgos-gold/40 text-sm resize-none" />
          </div>
          <button type="submit" disabled={loading} className="w-full bg-burgos-gold hover:bg-burgos-gold-light disabled:bg-burgos-gold/30 text-burgos-black py-3 rounded-xl font-semibold transition-all">
            {loading ? "Guardando..." : plantilla ? "Guardar Cambios" : "Crear Plantilla"}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
