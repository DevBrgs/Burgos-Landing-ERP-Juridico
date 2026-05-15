"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import {
  Briefcase,
  Users,
  Gavel,
  Building2,
  Heart,
  Shield,
  FileText,
  Scale,
} from "lucide-react";

const iconMap: Record<string, any> = {
  FileText, Building2, Briefcase, Gavel, Heart, Shield, Users, Scale,
};

const areasDefault = [
  { nombre: "Derecho Civil", descripcion: "Contratos, responsabilidad civil, sucesiones y derechos reales.", icono: "FileText" },
  { nombre: "Derecho Comercial", descripcion: "Sociedades, concursos, quiebras y contratos comerciales.", icono: "Building2" },
  { nombre: "Derecho Laboral", descripcion: "Despidos, accidentes laborales, negociación colectiva.", icono: "Briefcase" },
  { nombre: "Derecho Penal", descripcion: "Defensa penal, querellas y delitos económicos.", icono: "Gavel" },
  { nombre: "Derecho de Familia", descripcion: "Divorcios, alimentos, régimen de visitas y adopción.", icono: "Heart" },
  { nombre: "Derecho Administrativo", descripcion: "Licitaciones, contratos públicos y recursos administrativos.", icono: "Shield" },
  { nombre: "Derecho Societario", descripcion: "Constitución de sociedades, fusiones y adquisiciones.", icono: "Users" },
  { nombre: "Litigios Complejos", descripcion: "Casos de alta complejidad con estrategia integral.", icono: "Scale" },
];

export function AreasSection() {
  const [areas, setAreas] = useState(areasDefault);

  useEffect(() => {
    const fetchAreas = async () => {
      try {
        const res = await fetch("/api/configuracion");
        const config = await res.json();
        if (config.areas_practica) {
          const parsed = JSON.parse(config.areas_practica);
          if (Array.isArray(parsed) && parsed.length > 0) setAreas(parsed);
        }
      } catch {}
    };
    fetchAreas();
  }, []);
  return (
    <section id="areas" className="py-28 bg-burgos-black relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-burgos-gold/[0.02] rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-16"
        >
          <span className="text-xs uppercase tracking-[0.3em] text-burgos-gold/60 font-medium">
            Especialidades
          </span>
          <h2 className="text-3xl sm:text-5xl font-bold text-burgos-white mt-3 mb-4">
            Áreas de Práctica
          </h2>
          <p className="text-burgos-gray-400 max-w-lg mx-auto">
            Asesoramiento integral en todas las ramas del derecho con
            profesionales especializados.
          </p>
          <div className="w-12 h-[1px] bg-burgos-gold/40 mx-auto mt-6" />
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {areas.map((area, index) => {
            const Icon = iconMap[area.icono] || Scale;
            return (
              <motion.div
                key={area.nombre}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.08,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="group cursor-pointer"
              >
                <div className="h-full bg-burgos-dark rounded-2xl border border-burgos-gray-800 hover:border-burgos-gold/30 p-6 transition-all duration-500 hover:bg-burgos-dark-2 hover:shadow-[0_0_30px_rgba(201,168,76,0.05)]">
                  <div className="w-11 h-11 bg-burgos-gold/5 group-hover:bg-burgos-gold/10 border border-burgos-gold/10 group-hover:border-burgos-gold/30 rounded-xl flex items-center justify-center mb-4 transition-all duration-500">
                    <Icon className="w-5 h-5 text-burgos-gold/70 group-hover:text-burgos-gold transition-colors duration-500" />
                  </div>
                  <h3 className="font-semibold text-burgos-white text-sm mb-2 group-hover:text-burgos-gold transition-colors duration-300">
                    {area.nombre}
                  </h3>
                  <p className="text-xs text-burgos-gray-400 leading-relaxed">
                    {area.descripcion}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
