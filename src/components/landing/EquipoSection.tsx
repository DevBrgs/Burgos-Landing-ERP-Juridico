"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useCallback } from "react";
import { Calendar, ChevronLeft, ChevronRight, ArrowRight, MessageCircle, X, CheckCircle, Loader2 } from "lucide-react";
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
  whatsapp: string | null;
}

function ReservarTurnoModal({ abogado, onClose }: { abogado: Abogado; onClose: () => void }) {
  const [nombre, setNombre] = useState("");
  const [dni, setDni] = useState("");
  const [fecha, setFecha] = useState("");
  const [hora, setHora] = useState("");
  const [motivo, setMotivo] = useState("");
  const [slotsDisponibles, setSlotsDisponibles] = useState<string[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  // Fetch available slots when date changes
  useEffect(() => {
    if (!fecha) { setSlotsDisponibles([]); return; }
    const fetchSlots = async () => {
      setLoadingSlots(true);
      setHora("");
      try {
        const res = await fetch(`/api/disponibilidad?abogadoId=${abogado.id}&fecha=${fecha}`);
        const data = await res.json();
        setSlotsDisponibles(data.slotsDisponibles || []);
      } catch {
        setSlotsDisponibles([]);
      } finally {
        setLoadingSlots(false);
      }
    };
    fetchSlots();
  }, [fecha, abogado.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre || !dni || !fecha || !hora || !motivo) {
      setError("Completá todos los campos");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      const { createClient } = await import("@/lib/supabase/client");
      const supabase = createClient();
      const { error: insertError } = await supabase.from("turnos").insert({
        abogado_id: abogado.id,
        nombre_cliente: nombre,
        dni_cliente: dni,
        fecha,
        hora: hora + ":00",
        motivo,
        estado: "pendiente",
        origen: "web",
      });
      if (insertError) throw insertError;
      setSuccess(true);
    } catch {
      setError("No se pudo crear el turno. Intentá de nuevo.");
    } finally {
      setSubmitting(false);
    }
  };

  // Min date = tomorrow
  const minDate = new Date(Date.now() + 86400000).toISOString().split("T")[0];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ duration: 0.3 }}
        className="relative bg-burgos-dark border border-burgos-gray-800 rounded-2xl w-full max-w-md p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-burgos-gray-400 hover:text-burgos-white transition-colors" aria-label="Cerrar">
          <X size={20} />
        </button>

        {success ? (
          <div className="text-center py-8">
            <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-burgos-white mb-2">¡Turno solicitado!</h3>
            <p className="text-burgos-gray-400 text-sm">Tu turno con {abogado.nombre} fue registrado. Te contactaremos para confirmar.</p>
            <button onClick={onClose} className="mt-6 px-6 py-2.5 bg-burgos-gold hover:bg-burgos-gold-light text-burgos-black rounded-full text-sm font-medium transition-colors">
              Cerrar
            </button>
          </div>
        ) : (
          <>
            <h3 className="text-lg font-bold text-burgos-white mb-1">Reservar turno</h3>
            <p className="text-burgos-gold text-sm mb-5">con {abogado.nombre}</p>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="text-xs text-burgos-gray-400 mb-1 block">Nombre completo</label>
                <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Tu nombre" className="w-full px-3 py-2.5 bg-burgos-black/50 border border-burgos-gray-800 rounded-xl text-sm text-burgos-white placeholder:text-burgos-gray-600 focus:outline-none focus:border-burgos-gold/30 transition-colors" />
              </div>
              <div>
                <label className="text-xs text-burgos-gray-400 mb-1 block">DNI</label>
                <input type="text" value={dni} onChange={(e) => setDni(e.target.value)} placeholder="12345678" className="w-full px-3 py-2.5 bg-burgos-black/50 border border-burgos-gray-800 rounded-xl text-sm text-burgos-white placeholder:text-burgos-gray-600 focus:outline-none focus:border-burgos-gold/30 transition-colors" />
              </div>
              <div>
                <label className="text-xs text-burgos-gray-400 mb-1 block">Fecha</label>
                <input type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} min={minDate} className="w-full px-3 py-2.5 bg-burgos-black/50 border border-burgos-gray-800 rounded-xl text-sm text-burgos-white focus:outline-none focus:border-burgos-gold/30 transition-colors" />
              </div>
              <div>
                <label className="text-xs text-burgos-gray-400 mb-1 block">Hora</label>
                {loadingSlots ? (
                  <div className="flex items-center gap-2 text-burgos-gray-400 text-sm py-2"><Loader2 size={14} className="animate-spin" /> Cargando horarios...</div>
                ) : fecha && slotsDisponibles.length === 0 ? (
                  <p className="text-red-400 text-xs py-2">No hay horarios disponibles para esta fecha</p>
                ) : (
                  <select value={hora} onChange={(e) => setHora(e.target.value)} className="w-full px-3 py-2.5 bg-burgos-black/50 border border-burgos-gray-800 rounded-xl text-sm text-burgos-white focus:outline-none focus:border-burgos-gold/30 transition-colors" disabled={!fecha}>
                    <option value="">Seleccioná un horario</option>
                    {slotsDisponibles.map((slot) => (
                      <option key={slot} value={slot}>{slot} hs</option>
                    ))}
                  </select>
                )}
              </div>
              <div>
                <label className="text-xs text-burgos-gray-400 mb-1 block">Motivo de la consulta</label>
                <textarea value={motivo} onChange={(e) => setMotivo(e.target.value)} placeholder="Breve descripción..." rows={2} className="w-full px-3 py-2.5 bg-burgos-black/50 border border-burgos-gray-800 rounded-xl text-sm text-burgos-white placeholder:text-burgos-gray-600 focus:outline-none focus:border-burgos-gold/30 transition-colors resize-none" />
              </div>

              {error && <p className="text-red-400 text-xs">{error}</p>}

              <button type="submit" disabled={submitting || !nombre || !dni || !fecha || !hora || !motivo} className="w-full py-3 bg-burgos-gold hover:bg-burgos-gold-light disabled:bg-burgos-gray-800 disabled:text-burgos-gray-600 text-burgos-black font-medium rounded-xl text-sm transition-colors flex items-center justify-center gap-2">
                {submitting ? <><Loader2 size={14} className="animate-spin" /> Enviando...</> : <><Calendar size={14} /> Solicitar turno</>}
              </button>
            </form>
          </>
        )}
      </motion.div>
    </div>
  );
}

const slideVariants = {
  enter: (direction: number) => ({ x: direction > 0 ? 300 : -300, opacity: 0, scale: 0.9 }),
  center: { x: 0, opacity: 1, scale: 1 },
  exit: (direction: number) => ({ x: direction < 0 ? 300 : -300, opacity: 0, scale: 0.9 }),
};

// Fallback data si la API no responde
const fallbackAbogados: Abogado[] = [
  { id: "1", nombre: "Cargando equipo...", especialidad: "", matricula: null, rol: "asociado", bio: null, foto_url: null, fondo_url: null, whatsapp: null },
];

export function EquipoSection() {
  const [[activeIndex, direction], setActiveIndex] = useState([0, 0]);
  const [isPaused, setIsPaused] = useState(false);
  const [abogados, setAbogados] = useState<Abogado[]>(fallbackAbogados);
  const [showReserva, setShowReserva] = useState(false);
  const [reservaAbogado, setReservaAbogado] = useState<Abogado | null>(null);

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
                    <div className="flex gap-3 justify-center flex-wrap">
                      <button onClick={() => { setReservaAbogado(abogado); setShowReserva(true); }} className="inline-flex items-center gap-2 bg-burgos-gold/10 hover:bg-burgos-gold/20 text-burgos-gold border border-burgos-gold/30 px-5 py-2.5 rounded-full text-sm font-medium transition-all">
                        <Calendar size={14} /> Reservar turno
                      </button>
                      {abogado.whatsapp && (
                        <a href={`https://wa.me/${abogado.whatsapp}?text=Hola, me contacto desde la web de Burgos %26 Asociados`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-green-500/10 hover:bg-green-500/20 text-green-400 border border-green-500/30 px-4 py-2.5 rounded-full text-sm font-medium transition-all">
                          <MessageCircle size={14} /> WhatsApp
                        </a>
                      )}
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

      {/* Modal de reserva de turno */}
      <AnimatePresence>
        {showReserva && reservaAbogado && (
          <ReservarTurnoModal abogado={reservaAbogado} onClose={() => { setShowReserva(false); setReservaAbogado(null); }} />
        )}
      </AnimatePresence>
    </section>
  );
}
