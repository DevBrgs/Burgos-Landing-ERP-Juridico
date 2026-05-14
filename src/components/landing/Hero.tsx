"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Play } from "lucide-react";
import Image from "next/image";
import { useRef } from "react";

export function Hero() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);

  return (
    <section
      ref={ref}
      id="inicio"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Video/Image Background — configurable en el futuro */}
      <motion.div className="absolute inset-0" style={{ scale }}>
        {/* Por defecto imagen oscura. En futuro: video o imagen configurable */}
        <div className="absolute inset-0 bg-burgos-black" />
        {/* Gradient mesh background */}
        <div
          className="absolute inset-0 opacity-30"
          style={{
            background: `
              radial-gradient(ellipse at 20% 50%, rgba(201, 168, 76, 0.08) 0%, transparent 50%),
              radial-gradient(ellipse at 80% 20%, rgba(201, 168, 76, 0.05) 0%, transparent 40%),
              radial-gradient(ellipse at 50% 80%, rgba(201, 168, 76, 0.03) 0%, transparent 50%)
            `,
          }}
        />
      </motion.div>

      {/* Animated grid lines */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(rgba(201, 168, 76, 0.5) 1px, transparent 1px),
              linear-gradient(90deg, rgba(201, 168, 76, 0.5) 1px, transparent 1px)
            `,
            backgroundSize: "80px 80px",
          }}
        />
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-burgos-gold/30 rounded-full"
            style={{
              left: `${15 + i * 15}%`,
              top: `${20 + (i % 3) * 25}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.6, 0.2],
            }}
            transition={{
              duration: 4 + i,
              repeat: Infinity,
              delay: i * 0.8,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Content */}
      <motion.div
        style={{ y, opacity }}
        className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
      >
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="mb-10"
        >
          <div className="relative inline-block">
            <Image
              src="/logo-burgos.png"
              alt="Burgos & Asociados"
              width={90}
              height={90}
              className="mx-auto rounded-xl"
              priority
            />
            {/* Glow behind logo */}
            <div className="absolute inset-0 bg-burgos-gold/20 blur-3xl rounded-full scale-150" />
          </div>
        </motion.div>

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        >
          <h1 className="text-5xl sm:text-6xl lg:text-8xl font-bold tracking-tight mb-2">
            <span className="text-burgos-white">Burgos</span>
            <span className="text-gradient-gold"> & </span>
            <span className="text-burgos-white">Asociados</span>
          </h1>
        </motion.div>

        {/* Divider line */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="w-24 h-[1px] bg-gradient-to-r from-transparent via-burgos-gold to-transparent mx-auto my-6"
        />

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="text-sm sm:text-base uppercase tracking-[0.3em] text-burgos-gold/80 font-medium mb-6"
        >
          Estudio Jurídico
        </motion.p>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="text-base sm:text-lg text-burgos-gray-400 max-w-xl mx-auto mb-12 leading-relaxed"
        >
          Soluciones legales integrales con compromiso, experiencia y
          resultados. Innovación al servicio de la justicia.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <a
            href="#contacto"
            className="group relative inline-flex items-center justify-center gap-2 bg-burgos-gold hover:bg-burgos-gold-light text-burgos-black px-8 py-4 rounded-full font-semibold transition-all duration-300 hover:shadow-[0_0_30px_rgba(201,168,76,0.3)]"
          >
            Consulta Inicial
            <ArrowRight
              size={18}
              className="group-hover:translate-x-1 transition-transform"
            />
          </a>
          <a
            href="#equipo"
            className="inline-flex items-center justify-center gap-2 border border-burgos-gray-600 hover:border-burgos-gold/50 text-burgos-gray-200 hover:text-burgos-gold px-8 py-4 rounded-full font-medium transition-all duration-300"
          >
            Conocé al Equipo
          </a>
        </motion.div>
      </motion.div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-burgos-black to-transparent" />

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
          className="flex flex-col items-center gap-2"
        >
          <span className="text-[10px] uppercase tracking-[0.2em] text-burgos-gray-600">
            Scroll
          </span>
          <div className="w-[1px] h-8 bg-gradient-to-b from-burgos-gold/50 to-transparent" />
        </motion.div>
      </motion.div>
    </section>
  );
}
