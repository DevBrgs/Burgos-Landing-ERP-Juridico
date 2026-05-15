"use client";

import { motion } from "framer-motion";
import { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  FolderOpen,
  Plus,
  FileText,
  Clock,
  Edit,
  Save,
  X,
  UserPlus,
  Play,
  Square,
  Download,
  Sparkles,
  Timer,
} from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { FileUpload } from "@/components/ui/FileUpload";

interface Expediente {
  id: string;
  caratula: string;
  numero: string | null;
  fuero: string | null;
  juzgado: string | null;
  numero_pjn: string | null;
  estado: string;
  notas_internas: string | null;
  creado_en: string;
}

interface Actuacion {
  id: string;
  titulo: string;
  descripcion: string | null;
  fecha: string;
  creado_en: string;
}

interface Documento {
  id: string;
  nombre: string;
  tipo: string | null;
  url: string;
  creado_en: string;
}

interface TimerEntry {
  id: string;
  descripcion: string | null;
  inicio: string;
  fin: string | null;
  duracion_minutos: number | null;
  creado_en: string;
}

const estadoLabels: Record<string, string> = {
  activo: "Activo",
  en_espera: "En espera",
  cerrado: "Cerrado",
  archivado: "Archivado",
};

export default function ExpedienteDetallePage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [expediente, setExpediente] = useState<Expediente | null>(null);
  const [actuaciones, setActuaciones] = useState<Actuacion[]>([]);
  const [documentos, setDocumentos] = useState<Documento[]>([]);
  const [loading, setLoading] = useState(true);
  const [showActuacion, setShowActuacion] = useState(false);
  const [editando, setEditando] = useState(false);
  const supabase = createClient();

  // Timer state
  const [timerActivo, setTimerActivo] = useState(false);
  const [timerInicio, setTimerInicio] = useState<Date | null>(null);
  const [timerSegundos, setTimerSegundos] = useState(0);
  const [timers, setTimers] = useState<TimerEntry[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Resumen IA state
  const [resumen, setResumen] = useState<string | null>(null);
  const [resumenLoading, setResumenLoading] = useState(false);
  const [showResumen, setShowResumen] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      const [expRes, actRes, docRes, timerRes] = await Promise.all([
        supabase.from("expedientes").select("*").eq("id", id).single(),
        supabase.from("actuaciones").select("*").eq("expediente_id", id).order("fecha", { ascending: false }),
        supabase.from("documentos").select("*").eq("expediente_id", id).order("creado_en", { ascending: false }),
        supabase.from("timers").select("*").eq("expediente_id", id).order("creado_en", { ascending: false }),
      ]);
      if (expRes.data) setExpediente(expRes.data);
      if (actRes.data) setActuaciones(actRes.data);
      if (docRes.data) setDocumentos(docRes.data);
      if (timerRes.data) setTimers(timerRes.data);
      setLoading(false);
    };
    fetch();
  }, [id]);

  // Timer logic
  useEffect(() => {
    if (timerActivo && timerInicio) {
      timerRef.current = setInterval(() => {
        setTimerSegundos(Math.floor((Date.now() - timerInicio.getTime()) / 1000));
      }, 1000);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [timerActivo, timerInicio]);

  const iniciarTimer = () => {
    setTimerInicio(new Date());
    setTimerSegundos(0);
    setTimerActivo(true);
  };

  const detenerTimer = async () => {
    if (!timerInicio) return;
    setTimerActivo(false);
    if (timerRef.current) clearInterval(timerRef.current);

    const fin = new Date();
    const duracion = Math.round((fin.getTime() - timerInicio.getTime()) / 60000);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { data: abogado } = await supabase.from("abogados").select("id").eq("user_id", user.id).single();

    await supabase.from("timers").insert({
      abogado_id: abogado?.id,
      expediente_id: id,
      descripcion: `Trabajo en expediente`,
      inicio: timerInicio.toISOString(),
      fin: fin.toISOString(),
      duracion_minutos: duracion || 1,
    });

    const { data } = await supabase.from("timers").select("*").eq("expediente_id", id).order("creado_en", { ascending: false });
    if (data) setTimers(data);
    setTimerInicio(null);
    setTimerSegundos(0);
  };

  const formatTimer = (s: number) => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  };

  // Resumen IA
  const generarResumen = async () => {
    setResumenLoading(true);
    setShowResumen(true);
    try {
      const textoActuaciones = actuaciones.map((a) => `- ${a.fecha}: ${a.titulo}${a.descripcion ? ` — ${a.descripcion}` : ""}`).join("\n");
      const prompt = `Sos un abogado argentino. Resumí el siguiente expediente de forma concisa y profesional. Carátula: "${expediente?.caratula}". Fuero: ${expediente?.fuero || "N/A"}. Juzgado: ${expediente?.juzgado || "N/A"}. Estado: ${expediente?.estado}.\n\nActuaciones:\n${textoActuaciones || "Sin actuaciones registradas."}\n\nGenerá un resumen ejecutivo del caso en 3-5 párrafos.`;

      // Get abogado id for private chat
      const { data: { user } } = await supabase.auth.getUser();
      let abogadoId = "";
      if (user) {
        const { data: abogado } = await supabase.from("abogados").select("id").eq("user_id", user.id).single();
        if (abogado) abogadoId = abogado.id;
      }

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: prompt, abogadoId, tipo: "privado" }),
      });
      const data = await res.json();
      setResumen(data.reply || "No se pudo generar el resumen.");
    } catch {
      setResumen("Error al generar el resumen. Intentá nuevamente.");
    }
    setResumenLoading(false);
  };

  // PDF
  const generarPDF = async () => {
    const { jsPDF } = await import("jspdf");
    const autoTable = (await import("jspdf-autotable")).default;

    const doc = new jsPDF();
    const gold = [201, 168, 76] as [number, number, number];

    // Header
    doc.setFontSize(18);
    doc.setTextColor(...gold);
    doc.text("Burgos & Asociados", 14, 20);
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text("Reporte de Expediente", 14, 27);

    // Carátula
    doc.setFontSize(14);
    doc.setTextColor(30);
    doc.text(expediente?.caratula || "", 14, 40);

    doc.setFontSize(10);
    doc.setTextColor(80);
    let y = 50;
    if (expediente?.numero) { doc.text(`Número: ${expediente.numero}`, 14, y); y += 6; }
    if (expediente?.fuero) { doc.text(`Fuero: ${expediente.fuero}`, 14, y); y += 6; }
    if (expediente?.juzgado) { doc.text(`Juzgado: ${expediente.juzgado}`, 14, y); y += 6; }
    doc.text(`Estado: ${estadoLabels[expediente?.estado || "activo"]}`, 14, y); y += 12;

    // Actuaciones
    if (actuaciones.length > 0) {
      doc.setFontSize(12);
      doc.setTextColor(...gold);
      doc.text("Actuaciones", 14, y); y += 4;

      autoTable(doc, {
        startY: y,
        head: [["Fecha", "Título", "Descripción"]],
        body: actuaciones.map((a) => [a.fecha, a.titulo, a.descripcion || ""]),
        styles: { fontSize: 8 },
        headStyles: { fillColor: gold },
      });

      y = (doc as any).lastAutoTable.finalY + 10;
    }

    // Documentos
    if (documentos.length > 0) {
      if (y > 250) { doc.addPage(); y = 20; }
      doc.setFontSize(12);
      doc.setTextColor(...gold);
      doc.text("Documentos", 14, y); y += 4;

      autoTable(doc, {
        startY: y,
        head: [["Nombre", "Tipo", "Fecha"]],
        body: documentos.map((d) => [d.nombre, d.tipo || "-", new Date(d.creado_en).toLocaleDateString()]),
        styles: { fontSize: 8 },
        headStyles: { fillColor: gold },
      });
    }

    doc.save(`expediente-${expediente?.numero || id}.pdf`);
  };

  const updateEstado = async (estado: string) => {
    await supabase.from("expedientes").update({ estado }).eq("id", id);
    setExpediente((prev) => prev ? { ...prev, estado } : null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-burgos-gold/30 border-t-burgos-gold rounded-full animate-spin" />
      </div>
    );
  }

  if (!expediente) {
    return (
      <div className="text-center py-16">
        <p className="text-burgos-gray-600">Expediente no encontrado</p>
        <Link href="/erp/expedientes" className="text-burgos-gold text-sm mt-2 inline-block">← Volver</Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Back + Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Link href="/erp/expedientes" className="inline-flex items-center gap-2 text-burgos-gray-400 hover:text-burgos-gold text-sm mb-4 transition-colors">
          <ArrowLeft size={16} />
          Volver a expedientes
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-burgos-white">{expediente.caratula}</h1>
            <div className="flex items-center gap-3 mt-2 flex-wrap">
              {expediente.numero && <span className="text-xs text-burgos-gray-400 font-mono bg-burgos-dark-2 px-2 py-1 rounded">N° {expediente.numero}</span>}
              {expediente.fuero && <span className="text-xs text-burgos-gray-400">{expediente.fuero}</span>}
              {expediente.juzgado && <span className="text-xs text-burgos-gray-600">{expediente.juzgado}</span>}
            </div>
          </div>
          <select
            value={expediente.estado}
            onChange={(e) => updateEstado(e.target.value)}
            className="px-4 py-2 bg-burgos-dark-2 border border-burgos-gray-800 rounded-xl text-sm text-burgos-white focus:outline-none focus:border-burgos-gold/40 appearance-none"
          >
            {Object.entries(estadoLabels).map(([key, label]) => (
              <option key={key} value={key} className="bg-burgos-dark">{label}</option>
            ))}
          </select>
        </div>
      </motion.div>

      {/* Action buttons: Timer, Resumen IA, PDF */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="flex flex-wrap gap-3">
        {/* Timer */}
        {!timerActivo ? (
          <button onClick={iniciarTimer} className="inline-flex items-center gap-2 px-4 py-2 bg-burgos-dark border border-burgos-gray-800 rounded-xl text-sm text-burgos-white hover:border-burgos-gold/40 transition-colors">
            <Play size={14} className="text-green-400" />
            Iniciar Timer
          </button>
        ) : (
          <button onClick={detenerTimer} className="inline-flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/30 rounded-xl text-sm text-red-300 hover:bg-red-500/20 transition-colors">
            <Square size={14} />
            Detener {formatTimer(timerSegundos)}
          </button>
        )}

        {/* Resumen IA */}
        <button onClick={generarResumen} disabled={resumenLoading} className="inline-flex items-center gap-2 px-4 py-2 bg-burgos-dark border border-burgos-gray-800 rounded-xl text-sm text-burgos-white hover:border-purple-500/40 transition-colors disabled:opacity-50">
          <Sparkles size={14} className="text-purple-400" />
          {resumenLoading ? "Generando..." : "Resumir caso"}
        </button>

        {/* PDF */}
        <button onClick={generarPDF} className="inline-flex items-center gap-2 px-4 py-2 bg-burgos-dark border border-burgos-gray-800 rounded-xl text-sm text-burgos-white hover:border-burgos-gold/40 transition-colors">
          <Download size={14} className="text-burgos-gold" />
          Descargar PDF
        </button>
      </motion.div>

      {/* Info cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="lg:col-span-2 bg-burgos-dark rounded-2xl border border-burgos-gray-800 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-burgos-white flex items-center gap-2">
              <Clock size={16} className="text-burgos-gold" />
              Actuaciones ({actuaciones.length})
            </h2>
            <button onClick={() => setShowActuacion(true)} className="inline-flex items-center gap-1 text-xs text-burgos-gold hover:text-burgos-gold-light transition-colors">
              <Plus size={14} />
              Agregar
            </button>
          </div>

          {actuaciones.length === 0 ? (
            <p className="text-burgos-gray-600 text-sm text-center py-6">Sin actuaciones registradas</p>
          ) : (
            <div className="space-y-3">
              {actuaciones.map((act) => (
                <div key={act.id} className="p-4 bg-burgos-dark-2 rounded-xl border border-burgos-gray-800">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-burgos-white font-medium">{act.titulo}</p>
                      {act.descripcion && <p className="text-xs text-burgos-gray-400 mt-1">{act.descripcion}</p>}
                    </div>
                    <span className="text-[10px] text-burgos-gray-600">{act.fecha}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Notas internas */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-burgos-dark rounded-2xl border border-burgos-gray-800 p-6">
          <h2 className="text-sm font-semibold text-burgos-white flex items-center gap-2 mb-4">
            <FileText size={16} className="text-burgos-gold" />
            Notas Internas
          </h2>
          <p className="text-sm text-burgos-gray-400 whitespace-pre-wrap">
            {expediente.notas_internas || "Sin notas."}
          </p>
        </motion.div>
      </div>

      {/* Documentos adjuntos */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-burgos-dark rounded-2xl border border-burgos-gray-800 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-burgos-white flex items-center gap-2">
            <FileText size={16} className="text-burgos-gold" />
            Documentos ({documentos.length})
          </h2>
        </div>

        <FileUpload
          bucket="expedientes-docs"
          folder={id}
          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.xls,.xlsx"
          maxSizeMB={20}
          label="Adjuntar documento"
          onUpload={async (url, fileName) => {
            const { data: { user } } = await supabase.auth.getUser();
            const { data: abogado } = await supabase.from("abogados").select("id").eq("user_id", user!.id).single();
            await supabase.from("documentos").insert({
              expediente_id: id,
              nombre: fileName,
              tipo: fileName.split(".").pop() || null,
              url,
              subido_por: abogado?.id || null,
            });
            const { data } = await supabase.from("documentos").select("*").eq("expediente_id", id).order("creado_en", { ascending: false });
            if (data) setDocumentos(data);
          }}
        />

        {documentos.length > 0 && (
          <div className="mt-4 space-y-2">
            {documentos.map((doc) => (
              <div key={doc.id} className="flex items-center justify-between p-3 bg-burgos-dark-2 rounded-xl border border-burgos-gray-800">
                <div className="flex items-center gap-3">
                  <FileText size={16} className="text-burgos-gold" />
                  <div>
                    <p className="text-sm text-burgos-white">{doc.nombre}</p>
                    <p className="text-[10px] text-burgos-gray-600">{new Date(doc.creado_en).toLocaleDateString()}</p>
                  </div>
                </div>
                <a
                  href={doc.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-burgos-gold hover:text-burgos-gold-light transition-colors"
                >
                  Descargar
                </a>
              </div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Timer entries */}
      {timers.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="bg-burgos-dark rounded-2xl border border-burgos-gray-800 p-6">
          <h2 className="text-sm font-semibold text-burgos-white flex items-center gap-2 mb-4">
            <Timer size={16} className="text-burgos-gold" />
            Registro de Horas ({timers.length})
          </h2>
          <div className="space-y-2">
            {timers.map((t) => (
              <div key={t.id} className="flex items-center justify-between p-3 bg-burgos-dark-2 rounded-xl border border-burgos-gray-800">
                <div>
                  <p className="text-sm text-burgos-white">{t.descripcion || "Trabajo registrado"}</p>
                  <p className="text-[10px] text-burgos-gray-600">{new Date(t.inicio).toLocaleString("es-AR")}</p>
                </div>
                <span className="text-sm font-mono text-burgos-gold">{t.duracion_minutos} min</span>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Resumen IA Modal */}
      {showResumen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60" onClick={() => setShowResumen(false)} />
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="relative bg-burgos-dark rounded-2xl border border-burgos-gray-800 p-6 sm:p-8 w-full max-w-lg max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-burgos-white flex items-center gap-2">
                <Sparkles size={18} className="text-purple-400" />
                Resumen del Caso
              </h2>
              <button onClick={() => setShowResumen(false)} className="text-burgos-gray-600 hover:text-burgos-white"><X size={20} /></button>
            </div>
            {resumenLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="w-8 h-8 border-2 border-purple-400/30 border-t-purple-400 rounded-full animate-spin" />
              </div>
            ) : (
              <div className="prose prose-invert prose-sm max-w-none">
                <p className="text-sm text-burgos-gray-300 whitespace-pre-wrap leading-relaxed">{resumen}</p>
              </div>
            )}
          </motion.div>
        </div>
      )}

      {/* Modal nueva actuación */}
      {showActuacion && (
        <NuevaActuacionModal
          expedienteId={id}
          onClose={() => setShowActuacion(false)}
          onSuccess={async () => {
            setShowActuacion(false);
            const { data } = await supabase.from("actuaciones").select("*").eq("expediente_id", id).order("fecha", { ascending: false });
            if (data) setActuaciones(data);
          }}
        />
      )}
    </div>
  );
}

function NuevaActuacionModal({ expedienteId, onClose, onSuccess }: { expedienteId: string; onClose: () => void; onSuccess: () => void }) {
  const [form, setForm] = useState({ titulo: "", descripcion: "", fecha: new Date().toISOString().split("T")[0] });
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { data: abogado } = await supabase.from("abogados").select("id").eq("user_id", user.id).single();

    await supabase.from("actuaciones").insert({
      expediente_id: expedienteId,
      titulo: form.titulo,
      descripcion: form.descripcion || null,
      fecha: form.fecha,
      creado_por: abogado?.id || null,
    });

    setLoading(false);
    onSuccess();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="relative bg-burgos-dark rounded-2xl border border-burgos-gray-800 p-6 sm:p-8 w-full max-w-md">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-burgos-white">Nueva Actuación</h2>
          <button onClick={onClose} className="text-burgos-gray-600 hover:text-burgos-white"><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-[10px] uppercase tracking-wider text-burgos-gray-600 font-medium mb-1.5 block">Título *</label>
            <input type="text" required value={form.titulo} onChange={(e) => setForm({ ...form, titulo: e.target.value })} placeholder="Contestación de demanda presentada" className="w-full px-4 py-2.5 bg-burgos-black/50 border border-burgos-gray-800 rounded-xl text-burgos-white placeholder:text-burgos-gray-600 focus:outline-none focus:border-burgos-gold/40 text-sm" />
          </div>
          <div>
            <label className="text-[10px] uppercase tracking-wider text-burgos-gray-600 font-medium mb-1.5 block">Descripción</label>
            <textarea value={form.descripcion} onChange={(e) => setForm({ ...form, descripcion: e.target.value })} rows={3} placeholder="Detalles de la actuación..." className="w-full px-4 py-2.5 bg-burgos-black/50 border border-burgos-gray-800 rounded-xl text-burgos-white placeholder:text-burgos-gray-600 focus:outline-none focus:border-burgos-gold/40 text-sm resize-none" />
          </div>
          <div>
            <label className="text-[10px] uppercase tracking-wider text-burgos-gray-600 font-medium mb-1.5 block">Fecha</label>
            <input type="date" value={form.fecha} onChange={(e) => setForm({ ...form, fecha: e.target.value })} className="w-full px-4 py-2.5 bg-burgos-black/50 border border-burgos-gray-800 rounded-xl text-burgos-white focus:outline-none focus:border-burgos-gold/40 text-sm" />
          </div>
          <button type="submit" disabled={loading} className="w-full bg-burgos-gold hover:bg-burgos-gold-light disabled:bg-burgos-gold/30 text-burgos-black py-3 rounded-xl font-semibold transition-all duration-300">
            {loading ? "Guardando..." : "Agregar Actuación"}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
