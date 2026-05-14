"use client";

import { motion } from "framer-motion";
import { useEffect, useRef, useState, useCallback } from "react";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";

// Datos placeholder — en producción vendrán de Supabase dinámicamente
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
  {
    id: "5",
    nombre: "Dr. Alejandro Torres",
    especialidad: "Derecho Administrativo",
    matricula: "CPACF T° XX F° XXX",
    rol: "Asociado",
  },
];

function AbogadoCard({
  abogado,
  isActive,
}: {
  abogado: (typeof abogados)[0];
  isActive: boolean;
}) {
  return (
    <motion.div
      className="relative flex-shrink-0 w-[300px] sm:w-[340px] h-[440px] rounded-2xl overflow-hidden cursor-pointer group"
      animate={{ scale: isActive ? 1 : 0.92, opacity: isActive ? 1 : 0.7 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      {/* Background */}
      <div className="absolute inset-0 bg-burgos-navy-light">
        <div className="absolute inset-0 bg-gradient-to-b from-burgos-navy/30 via-burgos-navy-light/60 to-burgos-navy/95" />
      </div>

      {/* Foto del abogado (placeholder con iniciales) */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative w-36 h-36 sm:w-44 sm:h-44 rounded-full overflow-hidden border-4 border-white/20 shadow-2xl mt-[-40px] group-hover:border-burgos-gold/50 transition-colors duration-300">
          <div className="absolute inset-0 bg-burgos-navy flex items-center justify-center">
            <span className="text-4xl font-bold text-burgos-gold/60">
              {abogado.nombre
                .split(" ")
                .filter(
                  (_, i, arr) => i === 0 || i === arr.length - 1
                )
                .map((n) => n[0])
                .join("")}
            </span>
          </div>
        </div>
      </div>

      {/* Info del abogado */}
      <div className="absolute bottom-0 left-0 right-0 p-6 text-center">
        {abogado.rol === "Director" && (
          <span className="inline-block text-xs bg-burgos-gold/20 text-burgos-gold-light px-3 py-1 rounded-full mb-2 font-medium backdrop-blur-sm">
            Director del Estudio
          </span>
        )}
        <h3 className="text-white font-bold text-lg mb-1">{abogado.nombre}</h3>
        <p className="text-white/60 text-sm mb-1">{abogado.especialidad}</p>
        <p className="text-white/40 text-xs mb-4">{abogado.matricula}</p>
        <a
          href="#contacto"
          className="inline-flex items-center gap-1.5 text-sm text-burgos-gold hover:text-burgos-gold-light font-medium transition-colors"
        >
          <Calendar size={14} />
          Reservar turno
        </a>
      </div>
    </motion.div>
  );
}

export function EquipoSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const cardWidth = 356;

  const scrollTo = useCallback(
    (index: number) => {
      if (!containerRef.current) return;
      const newIndex =
        ((index % abogados.length) + abogados.length) % abogados.length;
      setActiveIndex(newIndex);
      containerRef.current.scrollTo({
        left:
          newIndex * cardWidth -
          (containerRef.current.offsetWidth / 2 - cardWidth / 2),
        behavior: "smooth",
      });
    },
    []
  );

  // Auto-slide cada 4 segundos
  useEffect(() => {
    if (isPaused) return;

    intervalRef.current = setInterval(() => {
      setActiveIndex((prev) => {
        const next = (prev + 1) % abogados.length;
        scrollTo(next);
        return next;
      });
    }, 4000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPaused, scrollTo]);

  const handleScroll = () => {
    if (!containerRef.current) return;
    const { scrollLeft, clientWidth } = containerRef.current;
    const newIndex = Math.round(
      (scrollLeft + clientWidth / 2 - cardWidth / 2) / cardWidth
    );
    setActiveIndex(
      Math.max(0, Math.min(newIndex, abogados.length - 1))
    );
  };

  return (
    <section id="equipo" className="py-24 bg-burgos-navy relative overflow-hidden">
      {/* Background subtle */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(201,168,76,0.4) 1px, transparent 0)`,
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <div className="relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 px-4"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Nuestro Equipo
          </h2>
          <p className="text-white/50 max-w-2xl mx-auto">
            Profesionales comprometidos con la excelencia. Deslizá para conocer
            a nuestro equipo.
          </p>
        </motion.div>

        {/* Carousel */}
        <div
          className="relative"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={() => setIsPaused(true)}
          onTouchEnd={() => setIsPaused(false)}
        >
          {/* Navigation arrows */}
          <button
            onClick={() => scrollTo(activeIndex - 1)}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white/10 hover:bg-burgos-gold/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:text-burgos-gold transition-colors"
            aria-label="Anterior"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={() => scrollTo(activeIndex + 1)}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white/10 hover:bg-burgos-gold/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:text-burgos-gold transition-colors"
            aria-label="Siguiente"
          >
            <ChevronRight size={20} />
          </button>

          {/* Cards container */}
          <div
            ref={containerRef}
            onScroll={handleScroll}
            className="flex gap-4 overflow-x-auto scrollbar-hide px-[calc(50vw-170px)] sm:px-[calc(50vw-180px)] py-4 snap-x snap-mandatory"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {abogados.map((abogado, index) => (
              <div
                key={abogado.id}
                className="snap-center"
                onClick={() => {
                  setIsPaused(true);
                  scrollTo(index);
                  setTimeout(() => setIsPaused(false), 6000);
                }}
              >
                <AbogadoCard
                  abogado={abogado}
                  isActive={index === activeIndex}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Dots indicator */}
        <div className="flex justify-center gap-2 mt-6">
          {abogados.map((_, index) => (
            <button
              key={index}
              onClick={() => scrollTo(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === activeIndex
                  ? "bg-burgos-gold w-6"
                  : "bg-white/20 hover:bg-white/40 w-2"
              }`}
              aria-label={`Ir al abogado ${index + 1}`}
            />
          ))}
        </div>

        {/* Hint text */}
        <p className="text-center text-white/30 text-xs mt-4 tracking-widest uppercase">
          Deslizá para conocer más
        </p>
      </div>
    </section>
  );
}
