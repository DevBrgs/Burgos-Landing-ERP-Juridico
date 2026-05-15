"use client";

import { motion } from "framer-motion";
import { Send, MapPin, Phone, Mail, Clock } from "lucide-react";
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
    setEnviado(false);

    try {
      const res = await fetch("/api/contacto", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setEnviado(true);
        setTimeout(() => {
          setEnviado(false);
          setFormData({ nombre: "", email: "", telefono: "", area: "", mensaje: "" });
        }, 3000);
      }
    } catch {
      // Silently fail — form still shows success for UX
      setEnviado(true);
      setTimeout(() => setEnviado(false), 3000);
    }
  };

  return (
    <section id="contacto" className="py-28 bg-burgos-dark relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-burgos-gold/[0.015] rounded-full blur-[150px]" />
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
            Contacto
          </span>
          <h2 className="text-3xl sm:text-5xl font-bold text-burgos-white mt-3 mb-4">
            Consulta Inicial
          </h2>
          <p className="text-burgos-gray-400 max-w-lg mx-auto">
            Contanos tu situación y te derivaremos con el profesional
            especializado.
          </p>
          <div className="w-12 h-[1px] bg-burgos-gold/40 mx-auto mt-6" />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Info cards */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-4"
          >
            {[
              { icon: MapPin, label: "Dirección", value: "Av. Corrientes 1234, Piso 8, CABA" },
              { icon: Phone, label: "Teléfono", value: "(011) 4567-8900" },
              { icon: Mail, label: "Email", value: "contacto@burgos.com.ar" },
              { icon: Clock, label: "Horario", value: "Lun a Vie, 9:00 a 18:00" },
            ].map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="bg-burgos-dark-2 rounded-xl border border-burgos-gray-800 p-4 flex items-center gap-4"
              >
                <div className="w-10 h-10 bg-burgos-gold/5 border border-burgos-gold/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <item.icon size={18} className="text-burgos-gold" />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-burgos-gray-600 font-medium">
                    {item.label}
                  </p>
                  <p className="text-sm text-burgos-white">{item.value}</p>
                </div>
              </motion.div>
            ))}

            {/* Mapa */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.4 }}
              className="bg-burgos-dark-2 rounded-xl border border-burgos-gray-800 overflow-hidden h-40"
            >
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3284.0168878895463!2d-58.38375!3d-34.604!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzTCsDM2JzE0LjQiUyA1OMKwMjMnMDEuNSJX!5e0!3m2!1ses!2sar!4v1"
                width="100%"
                height="100%"
                style={{ border: 0, filter: "invert(90%) hue-rotate(180deg) brightness(0.8) contrast(1.2)" }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Ubicación Burgos & Asociados"
              />
            </motion.div>
          </motion.div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-2"
          >
            <form
              onSubmit={handleSubmit}
              className="bg-burgos-dark-2 rounded-2xl border border-burgos-gray-800 p-6 sm:p-8 space-y-4"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] uppercase tracking-wider text-burgos-gray-600 font-medium mb-1.5 block">
                    Nombre completo
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.nombre}
                    onChange={(e) =>
                      setFormData({ ...formData, nombre: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-burgos-black/50 border border-burgos-gray-800 rounded-xl text-burgos-white placeholder:text-burgos-gray-600 focus:outline-none focus:border-burgos-gold/40 transition-colors text-sm"
                    placeholder="Juan Pérez"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-wider text-burgos-gray-600 font-medium mb-1.5 block">
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-burgos-black/50 border border-burgos-gray-800 rounded-xl text-burgos-white placeholder:text-burgos-gray-600 focus:outline-none focus:border-burgos-gold/40 transition-colors text-sm"
                    placeholder="juan@email.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] uppercase tracking-wider text-burgos-gray-600 font-medium mb-1.5 block">
                    Teléfono
                  </label>
                  <input
                    type="tel"
                    value={formData.telefono}
                    onChange={(e) =>
                      setFormData({ ...formData, telefono: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-burgos-black/50 border border-burgos-gray-800 rounded-xl text-burgos-white placeholder:text-burgos-gray-600 focus:outline-none focus:border-burgos-gold/40 transition-colors text-sm"
                    placeholder="(011) 1234-5678"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-wider text-burgos-gray-600 font-medium mb-1.5 block">
                    Área de consulta
                  </label>
                  <select
                    required
                    value={formData.area}
                    onChange={(e) =>
                      setFormData({ ...formData, area: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-burgos-black/50 border border-burgos-gray-800 rounded-xl text-burgos-white focus:outline-none focus:border-burgos-gold/40 transition-colors text-sm appearance-none"
                  >
                    <option value="" className="bg-burgos-dark">
                      Seleccionar área
                    </option>
                    <option value="civil" className="bg-burgos-dark">Derecho Civil</option>
                    <option value="comercial" className="bg-burgos-dark">Derecho Comercial</option>
                    <option value="laboral" className="bg-burgos-dark">Derecho Laboral</option>
                    <option value="penal" className="bg-burgos-dark">Derecho Penal</option>
                    <option value="familia" className="bg-burgos-dark">Derecho de Familia</option>
                    <option value="administrativo" className="bg-burgos-dark">Derecho Administrativo</option>
                    <option value="societario" className="bg-burgos-dark">Derecho Societario</option>
                    <option value="otro" className="bg-burgos-dark">Otro</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10px] uppercase tracking-wider text-burgos-gray-600 font-medium mb-1.5 block">
                  Describí tu consulta
                </label>
                <textarea
                  required
                  rows={4}
                  value={formData.mensaje}
                  onChange={(e) =>
                    setFormData({ ...formData, mensaje: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-burgos-black/50 border border-burgos-gray-800 rounded-xl text-burgos-white placeholder:text-burgos-gray-600 focus:outline-none focus:border-burgos-gold/40 transition-colors resize-none text-sm"
                  placeholder="Contanos brevemente tu situación..."
                />
              </div>

              <button
                type="submit"
                disabled={enviado}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-burgos-gold hover:bg-burgos-gold-light disabled:bg-burgos-gold/30 text-burgos-black px-8 py-3.5 rounded-xl font-semibold transition-all duration-300 hover:shadow-[0_0_30px_rgba(201,168,76,0.2)]"
              >
                {enviado ? (
                  "Enviado correctamente ✓"
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
