"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Image from "next/image";

export function Hero() {
  return (
    <section
      id="inicio"
      className="relative min-h-screen flex items-center justify-center bg-burgos-navy overflow-hidden"
    >
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(201,168,76,0.3) 1px, transparent 0)`,
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-burgos-navy via-burgos-navy/95 to-burgos-navy-light" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mb-8"
        >
          <Image
            src="/logo-burgos.png"
            alt="Burgos & Asociados"
            width={100}
            height={100}
            className="mx-auto rounded-lg shadow-2xl"
            priority
          />
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-4xl sm:text-5xl lg:text-7xl font-bold text-white mb-4"
        >
          Burgos{" "}
          <span className="text-burgos-gold">&</span>{" "}
          Asociados
        </motion.h1>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="text-lg sm:text-xl text-white/60 font-light mb-4 tracking-wide"
        >
          Estudio Jurídico
        </motion.p>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.6 }}
          className="text-base sm:text-lg text-white/50 max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          Soluciones legales integrales con compromiso, experiencia y resultados.
          Acompañamos a nuestros clientes en cada etapa del proceso.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.8 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <a
            href="#contacto"
            className="inline-flex items-center justify-center gap-2 bg-burgos-gold hover:bg-burgos-gold-dark text-burgos-navy px-8 py-3 rounded-md font-semibold transition-colors"
          >
            Consulta Inicial
            <ArrowRight size={18} />
          </a>
          <a
            href="#areas"
            className="inline-flex items-center justify-center gap-2 border border-white/20 hover:border-burgos-gold/50 text-white/80 hover:text-burgos-gold px-8 py-3 rounded-md font-medium transition-colors"
          >
            Nuestras Áreas
          </a>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="w-6 h-10 border-2 border-white/20 rounded-full flex items-start justify-center p-1"
        >
          <div className="w-1.5 h-2.5 bg-burgos-gold/60 rounded-full" />
        </motion.div>
      </motion.div>
    </section>
  );
}
