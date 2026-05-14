"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useCallback } from "react";
import { Calendar, ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import Link from "next/link";

// Datos placeholder — en producción vendrán de Supabase
const abogados = [
  {
    id: "1",
    nombre: "Dr. Martín Burgos",
    especialidad: "Derecho Civil y Comercial",
    matricula: "CPACF T° XX F° XXX",
    rol: "Director",
    bio: "Director del estudio con más de 20 años de experiencia en litigios civiles y comerciales de alta complejidad.",
  },
  {
    id: "2",
    nombre: "Dra. Laura Méndez",
    especialidad: "Derecho Laboral",
    matricula: "CPACF T° XX F° XXX",
    rol: "Asociada",
    bio: "Especialista en derecho laboral individual y colectivo. Amplia experiencia en negociaciones sindicales.",
  },
  {
    id: "3",
    nombre: "Dr. Federico Ruiz",
    especialidad: "Derecho Penal",
    matricula: "CPACF T° XX F° XXX",
    rol: "Asociado",
    bio: "Defensa penal en fuero ordinario y federal. Especializado en delitos económicos y lavado de activos.",
  },
  {
    id: "4",
    nombre: "Dra. Carolina Vega",
    especialidad: "Derecho de Familia",
    matricula: "CPACF T° XX F° XXX",
    rol: "Asociada",
    bio: "Mediadora y abogada de familia. Enfoque en resolución pacífica de conflictos familiares.",
  },
  {
    id: "5",
    nombre: "Dr. Alejandro Torres",
    especialidad: "Derecho Administrativo",
    matricula: "CPACF T° XX F° XXX",
    rol: "Asociado",
    bio: "Asesoramiento a empresas en licitaciones públicas, contratos administrativos y recursos.",
  },
];

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0,
    scale: 0.9,
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 300 : -300,
    opacity: 0,
    scale: 0.9,
  }),
};

export function EquipoSection() {
  const [[activeIndex, direction], setActiveIndex] = useState([0, 0]);
  const [isPaused, setIsPaused] = useState(false);

  const paginate = useCallback(
    (newDirection: number) => {
      setActiveIndex(([prev]) => {
        const next =
          ((prev + newDirection) % abogados.length + abogados.length) %
          abogados.length;
        return [next, newDirection];
      });
    },
    []
  );

  const goTo = (index: number) => {
    setActiveIndex(([prev]) => [index, index > prev ? 1 : -1]);
  };

  // Auto-slide cada 5 segundos
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => paginate(1), 5000);
    return () => clearInterval(interval);
  }, [isPaused, paginate]);

  const abogado = abogados[activeIndex];

  return (
    <section
      id="equipo"
      className="py-28 bg-burgos-black relative overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(201,168,76,1) 1px, transparent 0)`,
            backgroundSize: "50px 50px",
          }}
        />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-burgos-gold/[0.02] rounded-full blur-[100px]" />
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
            Profesionales
          </span>
          <h2 className="text-3xl sm:text-5xl font-bold text-burgos-white mt-3 mb-4">
            Nuestro Equipo
          </h2>
          <div className="w-12 h-[1px] bg-burgos-gold/40 mx-auto" />
        </motion.div>

        {/* Card carousel — una a la vez */}
        <div className="relative max-w-lg mx-auto">
          {/* Navigation arrows */}
          <button
            onClick={() => paginate(-1)}
            className="absolute -left-4 sm:-left-16 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-burgos-dark-2 hover:bg-burgos-dark-3 border border-burgos-gray-800 hover:border-burgos-gold/30 rounded-full flex items-center justify-center text-burgos-gray-400 hover:text-burgos-gold transition-all duration-300"
            aria-label="Anterior"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={() => paginate(1)}
            className="absolute -right-4 sm:-right-16 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-burgos-dark-2 hover:bg-burgos-dark-3 border border-burgos-gray-800 hover:border-burgos-gold/30 rounded-full flex items-center justify-center text-burgos-gray-400 hover:text-burgos-gold transition-all duration-300"
            aria-label="Siguiente"
          >
            <ChevronRight size={20} />
          </button>

          {/* Card */}
          <div className="relative h-[480px] sm:h-[500px] overflow-hidden">
            <AnimatePresence initial={false} custom={direction} mode="wait">
              <motion.div
                key={activeIndex}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="absolute inset-0"
              >
                <div className="h-full bg-burgos-dark rounded-3xl border border-burgos-gray-800 hover:border-burgos-gold/20 overflow-hidden transition-colors duration-500 gold-glow">
                  {/* Top gradient area (donde iría la foto de fondo) */}
                  <div className="relative h-48 bg-gradient-to-b from-burgos-dark-3 to-burgos-dark flex items-center justify-center">
                    {/* Foto placeholder */}
                    <div className="w-28 h-28 rounded-full bg-burgos-dark-2 border-2 border-burgos-gold/20 flex items-center justify-center">
                      <span className="text-3xl font-bold text-burgos-gold/50">
                        {abogado.nombre
                          .split(" ")
                          .filter((_, i, arr) => i === 0 || i === arr.length - 1)
                          .map((n) => n[0])
                          .join("")}
                      </span>
                    </div>
                    {/* Role badge */}
                    {abogado.rol === "Director" && (
                      <div className="absolute top-4 right-4 bg-burgos-gold/10 border border-burgos-gold/30 text-burgos-gold text-[10px] uppercase tracking-wider font-semibold px-3 py-1 rounded-full">
                        Director
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="p-8 text-center">
                    <h3 className="text-xl font-bold text-burgos-white mb-1">
                      {abogado.nombre}
                    </h3>
                    <p className="text-burgos-gold text-sm font-medium mb-1">
                      {abogado.especialidad}
                    </p>
                    <p className="text-burgos-gray-600 text-xs mb-4">
                      {abogado.matricula}
                    </p>
                    <p className="text-burgos-gray-400 text-sm leading-relaxed mb-6">
                      {abogado.bio}
                    </p>

                    <div className="flex gap-3 justify-center">
                      <a
                        href="#contacto"
                        className="inline-flex items-center gap-2 bg-burgos-gold/10 hover:bg-burgos-gold/20 text-burgos-gold border border-burgos-gold/30 px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300"
                      >
                        <Calendar size={14} />
                        Reservar turno
                      </a>
                      <Link
                        href={`/equipo/${abogado.id}`}
                        className="inline-flex items-center gap-1 text-burgos-gray-400 hover:text-burgos-gold text-sm font-medium transition-colors px-4 py-2.5"
                      >
                        Ver perfil
                        <ArrowRight size={14} />
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-2 mt-8">
          {abogados.map((_, index) => (
            <button
              key={index}
              onClick={() => goTo(index)}
              className={`h-1.5 rounded-full transition-all duration-500 ${
                index === activeIndex
                  ? "bg-burgos-gold w-8"
                  : "bg-burgos-gray-800 hover:bg-burgos-gray-600 w-1.5"
              }`}
              aria-label={`Ir al abogado ${index + 1}`}
            />
          ))}
        </div>

        {/* Counter */}
        <p className="text-center text-burgos-gray-600 text-xs mt-4 font-mono">
          {String(activeIndex + 1).padStart(2, "0")} / {String(abogados.length).padStart(2, "0")}
        </p>
      </div>
    </section>
  );
}
