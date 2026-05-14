"use client";

import { motion } from "framer-motion";
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

const areas = [
  {
    nombre: "Derecho Civil",
    descripcion: "Contratos, responsabilidad civil, sucesiones y derechos reales.",
    icono: FileText,
  },
  {
    nombre: "Derecho Comercial",
    descripcion: "Sociedades, concursos, quiebras y contratos comerciales.",
    icono: Building2,
  },
  {
    nombre: "Derecho Laboral",
    descripcion: "Despidos, accidentes laborales, negociación colectiva.",
    icono: Briefcase,
  },
  {
    nombre: "Derecho Penal",
    descripcion: "Defensa penal, querellas y delitos económicos.",
    icono: Gavel,
  },
  {
    nombre: "Derecho de Familia",
    descripcion: "Divorcios, alimentos, régimen de visitas y adopción.",
    icono: Heart,
  },
  {
    nombre: "Derecho Administrativo",
    descripcion: "Licitaciones, contratos públicos y recursos administrativos.",
    icono: Shield,
  },
  {
    nombre: "Derecho Societario",
    descripcion: "Constitución de sociedades, fusiones y adquisiciones.",
    icono: Users,
  },
  {
    nombre: "Litigios Complejos",
    descripcion: "Casos de alta complejidad con estrategia integral.",
    icono: Scale,
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export function AreasSection() {
  return (
    <section id="areas" className="py-24 bg-burgos-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-burgos-navy mb-4">
            Áreas de Práctica
          </h2>
          <p className="text-burgos-gray-500 max-w-2xl mx-auto">
            Brindamos asesoramiento integral en todas las ramas del derecho,
            con profesionales especializados en cada área.
          </p>
        </motion.div>

        {/* Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {areas.map((area) => {
            const Icon = area.icono;
            return (
              <motion.div
                key={area.nombre}
                variants={itemVariants}
                className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border border-burgos-gray-200 group cursor-pointer"
              >
                <div className="w-12 h-12 bg-burgos-navy/5 group-hover:bg-burgos-gold/10 rounded-lg flex items-center justify-center mb-4 transition-colors">
                  <Icon className="w-6 h-6 text-burgos-navy group-hover:text-burgos-gold transition-colors" />
                </div>
                <h3 className="font-semibold text-burgos-navy mb-2">
                  {area.nombre}
                </h3>
                <p className="text-sm text-burgos-gray-500 leading-relaxed">
                  {area.descripcion}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
