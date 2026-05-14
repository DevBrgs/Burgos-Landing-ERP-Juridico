"use client";

import { motion } from "framer-motion";
import { User, Calendar } from "lucide-react";

// Datos placeholder — en producción vendrán de Supabase
const abogados = [
  {
    id: "1",
    nombre: "Dr. Martín Burgos",
    especialidad: "Derecho Civil y Comercial",
    matricula: "CPACF T° XX F° XXX",
    rol: "Director",
  },
  {
    id: "2",
    nombre: "Dra. Laura Méndez",
    especialidad: "Derecho Laboral",
    matricula: "CPACF T° XX F° XXX",
    rol: "Asociada",
  },
  {
    id: "3",
    nombre: "Dr. Federico Ruiz",
    especialidad: "Derecho Penal",
    matricula: "CPACF T° XX F° XXX",
    rol: "Asociado",
  },
  {
    id: "4",
    nombre: "Dra. Carolina Vega",
    especialidad: "Derecho de Familia",
    matricula: "CPACF T° XX F° XXX",
    rol: "Asociada",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export function EquipoSection() {
  return (
    <section id="equipo" className="py-24 bg-white">
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
            Nuestro Equipo
          </h2>
          <p className="text-burgos-gray-500 max-w-2xl mx-auto">
            Profesionales comprometidos con la excelencia y la defensa de los
            derechos de nuestros clientes.
          </p>
        </motion.div>

        {/* Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {abogados.map((abogado) => (
            <motion.div
              key={abogado.id}
              variants={cardVariants}
              className="bg-burgos-cream rounded-xl p-6 text-center group hover:shadow-lg transition-shadow border border-burgos-gray-200"
            >
              {/* Avatar placeholder */}
              <div className="w-24 h-24 bg-burgos-navy/10 rounded-full mx-auto mb-4 flex items-center justify-center group-hover:bg-burgos-gold/10 transition-colors">
                <User className="w-10 h-10 text-burgos-navy/40 group-hover:text-burgos-gold transition-colors" />
              </div>

              <h3 className="font-semibold text-burgos-navy text-lg mb-1">
                {abogado.nombre}
              </h3>

              {abogado.rol === "Director" && (
                <span className="inline-block text-xs bg-burgos-gold/20 text-burgos-gold-dark px-2 py-0.5 rounded-full mb-2 font-medium">
                  Director
                </span>
              )}

              <p className="text-sm text-burgos-gray-500 mb-1">
                {abogado.especialidad}
              </p>
              <p className="text-xs text-burgos-gray-500/70 mb-4">
                {abogado.matricula}
              </p>

              <a
                href="#contacto"
                className="inline-flex items-center gap-1.5 text-sm text-burgos-gold hover:text-burgos-gold-dark font-medium transition-colors"
              >
                <Calendar size={14} />
                Reservar turno
              </a>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
