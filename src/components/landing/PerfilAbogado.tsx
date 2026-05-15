"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Calendar, Mail, ArrowLeft, Scale, Briefcase, MessageCircle } from "lucide-react";
import Link from "next/link";

interface AbogadoData {
  id: string;
  nombre: string;
  especialidad: string;
  matricula: string | null;
  rol: string;
  bio: string | null;
  areas: string[];
  experiencia: string | null;
  email: string;
  foto_url: string | null;
  whatsapp: string | null;
}

export function PerfilAbogado({ id }: { id: string }) {
  const [abogado, setAbogado] = useState<AbogadoData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAbogado = async () => {
      try {
        const res = await fetch("/api/equipo");
        const data = await res.json();
        if (Array.isArray(data)) {
          const found = data.find((a: any) => a.id === id);
          if (found) setAbogado(found);
        }
      } catch {}
      setLoading(false);
    };
    fetchAbogado();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-burgos-black flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-burgos-gold/30 border-t-burgos-gold rounded-full animate-spin" />
      </div>
    );
  }

  if (!abogado) {
    return (
      <div className="min-h-screen bg-burgos-black flex items-center justify-center">
        <div className="text-center">
          <p className="text-burgos-gray-400 mb-4">Perfil no encontrado</p>
          <Link href="/#equipo" className="text-burgos-gold hover:text-burgos-gold-light text-sm">← Volver al equipo</Link>
        </div>
      </div>
    );
  }

  return (
    <section className="py-16 bg-burgos-black min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <Link href="/#equipo" className="inline-flex items-center gap-2 text-burgos-gray-400 hover:text-burgos-gold text-sm mb-8 transition-colors">
            <ArrowLeft size={16} /> Volver al equipo
          </Link>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="bg-burgos-dark rounded-3xl border border-burgos-gray-800 overflow-hidden">
          {/* Header con foto */}
          <div className="relative h-48 bg-gradient-to-br from-burgos-dark-3 to-burgos-dark-2 flex items-center justify-center" style={abogado.foto_url ? {} : {}}>
            <div className="w-32 h-32 rounded-full bg-burgos-dark border-2 border-burgos-gold/20 flex items-center justify-center overflow-hidden">
              {abogado.foto_url ? (
                <img src={abogado.foto_url} alt={abogado.nombre} className="w-full h-full object-cover" />
              ) : (
                <span className="text-4xl font-bold text-burgos-gold/50">
                  {abogado.nombre.split(" ").filter((_, i, arr) => i === 0 || i === arr.length - 1).map((n) => n[0]).join("")}
                </span>
              )}
            </div>
            {abogado.rol === "director" && (
              <div className="absolute top-4 right-4 bg-burgos-gold/10 border border-burgos-gold/30 text-burgos-gold text-[10px] uppercase tracking-wider font-semibold px-3 py-1 rounded-full">Director</div>
            )}
          </div>

          {/* Content */}
          <div className="p-8 sm:p-10">
            <h1 className="text-2xl sm:text-3xl font-bold text-burgos-white mb-1">{abogado.nombre}</h1>
            <p className="text-burgos-gold font-medium mb-1">{abogado.especialidad}</p>
            {abogado.matricula && <p className="text-burgos-gray-600 text-sm mb-6">{abogado.matricula}</p>}

            {abogado.bio && <p className="text-burgos-gray-400 leading-relaxed mb-8">{abogado.bio}</p>}

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              {abogado.experiencia && (
                <div className="bg-burgos-dark-2 rounded-xl border border-burgos-gray-800 p-4 text-center">
                  <Briefcase size={18} className="text-burgos-gold mx-auto mb-2" />
                  <p className="text-burgos-white font-semibold">{abogado.experiencia}</p>
                  <p className="text-burgos-gray-600 text-xs">Experiencia</p>
                </div>
              )}
              <div className="bg-burgos-dark-2 rounded-xl border border-burgos-gray-800 p-4 text-center">
                <Scale size={18} className="text-burgos-gold mx-auto mb-2" />
                <p className="text-burgos-white font-semibold">{abogado.areas?.length || 0}</p>
                <p className="text-burgos-gray-600 text-xs">Áreas de práctica</p>
              </div>
              <div className="bg-burgos-dark-2 rounded-xl border border-burgos-gray-800 p-4 text-center">
                <Mail size={18} className="text-burgos-gold mx-auto mb-2" />
                <p className="text-burgos-white font-semibold text-sm">{abogado.email}</p>
                <p className="text-burgos-gray-600 text-xs">Contacto</p>
              </div>
            </div>

            {/* Areas */}
            {abogado.areas && abogado.areas.length > 0 && (
              <div className="mb-8">
                <h3 className="text-sm font-semibold text-burgos-white mb-3">Áreas de práctica</h3>
                <div className="flex flex-wrap gap-2">
                  {abogado.areas.map((area) => (
                    <span key={area} className="px-3 py-1.5 bg-burgos-gold/5 border border-burgos-gold/20 text-burgos-gold text-xs rounded-full">{area}</span>
                  ))}
                </div>
              </div>
            )}

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3">
              <a href="/#contacto" className="inline-flex items-center justify-center gap-2 bg-burgos-gold hover:bg-burgos-gold-light text-burgos-black px-6 py-3 rounded-xl font-semibold transition-all text-sm">
                <Calendar size={16} /> Reservar turno
              </a>
              {abogado.whatsapp && (
                <a href={`https://wa.me/${abogado.whatsapp}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 bg-green-500/10 hover:bg-green-500/20 text-green-400 border border-green-500/30 px-6 py-3 rounded-xl font-medium transition-all text-sm">
                  <MessageCircle size={16} /> WhatsApp
                </a>
              )}
              <a href={`mailto:${abogado.email}`} className="inline-flex items-center justify-center gap-2 bg-burgos-dark-2 hover:bg-burgos-dark-3 border border-burgos-gray-800 text-burgos-gray-200 px-6 py-3 rounded-xl font-medium transition-all text-sm">
                <Mail size={16} /> Email
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
