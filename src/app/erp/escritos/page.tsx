"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { FileText, Sparkles, Download, Copy, Check } from "lucide-react";
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

export default function EscritosPage() {
  const [tipo, setTipo] = useState("");
  const [expedienteId, setExpedienteId] = useState("");
  const [contexto, setContexto] = useState("");
  const [resultado, setResultado] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [expedientes, setExpedientes] = useState<{ id: string; caratula: string }[]>([]);
  const [abogadoId, setAbogadoId] = useState<string | null>(null);
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

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-burgos-white flex items-center gap-2">
          <FileText size={24} className="text-burgos-gold" />
          Generador de Escritos
        </h1>
        <p className="text-burgos-gray-400 text-sm mt-1">Redacción asistida por IA · Llama 3.3 70B</p>
      </motion.div>

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
                <p className="text-burgos-gray-600 text-sm text-center">Seleccioná un tipo de escrito y hacé click en "Generar"</p>
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
    </div>
  );
}
