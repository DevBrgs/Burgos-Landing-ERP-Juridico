"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { DollarSign, Plus, X, TrendingUp, AlertCircle, Clock } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface Honorario {
  id: string;
  monto: number;
  tipo: string;
  estado: string;
  fecha_factura: string | null;
  fecha_cobro: string | null;
  notas: string | null;
  expediente_id: string;
  creado_en: string;
}

const estadoStyles: Record<string, string> = {
  pendiente: "bg-amber-500/10 text-amber-400",
  facturado: "bg-blue-500/10 text-blue-400",
  cobrado: "bg-green-500/10 text-green-400",
  en_mora: "bg-red-500/10 text-red-400",
};

const tipoLabels: Record<string, string> = {
  regulacion: "Regulación",
  pactado: "Pactado",
  cuota_litis: "Cuota litis",
  otro: "Otro",
};

export default function HonorariosPage() {
  const [honorarios, setHonorarios] = useState<Honorario[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showFacturarHoras, setShowFacturarHoras] = useState(false);
  const supabase = createClient();

  const fetchHonorarios = async () => {
    const { data } = await supabase
      .from("honorarios")
      .select("*")
      .order("creado_en", { ascending: false });
    if (data) setHonorarios(data);
    setLoading(false);
  };

  useEffect(() => { fetchHonorarios(); }, []);

  const updateEstado = async (id: string, estado: string) => {
    const updates: Record<string, unknown> = { estado };
    if (estado === "cobrado") updates.fecha_cobro = new Date().toISOString().split("T")[0];
    if (estado === "facturado") updates.fecha_factura = new Date().toISOString().split("T")[0];
    await supabase.from("honorarios").update(updates).eq("id", id);
    fetchHonorarios();
  };

  const totalPendiente = honorarios.filter(h => h.estado === "pendiente" || h.estado === "en_mora").reduce((sum, h) => sum + Number(h.monto), 0);
  const totalCobrado = honorarios.filter(h => h.estado === "cobrado").reduce((sum, h) => sum + Number(h.monto), 0);
  const totalFacturado = honorarios.filter(h => h.estado === "facturado").reduce((sum, h) => sum + Number(h.monto), 0);

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-burgos-white flex items-center gap-2">
            <DollarSign size={24} className="text-burgos-gold" />
            Honorarios
          </h1>
          <p className="text-burgos-gray-400 text-sm mt-1">Gestión de cobros y facturación</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => setShowFacturarHoras(true)} className="inline-flex items-center gap-2 bg-burgos-dark border border-burgos-gray-800 hover:border-burgos-gold/30 text-burgos-white px-5 py-2.5 rounded-xl font-medium text-sm transition-all duration-300">
            <TrendingUp size={16} /> Facturar Horas
          </button>
          <button onClick={() => setShowModal(true)} className="inline-flex items-center gap-2 bg-burgos-gold hover:bg-burgos-gold-light text-burgos-black px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300">
            <Plus size={16} /> Nuevo Honorario
          </button>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-burgos-dark rounded-xl border border-burgos-gray-800 p-5">
          <p className="text-[10px] uppercase tracking-wider text-burgos-gray-600 mb-1">Cobrado</p>
          <p className="text-xl font-bold text-green-400">${totalCobrado.toLocaleString()}</p>
        </div>
        <div className="bg-burgos-dark rounded-xl border border-burgos-gray-800 p-5">
          <p className="text-[10px] uppercase tracking-wider text-burgos-gray-600 mb-1">Facturado (por cobrar)</p>
          <p className="text-xl font-bold text-blue-400">${totalFacturado.toLocaleString()}</p>
        </div>
        <div className="bg-burgos-dark rounded-xl border border-burgos-gray-800 p-5">
          <p className="text-[10px] uppercase tracking-wider text-burgos-gray-600 mb-1">Pendiente / En mora</p>
          <p className="text-xl font-bold text-amber-400">${totalPendiente.toLocaleString()}</p>
        </div>
      </div>

      {/* List */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-burgos-dark rounded-2xl border border-burgos-gray-800 overflow-hidden">
        {loading ? (
          <div className="text-center py-12"><div className="w-8 h-8 border-2 border-burgos-gold/30 border-t-burgos-gold rounded-full animate-spin mx-auto" /></div>
        ) : honorarios.length === 0 ? (
          <div className="text-center py-12"><p className="text-burgos-gray-600 text-sm">No hay honorarios registrados.</p></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-burgos-gray-800">
                  <th className="text-left px-5 py-3 text-[10px] uppercase tracking-wider text-burgos-gray-600 font-medium">Monto</th>
                  <th className="text-left px-5 py-3 text-[10px] uppercase tracking-wider text-burgos-gray-600 font-medium">Tipo</th>
                  <th className="text-left px-5 py-3 text-[10px] uppercase tracking-wider text-burgos-gray-600 font-medium">Estado</th>
                  <th className="text-left px-5 py-3 text-[10px] uppercase tracking-wider text-burgos-gray-600 font-medium hidden sm:table-cell">Notas</th>
                  <th className="px-5 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {honorarios.map((h) => (
                  <tr key={h.id} className="border-b border-burgos-gray-800/50 hover:bg-burgos-dark-2 transition-colors">
                    <td className="px-5 py-4 text-sm text-burgos-white font-bold">${Number(h.monto).toLocaleString()}</td>
                    <td className="px-5 py-4 text-sm text-burgos-gray-400">{tipoLabels[h.tipo]}</td>
                    <td className="px-5 py-4">
                      <span className={`text-[9px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full ${estadoStyles[h.estado]}`}>{h.estado}</span>
                    </td>
                    <td className="px-5 py-4 text-xs text-burgos-gray-600 hidden sm:table-cell">{h.notas || "—"}</td>
                    <td className="px-5 py-4">
                      <select
                        value={h.estado}
                        onChange={(e) => updateEstado(h.id, e.target.value)}
                        className="text-[10px] bg-burgos-dark-2 border border-burgos-gray-800 rounded-lg px-2 py-1 text-burgos-white appearance-none"
                      >
                        <option value="pendiente">Pendiente</option>
                        <option value="facturado">Facturado</option>
                        <option value="cobrado">Cobrado</option>
                        <option value="en_mora">En mora</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>

      {showModal && <NuevoHonorarioModal onClose={() => setShowModal(false)} onSuccess={() => { setShowModal(false); fetchHonorarios(); }} />}
      {showFacturarHoras && <FacturarHorasModal onClose={() => setShowFacturarHoras(false)} onSuccess={() => { setShowFacturarHoras(false); fetchHonorarios(); }} />}
    </div>
  );
}

function NuevoHonorarioModal({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {
  const [form, setForm] = useState({ monto: "", tipo: "pactado", notas: "", expediente_id: "" });
  const [expedientes, setExpedientes] = useState<{ id: string; caratula: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase.from("expedientes").select("id, caratula").eq("estado", "activo");
      if (data) setExpedientes(data);
    };
    fetch();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.expediente_id) { alert("Seleccioná un expediente"); return; }
    setLoading(true);

    await supabase.from("honorarios").insert({
      expediente_id: form.expediente_id,
      monto: parseFloat(form.monto),
      tipo: form.tipo,
      notas: form.notas || null,
    });

    setLoading(false);
    onSuccess();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="relative bg-burgos-dark rounded-2xl border border-burgos-gray-800 p-6 sm:p-8 w-full max-w-md">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-burgos-white">Nuevo Honorario</h2>
          <button onClick={onClose} className="text-burgos-gray-600 hover:text-burgos-white"><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-[10px] uppercase tracking-wider text-burgos-gray-600 font-medium mb-1.5 block">Expediente</label>
            <select required value={form.expediente_id} onChange={(e) => setForm({ ...form, expediente_id: e.target.value })} className="w-full px-4 py-2.5 bg-burgos-black/50 border border-burgos-gray-800 rounded-xl text-burgos-white focus:outline-none focus:border-burgos-gold/40 text-sm appearance-none">
              <option value="" className="bg-burgos-dark">Seleccionar expediente</option>
              {expedientes.map((exp) => <option key={exp.id} value={exp.id} className="bg-burgos-dark">{exp.caratula}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] uppercase tracking-wider text-burgos-gray-600 font-medium mb-1.5 block">Monto ($)</label>
              <input type="number" required min="0" step="0.01" value={form.monto} onChange={(e) => setForm({ ...form, monto: e.target.value })} placeholder="150000" className="w-full px-4 py-2.5 bg-burgos-black/50 border border-burgos-gray-800 rounded-xl text-burgos-white placeholder:text-burgos-gray-600 focus:outline-none focus:border-burgos-gold/40 text-sm" />
            </div>
            <div>
              <label className="text-[10px] uppercase tracking-wider text-burgos-gray-600 font-medium mb-1.5 block">Tipo</label>
              <select value={form.tipo} onChange={(e) => setForm({ ...form, tipo: e.target.value })} className="w-full px-3 py-2.5 bg-burgos-black/50 border border-burgos-gray-800 rounded-xl text-burgos-white focus:outline-none focus:border-burgos-gold/40 text-sm appearance-none">
                <option value="pactado" className="bg-burgos-dark">Pactado</option>
                <option value="regulacion" className="bg-burgos-dark">Regulación</option>
                <option value="cuota_litis" className="bg-burgos-dark">Cuota litis</option>
                <option value="otro" className="bg-burgos-dark">Otro</option>
              </select>
            </div>
          </div>
          <div>
            <label className="text-[10px] uppercase tracking-wider text-burgos-gray-600 font-medium mb-1.5 block">Notas</label>
            <input type="text" value={form.notas} onChange={(e) => setForm({ ...form, notas: e.target.value })} placeholder="Detalle del honorario..." className="w-full px-4 py-2.5 bg-burgos-black/50 border border-burgos-gray-800 rounded-xl text-burgos-white placeholder:text-burgos-gray-600 focus:outline-none focus:border-burgos-gold/40 text-sm" />
          </div>
          <button type="submit" disabled={loading} className="w-full bg-burgos-gold hover:bg-burgos-gold-light disabled:bg-burgos-gold/30 text-burgos-black py-3 rounded-xl font-semibold transition-all duration-300">
            {loading ? "Guardando..." : "Registrar Honorario"}
          </button>
        </form>
      </motion.div>
    </div>
  );
}

interface TimerWithExp {
  id: string;
  descripcion: string | null;
  duracion_minutos: number | null;
  inicio: string;
  expediente_id: string;
  expedientes?: { caratula: string } | null;
}

function FacturarHorasModal({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {
  const [timers, setTimers] = useState<TimerWithExp[]>([]);
  const [loading, setLoading] = useState(true);
  const [tarifa, setTarifa] = useState("15000");
  const [facturando, setFacturando] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    const fetchTimers = async () => {
      const { data } = await supabase
        .from("timers")
        .select("id, descripcion, duracion_minutos, inicio, expediente_id, expedientes(caratula)")
        .order("inicio", { ascending: false })
        .limit(50);
      if (data) setTimers(data as unknown as TimerWithExp[]);
      setLoading(false);
    };
    fetchTimers();
  }, []);

  // Group by expediente
  const grouped = timers.reduce((acc, t) => {
    const key = t.expediente_id;
    if (!acc[key]) acc[key] = { caratula: (t.expedientes as any)?.caratula || "Sin carátula", timers: [], totalMin: 0 };
    acc[key].timers.push(t);
    acc[key].totalMin += t.duracion_minutos || 0;
    return acc;
  }, {} as Record<string, { caratula: string; timers: TimerWithExp[]; totalMin: number }>);

  const facturarTodos = async () => {
    setFacturando(true);
    const tarifaNum = parseFloat(tarifa) || 0;

    for (const [expId, group] of Object.entries(grouped)) {
      const horas = group.totalMin / 60;
      const monto = Math.round(horas * tarifaNum);
      if (monto > 0) {
        await supabase.from("honorarios").insert({
          expediente_id: expId,
          monto,
          tipo: "pactado",
          notas: `Facturación por ${group.totalMin} min (${horas.toFixed(1)} hs) de trabajo`,
        });
      }
    }

    setFacturando(false);
    onSuccess();
  };

  const totalMinutos = Object.values(grouped).reduce((sum, g) => sum + g.totalMin, 0);
  const totalHoras = totalMinutos / 60;
  const montoTotal = Math.round(totalHoras * (parseFloat(tarifa) || 0));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="relative bg-burgos-dark rounded-2xl border border-burgos-gray-800 p-6 sm:p-8 w-full max-w-lg max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-burgos-white flex items-center gap-2">
            <Clock size={18} className="text-burgos-gold" />
            Facturar Horas
          </h2>
          <button onClick={onClose} className="text-burgos-gray-600 hover:text-burgos-white"><X size={20} /></button>
        </div>

        {loading ? (
          <div className="text-center py-8"><div className="w-8 h-8 border-2 border-burgos-gold/30 border-t-burgos-gold rounded-full animate-spin mx-auto" /></div>
        ) : Object.keys(grouped).length === 0 ? (
          <div className="text-center py-8">
            <p className="text-burgos-gray-600 text-sm">No hay horas registradas para facturar.</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="text-[10px] uppercase tracking-wider text-burgos-gray-600 font-medium mb-1.5 block">Tarifa por hora ($)</label>
              <input type="number" value={tarifa} onChange={(e) => setTarifa(e.target.value)} className="w-full px-4 py-2.5 bg-burgos-black/50 border border-burgos-gray-800 rounded-xl text-burgos-white focus:outline-none focus:border-burgos-gold/40 text-sm" />
            </div>

            <div className="space-y-2">
              {Object.entries(grouped).map(([expId, group]) => (
                <div key={expId} className="bg-burgos-dark-2 rounded-xl border border-burgos-gray-800 p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-burgos-white font-medium truncate max-w-[250px]">{group.caratula}</p>
                      <p className="text-[10px] text-burgos-gray-600">{group.timers.length} registros · {group.totalMin} min ({(group.totalMin / 60).toFixed(1)} hs)</p>
                    </div>
                    <span className="text-sm font-bold text-burgos-gold">${Math.round((group.totalMin / 60) * (parseFloat(tarifa) || 0)).toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-burgos-gold/5 border border-burgos-gold/20 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-burgos-gray-400">Total a facturar</p>
                  <p className="text-[10px] text-burgos-gray-600">{totalMinutos} min ({totalHoras.toFixed(1)} hs) × ${parseFloat(tarifa || "0").toLocaleString()}/h</p>
                </div>
                <p className="text-xl font-bold text-burgos-gold">${montoTotal.toLocaleString()}</p>
              </div>
            </div>

            <button onClick={facturarTodos} disabled={facturando || montoTotal <= 0} className="w-full bg-burgos-gold hover:bg-burgos-gold-light disabled:bg-burgos-gold/30 text-burgos-black py-3 rounded-xl font-semibold transition-all">
              {facturando ? "Generando honorarios..." : "Generar Honorarios"}
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}
