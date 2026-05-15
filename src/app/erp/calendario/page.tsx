"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface EventoCalendario {
  id: string;
  titulo: string;
  fecha: string;
  hora?: string;
  tipo: "turno" | "audiencia" | "tarea";
  estado?: string;
}

const tipoStyles: Record<string, { bg: string; text: string; border: string; label: string }> = {
  turno: { bg: "bg-amber-500/20", text: "text-amber-300", border: "border-amber-500/30", label: "Turno" },
  audiencia: { bg: "bg-purple-500/20", text: "text-purple-300", border: "border-purple-500/30", label: "Audiencia" },
  tarea: { bg: "bg-red-500/20", text: "text-red-300", border: "border-red-500/30", label: "Tarea" },
};

export default function CalendarioUnificadoPage() {
  const [eventos, setEventos] = useState<EventoCalendario[]>([]);
  const [loading, setLoading] = useState(true);
  const [mesActual, setMesActual] = useState(new Date());
  const [diaSeleccionado, setDiaSeleccionado] = useState<number | null>(null);
  const supabase = createClient();

  useEffect(() => {
    fetchEventos();
  }, [mesActual]);

  const fetchEventos = async () => {
    const year = mesActual.getFullYear();
    const month = mesActual.getMonth();
    const primerDia = `${year}-${String(month + 1).padStart(2, "0")}-01`;
    const ultimoDia = new Date(year, month + 1, 0);
    const ultimoDiaStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(ultimoDia.getDate()).padStart(2, "0")}`;

    const [turnosRes, audienciasRes, tareasRes] = await Promise.all([
      supabase.from("turnos").select("id, fecha, hora, motivo, estado").gte("fecha", primerDia).lte("fecha", ultimoDiaStr),
      supabase.from("audiencias").select("id, fecha, hora, tipo, estado").gte("fecha", primerDia).lte("fecha", ultimoDiaStr),
      supabase.from("tareas").select("id, titulo, vence_en, estado").not("vence_en", "is", null).gte("vence_en", primerDia).lte("vence_en", ultimoDiaStr),
    ]);

    const all: EventoCalendario[] = [];

    if (turnosRes.data) {
      for (const t of turnosRes.data) {
        all.push({ id: t.id, titulo: t.motivo || "Turno", fecha: t.fecha, hora: t.hora?.slice(0, 5), tipo: "turno", estado: t.estado });
      }
    }
    if (audienciasRes.data) {
      for (const a of audienciasRes.data) {
        all.push({ id: a.id, titulo: `${a.tipo || "Audiencia"}`, fecha: a.fecha, hora: a.hora?.slice(0, 5), tipo: "audiencia", estado: a.estado });
      }
    }
    if (tareasRes.data) {
      for (const t of tareasRes.data) {
        all.push({ id: t.id, titulo: t.titulo, fecha: t.vence_en!, tipo: "tarea", estado: t.estado });
      }
    }

    setEventos(all);
    setLoading(false);
  };

  const primerDia = new Date(mesActual.getFullYear(), mesActual.getMonth(), 1);
  const ultimoDia = new Date(mesActual.getFullYear(), mesActual.getMonth() + 1, 0);
  const diasEnMes = ultimoDia.getDate();
  const primerDiaSemana = primerDia.getDay();

  const dias: (number | null)[] = [];
  for (let i = 0; i < primerDiaSemana; i++) dias.push(null);
  for (let i = 1; i <= diasEnMes; i++) dias.push(i);

  const getEventosDia = (dia: number) => {
    const fecha = `${mesActual.getFullYear()}-${String(mesActual.getMonth() + 1).padStart(2, "0")}-${String(dia).padStart(2, "0")}`;
    return eventos.filter((e) => e.fecha === fecha);
  };

  const mesAnterior = () => setMesActual(new Date(mesActual.getFullYear(), mesActual.getMonth() - 1, 1));
  const mesSiguiente = () => setMesActual(new Date(mesActual.getFullYear(), mesActual.getMonth() + 1, 1));
  const nombreMes = mesActual.toLocaleDateString("es-AR", { month: "long", year: "numeric" });

  const eventosDelDia = diaSeleccionado ? getEventosDia(diaSeleccionado) : [];

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-burgos-white flex items-center gap-2">
          <CalendarDays size={24} className="text-burgos-gold" />
          Calendario Unificado
        </h1>
        <p className="text-burgos-gray-400 text-sm mt-1">Turnos, audiencias y tareas en una sola vista</p>
      </motion.div>

      {/* Leyenda */}
      <div className="flex flex-wrap gap-4">
        {Object.entries(tipoStyles).map(([key, style]) => (
          <div key={key} className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${style.bg} border ${style.border}`} />
            <span className="text-xs text-burgos-gray-400">{style.label}</span>
          </div>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-2 border-burgos-gold/30 border-t-burgos-gold rounded-full animate-spin" />
        </div>
      ) : (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-burgos-dark rounded-2xl border border-burgos-gray-800 p-4 sm:p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <button onClick={mesAnterior} className="flex items-center gap-1 text-burgos-gray-400 hover:text-burgos-gold transition-colors text-sm">
              <ChevronLeft size={16} /> Anterior
            </button>
            <h3 className="text-sm font-semibold text-burgos-white capitalize">{nombreMes}</h3>
            <button onClick={mesSiguiente} className="flex items-center gap-1 text-burgos-gray-400 hover:text-burgos-gold transition-colors text-sm">
              Siguiente <ChevronRight size={16} />
            </button>
          </div>

          {/* Días de la semana */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"].map((d) => (
              <div key={d} className="text-center text-[10px] text-burgos-white uppercase tracking-wider font-semibold py-1 opacity-70">{d}</div>
            ))}
          </div>

          {/* Grid de días */}
          <div className="grid grid-cols-7 gap-1">
            {dias.map((dia, i) => {
              if (!dia) return <div key={`empty-${i}`} />;
              const eventosDia = getEventosDia(dia);
              const hoy = new Date();
              const esHoy = dia === hoy.getDate() && mesActual.getMonth() === hoy.getMonth() && mesActual.getFullYear() === hoy.getFullYear();

              return (
                <button
                  type="button"
                  key={dia}
                  onClick={() => eventosDia.length > 0 && setDiaSeleccionado(dia)}
                  className={`min-h-[60px] sm:min-h-[80px] p-1 rounded-lg border transition-colors text-left ${
                    esHoy ? "border-burgos-gold/40 bg-burgos-gold/5" : "border-burgos-gray-800/50 hover:border-burgos-gray-600"
                  } ${eventosDia.length > 0 ? "cursor-pointer hover:bg-burgos-dark-2" : ""}`}
                >
                  <p className={`text-xs font-semibold mb-0.5 ${esHoy ? "text-burgos-gold" : "text-burgos-white"}`}>{dia}</p>
                  {eventosDia.slice(0, 3).map((ev) => {
                    const style = tipoStyles[ev.tipo];
                    return (
                      <div key={ev.id} className={`text-[8px] px-1 py-0.5 rounded mb-0.5 truncate font-medium ${style.bg} ${style.text} border ${style.border}`}>
                        {ev.hora ? `${ev.hora} ` : ""}{ev.titulo.slice(0, 12)}
                      </div>
                    );
                  })}
                  {eventosDia.length > 3 && <p className="text-[8px] text-burgos-white opacity-60 font-medium">+{eventosDia.length - 3} más</p>}
                </button>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* Modal detalle del día */}
      {diaSeleccionado && eventosDelDia.length > 0 && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60" onClick={() => setDiaSeleccionado(null)} />
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="relative bg-burgos-dark rounded-2xl border border-burgos-gray-800 p-6 w-full max-w-md max-h-[70vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-burgos-white">
                {diaSeleccionado} de {mesActual.toLocaleDateString("es-AR", { month: "long" })}
              </h2>
              <button onClick={() => setDiaSeleccionado(null)} className="text-burgos-gray-400 hover:text-burgos-white text-sm">✕</button>
            </div>
            <div className="space-y-2">
              {eventosDelDia.map((ev) => {
                const style = tipoStyles[ev.tipo];
                return (
                  <div key={ev.id} className={`p-3 rounded-xl border ${style.border} ${style.bg}`}>
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-[9px] uppercase tracking-wider font-bold ${style.text}`}>{style.label}</span>
                      {ev.hora && <span className="text-xs text-burgos-white font-mono">{ev.hora}</span>}
                    </div>
                    <p className={`text-sm font-medium ${style.text}`}>{ev.titulo}</p>
                    {ev.estado && <p className="text-[10px] text-burgos-gray-400 mt-1">Estado: {ev.estado}</p>}
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
