"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  User,
  FolderOpen,
  Calendar,
  DollarSign,
  MessageSquare,
  Clock,
  Phone,
  Mail,
  CreditCard,
  Activity,
  Eye,
} from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

interface Cliente {
  id: string;
  dni: string;
  nombre: string;
  email: string | null;
  telefono: string | null;
  activo: boolean;
  primer_ingreso: boolean;
  creado_en: string;
}

interface Expediente {
  id: string;
  caratula: string;
  numero: string | null;
  fuero: string | null;
  estado: string;
  creado_en: string;
}

interface Turno {
  id: string;
  fecha: string;
  hora: string;
  motivo: string | null;
  estado: string;
}

interface Honorario {
  id: string;
  monto: number;
  tipo: string;
  estado: string;
  creado_en: string;
  notas: string | null;
}

interface TimelineEvent {
  id: string;
  tipo: "expediente" | "turno" | "honorario" | "mensaje" | "alta";
  titulo: string;
  detalle: string | null;
  fecha: string;
  estado?: string;
}

const estadoExpStyles: Record<string, string> = {
  activo: "bg-green-500/10 text-green-400",
  en_espera: "bg-amber-500/10 text-amber-400",
  cerrado: "bg-burgos-gray-600/10 text-burgos-gray-400",
  archivado: "bg-blue-500/10 text-blue-400",
};

const estadoTurnoStyles: Record<string, string> = {
  pendiente: "bg-amber-500/10 text-amber-400",
  confirmado: "bg-green-500/10 text-green-400",
  cancelado: "bg-red-500/10 text-red-400",
  completado: "bg-blue-500/10 text-blue-400",
};

const estadoHonStyles: Record<string, string> = {
  pendiente: "bg-amber-500/10 text-amber-400",
  facturado: "bg-blue-500/10 text-blue-400",
  cobrado: "bg-green-500/10 text-green-400",
  en_mora: "bg-red-500/10 text-red-400",
};

export default function ClienteDetallePage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [cliente, setCliente] = useState<Cliente | null>(null);
  const [expedientes, setExpedientes] = useState<Expediente[]>([]);
  const [turnos, setTurnos] = useState<Turno[]>([]);
  const [honorarios, setHonorarios] = useState<Honorario[]>([]);
  const [mensajesCount, setMensajesCount] = useState(0);
  const [timeline, setTimeline] = useState<TimelineEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"timeline" | "expedientes" | "turnos" | "honorarios">("timeline");
  const supabase = createClient();

  useEffect(() => {
    const fetchAll = async () => {
      // Cliente
      const { data: cli } = await supabase.from("clientes").select("*").eq("id", id).single();
      if (!cli) { setLoading(false); return; }
      setCliente(cli);

      // Expedientes del cliente
      const { data: exps } = await supabase
        .from("expedientes")
        .select("id, caratula, numero, fuero, estado, creado_en")
        .eq("cliente_id", id)
        .order("creado_en", { ascending: false });
      if (exps) setExpedientes(exps);

      // Turnos del cliente
      const { data: trns } = await supabase
        .from("turnos")
        .select("id, fecha, hora, motivo, estado")
        .eq("cliente_id", id)
        .order("fecha", { ascending: false });
      if (trns) setTurnos(trns);

      // Honorarios del cliente
      const { data: hons } = await supabase
        .from("honorarios")
        .select("id, monto, tipo, estado, creado_en, notas")
        .eq("cliente_id", id)
        .order("creado_en", { ascending: false });
      if (hons) setHonorarios(hons);

      // Mensajes count
      const { count } = await supabase
        .from("mensajes")
        .select("id", { count: "exact", head: true })
        .eq("remitente_id", id);
      setMensajesCount(count || 0);

      // Build timeline
      const events: TimelineEvent[] = [];

      // Alta del cliente
      events.push({
        id: "alta-" + cli.id,
        tipo: "alta",
        titulo: "Cliente dado de alta",
        detalle: `DNI: ${cli.dni}`,
        fecha: cli.creado_en,
      });

      // Expedientes
      if (exps) {
        exps.forEach((e) => {
          events.push({
            id: "exp-" + e.id,
            tipo: "expediente",
            titulo: `Expediente: ${e.caratula}`,
            detalle: e.fuero ? `Fuero: ${e.fuero}` : null,
            fecha: e.creado_en,
            estado: e.estado,
          });
        });
      }

      // Turnos
      if (trns) {
        trns.forEach((t) => {
          events.push({
            id: "turno-" + t.id,
            tipo: "turno",
            titulo: `Turno: ${t.motivo || "Sin motivo"}`,
            detalle: `${t.fecha} a las ${t.hora?.slice(0, 5)}`,
            fecha: t.fecha + "T" + (t.hora || "00:00:00"),
            estado: t.estado,
          });
        });
      }

      // Honorarios
      if (hons) {
        hons.forEach((h) => {
          events.push({
            id: "hon-" + h.id,
            tipo: "honorario",
            titulo: `Honorario: $${Number(h.monto).toLocaleString()}`,
            detalle: h.notas || `Tipo: ${h.tipo}`,
            fecha: h.creado_en,
            estado: h.estado,
          });
        });
      }

      // Sort by date descending
      events.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
      setTimeline(events);
      setLoading(false);
    };
    fetchAll();
  }, [id]);

  const totalCobrado = honorarios.filter((h) => h.estado === "cobrado").reduce((s, h) => s + Number(h.monto), 0);
  const totalPendiente = honorarios.filter((h) => h.estado !== "cobrado").reduce((s, h) => s + Number(h.monto), 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-burgos-gold/30 border-t-burgos-gold rounded-full animate-spin" />
      </div>
    );
  }

  if (!cliente) {
    return (
      <div className="text-center py-16">
        <p className="text-burgos-gray-600">Cliente no encontrado</p>
        <Link href="/erp/clientes" className="text-burgos-gold text-sm mt-2 inline-block">← Volver</Link>
      </div>
    );
  }

  const tipoIcon = (tipo: TimelineEvent["tipo"]) => {
    switch (tipo) {
      case "expediente": return <FolderOpen size={14} className="text-blue-400" />;
      case "turno": return <Calendar size={14} className="text-burgos-gold" />;
      case "honorario": return <DollarSign size={14} className="text-green-400" />;
      case "mensaje": return <MessageSquare size={14} className="text-purple-400" />;
      case "alta": return <User size={14} className="text-burgos-gold" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Link href="/erp/clientes" className="inline-flex items-center gap-2 text-burgos-gray-400 hover:text-burgos-gold text-sm mb-4 transition-colors">
          <ArrowLeft size={16} /> Volver a clientes
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-burgos-gold/10 border border-burgos-gold/20 rounded-2xl flex items-center justify-center">
              <User size={24} className="text-burgos-gold" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-burgos-white">{cliente.nombre}</h1>
              <div className="flex items-center gap-3 mt-1 flex-wrap">
                <span className="text-xs text-burgos-gray-400 font-mono flex items-center gap-1">
                  <CreditCard size={10} /> DNI: {cliente.dni}
                </span>
                {cliente.email && (
                  <span className="text-xs text-burgos-gray-400 flex items-center gap-1">
                    <Mail size={10} /> {cliente.email}
                  </span>
                )}
                {cliente.telefono && (
                  <span className="text-xs text-burgos-gray-400 flex items-center gap-1">
                    <Phone size={10} /> {cliente.telefono}
                  </span>
                )}
              </div>
            </div>
          </div>
          <span className={`text-[9px] uppercase tracking-wider font-semibold px-2.5 py-1 rounded-full ${cliente.activo ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"}`}>
            {cliente.activo ? "Activo" : "Inactivo"}
          </span>
        </div>
      </motion.div>

      {/* KPIs */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-burgos-dark rounded-xl border border-burgos-gray-800 p-4">
          <div className="flex items-center gap-2 mb-1">
            <FolderOpen size={14} className="text-blue-400" />
            <span className="text-[10px] uppercase tracking-wider text-burgos-gray-600">Expedientes</span>
          </div>
          <p className="text-xl font-bold text-burgos-white">{expedientes.length}</p>
        </div>
        <div className="bg-burgos-dark rounded-xl border border-burgos-gray-800 p-4">
          <div className="flex items-center gap-2 mb-1">
            <Calendar size={14} className="text-burgos-gold" />
            <span className="text-[10px] uppercase tracking-wider text-burgos-gray-600">Turnos</span>
          </div>
          <p className="text-xl font-bold text-burgos-white">{turnos.length}</p>
        </div>
        <div className="bg-burgos-dark rounded-xl border border-burgos-gray-800 p-4">
          <div className="flex items-center gap-2 mb-1">
            <DollarSign size={14} className="text-green-400" />
            <span className="text-[10px] uppercase tracking-wider text-burgos-gray-600">Cobrado</span>
          </div>
          <p className="text-xl font-bold text-green-400">${totalCobrado.toLocaleString()}</p>
        </div>
        <div className="bg-burgos-dark rounded-xl border border-burgos-gray-800 p-4">
          <div className="flex items-center gap-2 mb-1">
            <DollarSign size={14} className="text-amber-400" />
            <span className="text-[10px] uppercase tracking-wider text-burgos-gray-600">Pendiente</span>
          </div>
          <p className="text-xl font-bold text-amber-400">${totalPendiente.toLocaleString()}</p>
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="flex gap-2 flex-wrap">
        {[
          { id: "timeline" as const, label: "Historial", icon: Activity },
          { id: "expedientes" as const, label: `Expedientes (${expedientes.length})`, icon: FolderOpen },
          { id: "turnos" as const, label: `Turnos (${turnos.length})`, icon: Calendar },
          { id: "honorarios" as const, label: `Honorarios (${honorarios.length})`, icon: DollarSign },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all border ${
              tab === t.id
                ? "bg-burgos-gold/10 text-burgos-gold border-burgos-gold/30"
                : "text-burgos-gray-400 border-burgos-gray-800 hover:border-burgos-gray-600"
            }`}
          >
            <t.icon size={14} /> {t.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {tab === "timeline" && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-burgos-dark rounded-2xl border border-burgos-gray-800 p-6">
          <h2 className="text-sm font-semibold text-burgos-white flex items-center gap-2 mb-5">
            <Activity size={16} className="text-burgos-gold" />
            Historial del Cliente
          </h2>
          {timeline.length === 0 ? (
            <p className="text-burgos-gray-600 text-sm text-center py-8">Sin actividad registrada.</p>
          ) : (
            <div className="relative">
              {/* Vertical line */}
              <div className="absolute left-[17px] top-2 bottom-2 w-px bg-burgos-gray-800" />
              <div className="space-y-4">
                {timeline.map((event) => (
                  <div key={event.id} className="flex gap-4 relative">
                    <div className="w-9 h-9 rounded-full bg-burgos-dark-2 border border-burgos-gray-800 flex items-center justify-center shrink-0 z-10">
                      {tipoIcon(event.tipo)}
                    </div>
                    <div className="flex-1 pb-4">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="text-sm text-burgos-white font-medium">{event.titulo}</p>
                          {event.detalle && <p className="text-xs text-burgos-gray-400 mt-0.5">{event.detalle}</p>}
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          {event.estado && (
                            <span className={`text-[9px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full ${
                              event.tipo === "expediente" ? estadoExpStyles[event.estado] || "" :
                              event.tipo === "turno" ? estadoTurnoStyles[event.estado] || "" :
                              event.tipo === "honorario" ? estadoHonStyles[event.estado] || "" : ""
                            }`}>
                              {event.estado}
                            </span>
                          )}
                          <span className="text-[10px] text-burgos-gray-600">
                            {new Date(event.fecha).toLocaleDateString("es-AR", { day: "2-digit", month: "short", year: "numeric" })}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      )}

      {tab === "expedientes" && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-burgos-dark rounded-2xl border border-burgos-gray-800 overflow-hidden">
          {expedientes.length === 0 ? (
            <div className="text-center py-12">
              <FolderOpen size={32} className="text-burgos-gray-800 mx-auto mb-2" />
              <p className="text-burgos-gray-600 text-sm">Sin expedientes vinculados.</p>
              <p className="text-burgos-gray-700 text-xs mt-1">Vinculá un expediente al crear uno nuevo.</p>
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-burgos-gray-800">
                  <th className="text-left px-5 py-3 text-[10px] uppercase tracking-wider text-burgos-gray-600 font-medium">Carátula</th>
                  <th className="text-left px-5 py-3 text-[10px] uppercase tracking-wider text-burgos-gray-600 font-medium hidden sm:table-cell">Fuero</th>
                  <th className="text-left px-5 py-3 text-[10px] uppercase tracking-wider text-burgos-gray-600 font-medium">Estado</th>
                  <th className="text-left px-5 py-3 text-[10px] uppercase tracking-wider text-burgos-gray-600 font-medium hidden sm:table-cell">Fecha</th>
                  <th className="px-5 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {expedientes.map((exp) => (
                  <tr key={exp.id} className="border-b border-burgos-gray-800/50 hover:bg-burgos-dark-2 transition-colors">
                    <td className="px-5 py-3">
                      <p className="text-sm text-burgos-white font-medium">{exp.caratula}</p>
                      {exp.numero && <p className="text-[10px] text-burgos-gray-600 font-mono mt-0.5">N° {exp.numero}</p>}
                    </td>
                    <td className="px-5 py-3 hidden sm:table-cell text-sm text-burgos-gray-400">{exp.fuero || "—"}</td>
                    <td className="px-5 py-3">
                      <span className={`text-[9px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full ${estadoExpStyles[exp.estado]}`}>{exp.estado}</span>
                    </td>
                    <td className="px-5 py-3 hidden sm:table-cell text-xs text-burgos-gray-600">{new Date(exp.creado_en).toLocaleDateString("es-AR")}</td>
                    <td className="px-5 py-3">
                      <Link href={`/erp/expedientes/${exp.id}`} className="w-7 h-7 bg-burgos-dark-2 border border-burgos-gray-800 hover:border-burgos-gold/30 rounded-lg flex items-center justify-center text-burgos-gray-400 hover:text-burgos-gold transition-all">
                        <Eye size={12} />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </motion.div>
      )}

      {tab === "turnos" && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-burgos-dark rounded-2xl border border-burgos-gray-800 overflow-hidden">
          {turnos.length === 0 ? (
            <div className="text-center py-12">
              <Calendar size={32} className="text-burgos-gray-800 mx-auto mb-2" />
              <p className="text-burgos-gray-600 text-sm">Sin turnos registrados.</p>
            </div>
          ) : (
            <div className="divide-y divide-burgos-gray-800/50">
              {turnos.map((t) => (
                <div key={t.id} className="px-5 py-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm text-burgos-white font-medium">{t.motivo || "Sin motivo"}</p>
                    <p className="text-xs text-burgos-gray-400 mt-0.5 flex items-center gap-2">
                      <Clock size={10} /> {t.fecha} · {t.hora?.slice(0, 5)}
                    </p>
                  </div>
                  <span className={`text-[9px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full ${estadoTurnoStyles[t.estado]}`}>{t.estado}</span>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      )}

      {tab === "honorarios" && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-burgos-dark rounded-2xl border border-burgos-gray-800 overflow-hidden">
          {honorarios.length === 0 ? (
            <div className="text-center py-12">
              <DollarSign size={32} className="text-burgos-gray-800 mx-auto mb-2" />
              <p className="text-burgos-gray-600 text-sm">Sin honorarios registrados.</p>
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-burgos-gray-800">
                  <th className="text-left px-5 py-3 text-[10px] uppercase tracking-wider text-burgos-gray-600 font-medium">Monto</th>
                  <th className="text-left px-5 py-3 text-[10px] uppercase tracking-wider text-burgos-gray-600 font-medium">Tipo</th>
                  <th className="text-left px-5 py-3 text-[10px] uppercase tracking-wider text-burgos-gray-600 font-medium">Estado</th>
                  <th className="text-left px-5 py-3 text-[10px] uppercase tracking-wider text-burgos-gray-600 font-medium hidden sm:table-cell">Fecha</th>
                </tr>
              </thead>
              <tbody>
                {honorarios.map((h) => (
                  <tr key={h.id} className="border-b border-burgos-gray-800/50">
                    <td className="px-5 py-3 text-sm text-burgos-white font-mono font-medium">${Number(h.monto).toLocaleString()}</td>
                    <td className="px-5 py-3 text-sm text-burgos-gray-400 capitalize">{h.tipo.replace("_", " ")}</td>
                    <td className="px-5 py-3">
                      <span className={`text-[9px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full ${estadoHonStyles[h.estado]}`}>{h.estado}</span>
                    </td>
                    <td className="px-5 py-3 hidden sm:table-cell text-xs text-burgos-gray-600">{new Date(h.creado_en).toLocaleDateString("es-AR")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </motion.div>
      )}

      {/* Info footer */}
      <div className="bg-burgos-dark rounded-xl border border-burgos-gray-800 p-4">
        <div className="flex items-center justify-between text-xs text-burgos-gray-500">
          <span>Cliente desde: {new Date(cliente.creado_en).toLocaleDateString("es-AR", { day: "numeric", month: "long", year: "numeric" })}</span>
          <span>{mensajesCount} mensajes intercambiados</span>
        </div>
      </div>
    </div>
  );
}
