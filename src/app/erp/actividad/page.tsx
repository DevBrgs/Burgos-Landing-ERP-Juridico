"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Activity, Clock, User, FileText } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface LogEntry {
  id: string;
  created_at: string;
  usuario: string;
  accion: string;
  entidad: string;
  detalle: string | null;
}

export default function ActividadPage() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchLogs = async () => {
      const { data } = await supabase
        .from("actividad_log")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(50);

      if (data) setLogs(data);
      setLoading(false);
    };
    fetchLogs();
  }, []);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleString("es-AR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-2xl font-bold text-burgos-white flex items-center gap-2">
          <Activity size={24} className="text-burgos-gold" />
          Log de Actividad
        </h1>
        <p className="text-burgos-gray-400 text-sm mt-1">
          Últimas 50 acciones registradas en el sistema
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="bg-burgos-dark rounded-2xl border border-burgos-gray-800 overflow-hidden"
      >
        {loading ? (
          <div className="text-center py-12">
            <div className="w-8 h-8 border-2 border-burgos-gold/30 border-t-burgos-gold rounded-full animate-spin mx-auto" />
          </div>
        ) : logs.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-burgos-gray-600 text-sm">No hay actividad registrada.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-burgos-gray-800">
                  <th className="text-left px-5 py-3 text-[10px] uppercase tracking-wider text-burgos-gray-600 font-medium">
                    <span className="flex items-center gap-1"><Clock size={10} /> Fecha/Hora</span>
                  </th>
                  <th className="text-left px-5 py-3 text-[10px] uppercase tracking-wider text-burgos-gray-600 font-medium">
                    <span className="flex items-center gap-1"><User size={10} /> Usuario</span>
                  </th>
                  <th className="text-left px-5 py-3 text-[10px] uppercase tracking-wider text-burgos-gray-600 font-medium">
                    Acción
                  </th>
                  <th className="text-left px-5 py-3 text-[10px] uppercase tracking-wider text-burgos-gray-600 font-medium">
                    <span className="flex items-center gap-1"><FileText size={10} /> Entidad</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <tr
                    key={log.id}
                    className="border-b border-burgos-gray-800/50 hover:bg-burgos-dark-2 transition-colors"
                  >
                    <td className="px-5 py-4 text-sm text-burgos-gray-400 font-mono whitespace-nowrap">
                      {formatDate(log.created_at)}
                    </td>
                    <td className="px-5 py-4 text-sm text-burgos-white font-medium">
                      {log.usuario}
                    </td>
                    <td className="px-5 py-4 text-sm text-burgos-gold">
                      {log.accion}
                    </td>
                    <td className="px-5 py-4 text-sm text-burgos-gray-400">
                      {log.entidad}
                      {log.detalle && (
                        <span className="text-burgos-gray-600 ml-2 text-xs">
                          ({log.detalle})
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>
    </div>
  );
}
