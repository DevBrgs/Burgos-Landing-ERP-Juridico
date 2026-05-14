"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const navLinks = [
  { href: "#inicio", label: "Inicio" },
  { href: "#newsletter", label: "Novedades" },
  { href: "#equipo", label: "Equipo" },
  { href: "#areas", label: "Áreas" },
  { href: "#contacto", label: "Contacto" },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "glass shadow-lg"
          : "bg-transparent"
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <Image
              src="/logo-burgos.png"
              alt="Burgos & Asociados"
              width={32}
              height={32}
              className="rounded-sm group-hover:scale-105 transition-transform duration-300"
            />
            <div className="flex items-baseline gap-1.5">
              <span className="text-burgos-gold font-bold text-lg tracking-tight">
                Burgos
              </span>
              <span className="text-burgos-gray-400 text-xs font-light hidden sm:inline">
                & Asociados
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="relative px-4 py-2 text-burgos-gray-400 hover:text-burgos-gold transition-colors text-sm font-medium group"
              >
                {link.label}
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[1px] bg-burgos-gold group-hover:w-4/5 transition-all duration-300" />
              </a>
            ))}
            <Link
              href="/portal"
              className="ml-4 bg-burgos-gold/10 hover:bg-burgos-gold/20 text-burgos-gold border border-burgos-gold/30 hover:border-burgos-gold/60 px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300"
            >
              Portal Clientes
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-burgos-gray-400 hover:text-burgos-gold transition-colors p-2"
            aria-label="Abrir menú"
          >
            {isOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile Nav */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden overflow-hidden"
            >
              <div className="py-4 space-y-1 border-t border-burgos-gray-800">
                {navLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className="block text-burgos-gray-400 hover:text-burgos-gold transition-colors text-sm font-medium py-3 px-2"
                  >
                    {link.label}
                  </a>
                ))}
                <Link
                  href="/portal"
                  onClick={() => setIsOpen(false)}
                  className="block bg-burgos-gold/10 text-burgos-gold border border-burgos-gold/30 px-4 py-3 rounded-xl text-sm font-semibold text-center mt-4"
                >
                  Portal Clientes
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </motion.header>
  );
}
