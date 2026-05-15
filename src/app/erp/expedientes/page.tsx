"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { FolderOpen, Plus, Search, Eye, X, Users, Globe, User } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

interface Expediente {
  id: string;
  caratula: string;
  numero: string | null;
  fuero: string | null;
  juzgado: string | null;
  estado: string;
  es_general: boolean;
  creado_en: string;
  abogado_id: string;
}

const estadoStyles: Record<string, string> = {
  activo: "bg-green-500/10 text-green-400 border-green-500/20",
  en_espera: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  cerrado: "bg-burgos-gray-600/10 text-burgos-gray-400 border-burgos-gray-600/20",
  archivado: "bg-blue-500/10 text-blue-400 border-blue-500/20",
};
const estadoLabels: Record<string, string> = { activo: "Activo", en_espera: "En espera", cerrado: "Cerrado", archivado: "Archivado" };

export default function ExpedientesPage() {
  const [expedientes, setExpedientes] = useState<Expediente[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtroEstado, setFiltroEstado] = useState("todos");
  const [busqueda, setBusqueda] = useState("");
  const [tab, setTab] = useState<"mis" | "generales">("mis");
  const [showModal, setShowModal] = useState(false);
  const [abogadoId, setAbogadoId] = useState<string | null>(null);
  const supabase = createClient();

  const fetchExpedientes = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setLoading(false); return; }
    const { data: abogado } = await supabase.from("abogados").select("id").eq("user_id", user.id).single();
    if (abogado) setAbogadoId(abogado.id);

    const { data } = await supabase.from("expedientes").select("*").order("creado_en", { ascending: false });
    if (data) setExpedientes(data);
    setLoading(false);
  };

  useEffect(() => { fetchExpedientes(); }, []);

  const misExp = expedientes.filter(e => !e.es_general && e.abogado_id === abogadoId);
  const generales = expedientes.filter(e => e.es_general);
  const currentList = tab === "mis" ? misExp : generales;

  const filtered = currentList.filter((exp) => {
    const matchEstado = filtroEstado === "todos" || exp.estado === filtroEstado;
    const matchBusqueda = busqueda === "" || exp.caratula.toLowerCase().includes(busqueda.toLowerCase()) || (exp.numero && exp.numero.includes(busqueda));
    return matchEstado && matchBusqueda;
  });

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-burgos-white flex items-center gap-2">
            <FolderOpen size={24} className="text-burgos-gold" />
            Expedientes
          </h1>
          <p className="text-burgos-gray-400 text-sm mt-1">{expedientes.length} en total · {misExp.length} personales · {generales.length} generales</p>
        </div>
        <button onClick={() => setShowModal(true)} className="inline-flex items-center gap-2 bg-burgos-gold hover:bg-burgos-gold-light text-burgos-black px-5 py-2.5 rounded-xl font-semibold text-sm transition-all">
          <Plus size={16} /> Nuevo Expediente
        </button>
      </motion.div>

      {/* Tabs */}
      <div className="flex gap-2">
        <button onClick={() => setTab("mis")} className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all border ${tab === "mis" ? "bg-burgos-gold/10 text-burgos-gold border-burgos-gold/30" : "text-burgos-gray-400 border-burgos-gray-800 hover:border-burgos-gray-600"}`}>
          <User size={14} /> Mis Expedientes ({misExp.length})
        </button>
        <button onClick={() => setTab("generales")} className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all border ${tab === "generales" ? "bg-burgos-gold/10 text-burgos-gold border-burgos-gold/30" : "text-burgos-gray-400 border-burgos-gray-800 hover:border-burgos-gray-600"}`}>
          <Globe size={14} /> Generales ({generales.length})
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-burgos-gray-600" />
          <input type="text" placeholder="Buscar por carátula o número..." value={busqueda} onChange={(e) => setBusqueda(e.target.value)} className="w-full pl-9 pr-4 py-2.5 bg-burgos-dark border border-burgos-gray-800 rounded-xl text-sm text-burgos-white placeholder:text-burgos-gray-600 focus:outline-none focus:border-burgos-gold/30" />
        </div>
        <div className="flex gap-2 flex-wrap">
          {["todos", "activo", "en_espera", "cerrado"].map((estado) => (
            <button key={estado} onClick={() => setFiltroEstado(estado)} className={`px-3 py-2 rounded-xl text-xs font-medium transition-all border ${filtroEstado === estado ? "bg-burgos-gold/10 text-burgos-gold border-burgos-gold/30" : "bg-burgos-dark text-burgos-gray-400 border-burgos-gray-800"}`}>
              {estado === "todos" ? "Todos" : estadoLabels[estado]}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-burgos-dark rounded-2xl border border-burgos-gray-800 overflow-hidden">
        {loading ? (
          <div className="text-center py-12"><div className="w-8 h-8 border-2 border-burgos-gold/30 border-t-burgos-gold rounded-full animate-spin mx-auto" /></div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12">
            <FolderOpen size={40} className="text-burgos-gray-800 mx-auto mb-3" />
            <p className="text-burgos-gray-600 text-sm">{tab === "mis" ? "No tenés expedientes personales." : "No hay expedientes generales."}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-burgos-gray-800">
                  <th className="text-left px-5 py-3 text-[10px] uppercase tracking-wider text-burgos-gray-600 font-medium">Carátula</th>
                  <th className="text-left px-5 py-3 text-[10px] uppercase tracking-wider text-burgos-gray-600 font-medium hidden md:table-cell">N°</th>
                  <th className="text-left px-5 py-3 text-[10px] uppercase tracking-wider text-burgos-gray-600 font-medium hidden lg:table-cell">Fuero</th>
                  <th className="text-left px-5 py-3 text-[10px] uppercase tracking-wider text-burgos-gray-600 font-medium">Estado</th>
                  <th className="px-5 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((exp) => (
                  <tr key={exp.id} className="border-b border-burgos-gray-800/50 hover:bg-burgos-dark-2 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        {exp.es_general && <Globe size={12} className="text-blue-400" />}
                        <div>
                          <p className="text-sm text-burgos-white font-medium line-clamp-2">{exp.caratula}</p>
                          {exp.juzgado && <p className="text-[10px] text-burgos-gray-600 mt-0.5">{exp.juzgado}</p>}
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 hidden md:table-cell"><span className="text-sm text-burgos-gray-400 font-mono">{exp.numero || "—"}</span></td>
                    <td className="px-5 py-4 hidden lg:table-cell"><span className="text-sm text-burgos-gray-400">{exp.fuero || "—"}</span></td>
                    <td className="px-5 py-4"><span className={`text-[9px] uppercase tracking-wider font-semibold px-2.5 py-1 rounded-full border ${estadoStyles[exp.estado]}`}>{estadoLabels[exp.estado]}</span></td>
                    <td className="px-5 py-4">
                      <Link href={`/erp/expedientes/${exp.id}`} className="w-8 h-8 bg-burgos-dark-2 border border-burgos-gray-800 hover:border-burgos-gold/30 rounded-lg flex items-center justify-center text-burgos-gray-400 hover:text-burgos-gold transition-all">
                        <Eye size={14} />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>

      {showModal && <NuevoExpedienteModal abogadoId={abogadoId} onClose={() => setShowModal(false)} onSuccess={() => { setShowModal(false); fetchExpedientes(); }} />}
    </div>
  );
}

function NuevoExpedienteModal({ abogadoId, onClose, onSuccess }: { abogadoId: string | null; onClose: () => void; onSuccess: () => void }) {
  const [form, setForm] = useState({ caratula: "", numero: "", fuero: "", juzgado: "", estado: "activo", notas_internas: "", es_general: false, cliente_id: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [conflictos, setConflictos] = useState<{ nombre: string; caratula: string }[]>([]);
  const [clientes, setClientes] = useState<{ id: string; nombre: string; dni: string }[]>([]);
  const supabase = createClient();

  // Fetch clientes for selector
  useEffect(() => {
    const fetchClientes = async () => {
      const { data } = await supabase.from("clientes").select("id, nombre, dni").eq("activo", true).order("nombre");
      if (data) setClientes(data);
    };
    fetchClientes();
  }, []);

  // Conflicto de intereses: parse carátula and search
  useEffect(() => {
    const checkConflictos = async () => {
      const caratula = form.caratula.trim();
      if (caratula.length < 5 || !caratula.includes("c/")) {
        setConflictos([]);
        return;
      }

      // Parse: "Actor c/ Demandado s/ Materia"
      const partes: string[] = [];
      const beforeC = caratula.split("c/")[0].trim();
      const afterC = caratula.split("c/").slice(1).join("c/");
      const demandado = afterC.split("s/")[0].trim();

      if (beforeC) partes.push(beforeC);
      if (demandado) partes.push(demandado);

      if (partes.length === 0) { setConflictos([]); return; }

      const found: { nombre: string; caratula: string }[] = [];

      for (const parte of partes) {
        // Search for this name in existing expedientes
        const { data } = await supabase
          .from("expedientes")
          .select("caratula")
          .ilike("caratula", `%${parte}%`)
          .limit(5);

        if (data && data.length > 0) {
          data.forEach((exp) => {
            // Don't flag if it's the same caratula being typed
            if (exp.caratula.toLowerCase() !== caratula.toLowerCase()) {
              found.push({ nombre: parte, caratula: exp.caratula });
            }
          });
        }
      }

      setConflictos(found);
    };

    const timeout = setTimeout(checkConflictos, 500);
    return () => clearTimeout(timeout);
  }, [form.caratula]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!abogadoId) { setError("No autenticado"); return; }
    setError("");
    setLoading(true);

    const { error: insertError } = await supabase.from("expedientes").insert({
      caratula: form.caratula,
      numero: form.numero || null,
      fuero: form.fuero || null,
      juzgado: form.juzgado || null,
      estado: form.estado,
      notas_internas: form.notas_internas || null,
      abogado_id: abogadoId,
      es_general: form.es_general,
      cliente_id: form.cliente_id || null,
    });

    if (insertError) { setError(insertError.message); setLoading(false); return; }
    setLoading(false);
    onSuccess();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="relative bg-burgos-dark rounded-2xl border border-burgos-gray-800 p-6 sm:p-8 w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-burgos-white">Nuevo Expediente</h2>
          <button onClick={onClose} className="text-burgos-gray-600 hover:text-burgos-white"><X size={20} /></button>
        </div>
        {error && <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-4 py-3 rounded-xl mb-4">{error}</div>}

        {/* Conflicto de intereses warning */}
        {conflictos.length > 0 && (
          <div className="bg-amber-500/10 border border-amber-500/20 text-amber-400 text-sm px-4 py-3 rounded-xl mb-4">
            <p className="font-semibold flex items-center gap-1 mb-1">⚠️ Posible conflicto de intereses</p>
            {conflictos.slice(0, 3).map((c, i) => (
              <p key={i} className="text-xs text-amber-300/80 mt-0.5">
                &quot;{c.nombre}&quot; aparece en: <span className="text-amber-200">{c.caratula}</span>
              </p>
            ))}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-[10px] uppercase tracking-wider text-burgos-gray-600 font-medium mb-1.5 block">Carátula *</label>
            <input type="text" required value={form.caratula} onChange={(e) => setForm({ ...form, caratula: e.target.value })} placeholder="García, Juan c/ López, María s/ Daños y Perjuicios" className="w-full px-4 py-2.5 bg-burgos-black/50 border border-burgos-gray-800 rounded-xl text-burgos-white placeholder:text-burgos-gray-600 focus:outline-none focus:border-burgos-gold/40 text-sm" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] uppercase tracking-wider text-burgos-gray-600 font-medium mb-1.5 block">N° Expediente</label>
              <input type="text" value={form.numero} onChange={(e) => setForm({ ...form, numero: e.target.value })} placeholder="45.231/2024" className="w-full px-3 py-2.5 bg-burgos-black/50 border border-burgos-gray-800 rounded-xl text-burgos-white placeholder:text-burgos-gray-600 focus:outline-none focus:border-burgos-gold/40 text-sm" />
            </div>
            <div>
              <label className="text-[10px] uppercase tracking-wider text-burgos-gray-600 font-medium mb-1.5 block">Fuero</label>
              <select value={form.fuero} onChange={(e) => setForm({ ...form, fuero: e.target.value })} className="w-full px-3 py-2.5 bg-burgos-black/50 border border-burgos-gray-800 rounded-xl text-burgos-white focus:outline-none focus:border-burgos-gold/40 text-sm appearance-none">
                <option value="" className="bg-burgos-dark">Seleccionar</option>
                <option value="Civil" className="bg-burgos-dark">Civil</option>
                <option value="Comercial" className="bg-burgos-dark">Comercial</option>
                <option value="Laboral" className="bg-burgos-dark">Laboral</option>
                <option value="Penal" className="bg-burgos-dark">Penal</option>
                <option value="Familia" className="bg-burgos-dark">Familia</option>
                <option value="Administrativo" className="bg-burgos-dark">Administrativo</option>
                <option value="Federal" className="bg-burgos-dark">Federal</option>
              </select>
            </div>
          </div>
          <div>
            <label className="text-[10px] uppercase tracking-wider text-burgos-gray-600 font-medium mb-1.5 block">Juzgado</label>
            <input type="text" value={form.juzgado} onChange={(e) => setForm({ ...form, juzgado: e.target.value })} placeholder="Juzgado Civil N° 45" className="w-full px-4 py-2.5 bg-burgos-black/50 border border-burgos-gray-800 rounded-xl text-burgos-white placeholder:text-burgos-gray-600 focus:outline-none focus:border-burgos-gold/40 text-sm" />
          </div>
          <div>
            <label className="text-[10px] uppercase tracking-wider text-burgos-gray-600 font-medium mb-1.5 block">Cliente vinculado</label>
            <select value={form.cliente_id} onChange={(e) => setForm({ ...form, cliente_id: e.target.value })} className="w-full px-4 py-2.5 bg-burgos-black/50 border border-burgos-gray-800 rounded-xl text-burgos-white focus:outline-none focus:border-burgos-gold/40 text-sm appearance-none">
              <option value="" className="bg-burgos-dark">Sin cliente (opcional)</option>
              {clientes.map((c) => <option key={c.id} value={c.id} className="bg-burgos-dark">{c.nombre} — DNI: {c.dni}</option>)}
            </select>
            <p className="text-[10px] text-burgos-gray-600 mt-1">Vinculá un cliente para que vea este expediente desde su portal.</p>
          </div>
          <div>
            <label className="text-[10px] uppercase tracking-wider text-burgos-gray-600 font-medium mb-1.5 block">Notas internas</label>
            <textarea value={form.notas_internas} onChange={(e) => setForm({ ...form, notas_internas: e.target.value })} rows={2} placeholder="Notas privadas..." className="w-full px-4 py-2.5 bg-burgos-black/50 border border-burgos-gray-800 rounded-xl text-burgos-white placeholder:text-burgos-gray-600 focus:outline-none focus:border-burgos-gold/40 text-sm resize-none" />
          </div>
          {/* General toggle */}
          <label className="flex items-center gap-3 p-3 bg-burgos-dark-2 rounded-xl border border-burgos-gray-800 cursor-pointer hover:border-burgos-gold/20 transition-colors">
            <input type="checkbox" checked={form.es_general} onChange={(e) => setForm({ ...form, es_general: e.target.checked })} className="w-4 h-4 accent-[#c9a84c] rounded" />
            <div>
              <p className="text-sm text-burgos-white">Expediente general</p>
              <p className="text-[10px] text-burgos-gray-600">Visible para todos los abogados del estudio</p>
            </div>
          </label>
          <button type="submit" disabled={loading} className="w-full bg-burgos-gold hover:bg-burgos-gold-light disabled:bg-burgos-gold/30 text-burgos-black py-3 rounded-xl font-semibold transition-all">
            {loading ? "Creando..." : "Crear Expediente"}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
