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
  List,
  CalendarDays,
  Trash2,
  Pencil,
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
  const [vista, setVista] = useState<"lista" | "calendario">("lista");
  const [fechaPrefill, setFechaPrefill] = useState("");
  const supabase = createClient();

  const fetchTurnos = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setLoading(false); return; }
    const { data: abogado } = await supabase.from("abogados").select("id, rol").eq("user_id", user.id).single();
    if (!abogado) { setLoading(false); return; }

    // Todos ven todos los turnos (para poder ver agenda completa del estudio)
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

      {/* Vista toggle */}
      <div className="flex gap-2">
        <button onClick={() => setVista("lista")} className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-all border ${vista === "lista" ? "bg-burgos-gold/10 text-burgos-gold border-burgos-gold/30" : "text-burgos-gray-400 border-burgos-gray-800"}`}>
          <List size={14} /> Lista
        </button>
        <button onClick={() => setVista("calendario")} className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-all border ${vista === "calendario" ? "bg-burgos-gold/10 text-burgos-gold border-burgos-gold/30" : "text-burgos-gray-400 border-burgos-gray-800"}`}>
          <CalendarDays size={14} /> Calendario
        </button>
      </div>

      {vista === "calendario" ? (
        <CalendarioView turnos={turnos} onUpdate={updateEstado} onRefresh={fetchTurnos} onNewTurno={(fecha) => { setFechaPrefill(fecha); setShowModal(true); }} />
      ) : (
      <>
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
      </>
      )}

      {/* Modal */}
      {showModal && (
        <NuevoTurnoModal
          fechaInicial={fechaPrefill}
          onClose={() => { setShowModal(false); setFechaPrefill(""); }}
          onSuccess={() => {
            setShowModal(false);
            setFechaPrefill("");
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

function CalendarioView({ turnos, onUpdate, onRefresh, onNewTurno }: { turnos: Turno[]; onUpdate: (id: string, estado: string) => void; onRefresh: () => void; onNewTurno: (fecha: string) => void }) {
  const [mesActual, setMesActual] = useState(new Date());
  const [diaSeleccionado, setDiaSeleccionado] = useState<number | null>(null);

  const primerDia = new Date(mesActual.getFullYear(), mesActual.getMonth(), 1);
  const ultimoDia = new Date(mesActual.getFullYear(), mesActual.getMonth() + 1, 0);
  const diasEnMes = ultimoDia.getDate();
  const primerDiaSemana = primerDia.getDay();

  const dias = [];
  for (let i = 0; i < primerDiaSemana; i++) dias.push(null);
  for (let i = 1; i <= diasEnMes; i++) dias.push(i);

  const getTurnosDia = (dia: number) => {
    const fecha = `${mesActual.getFullYear()}-${String(mesActual.getMonth() + 1).padStart(2, "0")}-${String(dia).padStart(2, "0")}`;
    return turnos.filter(t => t.fecha === fecha);
  };

  const mesAnterior = () => setMesActual(new Date(mesActual.getFullYear(), mesActual.getMonth() - 1, 1));
  const mesSiguiente = () => setMesActual(new Date(mesActual.getFullYear(), mesActual.getMonth() + 1, 1));

  const nombreMes = mesActual.toLocaleDateString("es-AR", { month: "long", year: "numeric" });

  const turnosDelDiaSeleccionado = diaSeleccionado ? getTurnosDia(diaSeleccionado) : [];

  return (
    <div className="bg-burgos-dark rounded-2xl border border-burgos-gray-800 p-4 sm:p-6">
      {/* Header del calendario */}
      <div className="flex items-center justify-between mb-4">
        <button onClick={mesAnterior} className="text-burgos-gray-400 hover:text-burgos-gold transition-colors text-sm">← Anterior</button>
        <h3 className="text-sm font-semibold text-burgos-white capitalize">{nombreMes}</h3>
        <button onClick={mesSiguiente} className="text-burgos-gray-400 hover:text-burgos-gold transition-colors text-sm">Siguiente →</button>
      </div>

      {/* Días de la semana */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"].map(d => (
          <div key={d} className="text-center text-[10px] text-burgos-white uppercase tracking-wider font-semibold py-1 opacity-70">{d}</div>
        ))}
      </div>

      {/* Días */}
      <div className="grid grid-cols-7 gap-1">
        {dias.map((dia, i) => {
          if (!dia) return <div key={`empty-${i}`} />;
          const turnosDia = getTurnosDia(dia);
          const hoy = new Date();
          const esHoy = dia === hoy.getDate() && mesActual.getMonth() === hoy.getMonth() && mesActual.getFullYear() === hoy.getFullYear();
          const tieneTurnos = turnosDia.length > 0;

          return (
            <button
              type="button"
              key={dia}
              onClick={() => {
                if (tieneTurnos) {
                  setDiaSeleccionado(dia);
                } else {
                  const fecha = `${mesActual.getFullYear()}-${String(mesActual.getMonth() + 1).padStart(2, "0")}-${String(dia).padStart(2, "0")}`;
                  onNewTurno(fecha);
                }
              }}
              className={`min-h-[60px] sm:min-h-[80px] p-1 rounded-lg border transition-colors text-left ${
                esHoy
                  ? "border-burgos-gold/40 bg-burgos-gold/5"
                  : "border-burgos-gray-800/50 hover:border-burgos-gray-600"
              } ${tieneTurnos ? "cursor-pointer hover:bg-burgos-gold/5" : "cursor-pointer hover:bg-burgos-gold/5"}`}
            >
              <p className={`text-xs font-semibold mb-0.5 ${esHoy ? "text-burgos-gold" : "text-burgos-white"}`}>{dia}</p>
              {turnosDia.slice(0, 2).map(t => (
                <div key={t.id} className={`text-[8px] px-1 py-0.5 rounded mb-0.5 truncate font-medium ${
                  t.estado === "confirmado"
                    ? "bg-green-500/20 text-green-300 border border-green-500/30"
                    : t.estado === "pendiente"
                    ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                    : t.estado === "cancelado"
                    ? "bg-red-500/20 text-red-300 border border-red-500/30"
                    : "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                }`}>
                  {t.hora.slice(0, 5)} {t.nombre_externo || t.motivo?.slice(0, 10) || ""}
                </div>
              ))}
              {turnosDia.length > 2 && <p className="text-[8px] text-burgos-white opacity-60 font-medium">+{turnosDia.length - 2} más</p>}
            </button>
          );
        })}
      </div>

      {/* Modal de detalle del día */}
      {diaSeleccionado && turnosDelDiaSeleccionado.length > 0 && (
        <TurnosDiaModal
          dia={diaSeleccionado}
          mes={mesActual}
          turnos={turnosDelDiaSeleccionado}
          onUpdate={onUpdate}
          onRefresh={onRefresh}
          onClose={() => setDiaSeleccionado(null)}
        />
      )}
    </div>
  );
}

function TurnosDiaModal({
  dia,
  mes,
  turnos,
  onUpdate,
  onRefresh,
  onClose,
}: {
  dia: number;
  mes: Date;
  turnos: Turno[];
  onUpdate: (id: string, estado: string) => void;
  onRefresh: () => void;
  onClose: () => void;
}) {
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ fecha: "", hora: "", motivo: "" });
  const [deleting, setDeleting] = useState(false);
  const supabase = createClient();

  const fechaStr = new Date(mes.getFullYear(), mes.getMonth(), dia).toLocaleDateString("es-AR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  const iniciarEdicion = (turno: Turno) => {
    setEditandoId(turno.id);
    setEditForm({ fecha: turno.fecha, hora: turno.hora, motivo: turno.motivo });
  };

  const guardarEdicion = async () => {
    if (!editandoId) return;
    await supabase.from("turnos").update({
      fecha: editForm.fecha,
      hora: editForm.hora,
      motivo: editForm.motivo,
    }).eq("id", editandoId);
    setEditandoId(null);
    onRefresh();
    onClose();
  };

  const eliminarTurno = async (id: string) => {
    if (!confirm("¿Estás seguro de eliminar este turno?")) return;
    setDeleting(true);
    await supabase.from("turnos").delete().eq("id", id);
    setDeleting(false);
    onRefresh();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative bg-burgos-dark rounded-2xl border border-burgos-gray-800 p-6 w-full max-w-lg max-h-[80vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-lg font-bold text-burgos-white capitalize">{fechaStr}</h2>
            <p className="text-xs text-burgos-gray-400 mt-0.5">{turnos.length} turno{turnos.length !== 1 ? "s" : ""}</p>
          </div>
          <button onClick={onClose} className="text-burgos-gray-400 hover:text-burgos-white transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="space-y-3">
          {turnos.map((turno) => (
            <div key={turno.id} className="bg-burgos-black/50 rounded-xl border border-burgos-gray-800 p-4">
              {editandoId === turno.id ? (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] uppercase tracking-wider text-burgos-gray-600 font-medium mb-1 block">Fecha</label>
                      <input type="date" value={editForm.fecha} onChange={(e) => setEditForm({ ...editForm, fecha: e.target.value })} className="w-full px-3 py-2 bg-burgos-black/50 border border-burgos-gray-800 rounded-lg text-burgos-white focus:outline-none focus:border-burgos-gold/40 text-sm" />
                    </div>
                    <div>
                      <label className="text-[10px] uppercase tracking-wider text-burgos-gray-600 font-medium mb-1 block">Hora</label>
                      <input type="time" value={editForm.hora} onChange={(e) => setEditForm({ ...editForm, hora: e.target.value })} className="w-full px-3 py-2 bg-burgos-black/50 border border-burgos-gray-800 rounded-lg text-burgos-white focus:outline-none focus:border-burgos-gold/40 text-sm" />
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] uppercase tracking-wider text-burgos-gray-600 font-medium mb-1 block">Motivo</label>
                    <input type="text" value={editForm.motivo} onChange={(e) => setEditForm({ ...editForm, motivo: e.target.value })} className="w-full px-3 py-2 bg-burgos-black/50 border border-burgos-gray-800 rounded-lg text-burgos-white focus:outline-none focus:border-burgos-gold/40 text-sm" />
                  </div>
                  <div className="flex gap-2">
                    <button onClick={guardarEdicion} className="bg-burgos-gold hover:bg-burgos-gold-light text-burgos-black px-4 py-2 rounded-lg text-xs font-semibold transition-all">
                      Guardar
                    </button>
                    <button onClick={() => setEditandoId(null)} className="bg-burgos-gray-800 hover:bg-burgos-gray-700 text-burgos-white px-4 py-2 rounded-lg text-xs font-medium transition-all">
                      Cancelar
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Clock size={12} className="text-burgos-gold" />
                      <span className="text-sm font-semibold text-burgos-white">{turno.hora.slice(0, 5)}</span>
                      <span className={`text-[9px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full border ${estadoStyles[turno.estado]}`}>
                        {turno.estado}
                      </span>
                    </div>
                    <p className="text-sm text-burgos-white font-medium">{turno.motivo || "Sin motivo"}</p>
                    {turno.nombre_externo && (
                      <p className="text-xs text-burgos-gray-400 flex items-center gap-1 mt-1">
                        <User size={10} /> {turno.nombre_externo}
                      </p>
                    )}
                    {turno.notas && (
                      <p className="text-xs text-burgos-gray-400 mt-1 italic">{turno.notas}</p>
                    )}
                    <p className="text-[10px] text-burgos-gray-600 mt-1">{origenLabels[turno.origen] || turno.origen}</p>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    {turno.estado === "pendiente" && (
                      <>
                        <button
                          onClick={() => onUpdate(turno.id, "confirmado")}
                          className="w-8 h-8 bg-green-500/10 border border-green-500/20 rounded-lg flex items-center justify-center text-green-400 hover:bg-green-500/20 transition-colors"
                          title="Confirmar"
                        >
                          <Check size={14} />
                        </button>
                        <button
                          onClick={() => onUpdate(turno.id, "cancelado")}
                          className="w-8 h-8 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center justify-center text-red-400 hover:bg-red-500/20 transition-colors"
                          title="Cancelar"
                        >
                          <X size={14} />
                        </button>
                      </>
                    )}
                    {turno.estado === "confirmado" && (
                      <>
                        <button
                          onClick={() => onUpdate(turno.id, "completado")}
                          className="w-8 h-8 bg-blue-500/10 border border-blue-500/20 rounded-lg flex items-center justify-center text-blue-400 hover:bg-blue-500/20 transition-colors"
                          title="Marcar completado"
                        >
                          <Check size={14} />
                        </button>
                        <button
                          onClick={() => onUpdate(turno.id, "cancelado")}
                          className="w-8 h-8 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center justify-center text-red-400 hover:bg-red-500/20 transition-colors"
                          title="Cancelar"
                        >
                          <X size={14} />
                        </button>
                      </>
                    )}
                    {/* Editar */}
                    <button
                      onClick={() => iniciarEdicion(turno)}
                      className="w-8 h-8 bg-burgos-gold/10 border border-burgos-gold/20 rounded-lg flex items-center justify-center text-burgos-gold hover:bg-burgos-gold/20 transition-colors"
                      title="Editar"
                    >
                      <Pencil size={14} />
                    </button>
                    {/* Eliminar */}
                    <button
                      onClick={() => eliminarTurno(turno.id)}
                      disabled={deleting}
                      className="w-8 h-8 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center justify-center text-red-400 hover:bg-red-500/20 transition-colors disabled:opacity-50"
                      title="Eliminar"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

function NuevoTurnoModal({
  fechaInicial,
  onClose,
  onSuccess,
}: {
  fechaInicial?: string;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [form, setForm] = useState({
    fecha: fechaInicial || "",
    hora: "",
    motivo: "",
    nombre_externo: "",
    cliente_id: "",
    notas: "",
  });
  const [loading, setLoading] = useState(false);
  const [clientes, setClientes] = useState<{ id: string; nombre: string; dni: string }[]>([]);
  const supabase = createClient();

  useEffect(() => {
    const fetchClientes = async () => {
      const { data } = await supabase.from("clientes").select("id, nombre, dni").eq("activo", true).order("nombre");
      if (data) setClientes(data);
    };
    fetchClientes();
  }, []);

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

    // Si se seleccionó un cliente, usar su nombre como nombre_externo también
    const clienteSeleccionado = clientes.find(c => c.id === form.cliente_id);
    const nombreFinal = form.nombre_externo || (clienteSeleccionado ? clienteSeleccionado.nombre : null);

    await supabase.from("turnos").insert({
      abogado_id: abogado.id,
      fecha: form.fecha,
      hora: form.hora,
      motivo: form.motivo,
      nombre_externo: nombreFinal || null,
      cliente_id: form.cliente_id || null,
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
            <label className="text-[10px] uppercase tracking-wider text-burgos-gray-600 font-medium mb-1.5 block">Cliente registrado</label>
            <select value={form.cliente_id} onChange={(e) => setForm({ ...form, cliente_id: e.target.value })} className="w-full px-4 py-2.5 bg-burgos-black/50 border border-burgos-gray-800 rounded-xl text-burgos-white focus:outline-none focus:border-burgos-gold/40 text-sm appearance-none">
              <option value="" className="bg-burgos-dark">Sin cliente registrado</option>
              {clientes.map((c) => <option key={c.id} value={c.id} className="bg-burgos-dark">{c.nombre} — DNI: {c.dni}</option>)}
            </select>
          </div>
          <div>
            <label className="text-[10px] uppercase tracking-wider text-burgos-gray-600 font-medium mb-1.5 block">Nombre externo (si no está registrado)</label>
            <input type="text" value={form.nombre_externo} onChange={(e) => setForm({ ...form, nombre_externo: e.target.value })} placeholder="Juan Pérez (solo si no seleccionaste arriba)" className="w-full px-4 py-2.5 bg-burgos-black/50 border border-burgos-gray-800 rounded-xl text-burgos-white placeholder:text-burgos-gray-600 focus:outline-none focus:border-burgos-gold/40 text-sm" />
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
