"use client";

import { motion } from "framer-motion";
import { Calendar, Mail, ArrowLeft, Scale, Briefcase } from "lucide-react";
import Link from "next/link";

// Datos placeholder — en producción vendrán de Supabase
const abogadosData: Record<string, {
  id: string;
  nombre: string;
  especialidad: string;
  matricula: string;
  rol: string;
  bio: string;
  areas: string[];
  experiencia: string;
  email: string;
}> = {
  "1": {
    id: "1",
    nombre: "Dr. Martín Burgos",
    especialidad: "Derecho Civil y Comercial",
    matricula: "CPACF T° XX F° XXX",
    rol: "Director",
    bio: "Director del estudio con más de 20 años de experiencia en litigios civiles y comerciales de alta complejidad. Especializado en contratos empresariales, responsabilidad civil y derecho societario. Docente universitario en Derecho de los Contratos.",
    areas: ["Derecho Civil", "Derecho Comercial", "Derecho Societario"],
    experiencia: "+20 años",
    email: "m.burgos@burgos.com.ar",
  },
  "2": {
    id: "2",
    nombre: "Dra. Laura Méndez",
    especialidad: "Derecho Laboral",
    matricula: "CPACF T° XX F° XXX",
    rol: "Asociada",
    bio: "Especialista en derecho laboral individual y colectivo. Amplia experiencia en negociaciones sindicales, despidos discriminatorios y accidentes de trabajo. Mediadora certificada por el Ministerio de Justicia.",
    areas: ["Derecho Laboral", "Mediación", "Accidentes de Trabajo"],
    experiencia: "+12 años",
    email: "l.mendez@burgos.com.ar",
  },
  "3": {
    id: "3",
    nombre: "Dr. Federico Ruiz",
    especialidad: "Derecho Penal",
    matricula: "CPACF T° XX F° XXX",
    rol: "Asociado",
    bio: "Defensa penal en fuero ordinario y federal. Especializado en delitos económicos, lavado de activos y compliance corporativo. Ex funcionario del Ministerio Público Fiscal.",
    areas: ["Derecho Penal", "Delitos Económicos", "Compliance"],
    experiencia: "+15 años",
    email: "f.ruiz@burgos.com.ar",
  },
  "4": {
    id: "4",
    nombre: "Dra. Carolina Vega",
    especialidad: "Derecho de Familia",
    matricula: "CPACF T° XX F° XXX",
    rol: "Asociada",
    bio: "Mediadora y abogada de familia. Enfoque en resolución pacífica de conflictos familiares. Especializada en divorcios, alimentos, régimen de comunicación y adopción.",
    areas: ["Derecho de Familia", "Mediación Familiar", "Adopción"],
    experiencia: "+10 años",
    email: "c.vega@burgos.com.ar",
  },
  "5": {
    id: "5",
    nombre: "Dr. Alejandro Torres",
    especialidad: "Derecho Administrativo",
    matricula: "CPACF T° XX F° XXX",
    rol: "Asociado",
    bio: "Asesoramiento a empresas en licitaciones públicas, contratos administrativos y recursos. Especializado en derecho regulatorio y contrataciones del Estado.",
    areas: ["Derecho Administrativo", "Licitaciones", "Derecho Regulatorio"],
    experiencia: "+8 años",
    email: "a.torres@burgos.com.ar",
  },
};

export function PerfilAbogado({ id }: { id: string }) {
  const abogado = abogadosData[id];

  if (!abogado) {
    return (
      <div className="min-h-screen bg-burgos-black flex items-center justify-center">
        <div className="text-center">
          <p className="text-burgos-gray-400 mb-4">Perfil no encontrado</p>
          <Link href="/#equipo" className="text-burgos-gold hover:text-burgos-gold-light text-sm">
            ← Volver al equipo
          </Link>
        </div>
      </div>
    );
  }

  return (
    <section className="py-16 bg-burgos-black min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Link
            href="/#equipo"
            className="inline-flex items-center gap-2 text-burgos-gray-400 hover:text-burgos-gold text-sm mb-8 transition-colors"
          >
            <ArrowLeft size={16} />
            Volver al equipo
          </Link>
        </motion.div>

        {/* Profile card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="bg-burgos-dark rounded-3xl border border-burgos-gray-800 overflow-hidden"
        >
          {/* Header */}
          <div className="relative h-48 bg-gradient-to-br from-burgos-dark-3 to-burgos-dark-2 flex items-center justify-center">
            <div className="w-32 h-32 rounded-full bg-burgos-dark border-2 border-burgos-gold/20 flex items-center justify-center">
              <span className="text-4xl font-bold text-burgos-gold/50">
                {abogado.nombre
                  .split(" ")
                  .filter((_, i, arr) => i === 0 || i === arr.length - 1)
                  .map((n) => n[0])
                  .join("")}
              </span>
            </div>
            {abogado.rol === "Director" && (
              <div className="absolute top-4 right-4 bg-burgos-gold/10 border border-burgos-gold/30 text-burgos-gold text-[10px] uppercase tracking-wider font-semibold px-3 py-1 rounded-full">
                Director
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-8 sm:p-10">
            <h1 className="text-2xl sm:text-3xl font-bold text-burgos-white mb-1">
              {abogado.nombre}
            </h1>
            <p className="text-burgos-gold font-medium mb-1">
              {abogado.especialidad}
            </p>
            <p className="text-burgos-gray-600 text-sm mb-6">
              {abogado.matricula}
            </p>

            {/* Bio */}
            <p className="text-burgos-gray-400 leading-relaxed mb-8">
              {abogado.bio}
            </p>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              <div className="bg-burgos-dark-2 rounded-xl border border-burgos-gray-800 p-4 text-center">
                <Briefcase size={18} className="text-burgos-gold mx-auto mb-2" />
                <p className="text-burgos-white font-semibold">{abogado.experiencia}</p>
                <p className="text-burgos-gray-600 text-xs">Experiencia</p>
              </div>
              <div className="bg-burgos-dark-2 rounded-xl border border-burgos-gray-800 p-4 text-center">
                <Scale size={18} className="text-burgos-gold mx-auto mb-2" />
                <p className="text-burgos-white font-semibold">{abogado.areas.length}</p>
                <p className="text-burgos-gray-600 text-xs">Áreas de práctica</p>
              </div>
              <div className="bg-burgos-dark-2 rounded-xl border border-burgos-gray-800 p-4 text-center">
                <Mail size={18} className="text-burgos-gold mx-auto mb-2" />
                <p className="text-burgos-white font-semibold text-sm">{abogado.email}</p>
                <p className="text-burgos-gray-600 text-xs">Contacto directo</p>
              </div>
            </div>

            {/* Areas */}
            <div className="mb-8">
              <h3 className="text-sm font-semibold text-burgos-white mb-3">
                Áreas de práctica
              </h3>
              <div className="flex flex-wrap gap-2">
                {abogado.areas.map((area) => (
                  <span
                    key={area}
                    className="px-3 py-1.5 bg-burgos-gold/5 border border-burgos-gold/20 text-burgos-gold text-xs rounded-full"
                  >
                    {area}
                  </span>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href="/#contacto"
                className="inline-flex items-center justify-center gap-2 bg-burgos-gold hover:bg-burgos-gold-light text-burgos-black px-6 py-3 rounded-xl font-semibold transition-all duration-300 text-sm"
              >
                <Calendar size={16} />
                Reservar turno
              </a>
              <a
                href={`mailto:${abogado.email}`}
                className="inline-flex items-center justify-center gap-2 bg-burgos-dark-2 hover:bg-burgos-dark-3 border border-burgos-gray-800 hover:border-burgos-gold/30 text-burgos-gray-200 px-6 py-3 rounded-xl font-medium transition-all duration-300 text-sm"
              >
                <Mail size={16} />
                Enviar email
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
