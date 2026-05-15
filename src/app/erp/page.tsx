"use client";

import { motion } from "framer-motion";
import {
  FolderOpen,
  Calendar,
  CheckSquare,
  Users,
  TrendingUp,
  Clock,
  AlertTriangle,
} from "lucide-react";

// Datos placeholder — en producción vendrán de Supabase
const stats = [
  { label: "Expedientes activos", value: "24", icon: FolderOpen, trend: "+3 este mes" },
  { label: "Turnos hoy", value: "5", icon: Calendar, trend: "2 pendientes" },
  { label: "Tareas pendientes", value: "12", icon: CheckSquare, trend: "3 urgentes" },
  { label: "Clientes activos", value: "48", icon: Users, trend: "+5 este mes" },
];

const proximasAudiencias = [
  { expediente: "García c/ López", fecha: "16 May", hora: "10:00", juzgado: "Juzgado Civil N° 45" },
  { expediente: "Martínez c/ OSDE", fecha: "18 May", hora: "11:30", juzgado: "Juzgado Laboral N° 12" },
  { expediente: "Rodríguez c/ Estado", fecha: "20 May", hora: "09:00", juzgado: "Cámara Federal" },
];

const tareasUrgentes = [
  { titulo: "Contestar demanda - Exp. 4521", vence: "Mañana", prioridad: "urgente" },
  { titulo: "Preparar alegato - García c/ López", vence: "En 3 días", prioridad: "urgente" },
  { titulo: "Revisar contrato SRL Mendoza", vence: "En 5 días", prioridad: "normal" },
];

export default function ErpDashboard() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-2xl font-bold text-burgos-white">Dashboard</h1>
        <p className="text-burgos-gray-400 text-sm mt-1">
          Resumen general del estudio
        </p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="bg-burgos-dark rounded-2xl border border-burgos-gray-800 p-5 hover:border-burgos-gold/20 transition-colors"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 bg-burgos-gold/5 border border-burgos-gold/10 rounded-xl flex items-center justify-center">
                  <Icon size={18} className="text-burgos-gold" />
                </div>
                <TrendingUp size={14} className="text-green-400" />
              </div>
              <p className="text-2xl font-bold text-burgos-white">{stat.value}</p>
              <p className="text-xs text-burgos-gray-400 mt-0.5">{stat.label}</p>
              <p className="text-[10px] text-burgos-gray-600 mt-2">{stat.trend}</p>
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
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-burgos-dark rounded-2xl border border-burgos-gray-800 p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-burgos-white flex items-center gap-2">
              <Clock size={16} className="text-burgos-gold" />
              Próximas Audiencias
            </h2>
            <span className="text-[10px] text-burgos-gray-600 uppercase tracking-wider">
              Próximos 7 días
            </span>
          </div>
          <div className="space-y-3">
            {proximasAudiencias.map((aud, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-3 bg-burgos-dark-2 rounded-xl border border-burgos-gray-800"
              >
                <div>
                  <p className="text-sm text-burgos-white font-medium">
                    {aud.expediente}
                  </p>
                  <p className="text-[10px] text-burgos-gray-600">{aud.juzgado}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-burgos-gold font-medium">{aud.fecha}</p>
                  <p className="text-[10px] text-burgos-gray-600">{aud.hora}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Tareas urgentes */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-burgos-dark rounded-2xl border border-burgos-gray-800 p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-burgos-white flex items-center gap-2">
              <AlertTriangle size={16} className="text-amber-400" />
              Tareas Próximas
            </h2>
            <span className="text-[10px] text-burgos-gray-600 uppercase tracking-wider">
              Por vencer
            </span>
          </div>
          <div className="space-y-3">
            {tareasUrgentes.map((tarea, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-3 bg-burgos-dark-2 rounded-xl border border-burgos-gray-800"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      tarea.prioridad === "urgente"
                        ? "bg-red-400"
                        : "bg-burgos-gold"
                    }`}
                  />
                  <p className="text-sm text-burgos-white">{tarea.titulo}</p>
                </div>
                <span
                  className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                    tarea.prioridad === "urgente"
                      ? "bg-red-500/10 text-red-400"
                      : "bg-burgos-gold/10 text-burgos-gold"
                  }`}
                >
                  {tarea.vence}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
