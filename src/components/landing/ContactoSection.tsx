"use client";

import { motion } from "framer-motion";
import { Send, MapPin, Phone, Mail } from "lucide-react";
import { useState } from "react";

export function ContactoSection() {
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    telefono: "",
    area: "",
    mensaje: "",
  });
  const [enviado, setEnviado] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Conectar con API de contacto + derivación automática
    console.log("Formulario enviado:", formData);
    setEnviado(true);
    setTimeout(() => setEnviado(false), 3000);
  };

  return (
    <section id="contacto" className="py-24 bg-burgos-navy">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Consulta Inicial
            </h2>
            <p className="text-white/60 mb-8 leading-relaxed">
              Contanos tu situación y te derivaremos con el profesional
              especializado en tu caso. La primera consulta es sin cargo.
            </p>

            <div className="space-y-4">
              <div className="flex items-center gap-3 text-white/70">
                <MapPin size={20} className="text-burgos-gold" />
                <span>Av. Corrientes 1234, Piso 8, CABA</span>
              </div>
              <div className="flex items-center gap-3 text-white/70">
                <Phone size={20} className="text-burgos-gold" />
                <span>(011) 4567-8900</span>
              </div>
              <div className="flex items-center gap-3 text-white/70">
                <Mail size={20} className="text-burgos-gold" />
                <span>contacto@burgos.com.ar</span>
              </div>
            </div>
          </motion.div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Nombre completo"
                  required
                  value={formData.nombre}
                  onChange={(e) =>
                    setFormData({ ...formData, nombre: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/30 focus:outline-none focus:border-burgos-gold/50 transition-colors"
                />
                <input
                  type="email"
                  placeholder="Email"
                  required
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/30 focus:outline-none focus:border-burgos-gold/50 transition-colors"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  type="tel"
                  placeholder="Teléfono"
                  value={formData.telefono}
                  onChange={(e) =>
                    setFormData({ ...formData, telefono: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/30 focus:outline-none focus:border-burgos-gold/50 transition-colors"
                />
                <select
                  required
                  value={formData.area}
                  onChange={(e) =>
                    setFormData({ ...formData, area: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/30 focus:outline-none focus:border-burgos-gold/50 transition-colors appearance-none"
                >
                  <option value="" className="bg-burgos-navy">
                    Área de consulta
                  </option>
                  <option value="civil" className="bg-burgos-navy">
                    Derecho Civil
                  </option>
                  <option value="comercial" className="bg-burgos-navy">
                    Derecho Comercial
                  </option>
                  <option value="laboral" className="bg-burgos-navy">
                    Derecho Laboral
                  </option>
                  <option value="penal" className="bg-burgos-navy">
                    Derecho Penal
                  </option>
                  <option value="familia" className="bg-burgos-navy">
                    Derecho de Familia
                  </option>
                  <option value="otro" className="bg-burgos-navy">
                    Otro
                  </option>
                </select>
              </div>

              <textarea
                placeholder="Describí brevemente tu consulta..."
                required
                rows={4}
                value={formData.mensaje}
                onChange={(e) =>
                  setFormData({ ...formData, mensaje: e.target.value })
                }
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/30 focus:outline-none focus:border-burgos-gold/50 transition-colors resize-none"
              />

              <button
                type="submit"
                disabled={enviado}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-burgos-gold hover:bg-burgos-gold-dark disabled:bg-burgos-gold/50 text-burgos-navy px-8 py-3 rounded-lg font-semibold transition-colors"
              >
                {enviado ? (
                  "Enviado ✓"
                ) : (
                  <>
                    Enviar Consulta
                    <Send size={16} />
                  </>
                )}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
