"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import {
  Calendar,
  Plus,
  Clock,
  User,
  Check,
  X,
  RefreshCw,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface Turno {
  id: string;
  fecha: string;
  hora: string;
  motivo: string;
  estado: string;
  origen: string;
  nombre_externo: string | null;
  notas: string | null;
  cliente_id: string | null;
  abogado_id: string;
}

const estadoStyles: Record<string, string> = {
  pendiente: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  confirmado: "bg-green-500/10 text-green-400 border-green-500/20",
  cancelado: "bg-red-500/10 text-red-400 border-red-500/20",
  completado: "bg-blue-500/10 text-blue-400 border-blue-500/20",
};

const origenLabels: Record<string, string> = {
  portal: "Portal cliente",
  ia_publica: "IA pública",
  manual: "Manual",
};

export default function TurnosPage() {
  const [turnos, setTurnos] = useState<Turno[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const supabase = createClient();

  const fetchTurnos = async () => {
    const { data } = await supabase
      .from("turnos")
      .select("*")
      .order("fecha", { ascending: true })
      .order("hora", { ascending: true });
    if (data) setTurnos(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchTurnos();
  }, []);

  const updateEstado = async (id: string, estado: string) => {
    await supabase.from("turnos").update({ estado }).eq("id", id);
    fetchTurnos();
  };

  const hoy = new Date().toISOString().split("T")[0];
  const turnosHoy = turnos.filter((t) => t.fecha === hoy);
  const turnosFuturos = turnos.filter((t) => t.fecha > hoy);
  const turnosPasados = turnos.filter((t) => t.fecha < hoy);

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
            <Calendar size={24} className="text-burgos-gold" />
            Turnos
          </h1>
          <p className="text-burgos-gray-400 text-sm mt-1">
            Gestión de agenda y turnos
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 bg-burgos-gold hover:bg-burgos-gold-light text-burgos-black px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300"
        >
          <Plus size={16} />
          Nuevo Turno
        </button>
      </motion.div>

      {/* Stats rápidos */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Hoy", value: turnosHoy.length, color: "text-burgos-gold" },
          { label: "Próximos", value: turnosFuturos.length, color: "text-blue-400" },
          { label: "Pendientes", value: turnos.filter((t) => t.estado === "pendiente").length, color: "text-amber-400" },
          { label: "Completados", value: turnos.filter((t) => t.estado === "completado").length, color: "text-green-400" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-burgos-dark rounded-xl border border-burgos-gray-800 p-4 text-center"
          >
            <p className={`text-xl font-bold ${stat.color}`}>{stat.value}</p>
            <p className="text-[10px] text-burgos-gray-600 uppercase tracking-wider">
              {stat.label}
            </p>
          </div>
        ))}
      </div>

      {/* Turnos de hoy */}
      {turnosHoy.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h2 className="text-sm font-semibold text-burgos-white mb-3 flex items-center gap-2">
            <div className="w-2 h-2 bg-burgos-gold rounded-full animate-pulse" />
            Hoy
          </h2>
          <div className="space-y-2">
            {turnosHoy.map((turno) => (
              <TurnoCard
                key={turno.id}
                turno={turno}
                onUpdate={updateEstado}
              />
            ))}
          </div>
        </motion.div>
      )}

      {/* Próximos */}
      {turnosFuturos.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-sm font-semibold text-burgos-white mb-3">
            Próximos
          </h2>
          <div className="space-y-2">
            {turnosFuturos.map((turno) => (
              <TurnoCard
                key={turno.id}
                turno={turno}
                onUpdate={updateEstado}
              />
            ))}
          </div>
        </motion.div>
      )}

      {/* Empty state */}
      {!loading && turnos.length === 0 && (
        <div className="text-center py-16">
          <Calendar size={40} className="text-burgos-gray-800 mx-auto mb-3" />
          <p className="text-burgos-gray-600 text-sm">
            No hay turnos cargados. Creá el primero.
          </p>
        </div>
      )}

      {loading && (
        <div className="text-center py-12">
          <div className="w-8 h-8 border-2 border-burgos-gold/30 border-t-burgos-gold rounded-full animate-spin mx-auto" />
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <NuevoTurnoModal
          onClose={() => setShowModal(false)}
          onSuccess={() => {
            setShowModal(false);
            fetchTurnos();
          }}
        />
      )}
    </div>
  );
}

function TurnoCard({
  turno,
  onUpdate,
}: {
  turno: Turno;
  onUpdate: (id: string, estado: string) => void;
}) {
  return (
    <div className="bg-burgos-dark rounded-xl border border-burgos-gray-800 p-4 flex items-center justify-between gap-4 hover:border-burgos-gold/20 transition-colors">
      <div className="flex items-center gap-4">
        <div className="text-center min-w-[50px]">
          <p className="text-xs text-burgos-gold font-bold">{turno.hora.slice(0, 5)}</p>
          <p className="text-[10px] text-burgos-gray-600">{turno.fecha}</p>
        </div>
        <div>
          <p className="text-sm text-burgos-white font-medium">
            {turno.motivo || "Sin motivo"}
          </p>
          <div className="flex items-center gap-2 mt-0.5">
            {turno.nombre_externo && (
              <span className="text-[10px] text-burgos-gray-400 flex items-center gap-1">
                <User size={9} />
                {turno.nombre_externo}
              </span>
            )}
            <span className="text-[10px] text-burgos-gray-600">
              {origenLabels[turno.origen]}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <span
          className={`text-[9px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full border ${estadoStyles[turno.estado]}`}
        >
          {turno.estado}
        </span>
        {turno.estado === "pendiente" && (
          <div className="flex gap-1">
            <button
              onClick={() => onUpdate(turno.id, "confirmado")}
              className="w-7 h-7 bg-green-500/10 border border-green-500/20 rounded-lg flex items-center justify-center text-green-400 hover:bg-green-500/20 transition-colors"
              title="Confirmar"
            >
              <Check size={12} />
            </button>
            <button
              onClick={() => onUpdate(turno.id, "cancelado")}
              className="w-7 h-7 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center justify-center text-red-400 hover:bg-red-500/20 transition-colors"
              title="Cancelar"
            >
              <X size={12} />
            </button>
          </div>
        )}
        {turno.estado === "confirmado" && (
          <button
            onClick={() => onUpdate(turno.id, "completado")}
            className="w-7 h-7 bg-blue-500/10 border border-blue-500/20 rounded-lg flex items-center justify-center text-blue-400 hover:bg-blue-500/20 transition-colors"
            title="Marcar completado"
          >
            <Check size={12} />
          </button>
        )}
      </div>
    </div>
  );
}

function NuevoTurnoModal({
  onClose,
  onSuccess,
}: {
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [form, setForm] = useState({
    fecha: "",
    hora: "",
    motivo: "",
    nombre_externo: "",
    notas: "",
  });
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Obtener el abogado actual
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: abogado } = await supabase
      .from("abogados")
      .select("id")
      .eq("user_id", user.id)
      .single();

    if (!abogado) return;

    // Validar que no haya turno duplicado (misma fecha y hora para el mismo abogado)
    const { data: existente } = await supabase
      .from("turnos")
      .select("id")
      .eq("abogado_id", abogado.id)
      .eq("fecha", form.fecha)
      .eq("hora", form.hora)
      .neq("estado", "cancelado")
      .limit(1);

    if (existente && existente.length > 0) {
      alert("Ya existe un turno para esa fecha y hora. Elegí otro horario.");
      setLoading(false);
      return;
    }

    await supabase.from("turnos").insert({
      abogado_id: abogado.id,
      fecha: form.fecha,
      hora: form.hora,
      motivo: form.motivo,
      nombre_externo: form.nombre_externo || null,
      notas: form.notas || null,
      origen: "manual",
    });

    setLoading(false);
    onSuccess();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative bg-burgos-dark rounded-2xl border border-burgos-gray-800 p-6 sm:p-8 w-full max-w-md"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-burgos-white">Nuevo Turno</h2>
          <button onClick={onClose} className="text-burgos-gray-600 hover:text-burgos-white">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] uppercase tracking-wider text-burgos-gray-600 font-medium mb-1.5 block">Fecha</label>
              <input type="date" required value={form.fecha} onChange={(e) => setForm({ ...form, fecha: e.target.value })} className="w-full px-3 py-2.5 bg-burgos-black/50 border border-burgos-gray-800 rounded-xl text-burgos-white focus:outline-none focus:border-burgos-gold/40 text-sm" />
            </div>
            <div>
              <label className="text-[10px] uppercase tracking-wider text-burgos-gray-600 font-medium mb-1.5 block">Hora</label>
              <input type="time" required value={form.hora} onChange={(e) => setForm({ ...form, hora: e.target.value })} className="w-full px-3 py-2.5 bg-burgos-black/50 border border-burgos-gray-800 rounded-xl text-burgos-white focus:outline-none focus:border-burgos-gold/40 text-sm" />
            </div>
          </div>
          <div>
            <label className="text-[10px] uppercase tracking-wider text-burgos-gray-600 font-medium mb-1.5 block">Motivo</label>
            <input type="text" required value={form.motivo} onChange={(e) => setForm({ ...form, motivo: e.target.value })} placeholder="Consulta inicial, seguimiento..." className="w-full px-4 py-2.5 bg-burgos-black/50 border border-burgos-gray-800 rounded-xl text-burgos-white placeholder:text-burgos-gray-600 focus:outline-none focus:border-burgos-gold/40 text-sm" />
          </div>
          <div>
            <label className="text-[10px] uppercase tracking-wider text-burgos-gray-600 font-medium mb-1.5 block">Nombre del cliente (opcional)</label>
            <input type="text" value={form.nombre_externo} onChange={(e) => setForm({ ...form, nombre_externo: e.target.value })} placeholder="Juan Pérez" className="w-full px-4 py-2.5 bg-burgos-black/50 border border-burgos-gray-800 rounded-xl text-burgos-white placeholder:text-burgos-gray-600 focus:outline-none focus:border-burgos-gold/40 text-sm" />
          </div>
          <div>
            <label className="text-[10px] uppercase tracking-wider text-burgos-gray-600 font-medium mb-1.5 block">Notas</label>
            <textarea value={form.notas} onChange={(e) => setForm({ ...form, notas: e.target.value })} rows={2} placeholder="Notas adicionales..." className="w-full px-4 py-2.5 bg-burgos-black/50 border border-burgos-gray-800 rounded-xl text-burgos-white placeholder:text-burgos-gray-600 focus:outline-none focus:border-burgos-gold/40 text-sm resize-none" />
          </div>
          <button type="submit" disabled={loading} className="w-full bg-burgos-gold hover:bg-burgos-gold-light disabled:bg-burgos-gold/30 text-burgos-black py-3 rounded-xl font-semibold transition-all duration-300">
            {loading ? "Creando..." : "Crear Turno"}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
