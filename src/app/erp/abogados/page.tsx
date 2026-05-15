"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import {
  UserPlus,
  Users,
  Search,
  Shield,
  Eye,
  EyeOff,
  X,
  Check,
  Pencil,
  KeyRound,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface Abogado {
  id: string;
  user_id: string;
  nombre: string;
  email: string;
  especialidad: string;
  matricula: string;
  rol: string;
  activo: boolean;
  creado_en: string;
}

export default function AbogadosPage() {
  const [abogados, setAbogados] = useState<Abogado[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [busqueda, setBusqueda] = useState("");
  const [currentRol, setCurrentRol] = useState<string>("asociado");
  const [showReasignar, setShowReasignar] = useState<Abogado | null>(null);
  const [editingMember, setEditingMember] = useState<Abogado | null>(null);
  const [resetPasswordMember, setResetPasswordMember] = useState<Abogado | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string>("");

  const supabase = createClient();

  const fetchAbogados = async () => {
    const { data, error } = await supabase
      .from("abogados")
      .select("*")
      .order("creado_en", { ascending: false });

    if (data) setAbogados(data);
    setLoading(false);
  };

  const fetchCurrentRol = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    setCurrentUserId(user.id);
    const { data } = await supabase
      .from("abogados")
      .select("rol")
      .eq("user_id", user.id)
      .single();
    if (data) setCurrentRol(data.rol);
  };

  useEffect(() => {
    fetchAbogados();
    fetchCurrentRol();
  }, []);

  const handleDesactivar = async (abogado: Abogado) => {
    if (abogado.activo) {
      // Check if they have active expedientes
      const { data: expedientes } = await supabase
        .from("expedientes")
        .select("id")
        .eq("abogado_id", abogado.id)
        .eq("estado", "activo");

      if (expedientes && expedientes.length > 0) {
        setShowReasignar(abogado);
        return;
      }
    }
    await supabase.from("abogados").update({ activo: !abogado.activo }).eq("id", abogado.id);
    fetchAbogados();
  };

  const filtered = abogados.filter(
    (a) =>
      busqueda === "" ||
      a.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      a.email.toLowerCase().includes(busqueda.toLowerCase())
  );

  // Fix 3: Hide director from non-directors
  const visibleAbogados = filtered.filter((a) => {
    if (currentRol !== "director" && a.rol === "director") return false;
    return true;
  });

  const canEdit = (member: Abogado) => {
    if (currentRol === "director") return true;
    if (currentRol === "asociado" && member.rol === "administrativo") return true;
    return false;
  };

  const canResetPassword = (member: Abogado) => {
    // Director can reset anyone's password
    if (currentRol === "director") return true;
    // Asociado can reset administrativo's password
    if (currentRol === "asociado" && member.rol === "administrativo") return true;
    // Nobody can reset the director's password except the director themselves
    return false;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl font-bold text-burgos-white flex items-center gap-2">
            <Users size={24} className="text-burgos-gold" />
            Equipo
          </h1>
          <p className="text-burgos-gray-400 text-sm mt-1">
            Gestión de abogados del estudio
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 bg-burgos-gold hover:bg-burgos-gold-light text-burgos-black px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300"
        >
          <UserPlus size={16} />
          Nuevo Miembro
        </button>
      </motion.div>

      {/* Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div className="relative max-w-md">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-burgos-gray-600"
          />
          <input
            type="text"
            placeholder="Buscar por nombre o email..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-burgos-dark border border-burgos-gray-800 rounded-xl text-sm text-burgos-white placeholder:text-burgos-gray-600 focus:outline-none focus:border-burgos-gold/30 transition-colors"
          />
        </div>
      </motion.div>

      {/* Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        {loading ? (
          <div className="col-span-full text-center py-12">
            <div className="w-8 h-8 border-2 border-burgos-gold/30 border-t-burgos-gold rounded-full animate-spin mx-auto" />
          </div>
        ) : visibleAbogados.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <p className="text-burgos-gray-600">No se encontraron abogados.</p>
          </div>
        ) : (
          visibleAbogados.map((abogado) => (
            <div
              key={abogado.id}
              className={`bg-burgos-dark rounded-2xl border p-5 transition-all duration-300 ${
                abogado.activo
                  ? "border-burgos-gray-800 hover:border-burgos-gold/20"
                  : "border-red-500/20 opacity-60"
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="w-12 h-12 bg-burgos-dark-2 border border-burgos-gray-800 rounded-full flex items-center justify-center">
                  <span className="text-sm font-bold text-burgos-gold/60">
                    {abogado.nombre
                      .split(" ")
                      .filter((_, i, arr) => i === 0 || i === arr.length - 1)
                      .map((n) => n[0])
                      .join("")}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  {abogado.rol === "director" && (
                    <Shield size={14} className="text-burgos-gold" />
                  )}
                  <span
                    className={`text-[9px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full ${
                      abogado.activo
                        ? "bg-green-500/10 text-green-400"
                        : "bg-red-500/10 text-red-400"
                    }`}
                  >
                    {abogado.activo ? "Activo" : "Inactivo"}
                  </span>
                </div>
              </div>

              <h3 className="text-sm font-semibold text-burgos-white mb-0.5">
                {abogado.nombre}
              </h3>
              <p className="text-xs text-burgos-gold mb-0.5">
                {abogado.especialidad}
              </p>
              <p className="text-[10px] text-burgos-gray-600 mb-3">
                {abogado.email}
              </p>
              {abogado.matricula && (
                <p className="text-[10px] text-burgos-gray-600 mb-3">
                  {abogado.matricula}
                </p>
              )}

              <div className="flex gap-2">
                {canEdit(abogado) && (
                  <button
                    onClick={() => setEditingMember(abogado)}
                    className="text-xs py-2 px-3 rounded-lg font-medium transition-all border bg-burgos-gold/5 border-burgos-gold/20 text-burgos-gold hover:bg-burgos-gold/10"
                    title="Editar"
                  >
                    <Pencil size={14} />
                  </button>
                )}
                {canResetPassword(abogado) && (
                  <button
                    onClick={() => setResetPasswordMember(abogado)}
                    className="text-xs py-2 px-3 rounded-lg font-medium transition-all border bg-orange-500/5 border-orange-500/20 text-orange-400 hover:bg-orange-500/10"
                    title="Resetear clave"
                  >
                    <KeyRound size={14} />
                  </button>
                )}
                {/* Fix 3: Hide desactivar for director if current user is not director */}
                {!(currentRol !== "director" && abogado.rol === "director") && (
                  <button
                    onClick={() => handleDesactivar(abogado)}
                    className={`flex-1 text-xs py-2 rounded-lg font-medium transition-all border ${
                      abogado.activo
                        ? "bg-red-500/5 border-red-500/20 text-red-400 hover:bg-red-500/10"
                        : "bg-green-500/5 border-green-500/20 text-green-400 hover:bg-green-500/10"
                    }`}
                  >
                    {abogado.activo ? "Desactivar" : "Reactivar"}
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </motion.div>

      {/* Modal de alta */}
      {showModal && (
        <AltaAbogadoModal
          onClose={() => setShowModal(false)}
          onSuccess={() => {
            setShowModal(false);
            fetchAbogados();
          }}
        />
      )}

      {/* Modal de reasignación */}
      {showReasignar && (
        <ReasignarModal
          abogado={showReasignar}
          abogados={abogados.filter((a) => a.activo && a.id !== showReasignar.id && a.rol !== "administrativo")}
          onClose={() => setShowReasignar(null)}
          onSuccess={() => {
            setShowReasignar(null);
            fetchAbogados();
          }}
        />
      )}

      {/* Modal de edición */}
      {editingMember && (
        <EditarMiembroModal
          abogado={editingMember}
          onClose={() => setEditingMember(null)}
          onSuccess={() => {
            setEditingMember(null);
            fetchAbogados();
          }}
        />
      )}

      {/* Modal de resetear clave */}
      {resetPasswordMember && (
        <ResetearClaveModal
          abogado={resetPasswordMember}
          onClose={() => setResetPasswordMember(null)}
          onSuccess={() => setResetPasswordMember(null)}
        />
      )}
    </div>
  );
}

function AltaAbogadoModal({
  onClose,
  onSuccess,
}: {
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [form, setForm] = useState({
    nombre: "",
    email: "",
    password: "",
    especialidad: "",
    matricula: "",
    rol: "asociado",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/abogados", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Error al crear el miembro");
      } else {
        onSuccess();
      }
    } catch {
      setError("Error de conexión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="relative bg-burgos-dark rounded-2xl border border-burgos-gray-800 p-6 sm:p-8 w-full max-w-lg max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-burgos-white">
            Nuevo Miembro
          </h2>
          <button
            onClick={onClose}
            className="text-burgos-gray-600 hover:text-burgos-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-4 py-3 rounded-xl mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-[10px] uppercase tracking-wider text-burgos-gray-600 font-medium mb-1.5 block">
              Nombre completo
            </label>
            <input
              type="text"
              required
              value={form.nombre}
              onChange={(e) => setForm({ ...form, nombre: e.target.value })}
              className="w-full px-4 py-3 bg-burgos-black/50 border border-burgos-gray-800 rounded-xl text-burgos-white placeholder:text-burgos-gray-600 focus:outline-none focus:border-burgos-gold/40 transition-colors text-sm"
              placeholder="Dr. Juan Pérez"
            />
          </div>

          <div>
            <label className="text-[10px] uppercase tracking-wider text-burgos-gray-600 font-medium mb-1.5 block">
              Email
            </label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full px-4 py-3 bg-burgos-black/50 border border-burgos-gray-800 rounded-xl text-burgos-white placeholder:text-burgos-gray-600 focus:outline-none focus:border-burgos-gold/40 transition-colors text-sm"
              placeholder="juan@burgos.com.ar"
            />
          </div>

          <div>
            <label className="text-[10px] uppercase tracking-wider text-burgos-gray-600 font-medium mb-1.5 block">
              Contraseña inicial
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full px-4 py-3 pr-12 bg-burgos-black/50 border border-burgos-gray-800 rounded-xl text-burgos-white placeholder:text-burgos-gray-600 focus:outline-none focus:border-burgos-gold/40 transition-colors text-sm"
                placeholder="Mínimo 8 caracteres"
                minLength={8}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-burgos-gray-600 hover:text-burgos-gray-400"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div>
            <label className="text-[10px] uppercase tracking-wider text-burgos-gray-600 font-medium mb-1.5 block">
              Rol
            </label>
            <select
              value={form.rol}
              onChange={(e) => setForm({ ...form, rol: e.target.value })}
              className="w-full px-4 py-3 bg-burgos-black/50 border border-burgos-gray-800 rounded-xl text-burgos-white focus:outline-none focus:border-burgos-gold/40 transition-colors text-sm appearance-none"
            >
              <option value="asociado" className="bg-burgos-dark">
                Asociado
              </option>
              <option value="administrativo" className="bg-burgos-dark">
                Administrativo
              </option>
            </select>
            <p className="text-[10px] text-burgos-gray-600 mt-1">
              Los administrativos no requieren especialidad ni matrícula.
            </p>
          </div>

          <div>
            <label className="text-[10px] uppercase tracking-wider text-burgos-gray-600 font-medium mb-1.5 block">
              Especialidad
            </label>
            <input
              type="text"
              required={form.rol !== "administrativo"}
              value={form.especialidad}
              onChange={(e) =>
                setForm({ ...form, especialidad: e.target.value })
              }
              className="w-full px-4 py-3 bg-burgos-black/50 border border-burgos-gray-800 rounded-xl text-burgos-white placeholder:text-burgos-gray-600 focus:outline-none focus:border-burgos-gold/40 transition-colors text-sm"
              placeholder={form.rol === "administrativo" ? "Opcional" : "Derecho Civil y Comercial"}
            />
          </div>

          <div>
            <label className="text-[10px] uppercase tracking-wider text-burgos-gray-600 font-medium mb-1.5 block">
              Matrícula CPACF
            </label>
            <input
              type="text"
              required={form.rol !== "administrativo"}
              value={form.matricula}
              onChange={(e) => setForm({ ...form, matricula: e.target.value })}
              className="w-full px-4 py-3 bg-burgos-black/50 border border-burgos-gray-800 rounded-xl text-burgos-white placeholder:text-burgos-gray-600 focus:outline-none focus:border-burgos-gold/40 transition-colors text-sm"
              placeholder={form.rol === "administrativo" ? "Opcional" : "T° XX F° XXX"}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex items-center justify-center gap-2 bg-burgos-gold hover:bg-burgos-gold-light disabled:bg-burgos-gold/30 text-burgos-black py-3.5 rounded-xl font-semibold transition-all duration-300 mt-2"
          >
            {loading ? (
              <span className="w-5 h-5 border-2 border-burgos-black/30 border-t-burgos-black rounded-full animate-spin" />
            ) : (
              <>
                <Check size={18} />
                Crear Miembro
              </>
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
}

function ReasignarModal({
  abogado,
  abogados,
  onClose,
  onSuccess,
}: {
  abogado: Abogado;
  abogados: Abogado[];
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [destino, setDestino] = useState("");
  const [loading, setLoading] = useState(false);
  const [expedientesCount, setExpedientesCount] = useState(0);
  const supabase = createClient();

  useEffect(() => {
    const fetchCount = async () => {
      const { count } = await supabase
        .from("expedientes")
        .select("id", { count: "exact", head: true })
        .eq("abogado_id", abogado.id)
        .eq("estado", "activo");
      setExpedientesCount(count || 0);
    };
    fetchCount();
  }, [abogado.id]);

  const handleReasignar = async () => {
    if (!destino) return;
    setLoading(true);

    // Reasignar expedientes activos
    await supabase
      .from("expedientes")
      .update({ abogado_id: destino })
      .eq("abogado_id", abogado.id)
      .eq("estado", "activo");

    // Desactivar al abogado
    await supabase
      .from("abogados")
      .update({ activo: false })
      .eq("id", abogado.id);

    setLoading(false);
    onSuccess();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="relative bg-burgos-dark rounded-2xl border border-burgos-gray-800 p-6 sm:p-8 w-full max-w-md"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-burgos-white">
            Reasignar Expedientes
          </h2>
          <button
            onClick={onClose}
            className="text-burgos-gray-600 hover:text-burgos-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 text-sm px-4 py-3 rounded-xl mb-4">
          <strong>{abogado.nombre}</strong> tiene{" "}
          <strong>{expedientesCount}</strong> expediente(s) activo(s). Debés
          reasignarlos antes de desactivarlo.
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-[10px] uppercase tracking-wider text-burgos-gray-600 font-medium mb-1.5 block">
              Reasignar a
            </label>
            <select
              value={destino}
              onChange={(e) => setDestino(e.target.value)}
              className="w-full px-4 py-3 bg-burgos-black/50 border border-burgos-gray-800 rounded-xl text-burgos-white focus:outline-none focus:border-burgos-gold/40 transition-colors text-sm appearance-none"
            >
              <option value="" className="bg-burgos-dark">
                Seleccionar abogado...
              </option>
              {abogados.map((a) => (
                <option key={a.id} value={a.id} className="bg-burgos-dark">
                  {a.nombre} ({a.especialidad || a.rol})
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 text-sm py-3 rounded-xl font-medium border border-burgos-gray-800 text-burgos-gray-400 hover:text-burgos-white hover:border-burgos-gray-600 transition-all"
            >
              Cancelar
            </button>
            <button
              onClick={handleReasignar}
              disabled={!destino || loading}
              className="flex-1 text-sm py-3 rounded-xl font-semibold bg-burgos-gold hover:bg-burgos-gold-light disabled:bg-burgos-gold/30 text-burgos-black transition-all"
            >
              {loading ? "Reasignando..." : "Reasignar y Desactivar"}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}


function EditarMiembroModal({
  abogado,
  onClose,
  onSuccess,
}: {
  abogado: Abogado;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [form, setForm] = useState({
    nombre: abogado.nombre,
    especialidad: abogado.especialidad || "",
    matricula: abogado.matricula || "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [resetMsg, setResetMsg] = useState("");
  const supabase = createClient();

  const handleResetPassword = async () => {
    const res = await fetch("/api/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: abogado.user_id, newPassword }),
    });
    if (res.ok) {
      setResetMsg("Contraseña actualizada correctamente");
      setNewPassword("");
      setTimeout(() => setResetMsg(""), 3000);
    } else {
      const data = await res.json();
      setResetMsg(data.error || "Error al resetear");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { error: updateError } = await supabase
        .from("abogados")
        .update({
          nombre: form.nombre,
          especialidad: form.especialidad,
          matricula: form.matricula,
        })
        .eq("id", abogado.id);

      if (updateError) {
        setError(updateError.message || "Error al actualizar");
      } else {
        onSuccess();
      }
    } catch {
      setError("Error de conexión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="relative bg-burgos-dark rounded-2xl border border-burgos-gray-800 p-6 sm:p-8 w-full max-w-lg max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-burgos-white">
            Editar Miembro
          </h2>
          <button
            onClick={onClose}
            className="text-burgos-gray-600 hover:text-burgos-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-4 py-3 rounded-xl mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-[10px] uppercase tracking-wider text-burgos-gray-600 font-medium mb-1.5 block">
              Nombre completo
            </label>
            <input
              type="text"
              required
              value={form.nombre}
              onChange={(e) => setForm({ ...form, nombre: e.target.value })}
              className="w-full px-4 py-3 bg-burgos-black/50 border border-burgos-gray-800 rounded-xl text-burgos-white placeholder:text-burgos-gray-600 focus:outline-none focus:border-burgos-gold/40 transition-colors text-sm"
              placeholder="Dr. Juan Pérez"
            />
          </div>

          <div>
            <label className="text-[10px] uppercase tracking-wider text-burgos-gray-600 font-medium mb-1.5 block">
              Email
            </label>
            <input
              type="email"
              disabled
              value={abogado.email}
              className="w-full px-4 py-3 bg-burgos-black/30 border border-burgos-gray-800 rounded-xl text-burgos-gray-500 text-sm cursor-not-allowed"
            />
            <p className="text-[10px] text-burgos-gray-600 mt-1">
              El email no se puede modificar.
            </p>
          </div>

          <div>
            <label className="text-[10px] uppercase tracking-wider text-burgos-gray-600 font-medium mb-1.5 block">
              Rol
            </label>
            <input
              type="text"
              disabled
              value={abogado.rol.charAt(0).toUpperCase() + abogado.rol.slice(1)}
              className="w-full px-4 py-3 bg-burgos-black/30 border border-burgos-gray-800 rounded-xl text-burgos-gray-500 text-sm cursor-not-allowed"
            />
            <p className="text-[10px] text-burgos-gray-600 mt-1">
              El rol no se puede modificar.
            </p>
          </div>

          <div>
            <label className="text-[10px] uppercase tracking-wider text-burgos-gray-600 font-medium mb-1.5 block">
              Especialidad
            </label>
            <input
              type="text"
              value={form.especialidad}
              onChange={(e) =>
                setForm({ ...form, especialidad: e.target.value })
              }
              className="w-full px-4 py-3 bg-burgos-black/50 border border-burgos-gray-800 rounded-xl text-burgos-white placeholder:text-burgos-gray-600 focus:outline-none focus:border-burgos-gold/40 transition-colors text-sm"
              placeholder="Derecho Civil y Comercial"
            />
          </div>

          <div>
            <label className="text-[10px] uppercase tracking-wider text-burgos-gray-600 font-medium mb-1.5 block">
              Matrícula CPACF
            </label>
            <input
              type="text"
              value={form.matricula}
              onChange={(e) => setForm({ ...form, matricula: e.target.value })}
              className="w-full px-4 py-3 bg-burgos-black/50 border border-burgos-gray-800 rounded-xl text-burgos-white placeholder:text-burgos-gray-600 focus:outline-none focus:border-burgos-gold/40 transition-colors text-sm"
              placeholder="T° XX F° XXX"
            />
          </div>

          <hr className="border-burgos-gray-800 my-4" />
          <div>
            <label className="text-[10px] uppercase tracking-wider text-burgos-gray-600 font-medium mb-1.5 block">
              Resetear contraseña
            </label>
            <div className="flex gap-2">
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Nueva contraseña (mín. 8 chars)"
                className="flex-1 px-4 py-2.5 bg-burgos-black/50 border border-burgos-gray-800 rounded-xl text-burgos-white placeholder:text-burgos-gray-600 focus:outline-none focus:border-burgos-gold/40 text-sm"
              />
              <button
                type="button"
                onClick={handleResetPassword}
                disabled={!newPassword || newPassword.length < 8}
                className="px-4 py-2.5 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-xl text-xs font-medium hover:bg-amber-500/20 disabled:opacity-40 transition-colors"
              >
                Resetear
              </button>
            </div>
            {resetMsg && <p className="text-[10px] text-green-400 mt-1">{resetMsg}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex items-center justify-center gap-2 bg-burgos-gold hover:bg-burgos-gold-light disabled:bg-burgos-gold/30 text-burgos-black py-3.5 rounded-xl font-semibold transition-all duration-300 mt-2"
          >
            {loading ? (
              <span className="w-5 h-5 border-2 border-burgos-black/30 border-t-burgos-black rounded-full animate-spin" />
            ) : (
              <>
                <Check size={18} />
                Guardar cambios
              </>
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
}


function ResetearClaveModal({
  abogado,
  onClose,
  onSuccess,
}: {
  abogado: Abogado;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const handleReset = async () => {
    setLoading(true);
    setMsg("");
    const res = await fetch("/api/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: abogado.user_id, newPassword }),
    });
    if (res.ok) {
      setMsg("Contraseña actualizada correctamente");
      setNewPassword("");
      setTimeout(() => onSuccess(), 1500);
    } else {
      const data = await res.json();
      setMsg(data.error || "Error al resetear");
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="relative bg-burgos-dark rounded-2xl border border-burgos-gray-800 p-6 sm:p-8 w-full max-w-md"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-burgos-white">
            Resetear Contraseña
          </h2>
          <button
            onClick={onClose}
            className="text-burgos-gray-600 hover:text-burgos-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <p className="text-sm text-burgos-gray-400 mb-4">
          Resetear contraseña de <strong className="text-burgos-white">{abogado.nombre}</strong>
        </p>

        <div className="space-y-4">
          <div>
            <label className="text-[10px] uppercase tracking-wider text-burgos-gray-600 font-medium mb-1.5 block">
              Nueva contraseña
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Mínimo 8 caracteres"
              className="w-full px-4 py-3 bg-burgos-black/50 border border-burgos-gray-800 rounded-xl text-burgos-white placeholder:text-burgos-gray-600 focus:outline-none focus:border-burgos-gold/40 transition-colors text-sm"
            />
          </div>

          {msg && (
            <p className={`text-xs ${msg.includes("Error") ? "text-red-400" : "text-green-400"}`}>
              {msg}
            </p>
          )}

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 text-sm py-3 rounded-xl font-medium border border-burgos-gray-800 text-burgos-gray-400 hover:text-burgos-white hover:border-burgos-gray-600 transition-all"
            >
              Cancelar
            </button>
            <button
              onClick={handleReset}
              disabled={!newPassword || newPassword.length < 8 || loading}
              className="flex-1 text-sm py-3 rounded-xl font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20 hover:bg-amber-500/20 disabled:opacity-40 transition-all"
            >
              {loading ? "Reseteando..." : "Resetear Clave"}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
