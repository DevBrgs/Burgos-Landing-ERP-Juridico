"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import {
  FolderOpen,
  Plus,
  Search,
  Filter,
  MoreVertical,
  Eye,
} from "lucide-react";
import Link from "next/link";

// Datos placeholder
const expedientes = [
  {
    id: "1",
    caratula: "García, Juan c/ López, María s/ Daños y Perjuicios",
    numero: "45.231/2024",
    fuero: "Civil",
    juzgado: "Juzgado Civil N° 45",
    estado: "activo",
    abogado: "Dr. Martín Burgos",
    cliente: "Juan García",
    ultimaActuacion: "Contestación de demanda presentada",
    fecha: "12 May 2025",
  },
  {
    id: "2",
    caratula: "Martínez, Pedro c/ OSDE s/ Amparo",
    numero: "12.876/2025",
    fuero: "Laboral",
    juzgado: "Juzgado Laboral N° 12",
    estado: "activo",
    abogado: "Dra. Laura Méndez",
    cliente: "Pedro Martínez",
    ultimaActuacion: "Audiencia preliminar fijada",
    fecha: "10 May 2025",
  },
  {
    id: "3",
    caratula: "Rodríguez, Ana c/ Estado Nacional s/ Recurso",
    numero: "8.432/2024",
    fuero: "Administrativo",
    juzgado: "Cámara Federal",
    estado: "en_espera",
    abogado: "Dr. Alejandro Torres",
    cliente: "Ana Rodríguez",
    ultimaActuacion: "Esperando resolución de Cámara",
    fecha: "5 May 2025",
  },
  {
    id: "4",
    caratula: "Fernández c/ Fernández s/ Divorcio",
    numero: "22.109/2025",
    fuero: "Familia",
    juzgado: "Juzgado de Familia N° 3",
    estado: "activo",
    abogado: "Dra. Carolina Vega",
    cliente: "María Fernández",
    ultimaActuacion: "Mediación programada",
    fecha: "8 May 2025",
  },
  {
    id: "5",
    caratula: "Gómez, Ricardo s/ Estafa",
    numero: "3.211/2024",
    fuero: "Penal",
    juzgado: "Juzgado Penal N° 7",
    estado: "cerrado",
    abogado: "Dr. Federico Ruiz",
    cliente: "Ricardo Gómez",
    ultimaActuacion: "Sentencia absolutoria firme",
    fecha: "1 May 2025",
  },
];

const estadoStyles: Record<string, string> = {
  activo: "bg-green-500/10 text-green-400 border-green-500/20",
  en_espera: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  cerrado: "bg-burgos-gray-600/10 text-burgos-gray-400 border-burgos-gray-600/20",
  archivado: "bg-blue-500/10 text-blue-400 border-blue-500/20",
};

const estadoLabels: Record<string, string> = {
  activo: "Activo",
  en_espera: "En espera",
  cerrado: "Cerrado",
  archivado: "Archivado",
};

export default function ExpedientesPage() {
  const [filtroEstado, setFiltroEstado] = useState("todos");
  const [busqueda, setBusqueda] = useState("");

  const filtered = expedientes.filter((exp) => {
    const matchEstado = filtroEstado === "todos" || exp.estado === filtroEstado;
    const matchBusqueda =
      busqueda === "" ||
      exp.caratula.toLowerCase().includes(busqueda.toLowerCase()) ||
      exp.numero.includes(busqueda) ||
      exp.cliente.toLowerCase().includes(busqueda.toLowerCase());
    return matchEstado && matchBusqueda;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl font-bold text-burgos-white flex items-center gap-2">
            <FolderOpen size={24} className="text-burgos-gold" />
            Expedientes
          </h1>
          <p className="text-burgos-gray-400 text-sm mt-1">
            {expedientes.length} expedientes en total
          </p>
        </div>
        <button className="inline-flex items-center gap-2 bg-burgos-gold hover:bg-burgos-gold-light text-burgos-black px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300">
          <Plus size={16} />
          Nuevo Expediente
        </button>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="flex flex-col sm:flex-row gap-3"
      >
        <div className="relative flex-1">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-burgos-gray-600"
          />
          <input
            type="text"
            placeholder="Buscar por carátula, número o cliente..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-burgos-dark border border-burgos-gray-800 rounded-xl text-sm text-burgos-white placeholder:text-burgos-gray-600 focus:outline-none focus:border-burgos-gold/30 transition-colors"
          />
        </div>
        <div className="flex gap-2">
          {["todos", "activo", "en_espera", "cerrado"].map((estado) => (
            <button
              key={estado}
              onClick={() => setFiltroEstado(estado)}
              className={`px-4 py-2 rounded-xl text-xs font-medium transition-all border ${
                filtroEstado === estado
                  ? "bg-burgos-gold/10 text-burgos-gold border-burgos-gold/30"
                  : "bg-burgos-dark text-burgos-gray-400 border-burgos-gray-800 hover:border-burgos-gray-600"
              }`}
            >
              {estado === "todos" ? "Todos" : estadoLabels[estado]}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-burgos-dark rounded-2xl border border-burgos-gray-800 overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-burgos-gray-800">
                <th className="text-left px-5 py-3 text-[10px] uppercase tracking-wider text-burgos-gray-600 font-medium">
                  Carátula
                </th>
                <th className="text-left px-5 py-3 text-[10px] uppercase tracking-wider text-burgos-gray-600 font-medium hidden md:table-cell">
                  N° Expediente
                </th>
                <th className="text-left px-5 py-3 text-[10px] uppercase tracking-wider text-burgos-gray-600 font-medium hidden lg:table-cell">
                  Abogado
                </th>
                <th className="text-left px-5 py-3 text-[10px] uppercase tracking-wider text-burgos-gray-600 font-medium">
                  Estado
                </th>
                <th className="text-left px-5 py-3 text-[10px] uppercase tracking-wider text-burgos-gray-600 font-medium hidden sm:table-cell">
                  Última actuación
                </th>
                <th className="px-5 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((exp) => (
                <tr
                  key={exp.id}
                  className="border-b border-burgos-gray-800/50 hover:bg-burgos-dark-2 transition-colors"
                >
                  <td className="px-5 py-4">
                    <p className="text-sm text-burgos-white font-medium line-clamp-2">
                      {exp.caratula}
                    </p>
                    <p className="text-[10px] text-burgos-gray-600 mt-0.5">
                      {exp.fuero} · {exp.juzgado}
                    </p>
                  </td>
                  <td className="px-5 py-4 hidden md:table-cell">
                    <span className="text-sm text-burgos-gray-400 font-mono">
                      {exp.numero}
                    </span>
                  </td>
                  <td className="px-5 py-4 hidden lg:table-cell">
                    <span className="text-sm text-burgos-gray-400">
                      {exp.abogado}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={`text-[10px] uppercase tracking-wider font-semibold px-2.5 py-1 rounded-full border ${estadoStyles[exp.estado]}`}
                    >
                      {estadoLabels[exp.estado]}
                    </span>
                  </td>
                  <td className="px-5 py-4 hidden sm:table-cell">
                    <p className="text-xs text-burgos-gray-400">
                      {exp.ultimaActuacion}
                    </p>
                    <p className="text-[10px] text-burgos-gray-600">{exp.fecha}</p>
                  </td>
                  <td className="px-5 py-4">
                    <Link
                      href={`/erp/expedientes/${exp.id}`}
                      className="w-8 h-8 bg-burgos-dark-2 border border-burgos-gray-800 hover:border-burgos-gold/30 rounded-lg flex items-center justify-center text-burgos-gray-400 hover:text-burgos-gold transition-all"
                    >
                      <Eye size={14} />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-12">
            <p className="text-burgos-gray-600 text-sm">
              No se encontraron expedientes.
            </p>
          </div>
        )}
      </motion.div>
    </div>
  );
}
