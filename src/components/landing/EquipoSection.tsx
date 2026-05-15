"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useCallback } from "react";
import { Calendar, ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import Link from "next/link";

interface Abogado {
  id: string;
  nombre: string;
  especialidad: string;
  matricula: string | null;
  rol: string;
  bio: string | null;
  foto_url: string | null;
  fondo_url: string | null;
}

const slideVariants = {
  enter: (direction: number) => ({ x: direction > 0 ? 300 : -300, opacity: 0, scale: 0.9 }),
  center: { x: 0, opacity: 1, scale: 1 },
  exit: (direction: number) => ({ x: direction < 0 ? 300 : -300, opacity: 0, scale: 0.9 }),
};

// Fallback data si la API no responde
const fallbackAbogados: Abogado[] = [
  { id: "1", nombre: "Cargando equipo...", especialidad: "", matricula: null, rol: "asociado", bio: null, foto_url: null, fondo_url: null },
];

export function EquipoSection() {
  const [[activeIndex, direction], setActiveIndex] = useState([0, 0]);
  const [isPaused, setIsPaused] = useState(false);
  const [abogados, setAbogados] = useState<Abogado[]>(fallbackAbogados);

  useEffect(() => {
    const fetchEquipo = async () => {
      try {
        const res = await fetch("/api/equipo");
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) setAbogados(data);
      } catch {}
    };
    fetchEquipo();
  }, []);

  const paginate = useCallback((newDirection: number) => {
    setActiveIndex(([prev]) => {
      const next = ((prev + newDirection) % abogados.length + abogados.length) % abogados.length;
      return [next, newDirection];
    });
  }, [abogados.length]);

  const goTo = (index: number) => {
    setActiveIndex(([prev]) => [index, index > prev ? 1 : -1]);
  };

  useEffect(() => {
    if (isPaused || abogados.length <= 1) return;
    const interval = setInterval(() => paginate(1), 5000);
    return () => clearInterval(interval);
  }, [isPaused, paginate, abogados.length]);

  const abogado = abogados[activeIndex] || abogados[0];
  if (!abogado) return null;

  return (
    <section id="equipo" className="py-28 bg-burgos-black relative overflow-hidden" onMouseEnter={() => setIsPaused(true)} onMouseLeave={() => setIsPaused(false)}>
      <div className="absolute inset-0">
        <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: `radial-gradient(circle at 1px 1px, rgba(201,168,76,1) 1px, transparent 0)`, backgroundSize: "50px 50px" }} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="text-center mb-16">
          <span className="text-xs uppercase tracking-[0.3em] text-burgos-gold/60 font-medium">Profesionales</span>
          <h2 className="text-3xl sm:text-5xl font-bold text-burgos-white mt-3 mb-4">Nuestro Equipo</h2>
          <div className="w-12 h-[1px] bg-burgos-gold/40 mx-auto" />
        </motion.div>

        <div className="relative max-w-lg mx-auto">
          <button onClick={() => paginate(-1)} className="absolute -left-4 sm:-left-16 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-burgos-dark-2 hover:bg-burgos-dark-3 border border-burgos-gray-800 hover:border-burgos-gold/30 rounded-full flex items-center justify-center text-burgos-gray-400 hover:text-burgos-gold transition-all" aria-label="Anterior">
            <ChevronLeft size={20} />
          </button>
          <button onClick={() => paginate(1)} className="absolute -right-4 sm:-right-16 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-burgos-dark-2 hover:bg-burgos-dark-3 border border-burgos-gray-800 hover:border-burgos-gold/30 rounded-full flex items-center justify-center text-burgos-gray-400 hover:text-burgos-gold transition-all" aria-label="Siguiente">
            <ChevronRight size={20} />
          </button>

          <div className="relative h-[480px] sm:h-[500px] overflow-hidden">
            <AnimatePresence initial={false} custom={direction} mode="wait">
              <motion.div key={activeIndex} custom={direction} variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }} className="absolute inset-0">
                <div className="h-full bg-burgos-dark rounded-3xl border border-burgos-gray-800 hover:border-burgos-gold/20 overflow-hidden transition-colors duration-500 gold-glow">
                  <div className="relative h-48 bg-gradient-to-b from-burgos-dark-3 to-burgos-dark flex items-center justify-center" style={abogado.fondo_url ? { backgroundImage: `url(${abogado.fondo_url})`, backgroundSize: "cover", backgroundPosition: "center" } : {}}>
                    {abogado.fondo_url && <div className="absolute inset-0 bg-burgos-dark/60" />}
                    <div className="relative w-28 h-28 rounded-full bg-burgos-dark-2 border-2 border-burgos-gold/20 flex items-center justify-center overflow-hidden">
                      {abogado.foto_url ? (
                        <img src={abogado.foto_url} alt={abogado.nombre} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-3xl font-bold text-burgos-gold/50">
                          {abogado.nombre.split(" ").filter((_, i, arr) => i === 0 || i === arr.length - 1).map((n) => n[0]).join("")}
                        </span>
                      )}
                    </div>
                    {abogado.rol === "director" && (
                      <div className="absolute top-4 right-4 bg-burgos-gold/10 border border-burgos-gold/30 text-burgos-gold text-[10px] uppercase tracking-wider font-semibold px-3 py-1 rounded-full">Director</div>
                    )}
                  </div>
                  <div className="p-8 text-center">
                    <h3 className="text-xl font-bold text-burgos-white mb-1">{abogado.nombre}</h3>
                    <p className="text-burgos-gold text-sm font-medium mb-1">{abogado.especialidad}</p>
                    {abogado.matricula && <p className="text-burgos-gray-600 text-xs mb-4">{abogado.matricula}</p>}
                    {abogado.bio && <p className="text-burgos-gray-400 text-sm leading-relaxed mb-6 line-clamp-3">{abogado.bio}</p>}
                    <div className="flex gap-3 justify-center">
                      <a href="#contacto" className="inline-flex items-center gap-2 bg-burgos-gold/10 hover:bg-burgos-gold/20 text-burgos-gold border border-burgos-gold/30 px-5 py-2.5 rounded-full text-sm font-medium transition-all">
                        <Calendar size={14} /> Reservar turno
                      </a>
                      <Link href={`/equipo/${abogado.id}`} className="inline-flex items-center gap-1 text-burgos-gray-400 hover:text-burgos-gold text-sm font-medium transition-colors px-4 py-2.5">
                        Ver perfil <ArrowRight size={14} />
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        <div className="flex justify-center gap-2 mt-8">
          {abogados.map((_, index) => (
            <button key={index} onClick={() => goTo(index)} className={`h-1.5 rounded-full transition-all duration-500 ${index === activeIndex ? "bg-burgos-gold w-8" : "bg-burgos-gray-800 hover:bg-burgos-gray-600 w-1.5"}`} aria-label={`Abogado ${index + 1}`} />
          ))}
        </div>
        <p className="text-center text-burgos-gray-600 text-xs mt-4 font-mono">
          {String(activeIndex + 1).padStart(2, "0")} / {String(abogados.length).padStart(2, "0")}
        </p>
      </div>
    </section>
  );
}
