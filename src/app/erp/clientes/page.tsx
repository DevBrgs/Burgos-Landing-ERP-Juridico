"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Users, Plus, Search, X, Key, Copy, Check, Pencil, Trash2 } from "lucide-react";
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

export default function ClientesPage() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showMasivoModal, setShowMasivoModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState<Cliente | null>(null);
  const [busqueda, setBusqueda] = useState("");
  const supabase = createClient();

  const fetchClientes = async () => {
    const { data } = await supabase
      .from("clientes")
      .select("*")
      .order("creado_en", { ascending: false });
    if (data) setClientes(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchClientes();
  }, []);

  const handleDelete = async (cliente: Cliente) => {
    if (!confirm(`¿Eliminar al cliente "${cliente.nombre}"? Esta acción no se puede deshacer.`)) return;
    await supabase.from("clientes").delete().eq("id", cliente.id);
    fetchClientes();
  };

  const filtered = clientes.filter(
    (c) =>
      busqueda === "" ||
      c.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      c.dni.includes(busqueda)
  );

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl font-bold text-burgos-white flex items-center gap-2">
            <Users size={24} className="text-burgos-gold" />
            Clientes
          </h1>
          <p className="text-burgos-gray-400 text-sm mt-1">
            {clientes.length} clientes registrados
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setShowMasivoModal(true)}
            className="inline-flex items-center gap-2 bg-burgos-dark border border-burgos-gray-800 hover:border-burgos-gold/30 text-burgos-white px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300"
          >
            <Key size={16} />
            Claves masivas
          </button>
          <button
            onClick={() => setShowModal(true)}
            className="inline-flex items-center gap-2 bg-burgos-gold hover:bg-burgos-gold-light text-burgos-black px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300"
          >
            <Plus size={16} />
            Nuevo Cliente
          </button>
        </div>
      </motion.div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-burgos-gray-600" />
        <input
          type="text"
          placeholder="Buscar por nombre o DNI..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 bg-burgos-dark border border-burgos-gray-800 rounded-xl text-sm text-burgos-white placeholder:text-burgos-gray-600 focus:outline-none focus:border-burgos-gold/30 transition-colors"
        />
      </div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-burgos-dark rounded-2xl border border-burgos-gray-800 overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-burgos-gray-800">
                <th className="text-left px-5 py-3 text-[10px] uppercase tracking-wider text-burgos-gray-600 font-medium">Nombre</th>
                <th className="text-left px-5 py-3 text-[10px] uppercase tracking-wider text-burgos-gray-600 font-medium">DNI</th>
                <th className="text-left px-5 py-3 text-[10px] uppercase tracking-wider text-burgos-gray-600 font-medium hidden sm:table-cell">Email</th>
                <th className="text-left px-5 py-3 text-[10px] uppercase tracking-wider text-burgos-gray-600 font-medium hidden md:table-cell">Teléfono</th>
                <th className="text-left px-5 py-3 text-[10px] uppercase tracking-wider text-burgos-gray-600 font-medium">Estado</th>
                <th className="text-right px-5 py-3 text-[10px] uppercase tracking-wider text-burgos-gray-600 font-medium">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((cliente) => (
                <tr key={cliente.id} className="border-b border-burgos-gray-800/50 hover:bg-burgos-dark-2 transition-colors">
                  <td className="px-5 py-4 text-sm text-burgos-white font-medium">{cliente.nombre}</td>
                  <td className="px-5 py-4 text-sm text-burgos-gray-400 font-mono">{cliente.dni}</td>
                  <td className="px-5 py-4 text-sm text-burgos-gray-400 hidden sm:table-cell">{cliente.email || "—"}</td>
                  <td className="px-5 py-4 text-sm text-burgos-gray-400 hidden md:table-cell">{cliente.telefono || "—"}</td>
                  <td className="px-5 py-4">
                    <span className={`text-[9px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full ${cliente.activo ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"}`}>
                      {cliente.activo ? "Activo" : "Inactivo"}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setShowEditModal(cliente)}
                        className="w-7 h-7 bg-burgos-dark-2 border border-burgos-gray-800 rounded-lg flex items-center justify-center text-burgos-gray-400 hover:text-burgos-gold hover:border-burgos-gold/30 transition-all"
                        title="Editar"
                      >
                        <Pencil size={12} />
                      </button>
                      <button
                        onClick={() => handleDelete(cliente)}
                        className="w-7 h-7 bg-burgos-dark-2 border border-burgos-gray-800 rounded-lg flex items-center justify-center text-burgos-gray-400 hover:text-red-400 hover:border-red-500/30 transition-all"
                        title="Eliminar"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {!loading && filtered.length === 0 && (
          <div className="text-center py-12">
            <p className="text-burgos-gray-600 text-sm">No se encontraron clientes.</p>
          </div>
        )}
      </motion.div>

      {showModal && (
        <NuevoClienteModal onClose={() => setShowModal(false)} onSuccess={() => { setShowModal(false); fetchClientes(); }} />
      )}

      {showEditModal && (
        <EditarClienteModal cliente={showEditModal} onClose={() => setShowEditModal(null)} onSuccess={() => { setShowEditModal(null); fetchClientes(); }} />
      )}

      {showMasivoModal && (
        <ClavesMasivasModal onClose={() => setShowMasivoModal(false)} onSuccess={() => { setShowMasivoModal(false); fetchClientes(); }} />
      )}
    </div>
  );
}

function NuevoClienteModal({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {
  const [form, setForm] = useState({ nombre: "", dni: "", email: "", telefono: "" });
  const [clave, setClave] = useState("");
  const [clavePersonalizada, setClavePersonalizada] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const supabase = createClient();

  // Generar clave aleatoria
  const generarClave = () => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789";
    let result = "";
    for (let i = 0; i < 8; i++) result += chars.charAt(Math.floor(Math.random() * chars.length));
    setClave(result);
  };

  useEffect(() => { generarClave(); }, []);

  const copiarClave = () => {
    navigator.clipboard.writeText(clave);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!clave || clave.length < 4) { setError("La clave debe tener al menos 4 caracteres"); return; }
    setLoading(true);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { data: abogado } = await supabase.from("abogados").select("id").eq("user_id", user.id).single();
    if (!abogado) return;

    const { error: insertError } = await supabase.from("clientes").insert({
      nombre: form.nombre,
      dni: form.dni,
      email: form.email || null,
      telefono: form.telefono || null,
      clave_hash: clave,
      abogado_id: abogado.id,
    });

    if (insertError) {
      if (insertError.message.includes("duplicate")) {
        setError("Ya existe un cliente con ese DNI");
      } else {
        setError(insertError.message);
      }
      setLoading(false);
      return;
    }

    setLoading(false);
    onSuccess();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="relative bg-burgos-dark rounded-2xl border border-burgos-gray-800 p-6 sm:p-8 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-burgos-white">Nuevo Cliente</h2>
          <button onClick={onClose} className="text-burgos-gray-600 hover:text-burgos-white"><X size={20} /></button>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-4 py-3 rounded-xl mb-4">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-[10px] uppercase tracking-wider text-burgos-gray-600 font-medium mb-1.5 block">Nombre completo</label>
            <input type="text" required value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} placeholder="Juan Pérez" className="w-full px-4 py-2.5 bg-burgos-black/50 border border-burgos-gray-800 rounded-xl text-burgos-white placeholder:text-burgos-gray-600 focus:outline-none focus:border-burgos-gold/40 text-sm" />
          </div>
          <div>
            <label className="text-[10px] uppercase tracking-wider text-burgos-gray-600 font-medium mb-1.5 block">DNI</label>
            <input type="text" required value={form.dni} onChange={(e) => setForm({ ...form, dni: e.target.value })} placeholder="12345678" className="w-full px-4 py-2.5 bg-burgos-black/50 border border-burgos-gray-800 rounded-xl text-burgos-white placeholder:text-burgos-gray-600 focus:outline-none focus:border-burgos-gold/40 text-sm" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] uppercase tracking-wider text-burgos-gray-600 font-medium mb-1.5 block">Email</label>
              <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="opcional" className="w-full px-3 py-2.5 bg-burgos-black/50 border border-burgos-gray-800 rounded-xl text-burgos-white placeholder:text-burgos-gray-600 focus:outline-none focus:border-burgos-gold/40 text-sm" />
            </div>
            <div>
              <label className="text-[10px] uppercase tracking-wider text-burgos-gray-600 font-medium mb-1.5 block">Teléfono</label>
              <input type="tel" value={form.telefono} onChange={(e) => setForm({ ...form, telefono: e.target.value })} placeholder="opcional" className="w-full px-3 py-2.5 bg-burgos-black/50 border border-burgos-gray-800 rounded-xl text-burgos-white placeholder:text-burgos-gray-600 focus:outline-none focus:border-burgos-gold/40 text-sm" />
            </div>
          </div>

          {/* Clave section */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-[10px] uppercase tracking-wider text-burgos-gray-600 font-medium flex items-center gap-1">
                <Key size={10} />
                Clave de acceso al portal
              </label>
              <button
                type="button"
                onClick={() => { setClavePersonalizada(!clavePersonalizada); if (clavePersonalizada) generarClave(); }}
                className="text-[10px] text-burgos-gold hover:text-burgos-gold-light transition-colors"
              >
                {clavePersonalizada ? "Generar automática" : "Usar clave personalizada"}
              </button>
            </div>

            {clavePersonalizada ? (
              <input
                type="text"
                value={clave}
                onChange={(e) => setClave(e.target.value)}
                placeholder="Escribir clave personalizada..."
                className="w-full px-4 py-2.5 bg-burgos-black/50 border border-burgos-gray-800 rounded-xl text-burgos-white placeholder:text-burgos-gray-600 focus:outline-none focus:border-burgos-gold/40 text-sm font-mono"
              />
            ) : (
              <div className="flex gap-2">
                <div className="flex-1 px-4 py-2.5 bg-burgos-black/50 border border-burgos-gold/20 rounded-xl text-burgos-gold font-mono text-sm">
                  {clave}
                </div>
                <button type="button" onClick={copiarClave} className="w-10 bg-burgos-dark-2 border border-burgos-gray-800 rounded-xl flex items-center justify-center text-burgos-gray-400 hover:text-burgos-gold transition-colors">
                  {copied ? <Check size={14} /> : <Copy size={14} />}
                </button>
                <button type="button" onClick={generarClave} className="px-3 bg-burgos-dark-2 border border-burgos-gray-800 rounded-xl text-[10px] text-burgos-gray-400 hover:text-burgos-gold transition-colors">
                  Nueva
                </button>
              </div>
            )}
            <p className="text-[10px] text-burgos-gray-600 mt-1">
              Compartí esta clave con el cliente. La usará para ingresar al portal.
            </p>
          </div>

          <button type="submit" disabled={loading} className="w-full bg-burgos-gold hover:bg-burgos-gold-light disabled:bg-burgos-gold/30 text-burgos-black py-3 rounded-xl font-semibold transition-all duration-300">
            {loading ? "Creando..." : "Crear Cliente"}
          </button>
        </form>
      </motion.div>
    </div>
  );
}

function EditarClienteModal({ cliente, onClose, onSuccess }: { cliente: Cliente; onClose: () => void; onSuccess: () => void }) {
  const [form, setForm] = useState({ nombre: cliente.nombre, email: cliente.email || "", telefono: cliente.telefono || "" });
  const [resetClave, setResetClave] = useState(false);
  const [nuevaClave, setNuevaClave] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const supabase = createClient();

  const generarClave = () => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789";
    let result = "";
    for (let i = 0; i < 8; i++) result += chars.charAt(Math.floor(Math.random() * chars.length));
    setNuevaClave(result);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const updates: Record<string, unknown> = {
      nombre: form.nombre,
      email: form.email || null,
      telefono: form.telefono || null,
    };

    if (resetClave && nuevaClave) {
      updates.clave_hash = nuevaClave;
      updates.primer_ingreso = true;
    }

    const { error: updateError } = await supabase.from("clientes").update(updates).eq("id", cliente.id);

    if (updateError) {
      setError(updateError.message);
      setLoading(false);
      return;
    }

    setLoading(false);
    onSuccess();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="relative bg-burgos-dark rounded-2xl border border-burgos-gray-800 p-6 sm:p-8 w-full max-w-md">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-burgos-white">Editar Cliente</h2>
          <button onClick={onClose} className="text-burgos-gray-600 hover:text-burgos-white"><X size={20} /></button>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-4 py-3 rounded-xl mb-4">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-[10px] uppercase tracking-wider text-burgos-gray-600 font-medium mb-1.5 block">Nombre completo</label>
            <input type="text" required value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} className="w-full px-4 py-2.5 bg-burgos-black/50 border border-burgos-gray-800 rounded-xl text-burgos-white focus:outline-none focus:border-burgos-gold/40 text-sm" />
          </div>
          <div>
            <label className="text-[10px] uppercase tracking-wider text-burgos-gray-600 font-medium mb-1.5 block">DNI (no editable)</label>
            <input type="text" disabled value={cliente.dni} className="w-full px-4 py-2.5 bg-burgos-black/30 border border-burgos-gray-800 rounded-xl text-burgos-gray-400 text-sm cursor-not-allowed" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] uppercase tracking-wider text-burgos-gray-600 font-medium mb-1.5 block">Email</label>
              <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="opcional" className="w-full px-3 py-2.5 bg-burgos-black/50 border border-burgos-gray-800 rounded-xl text-burgos-white placeholder:text-burgos-gray-600 focus:outline-none focus:border-burgos-gold/40 text-sm" />
            </div>
            <div>
              <label className="text-[10px] uppercase tracking-wider text-burgos-gray-600 font-medium mb-1.5 block">Teléfono</label>
              <input type="tel" value={form.telefono} onChange={(e) => setForm({ ...form, telefono: e.target.value })} placeholder="opcional" className="w-full px-3 py-2.5 bg-burgos-black/50 border border-burgos-gray-800 rounded-xl text-burgos-white placeholder:text-burgos-gray-600 focus:outline-none focus:border-burgos-gold/40 text-sm" />
            </div>
          </div>

          {/* Reset clave */}
          <div className="border border-burgos-gray-800 rounded-xl p-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={resetClave}
                onChange={(e) => { setResetClave(e.target.checked); if (e.target.checked) generarClave(); }}
                className="w-4 h-4 rounded border-burgos-gray-800 bg-burgos-black/50 text-burgos-gold focus:ring-burgos-gold/30"
              />
              <span className="text-xs text-burgos-gray-400">Resetear clave de acceso</span>
            </label>
            {resetClave && (
              <div className="mt-3 flex gap-2">
                <input
                  type="text"
                  value={nuevaClave}
                  onChange={(e) => setNuevaClave(e.target.value)}
                  className="flex-1 px-3 py-2 bg-burgos-black/50 border border-burgos-gold/20 rounded-lg text-burgos-gold font-mono text-sm focus:outline-none"
                />
                <button type="button" onClick={generarClave} className="px-3 bg-burgos-dark-2 border border-burgos-gray-800 rounded-lg text-[10px] text-burgos-gray-400 hover:text-burgos-gold transition-colors">
                  Nueva
                </button>
              </div>
            )}
          </div>

          <button type="submit" disabled={loading} className="w-full bg-burgos-gold hover:bg-burgos-gold-light disabled:bg-burgos-gold/30 text-burgos-black py-3 rounded-xl font-semibold transition-all duration-300">
            {loading ? "Guardando..." : "Guardar Cambios"}
          </button>
        </form>
      </motion.div>
    </div>
  );
}

function ClavesMasivasModal({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {
  const [dnis, setDnis] = useState("");
  const [loading, setLoading] = useState(false);
  const [resultados, setResultados] = useState<{ dni: string; clave: string; error?: string }[]>([]);
  const [copied, setCopied] = useState(false);
  const supabase = createClient();

  const generarClave = () => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789";
    let result = "";
    for (let i = 0; i < 8; i++) result += chars.charAt(Math.floor(Math.random() * chars.length));
    return result;
  };

  const handleGenerar = async () => {
    const listaDnis = dnis
      .split("\n")
      .map((d) => d.trim())
      .filter((d) => d.length > 0);

    if (listaDnis.length === 0) return;
    setLoading(true);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { data: abogado } = await supabase.from("abogados").select("id").eq("user_id", user.id).single();
    if (!abogado) return;

    const results: { dni: string; clave: string; error?: string }[] = [];

    for (const dni of listaDnis) {
      const clave = generarClave();
      const { error } = await supabase.from("clientes").insert({
        nombre: `Cliente ${dni}`,
        dni,
        clave_hash: clave,
        abogado_id: abogado.id,
      });

      if (error) {
        results.push({ dni, clave: "", error: error.message.includes("duplicate") ? "DNI duplicado" : error.message });
      } else {
        results.push({ dni, clave });
      }
    }

    setResultados(results);
    setLoading(false);
  };

  const copiarResultados = () => {
    const text = resultados
      .filter((r) => !r.error)
      .map((r) => `DNI: ${r.dni} | Clave: ${r.clave}`)
      .join("\n");
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative bg-burgos-dark rounded-2xl border border-burgos-gray-800 p-6 sm:p-8 w-full max-w-lg max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-burgos-white flex items-center gap-2">
            <Key size={18} className="text-burgos-gold" />
            Generación Masiva de Claves
          </h2>
          <button onClick={onClose} className="text-burgos-gray-600 hover:text-burgos-white">
            <X size={20} />
          </button>
        </div>

        {resultados.length === 0 ? (
          <div className="space-y-4">
            <div>
              <label className="text-[10px] uppercase tracking-wider text-burgos-gray-600 font-medium mb-1.5 block">
                DNIs (uno por línea)
              </label>
              <textarea
                value={dnis}
                onChange={(e) => setDnis(e.target.value)}
                rows={8}
                placeholder={"12345678\n23456789\n34567890"}
                className="w-full px-4 py-3 bg-burgos-black/50 border border-burgos-gray-800 rounded-xl text-burgos-white placeholder:text-burgos-gray-600 focus:outline-none focus:border-burgos-gold/40 text-sm font-mono resize-none"
              />
              <p className="text-[10px] text-burgos-gray-600 mt-1">
                Se creará un cliente por cada DNI con una clave aleatoria generada.
              </p>
            </div>

            <button
              onClick={handleGenerar}
              disabled={loading || !dnis.trim()}
              className="w-full bg-burgos-gold hover:bg-burgos-gold-light disabled:bg-burgos-gold/30 text-burgos-black py-3 rounded-xl font-semibold transition-all duration-300"
            >
              {loading ? "Generando..." : "Generar Claves"}
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-burgos-black/50 border border-burgos-gray-800 rounded-xl p-4 max-h-60 overflow-y-auto">
              {resultados.map((r, i) => (
                <div
                  key={i}
                  className={`flex justify-between items-center py-2 ${i > 0 ? "border-t border-burgos-gray-800/50" : ""}`}
                >
                  <span className="text-sm font-mono text-burgos-gray-400">{r.dni}</span>
                  {r.error ? (
                    <span className="text-xs text-red-400">{r.error}</span>
                  ) : (
                    <span className="text-sm font-mono text-burgos-gold">{r.clave}</span>
                  )}
                </div>
              ))}
            </div>

            <div className="flex gap-3">
              <button
                onClick={copiarResultados}
                className="flex-1 inline-flex items-center justify-center gap-2 bg-burgos-dark-2 border border-burgos-gray-800 hover:border-burgos-gold/30 text-burgos-white py-3 rounded-xl font-medium text-sm transition-all"
              >
                {copied ? <Check size={14} /> : <Copy size={14} />}
                {copied ? "Copiado" : "Copiar resultados"}
              </button>
              <button
                onClick={() => { onSuccess(); }}
                className="flex-1 bg-burgos-gold hover:bg-burgos-gold-light text-burgos-black py-3 rounded-xl font-semibold text-sm transition-all"
              >
                Listo
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
