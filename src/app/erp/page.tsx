"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import {
  FolderOpen,
  Calendar,
  CheckSquare,
  Users,
  TrendingUp,
  Clock,
  AlertTriangle,
  Gavel,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface Stats {
  expedientes: number;
  turnosHoy: number;
  tareasPendientes: number;
  clientes: number;
}

interface Audiencia {
  id: string;
  tipo: string;
  fecha: string;
  hora: string | null;
  juzgado: string | null;
}

interface Tarea {
  id: string;
  titulo: string;
  prioridad: string;
  vence_en: string | null;
}

export default function ErpDashboard() {
  const [stats, setStats] = useState<Stats>({ expedientes: 0, turnosHoy: 0, tareasPendientes: 0, clientes: 0 });
  const [audiencias, setAudiencias] = useState<Audiencia[]>([]);
  const [tareas, setTareas] = useState<Tarea[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchData = async () => {
      const hoy = new Date().toISOString().split("T")[0];

      const [expRes, turnosRes, tareasRes, clientesRes, audRes, tareasListRes] = await Promise.all([
        supabase.from("expedientes").select("id", { count: "exact", head: true }).eq("estado", "activo"),
        supabase.from("turnos").select("id", { count: "exact", head: true }).eq("fecha", hoy),
        supabase.from("tareas").select("id", { count: "exact", head: true }).eq("estado", "pendiente"),
        supabase.from("clientes").select("id", { count: "exact", head: true }).eq("activo", true),
        supabase.from("audiencias").select("id, tipo, fecha, hora, juzgado").eq("estado", "pendiente").gte("fecha", hoy).order("fecha", { ascending: true }).limit(5),
        supabase.from("tareas").select("id, titulo, prioridad, vence_en").neq("estado", "completada").order("vence_en", { ascending: true, nullsFirst: false }).limit(5),
      ]);

      setStats({
        expedientes: expRes.count || 0,
        turnosHoy: turnosRes.count || 0,
        tareasPendientes: tareasRes.count || 0,
        clientes: clientesRes.count || 0,
      });

      if (audRes.data) setAudiencias(audRes.data);
      if (tareasListRes.data) setTareas(tareasListRes.data);
      setLoading(false);
    };

    fetchData();
  }, []);

  const statsCards = [
    { label: "Expedientes activos", value: stats.expedientes, icon: FolderOpen },
    { label: "Turnos hoy", value: stats.turnosHoy, icon: Calendar },
    { label: "Tareas pendientes", value: stats.tareasPendientes, icon: CheckSquare },
    { label: "Clientes activos", value: stats.clientes, icon: Users },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-burgos-gold/30 border-t-burgos-gold rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-burgos-white">Dashboard</h1>
        <p className="text-burgos-gray-400 text-sm mt-1">Resumen general del estudio</p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statsCards.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-burgos-dark rounded-2xl border border-burgos-gray-800 p-5 hover:border-burgos-gold/20 transition-colors"
            >
              <div className="w-10 h-10 bg-burgos-gold/5 border border-burgos-gold/10 rounded-xl flex items-center justify-center mb-3">
                <Icon size={18} className="text-burgos-gold" />
              </div>
              <p className="text-2xl font-bold text-burgos-white">{stat.value}</p>
              <p className="text-xs text-burgos-gray-400 mt-0.5">{stat.label}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Two columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Próximas audiencias */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-burgos-dark rounded-2xl border border-burgos-gray-800 p-6"
        >
          <h2 className="text-sm font-semibold text-burgos-white flex items-center gap-2 mb-4">
            <Gavel size={16} className="text-burgos-gold" />
            Próximas Audiencias
          </h2>
          {audiencias.length === 0 ? (
            <p className="text-burgos-gray-600 text-sm py-4 text-center">Sin audiencias próximas</p>
          ) : (
            <div className="space-y-3">
              {audiencias.map((aud) => (
                <div key={aud.id} className="flex items-center justify-between p-3 bg-burgos-dark-2 rounded-xl border border-burgos-gray-800">
                  <div>
                    <p className="text-sm text-burgos-white font-medium">{aud.tipo}</p>
                    <p className="text-[10px] text-burgos-gray-600">{aud.juzgado || "Sin juzgado"}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-burgos-gold font-medium">{aud.fecha}</p>
                    <p className="text-[10px] text-burgos-gray-600">{aud.hora?.slice(0, 5) || "—"}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Tareas próximas */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-burgos-dark rounded-2xl border border-burgos-gray-800 p-6"
        >
          <h2 className="text-sm font-semibold text-burgos-white flex items-center gap-2 mb-4">
            <AlertTriangle size={16} className="text-amber-400" />
            Tareas Próximas
          </h2>
          {tareas.length === 0 ? (
            <p className="text-burgos-gray-600 text-sm py-4 text-center">Sin tareas pendientes</p>
          ) : (
            <div className="space-y-3">
              {tareas.map((tarea) => {
                const isVencida = tarea.vence_en && new Date(tarea.vence_en) < new Date();
                return (
                  <div key={tarea.id} className="flex items-center justify-between p-3 bg-burgos-dark-2 rounded-xl border border-burgos-gray-800">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${tarea.prioridad === "urgente" ? "bg-red-400" : tarea.prioridad === "normal" ? "bg-burgos-gold" : "bg-burgos-gray-600"}`} />
                      <p className="text-sm text-burgos-white">{tarea.titulo}</p>
                    </div>
                    {tarea.vence_en && (
                      <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${isVencida ? "bg-red-500/10 text-red-400" : "bg-burgos-gold/10 text-burgos-gold"}`}>
                        {tarea.vence_en}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
