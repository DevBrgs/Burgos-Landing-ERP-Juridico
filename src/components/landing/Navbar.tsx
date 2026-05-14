"use client";

import { useState } from "react";
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

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-burgos-navy/95 backdrop-blur-sm border-b border-burgos-navy-light">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/logo-burgos.png"
              alt="Burgos & Asociados"
              width={36}
              height={36}
              className="rounded-sm"
            />
            <span className="text-burgos-gold font-bold text-xl tracking-tight">
              Burgos
            </span>
            <span className="text-white/80 text-sm font-light">
              & Asociados
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-white/70 hover:text-burgos-gold transition-colors text-sm font-medium"
              >
                {link.label}
              </a>
            ))}
            <Link
              href="/portal"
              className="bg-burgos-gold hover:bg-burgos-gold-dark text-burgos-navy px-4 py-2 rounded-md text-sm font-semibold transition-colors"
            >
              Portal Clientes
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-white/80 hover:text-burgos-gold transition-colors"
            aria-label="Abrir menú"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Nav */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden overflow-hidden"
            >
              <div className="py-4 space-y-3 border-t border-burgos-navy-light">
                {navLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className="block text-white/70 hover:text-burgos-gold transition-colors text-sm font-medium py-2"
                  >
                    {link.label}
                  </a>
                ))}
                <Link
                  href="/portal"
                  onClick={() => setIsOpen(false)}
                  className="block bg-burgos-gold hover:bg-burgos-gold-dark text-burgos-navy px-4 py-2 rounded-md text-sm font-semibold transition-colors text-center mt-4"
                >
                  Portal Clientes
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
}
