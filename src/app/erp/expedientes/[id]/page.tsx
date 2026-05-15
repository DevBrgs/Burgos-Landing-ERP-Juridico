"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
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

  useEffect(() => {
    const fetch = async () => {
      const [expRes, actRes, docRes] = await Promise.all([
        supabase.from("expedientes").select("*").eq("id", id).single(),
        supabase.from("actuaciones").select("*").eq("expediente_id", id).order("fecha", { ascending: false }),
        supabase.from("documentos").select("*").eq("expediente_id", id).order("creado_en", { ascending: false }),
      ]);
      if (expRes.data) setExpediente(expRes.data);
      if (actRes.data) setActuaciones(actRes.data);
      if (docRes.data) setDocumentos(docRes.data);
      setLoading(false);
    };
    fetch();
  }, [id]);

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
