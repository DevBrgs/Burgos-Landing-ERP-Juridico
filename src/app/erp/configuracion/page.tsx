"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import {
  Settings,
  Bell,
  Mail,
  Shield,
  Database,
  Globe,
  Palette,
  Key,
  RefreshCw,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { FileUpload } from "@/components/ui/FileUpload";

const secciones = [
  {
    id: "general",
    label: "General",
    icon: Settings,
    descripcion: "Nombre del estudio, dirección, teléfono, horarios",
  },
  {
    id: "notificaciones",
    label: "Notificaciones",
    icon: Bell,
    descripcion: "Alertas por email, audiencias, vencimientos",
  },
  {
    id: "email",
    label: "Email",
    icon: Mail,
    descripcion: "Configuración de Resend, plantillas de email",
  },
  {
    id: "seguridad",
    label: "Seguridad",
    icon: Shield,
    descripcion: "Roles, permisos, sesiones",
  },
  {
    id: "integraciones",
    label: "Integraciones",
    icon: Database,
    descripcion: "PJN, AFIP/ARCA, SAIJ, Google Calendar",
  },
  {
    id: "landing",
    label: "Landing",
    icon: Globe,
    descripcion: "Hero, fondos, textos de la página pública",
  },
  {
    id: "apariencia",
    label: "Apariencia",
    icon: Palette,
    descripcion: "Colores, logo, tema del ERP",
  },
  {
    id: "api",
    label: "API Keys",
    icon: Key,
    descripcion: "Groq, Resend, claves de integración",
  },
];

export default function ConfiguracionPage() {
  const [seccionActiva, setSeccionActiva] = useState("general");
  const [rol, setRol] = useState<string>("asociado");
  const supabase = createClient();

  useEffect(() => {
    const getRol = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase.from("abogados").select("rol").eq("user_id", user.id).single();
      if (data) setRol(data.rol);
    };
    getRol();
  }, []);

  // Filtrar secciones según rol
  const seccionesVisibles = secciones.filter((sec) => {
    if (rol === "director") return true;
    // Asociados solo ven general, notificaciones y landing
    return ["general", "notificaciones", "landing"].includes(sec.id);
  });

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl font-bold text-burgos-white flex items-center gap-2">
          <Settings size={24} className="text-burgos-gold" />
          Configuración
        </h1>
        <p className="text-burgos-gray-400 text-sm mt-1">
          Ajustes generales del sistema
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar de secciones */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-1"
        >
          {seccionesVisibles.map((sec) => {
            const Icon = sec.icon;
            return (
              <button
                key={sec.id}
                onClick={() => setSeccionActiva(sec.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all ${
                  seccionActiva === sec.id
                    ? "bg-burgos-gold/10 text-burgos-gold border border-burgos-gold/20"
                    : "text-burgos-gray-400 hover:text-burgos-white hover:bg-burgos-dark-2 border border-transparent"
                }`}
              >
                <Icon size={18} />
                <span className="text-sm font-medium">{sec.label}</span>
              </button>
            );
          })}
        </motion.div>

        {/* Contenido */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-3 bg-burgos-dark rounded-2xl border border-burgos-gray-800 p-6 sm:p-8"
        >
          {seccionActiva === "general" && <ConfigGeneral />}
          {seccionActiva === "notificaciones" && <ConfigNotificaciones />}
          {seccionActiva === "landing" && <ConfigLanding />}
          {seccionActiva !== "general" &&
            seccionActiva !== "notificaciones" &&
            seccionActiva !== "landing" && (
              <div className="text-center py-12">
                <p className="text-burgos-gray-600 text-sm">
                  Sección en desarrollo. Próximamente disponible.
                </p>
              </div>
            )}
        </motion.div>
      </div>
    </div>
  );
}

function ConfigGeneral() {
  const [jusVerbal, setJusVerbal] = useState("");
  const [jusEscrito, setJusEscrito] = useState("");
  const [direccion, setDireccion] = useState("Av. Corrientes 1234, Piso 8, CABA");
  const [telefono, setTelefono] = useState("(011) 4567-8900");
  const [emailContacto, setEmailContacto] = useState("contacto@burgos.com.ar");
  const [horario, setHorario] = useState("Lunes a Viernes, 9:00 a 18:00");
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    const fetchConfig = async () => {
      const res = await fetch("/api/configuracion");
      const data = await res.json();
      if (data.jus_verbal) setJusVerbal(data.jus_verbal);
      if (data.jus_escrito) setJusEscrito(data.jus_escrito);
      if (data.direccion) setDireccion(data.direccion);
      if (data.telefono) setTelefono(data.telefono);
      if (data.email_contacto) setEmailContacto(data.email_contacto);
      if (data.horario) setHorario(data.horario);
    };
    fetchConfig();
  }, []);

  const guardar = async () => {
    setSaving(true);
    const updates = [
      { clave: "jus_verbal", valor: jusVerbal },
      { clave: "jus_escrito", valor: jusEscrito },
      { clave: "direccion", valor: direccion },
      { clave: "telefono", valor: telefono },
      { clave: "email_contacto", valor: emailContacto },
      { clave: "horario", valor: horario },
    ];
    for (const u of updates) {
      await fetch("/api/configuracion", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(u) });
    }
    setSaving(false);
    setMsg("Configuración guardada correctamente.");
    setTimeout(() => setMsg(""), 3000);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-burgos-white">Honorarios — Valor del JUS</h2>
      <p className="text-sm text-burgos-gray-400">Estos valores se muestran en la landing pública del estudio.</p>

      {msg && <div className="bg-green-500/10 text-green-400 text-sm px-4 py-3 rounded-xl">{msg}</div>}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-[10px] uppercase tracking-wider text-burgos-gray-600 font-medium mb-1.5 block">JUS Consulta Verbal ($)</label>
          <input type="number" value={jusVerbal} onChange={(e) => setJusVerbal(e.target.value)} className="w-full px-4 py-2.5 bg-burgos-black/50 border border-burgos-gray-800 rounded-xl text-burgos-white focus:outline-none focus:border-burgos-gold/40 text-sm" />
        </div>
        <div>
          <label className="text-[10px] uppercase tracking-wider text-burgos-gray-600 font-medium mb-1.5 block">JUS Consulta Escrita ($)</label>
          <input type="number" value={jusEscrito} onChange={(e) => setJusEscrito(e.target.value)} className="w-full px-4 py-2.5 bg-burgos-black/50 border border-burgos-gray-800 rounded-xl text-burgos-white focus:outline-none focus:border-burgos-gold/40 text-sm" />
        </div>
      </div>

      <hr className="border-burgos-gray-800 my-6" />

      <h2 className="text-lg font-semibold text-burgos-white">Datos de Contacto</h2>
      <p className="text-sm text-burgos-gray-400">Esta información aparece en la landing y en el chat de IA.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-[10px] uppercase tracking-wider text-burgos-gray-600 font-medium mb-1.5 block">Dirección</label>
          <input type="text" value={direccion} onChange={(e) => setDireccion(e.target.value)} className="w-full px-4 py-2.5 bg-burgos-black/50 border border-burgos-gray-800 rounded-xl text-burgos-white focus:outline-none focus:border-burgos-gold/40 text-sm" />
        </div>
        <div>
          <label className="text-[10px] uppercase tracking-wider text-burgos-gray-600 font-medium mb-1.5 block">Teléfono</label>
          <input type="text" value={telefono} onChange={(e) => setTelefono(e.target.value)} className="w-full px-4 py-2.5 bg-burgos-black/50 border border-burgos-gray-800 rounded-xl text-burgos-white focus:outline-none focus:border-burgos-gold/40 text-sm" />
        </div>
        <div>
          <label className="text-[10px] uppercase tracking-wider text-burgos-gray-600 font-medium mb-1.5 block">Email de contacto</label>
          <input type="email" value={emailContacto} onChange={(e) => setEmailContacto(e.target.value)} className="w-full px-4 py-2.5 bg-burgos-black/50 border border-burgos-gray-800 rounded-xl text-burgos-white focus:outline-none focus:border-burgos-gold/40 text-sm" />
        </div>
        <div>
          <label className="text-[10px] uppercase tracking-wider text-burgos-gray-600 font-medium mb-1.5 block">Horario de atención</label>
          <input type="text" value={horario} onChange={(e) => setHorario(e.target.value)} className="w-full px-4 py-2.5 bg-burgos-black/50 border border-burgos-gray-800 rounded-xl text-burgos-white focus:outline-none focus:border-burgos-gold/40 text-sm" />
        </div>
      </div>

      <button onClick={guardar} disabled={saving} className="bg-burgos-gold hover:bg-burgos-gold-light disabled:bg-burgos-gold/30 text-burgos-black px-6 py-2.5 rounded-xl font-semibold text-sm transition-all">
        {saving ? "Guardando..." : "Guardar todo"}
      </button>
    </div>
  );
}

function ConfigNotificaciones() {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-burgos-white">Notificaciones</h2>
      <p className="text-sm text-burgos-gray-400">Configurá cuándo y cómo recibir alertas.</p>
      <div className="space-y-4">
        {[
          { label: "Audiencias próximas (72hs antes)", defaultChecked: true },
          { label: "Tareas por vencer (24hs antes)", defaultChecked: true },
          { label: "Nuevo turno solicitado", defaultChecked: true },
          { label: "Mensaje nuevo de cliente", defaultChecked: true },
          { label: "Consulta de contacto recibida", defaultChecked: true },
          { label: "Resumen semanal por email", defaultChecked: false },
        ].map((item) => (
          <label key={item.label} className="flex items-center justify-between p-4 bg-burgos-dark-2 rounded-xl border border-burgos-gray-800 cursor-pointer hover:border-burgos-gold/20 transition-colors">
            <span className="text-sm text-burgos-white">{item.label}</span>
            <input type="checkbox" defaultChecked={item.defaultChecked} className="w-4 h-4 accent-[#c9a84c] rounded" />
          </label>
        ))}
      </div>
      <button className="bg-burgos-gold hover:bg-burgos-gold-light text-burgos-black px-6 py-2.5 rounded-xl font-semibold text-sm transition-all">
        Guardar preferencias
      </button>
    </div>
  );
}

function ConfigLanding() {
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  const restaurarFondo = async () => {
    setSaving(true);
    await fetch("/api/configuracion", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ clave: "hero_background_url", valor: "" }),
    });
    setSaving(false);
    setMsg("Fondo restaurado al original (animación por defecto).");
    setTimeout(() => setMsg(""), 3000);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-burgos-white">Configuración de la Landing</h2>
      <p className="text-sm text-burgos-gray-400">Personalizá el contenido de la página pública.</p>

      {msg && <div className="bg-green-500/10 text-green-400 text-sm px-4 py-3 rounded-xl">{msg}</div>}

      <div className="space-y-4">
        <div>
          <label className="text-[10px] uppercase tracking-wider text-burgos-gray-600 font-medium mb-1.5 block">Tagline del Hero</label>
          <input type="text" defaultValue="Soluciones legales integrales con compromiso, experiencia y resultados." className="w-full px-4 py-2.5 bg-burgos-black/50 border border-burgos-gray-800 rounded-xl text-burgos-white focus:outline-none focus:border-burgos-gold/40 text-sm" />
        </div>
        <div>
          <label className="text-[10px] uppercase tracking-wider text-burgos-gray-600 font-medium mb-1.5 block">Video o imagen de fondo (Hero)</label>
          <FileUpload
            bucket="landing-media"
            folder="hero"
            accept="image/*,video/mp4"
            maxSizeMB={50}
            label="Subir video o imagen"
            onUpload={(url) => { console.log("Hero media:", url); }}
          />
          <p className="text-[10px] text-burgos-gray-600 mt-1">Soporta video MP4 o imagen JPG/PNG. Máximo 50MB.</p>
          <button
            onClick={restaurarFondo}
            disabled={saving}
            className="mt-3 inline-flex items-center gap-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 px-4 py-2 rounded-xl text-xs font-medium transition-all disabled:opacity-50"
          >
            <RefreshCw size={14} />
            Restaurar fondo original
          </button>
          <p className="text-[10px] text-burgos-gray-600 mt-1">Elimina la imagen/video subido y vuelve al fondo animado por defecto.</p>
        </div>
        <div>
          <label className="text-[10px] uppercase tracking-wider text-burgos-gray-600 font-medium mb-1.5 block">Ubicación del estudio</label>
          <input type="text" defaultValue="Av. Corrientes 1234, Piso 8, CABA" className="w-full px-4 py-2.5 bg-burgos-black/50 border border-burgos-gray-800 rounded-xl text-burgos-white focus:outline-none focus:border-burgos-gold/40 text-sm" placeholder="Dirección completa" />
        </div>
        <div>
          <label className="text-[10px] uppercase tracking-wider text-burgos-gray-600 font-medium mb-1.5 block">Descripción SEO</label>
          <textarea defaultValue="Estudio jurídico integral con más de 20 años de experiencia. Derecho civil, comercial, laboral, penal y familia." rows={3} className="w-full px-4 py-2.5 bg-burgos-black/50 border border-burgos-gray-800 rounded-xl text-burgos-white focus:outline-none focus:border-burgos-gold/40 text-sm resize-none" />
        </div>
      </div>
      <button className="bg-burgos-gold hover:bg-burgos-gold-light text-burgos-black px-6 py-2.5 rounded-xl font-semibold text-sm transition-all">
        Guardar cambios
      </button>
    </div>
  );
}
