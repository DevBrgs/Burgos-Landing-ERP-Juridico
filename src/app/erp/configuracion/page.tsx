"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import {
  Settings,
  Bell,
  Mail,
  Shield,
  Database,
  Globe,
  Palette,
  Key,
} from "lucide-react";

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
          {secciones.map((sec) => {
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
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-burgos-white">Datos del Estudio</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-[10px] uppercase tracking-wider text-burgos-gray-600 font-medium mb-1.5 block">Nombre del estudio</label>
          <input type="text" defaultValue="Burgos & Asociados" className="w-full px-4 py-2.5 bg-burgos-black/50 border border-burgos-gray-800 rounded-xl text-burgos-white focus:outline-none focus:border-burgos-gold/40 text-sm" />
        </div>
        <div>
          <label className="text-[10px] uppercase tracking-wider text-burgos-gray-600 font-medium mb-1.5 block">Teléfono</label>
          <input type="text" defaultValue="(011) 4567-8900" className="w-full px-4 py-2.5 bg-burgos-black/50 border border-burgos-gray-800 rounded-xl text-burgos-white focus:outline-none focus:border-burgos-gold/40 text-sm" />
        </div>
        <div>
          <label className="text-[10px] uppercase tracking-wider text-burgos-gray-600 font-medium mb-1.5 block">Dirección</label>
          <input type="text" defaultValue="Av. Corrientes 1234, Piso 8, CABA" className="w-full px-4 py-2.5 bg-burgos-black/50 border border-burgos-gray-800 rounded-xl text-burgos-white focus:outline-none focus:border-burgos-gold/40 text-sm" />
        </div>
        <div>
          <label className="text-[10px] uppercase tracking-wider text-burgos-gray-600 font-medium mb-1.5 block">Email de contacto</label>
          <input type="email" defaultValue="contacto@burgos.com.ar" className="w-full px-4 py-2.5 bg-burgos-black/50 border border-burgos-gray-800 rounded-xl text-burgos-white focus:outline-none focus:border-burgos-gold/40 text-sm" />
        </div>
      </div>
      <div>
        <label className="text-[10px] uppercase tracking-wider text-burgos-gray-600 font-medium mb-1.5 block">Horario de atención</label>
        <input type="text" defaultValue="Lunes a Viernes, 9:00 a 18:00" className="w-full px-4 py-2.5 bg-burgos-black/50 border border-burgos-gray-800 rounded-xl text-burgos-white focus:outline-none focus:border-burgos-gold/40 text-sm" />
      </div>
      <button className="bg-burgos-gold hover:bg-burgos-gold-light text-burgos-black px-6 py-2.5 rounded-xl font-semibold text-sm transition-all">
        Guardar cambios
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
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-burgos-white">Configuración de la Landing</h2>
      <p className="text-sm text-burgos-gray-400">Personalizá el contenido de la página pública.</p>
      <div className="space-y-4">
        <div>
          <label className="text-[10px] uppercase tracking-wider text-burgos-gray-600 font-medium mb-1.5 block">Tagline del Hero</label>
          <input type="text" defaultValue="Soluciones legales integrales con compromiso, experiencia y resultados." className="w-full px-4 py-2.5 bg-burgos-black/50 border border-burgos-gray-800 rounded-xl text-burgos-white focus:outline-none focus:border-burgos-gold/40 text-sm" />
        </div>
        <div>
          <label className="text-[10px] uppercase tracking-wider text-burgos-gray-600 font-medium mb-1.5 block">URL de video/imagen de fondo (Hero)</label>
          <input type="url" placeholder="https://... (dejar vacío para fondo por defecto)" className="w-full px-4 py-2.5 bg-burgos-black/50 border border-burgos-gray-800 rounded-xl text-burgos-white placeholder:text-burgos-gray-600 focus:outline-none focus:border-burgos-gold/40 text-sm" />
          <p className="text-[10px] text-burgos-gray-600 mt-1">Soporta video MP4 o imagen JPG/PNG</p>
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
