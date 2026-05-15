"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import {
  HelpCircle,
  ChevronDown,
  LayoutDashboard,
  FolderOpen,
  Calendar,
  CheckSquare,
  Gavel,
  DollarSign,
  MessageSquare,
  Sparkles,
  FilePen,
  BookOpen,
  Newspaper,
  Users,
  UserPlus,
  UserCog,
  Settings,
} from "lucide-react";

interface ManualSection {
  id: string;
  titulo: string;
  icon: React.ElementType;
  contenido: string;
}

const secciones: ManualSection[] = [
  {
    id: "dashboard",
    titulo: "Dashboard",
    icon: LayoutDashboard,
    contenido: `El Dashboard es la pantalla principal del ERP. Muestra un resumen general del estudio con KPIs clave:

• Expedientes activos y su estado actual
• Turnos del día y próximos
• Tareas pendientes y vencidas
• Honorarios cobrados vs pendientes
• Alertas de audiencias próximas
• Actividad reciente del equipo

Los KPIs se actualizan en tiempo real. Podés hacer clic en cualquier tarjeta para ir directamente a la sección correspondiente.`,
  },
  {
    id: "expedientes",
    titulo: "Expedientes",
    icon: FolderOpen,
    contenido: `Gestión completa de casos legales del estudio:

• Crear nuevos expedientes con carátula, juzgado, fuero y jurisdicción
• Registrar actuaciones (movimientos procesales) con fecha y descripción
• Adjuntar documentos a cada expediente (escritos, cédulas, oficios)
• Asignar abogados responsables
• Cambiar estado: activo, en trámite, archivado, finalizado
• Filtrar por cliente, estado, fuero o abogado asignado
• Compartir expedientes con clientes a través del portal

Cada expediente tiene un historial completo de actuaciones ordenado cronológicamente.`,
  },
  {
    id: "turnos",
    titulo: "Turnos",
    icon: Calendar,
    contenido: `Agenda de citas y gestión de disponibilidad:

• Calendario visual con vista diaria, semanal y mensual
• Configurar horarios de disponibilidad por abogado
• Los clientes pueden reservar turnos desde el portal público
• Confirmación automática o manual de turnos
• Recordatorios por email antes de la cita
• Cancelar o reprogramar turnos
• Ver historial de turnos por cliente

La disponibilidad se configura en bloques horarios. Los turnos ocupados se bloquean automáticamente.`,
  },
  {
    id: "tareas",
    titulo: "Tareas",
    icon: CheckSquare,
    contenido: `Gestión de trabajo con tablero kanban:

• Crear tareas con título, descripción, prioridad y fecha límite
• Tablero kanban con columnas: Pendiente, En progreso, Completada
• Asignar tareas a miembros del equipo
• Crear subtareas dentro de cada tarea
• Arrastrar y soltar para cambiar estado
• Filtrar por asignado, prioridad o fecha
• Vincular tareas a expedientes específicos
• Colaboración: comentarios y menciones

Las tareas vencidas se resaltan en rojo. El dashboard muestra un contador de tareas pendientes.`,
  },
  {
    id: "audiencias",
    titulo: "Audiencias",
    icon: Gavel,
    contenido: `Calendario judicial y sistema de alertas:

• Registrar audiencias con fecha, hora, juzgado y expediente
• Alertas automáticas días antes de cada audiencia
• Vista de calendario dedicada a audiencias
• Vincular audiencia al expediente correspondiente
• Marcar resultado: realizada, suspendida, reprogramada
• Notas post-audiencia para registrar lo ocurrido
• Filtrar por juzgado, fuero o abogado

Las audiencias próximas aparecen como alertas en el Dashboard.`,
  },
  {
    id: "honorarios",
    titulo: "Honorarios",
    icon: DollarSign,
    contenido: `Control de cobros y facturación:

• Registrar honorarios por expediente o servicio
• Estados: pendiente, cobrado parcial, cobrado total
• Generar recibos y comprobantes
• Historial de pagos por cliente
• Métricas: total facturado, cobrado, pendiente
• Filtrar por período, cliente o estado
• Alertas de honorarios vencidos

El Dashboard Director muestra gráficos de facturación mensual y comparativas.`,
  },
  {
    id: "mensajes",
    titulo: "Mensajes",
    icon: MessageSquare,
    contenido: `Comunicación directa con clientes:

• Chat interno entre el estudio y cada cliente
• Los clientes acceden desde su portal
• Historial completo de conversaciones
• Notificaciones de mensajes nuevos
• Adjuntar archivos en los mensajes
• Organizado por cliente/expediente

Los mensajes no leídos se muestran como badge en el sidebar.`,
  },
  {
    id: "ia",
    titulo: "Asistente IA",
    icon: Sparkles,
    contenido: `Asistente jurídico personalizado con inteligencia artificial:

• Chat conversacional especializado en derecho argentino
• Consultas sobre legislación, doctrina y procedimientos
• Generación de borradores de documentos
• Análisis de situaciones jurídicas
• Subida de documentos para análisis (PDFs, escritos)
• Historial de conversaciones guardado
• Respuestas contextualizadas al derecho argentino

El asistente usa modelos de IA avanzados y está entrenado con terminología jurídica argentina.`,
  },
  {
    id: "escritos",
    titulo: "Escritos",
    icon: FilePen,
    contenido: `Generador de escritos judiciales con IA:

• Seleccionar tipo de escrito (demanda, contestación, recurso, etc.)
• Completar datos del caso y partes
• La IA genera un borrador completo del escrito
• Editar y personalizar el resultado
• Descargar en formato listo para presentar
• Historial de escritos generados
• Plantillas personalizables

Los escritos se generan siguiendo las formalidades procesales argentinas.`,
  },
  {
    id: "jurisprudencia",
    titulo: "Jurisprudencia",
    icon: BookOpen,
    contenido: `Búsqueda en fuentes oficiales de jurisprudencia:

• Buscar por tema, artículo, carátula o palabras clave
• Fuentes disponibles:
  - CSJN (Corte Suprema de Justicia de la Nación)
  - CIJ (Centro de Información Judicial)
  - SAIJ (Sistema Argentino de Información Jurídica)
• Orientación por IA: resumen de qué esperar en los resultados
• Links directos a cada fuente con la búsqueda precargada
• Consejos para refinar búsquedas

La IA proporciona contexto sobre leyes y artículos relevantes antes de buscar.`,
  },
  {
    id: "newsletter",
    titulo: "Newsletter",
    icon: Newspaper,
    contenido: `Publicaciones y novedades del estudio:

• Crear artículos y novedades jurídicas
• Publicar en la landing page del estudio
• Editor de contenido con formato
• Categorizar por área del derecho
• Programar publicaciones
• Visible para visitantes de la web del estudio

Las publicaciones ayudan al posicionamiento del estudio y mantienen informados a los clientes.`,
  },
  {
    id: "clientes",
    titulo: "Clientes",
    icon: Users,
    contenido: `Alta y gestión de clientes del portal:

• Registrar nuevos clientes con datos completos
• Datos: nombre, DNI/CUIT, email, teléfono, dirección
• Vincular clientes a expedientes
• Ver historial de expedientes por cliente
• Acceso al portal de clientes (consulta de expedientes, turnos, mensajes)
• Filtrar y buscar clientes
• Estado: activo, inactivo

Los clientes con acceso al portal pueden ver sus expedientes, sacar turnos y enviar mensajes.`,
  },
  {
    id: "equipo",
    titulo: "Equipo",
    icon: UserPlus,
    contenido: `Gestión de abogados y personal del estudio:

• Alta de nuevos miembros del equipo
• Roles: Director, Asociado, Administrativo
• Asignar matrícula y especialidad
• Cada rol tiene permisos diferentes en el sistema
• Director: acceso total + métricas + configuración
• Asociado: expedientes, tareas, audiencias, IA
• Administrativo: turnos, clientes, honorarios, mensajes

El director puede invitar nuevos miembros y gestionar roles.`,
  },
  {
    id: "perfil",
    titulo: "Mi Perfil",
    icon: UserCog,
    contenido: `Datos personales y configuración de cuenta:

• Nombre y apellido
• Foto de perfil (se muestra en el sistema)
• Número de WhatsApp (para contacto rápido)
• Email asociado a la cuenta
• Matrícula profesional
• Especialidad jurídica

Los datos del perfil se usan en escritos generados y en la información visible para clientes.`,
  },
  {
    id: "configuracion",
    titulo: "Configuración",
    icon: Settings,
    contenido: `Ajustes generales del sistema (solo Director):

• Número de JUS (para cálculo de honorarios)
• Datos de contacto del estudio
• Configuración de la landing page
• Horarios de atención
• Datos fiscales
• Personalización del portal de clientes

Los cambios en configuración afectan a todo el estudio.`,
  },
];

export default function ManualPage() {
  const [openSection, setOpenSection] = useState<string | null>(null);

  const toggle = (id: string) => {
    setOpenSection(openSection === id ? null : id);
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-burgos-white flex items-center gap-2">
          <HelpCircle size={24} className="text-burgos-gold" />
          Manual de Usuario
        </h1>
        <p className="text-burgos-gray-400 text-sm mt-1">
          Guía completa del ERP Jurídico — Hacé clic en cada sección para ver los detalles
        </p>
      </motion.div>

      <div className="space-y-2">
        {secciones.map((seccion, index) => {
          const Icon = seccion.icon;
          const isOpen = openSection === seccion.id;

          return (
            <motion.div
              key={seccion.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.03 }}
            >
              <button
                onClick={() => toggle(seccion.id)}
                className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-left transition-all duration-200 border ${
                  isOpen
                    ? "bg-burgos-gold/5 border-burgos-gold/20 text-burgos-gold"
                    : "bg-burgos-dark border-burgos-gray-800 text-burgos-gray-300 hover:border-burgos-gray-700 hover:text-burgos-white"
                }`}
              >
                <Icon size={18} className={isOpen ? "text-burgos-gold" : "text-burgos-gray-500"} />
                <span className="flex-1 text-sm font-medium">{seccion.titulo}</span>
                <ChevronDown
                  size={16}
                  className={`transition-transform duration-200 ${isOpen ? "rotate-180 text-burgos-gold" : "text-burgos-gray-600"}`}
                />
              </button>

              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 py-4 ml-4 mt-1 border-l-2 border-burgos-gold/20">
                      <p className="text-sm text-burgos-gray-300 leading-relaxed whitespace-pre-line">
                        {seccion.contenido}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      <div className="bg-burgos-dark rounded-xl border border-burgos-gray-800 p-5 mt-8">
        <p className="text-xs text-burgos-gray-500 text-center">
          ¿Necesitás ayuda adicional? Usá el{" "}
          <span className="text-burgos-gold">Asistente IA</span> para consultas específicas sobre el uso del sistema.
        </p>
      </div>
    </div>
  );
}
