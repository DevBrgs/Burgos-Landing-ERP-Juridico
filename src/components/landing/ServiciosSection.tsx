"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { MessageSquare, FileText } from "lucide-react";

export function ServiciosSection() {
  const [jusVerbal, setJusVerbal] = useState<number>(0);
  const [jusEscrito, setJusEscrito] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const res = await fetch("/api/configuracion");
        const data = await res.json();
        if (data.jus_verbal) setJusVerbal(Number(data.jus_verbal));
        if (data.jus_escrito) setJusEscrito(Number(data.jus_escrito));
      } catch {}
      setLoading(false);
    };
    fetchConfig();
  }, []);

  if (loading || (jusVerbal === 0 && jusEscrito === 0)) return null;

  return (
    <section id="servicios" className="py-28 bg-burgos-dark relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-burgos-gold/[0.02] rounded-full blur-[120px]" />
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
            Honorarios
          </span>
          <h2 className="text-3xl sm:text-5xl font-bold text-burgos-white mt-3 mb-4">
            Costos de Consulta
          </h2>
          <p className="text-burgos-gray-400 max-w-lg mx-auto">
            Valores de referencia para consultas profesionales.
            La primera consulta es sin cargo.
          </p>
          <div className="w-12 h-[1px] bg-burgos-gold/40 mx-auto mt-6" />
        </motion.div>

        {/* Cards de JUS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto mb-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-burgos-dark-2 rounded-2xl border border-burgos-gray-800 hover:border-burgos-gold/20 p-8 text-center transition-all duration-300 group"
          >
            <div className="w-14 h-14 bg-burgos-gold/5 border border-burgos-gold/10 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-burgos-gold/10 transition-colors">
              <MessageSquare size={24} className="text-burgos-gold" />
            </div>
            <h3 className="text-lg font-semibold text-burgos-white mb-2">
              Consulta Verbal
            </h3>
            <p className="text-3xl font-bold text-burgos-gold mb-1">
              ${jusVerbal.toLocaleString("es-AR")}
            </p>
            <p className="text-xs text-burgos-gray-600">
              Asesoramiento presencial o virtual
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-burgos-dark-2 rounded-2xl border border-burgos-gray-800 hover:border-burgos-gold/20 p-8 text-center transition-all duration-300 group"
          >
            <div className="w-14 h-14 bg-burgos-gold/5 border border-burgos-gold/10 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-burgos-gold/10 transition-colors">
              <FileText size={24} className="text-burgos-gold" />
            </div>
            <h3 className="text-lg font-semibold text-burgos-white mb-2">
              Consulta Escrita
            </h3>
            <p className="text-3xl font-bold text-burgos-gold mb-1">
              ${jusEscrito.toLocaleString("es-AR")}
            </p>
            <p className="text-xs text-burgos-gray-600">
              Dictamen o informe escrito
            </p>
          </motion.div>
        </div>

        {/* Nota */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <p className="text-xs text-burgos-gray-600">
            Valores actualizados por el estudio. Los honorarios definitivos se pactan según la complejidad del caso.
          </p>
          <a
            href="#contacto"
            className="inline-block mt-3 text-sm text-burgos-gold hover:text-burgos-gold-light font-medium transition-colors"
          >
            Primera consulta sin cargo →
          </a>
        </motion.div>
      </div>
    </section>
  );
}
