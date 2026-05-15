"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { User, Save, Camera } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { FileUpload } from "@/components/ui/FileUpload";

interface Perfil {
  id: string;
  nombre: string;
  email: string;
  especialidad: string;
  matricula: string | null;
  foto_url: string | null;
  fondo_url: string | null;
  bio: string | null;
  areas: string[];
  experiencia: string | null;
  rol: string;
}

export default function PerfilPage() {
  const [perfil, setPerfil] = useState<Perfil | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const supabase = createClient();

  useEffect(() => {
    const fetch = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase.from("abogados").select("*").eq("user_id", user.id).single();
      if (data) setPerfil(data);
      setLoading(false);
    };
    fetch();
  }, []);

  const handleSave = async () => {
    if (!perfil) return;
    setSaving(true);
    const { error } = await supabase
      .from("abogados")
      .update({
        nombre: perfil.nombre,
        especialidad: perfil.especialidad,
        matricula: perfil.matricula,
        bio: perfil.bio,
        areas: perfil.areas,
        experiencia: perfil.experiencia,
        foto_url: perfil.foto_url,
        fondo_url: perfil.fondo_url,
      })
      .eq("id", perfil.id);

    setSaving(false);
    setMensaje(error ? "Error al guardar" : "Perfil actualizado");
    setTimeout(() => setMensaje(""), 3000);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-burgos-gold/30 border-t-burgos-gold rounded-full animate-spin" />
      </div>
    );
  }

  if (!perfil) return null;

  return (
    <div className="space-y-6 max-w-3xl">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-burgos-white flex items-center gap-2">
          <User size={24} className="text-burgos-gold" />
          Mi Perfil
        </h1>
        <p className="text-burgos-gray-400 text-sm mt-1">
          Tu información aparece en la landing pública del estudio
        </p>
      </motion.div>

      {mensaje && (
        <div className={`px-4 py-3 rounded-xl text-sm ${mensaje.includes("Error") ? "bg-red-500/10 text-red-400" : "bg-green-500/10 text-green-400"}`}>
          {mensaje}
        </div>
      )}

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-burgos-dark rounded-2xl border border-burgos-gray-800 p-6 sm:p-8 space-y-6">
        {/* Fotos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="text-[10px] uppercase tracking-wider text-burgos-gray-600 font-medium mb-2 block">
              Foto de perfil
            </label>
            {perfil.foto_url && (
              <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-burgos-gold/20 mb-3">
                <img src={perfil.foto_url} alt="Foto" className="w-full h-full object-cover" />
              </div>
            )}
            <FileUpload
              bucket="fotos-equipo"
              folder={perfil.id}
              accept="image/*"
              maxSizeMB={5}
              label="Subir foto"
              compact
              onUpload={(url) => setPerfil({ ...perfil, foto_url: url })}
            />
          </div>
          <div>
            <label className="text-[10px] uppercase tracking-wider text-burgos-gray-600 font-medium mb-2 block">
              Foto de fondo (landing)
            </label>
            {perfil.fondo_url && (
              <div className="w-full h-24 rounded-xl overflow-hidden border border-burgos-gray-800 mb-3">
                <img src={perfil.fondo_url} alt="Fondo" className="w-full h-full object-cover" />
              </div>
            )}
            <FileUpload
              bucket="fotos-equipo"
              folder={`${perfil.id}/fondo`}
              accept="image/*"
              maxSizeMB={5}
              label="Subir fondo"
              compact
              onUpload={(url) => setPerfil({ ...perfil, fondo_url: url })}
            />
          </div>
        </div>

        {/* Datos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-[10px] uppercase tracking-wider text-burgos-gray-600 font-medium mb-1.5 block">Nombre</label>
            <input type="text" value={perfil.nombre} onChange={(e) => setPerfil({ ...perfil, nombre: e.target.value })} className="w-full px-4 py-2.5 bg-burgos-black/50 border border-burgos-gray-800 rounded-xl text-burgos-white focus:outline-none focus:border-burgos-gold/40 text-sm" />
          </div>
          <div>
            <label className="text-[10px] uppercase tracking-wider text-burgos-gray-600 font-medium mb-1.5 block">Email</label>
            <input type="email" value={perfil.email} disabled className="w-full px-4 py-2.5 bg-burgos-black/30 border border-burgos-gray-800 rounded-xl text-burgos-gray-600 text-sm cursor-not-allowed" />
          </div>
          <div>
            <label className="text-[10px] uppercase tracking-wider text-burgos-gray-600 font-medium mb-1.5 block">Especialidad</label>
            <input type="text" value={perfil.especialidad} onChange={(e) => setPerfil({ ...perfil, especialidad: e.target.value })} className="w-full px-4 py-2.5 bg-burgos-black/50 border border-burgos-gray-800 rounded-xl text-burgos-white focus:outline-none focus:border-burgos-gold/40 text-sm" />
          </div>
          <div>
            <label className="text-[10px] uppercase tracking-wider text-burgos-gray-600 font-medium mb-1.5 block">Matrícula</label>
            <input type="text" value={perfil.matricula || ""} onChange={(e) => setPerfil({ ...perfil, matricula: e.target.value })} className="w-full px-4 py-2.5 bg-burgos-black/50 border border-burgos-gray-800 rounded-xl text-burgos-white focus:outline-none focus:border-burgos-gold/40 text-sm" />
          </div>
          <div>
            <label className="text-[10px] uppercase tracking-wider text-burgos-gray-600 font-medium mb-1.5 block">Experiencia</label>
            <input type="text" value={perfil.experiencia || ""} onChange={(e) => setPerfil({ ...perfil, experiencia: e.target.value })} placeholder="+10 años" className="w-full px-4 py-2.5 bg-burgos-black/50 border border-burgos-gray-800 rounded-xl text-burgos-white placeholder:text-burgos-gray-600 focus:outline-none focus:border-burgos-gold/40 text-sm" />
          </div>
          <div>
            <label className="text-[10px] uppercase tracking-wider text-burgos-gray-600 font-medium mb-1.5 block">Rol</label>
            <input type="text" value={perfil.rol} disabled className="w-full px-4 py-2.5 bg-burgos-black/30 border border-burgos-gray-800 rounded-xl text-burgos-gray-600 text-sm capitalize cursor-not-allowed" />
          </div>
        </div>

        <div>
          <label className="text-[10px] uppercase tracking-wider text-burgos-gray-600 font-medium mb-1.5 block">Biografía</label>
          <textarea value={perfil.bio || ""} onChange={(e) => setPerfil({ ...perfil, bio: e.target.value })} rows={3} placeholder="Breve descripción profesional..." className="w-full px-4 py-2.5 bg-burgos-black/50 border border-burgos-gray-800 rounded-xl text-burgos-white placeholder:text-burgos-gray-600 focus:outline-none focus:border-burgos-gold/40 text-sm resize-none" />
        </div>

        <div>
          <label className="text-[10px] uppercase tracking-wider text-burgos-gray-600 font-medium mb-1.5 block">Áreas de práctica (separadas por coma)</label>
          <input type="text" value={perfil.areas?.join(", ") || ""} onChange={(e) => setPerfil({ ...perfil, areas: e.target.value.split(",").map((a) => a.trim()).filter(Boolean) })} placeholder="Derecho Civil, Derecho Comercial" className="w-full px-4 py-2.5 bg-burgos-black/50 border border-burgos-gray-800 rounded-xl text-burgos-white placeholder:text-burgos-gray-600 focus:outline-none focus:border-burgos-gold/40 text-sm" />
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 bg-burgos-gold hover:bg-burgos-gold-light disabled:bg-burgos-gold/30 text-burgos-black px-6 py-3 rounded-xl font-semibold text-sm transition-all"
        >
          {saving ? "Guardando..." : <><Save size={16} /> Guardar Perfil</>}
        </button>
      </motion.div>
    </div>
  );
}
