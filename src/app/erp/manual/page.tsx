"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import {
  HelpCircle,
  ChevronDown,
  LayoutDashboard,
  BarChart3,
  FolderOpen,
  Calendar,
  CalendarDays,
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
  Globe,
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
    contenido: `Pantalla principal del ERP con resumen del estudio:

• Saludo personalizado con tu nombre y hora del día
• KPIs en tiempo real: expedientes activos, turnos hoy, tareas pendientes, clientes
• Próximas audiencias (próximos 7 días)
• Tareas por vencer
• Actividad reciente del sistema
• Expedientes creados/actualizados recientemente

Los datos se actualizan cada vez que entrás al dashboard.`,
  },
  {
    id: "metricas",
    titulo: "Métricas",
    icon: BarChart3,
    contenido: `Gráficos y estadísticas del estudio (visible para todos):

• Gráfico de barras: expedientes por abogado
• Gráfico de torta: distribución por fuero
• KPIs globales: total expedientes, abogados activos, cobrado vs pendiente
• Comparativas mensuales

Los gráficos se generan con datos reales de Supabase usando Recharts.`,
  },
  {
    id: "expedientes",
    titulo: "Expedientes",
    icon: FolderOpen,
    contenido: `Gestión completa de casos legales:

• Dos secciones: "Mis Expedientes" (personales) y "Generales" (compartidos)
• Crear expediente: carátula, número, fuero, juzgado, estado
• Detección de conflicto de intereses al crear (busca partes repetidas)
• Vista de detalle con:
  - Actuaciones (historial cronológico)
  - Documentos adjuntos (upload drag & drop)
  - Timer de horas trabajadas (Play/Stop)
  - Resumen automático con IA ("Resumir caso")
  - Análisis de plazos con IA ("Analizar plazos")
  - Análisis de probabilidad con IA
  - Descargar reporte PDF completo
• Cambiar estado: activo, en espera, cerrado, archivado
• Filtros por estado, búsqueda por carátula o número`,
  },  {
    id: "turnos",
    titulo: "Turnos",
    icon: Calendar,
    contenido: `Gestión de agenda y citas:

• Vista lista: turnos de hoy, próximos, historial
• Vista calendario: mensual con turnos coloreados por estado
• Crear turno: fecha, hora, motivo, cliente
• Validación de duplicados (no permite 2 turnos misma hora)
• Crear turno clickeando un día vacío en el calendario
• Editar/eliminar turnos desde el calendario
• Confirmar, cancelar o marcar como completado
• Los clientes pueden solicitar turnos desde:
  - La landing (card del abogado)
  - El chat de IA pública
  - El portal de clientes
• Recordatorio automático por email 24hs antes`,
  },
  {
    id: "calendario",
    titulo: "Calendario Unificado",
    icon: CalendarDays,
    contenido: `Vista única de todos los eventos del estudio:

• Turnos (dorado)
• Audiencias (púrpura)
• Tareas con vencimiento (rojo)
• Vista mensual con navegación
• Click en un día muestra detalle de todos los eventos
• Leyenda de colores para identificar tipos
• Útil para ver la carga de trabajo general`,
  },
  {
    id: "tareas",
    titulo: "Tareas",
    icon: CheckSquare,
    contenido: `Gestión de trabajo con tablero kanban:

• Tres columnas: Pendientes, En curso, Completadas
• Crear tarea con: título, descripción, prioridad, fecha límite
• Asignar a cualquier miembro del equipo
• Vincular a un expediente específico
• Subtareas con barra de progreso visual
• Etiquetas/tags personalizables
• Adjuntar archivos (PDF, Word, imágenes)
• Comentarios por tarea (hilos de discusión)
• Indicadores: clip (adjunto), link (expediente vinculado), chat (comentarios)
• Filtros: todas, pendientes, en curso, completadas
• Alertas de vencimiento (tareas vencidas en rojo)`,
  },  {
    id: "audiencias",
    titulo: "Audiencias",
    icon: Gavel,
    contenido: `Calendario judicial y alertas:

• Vista lista: próximas y historial
• Vista calendario: mensual con tipos coloreados
• Tipos: Preliminar, De vista, Oral, Pericial, Conciliación, Sentencia
• Crear audiencia: tipo, fecha, hora, juzgado, notas
• Indicador "En X días" para cada audiencia
• Marcar como: realizada, suspendida, reprogramada
• Alertas automáticas por email 72hs antes
• Click en calendario muestra detalle del día`,
  },
  {
    id: "honorarios",
    titulo: "Honorarios",
    icon: DollarSign,
    contenido: `Control de cobros y facturación:

• Registrar honorarios por expediente
• Tipos: pactado, regulación, cuota litis, otro
• Estados: pendiente, facturado, cobrado, en mora
• Stats en tiempo real: total cobrado, facturado, pendiente
• Facturación por horas: timer × tarifa = honorario automático
• Cambiar estado directamente desde la tabla
• Valores de JUS (verbal/escrito) configurables desde Configuración
• Los valores de JUS se muestran en la landing automáticamente`,
  },
  {
    id: "mensajes",
    titulo: "Mensajes",
    icon: MessageSquare,
    contenido: `Comunicación directa con clientes:

• Lista de clientes a la izquierda, chat a la derecha
• Mensajes en tiempo real (polling cada 5 segundos)
• Historial completo de conversaciones
• En mobile: vista adaptada (lista o chat, no ambos)
• Los clientes acceden desde su portal
• Botón "Volver" en mobile para cambiar de cliente`,
  },  {
    id: "ia",
    titulo: "Asistente IA",
    icon: Sparkles,
    contenido: `Asistente jurídico personalizado con IA (Groq Llama 3.3 70B):

• Múltiples sesiones de chat guardadas
• Panel lateral con conversaciones anteriores
• "Nueva conversación" para empezar de cero
• Auto-título basado en el primer mensaje
• Eliminar sesiones
• Pestaña "Mis Documentos":
  - Subir PDFs, Word o textos
  - Se procesan automáticamente (chunking)
  - La IA usa tus documentos como contexto (RAG)
  - Estado: subido → procesando → listo
• Si la IA falla: mensaje amigable + botón "Reintentar"
• Cada abogado tiene su propia IA aislada`,
  },
  {
    id: "escritos",
    titulo: "Escritos",
    icon: FilePen,
    contenido: `Generador de escritos judiciales con IA + plantillas:

Pestaña "Generar":
• 8 tipos: demanda, contestación, apelación, alegato, cédula, oficio, contrato, poder
• Seleccionar expediente (opcional) para contexto
• Agregar contexto adicional (hechos, petitorio)
• La IA genera el escrito en formato judicial argentino
• Copiar resultado al portapapeles

Pestaña "Mis Plantillas":
• Guardar modelos propios de escritos
• Crear, editar, eliminar plantillas
• Categorizar por tipo
• "Usar" copia el contenido al portapapeles
• Plantillas privadas por abogado`,
  },
  {
    id: "jurisprudencia",
    titulo: "Jurisprudencia",
    icon: BookOpen,
    contenido: `Búsqueda en fuentes oficiales con orientación de IA:

• Buscar por tema, artículo, carátula o palabras clave
• La IA genera orientación: qué esperar, leyes relevantes, consejos de búsqueda
• Links directos a 3 fuentes:
  - CSJN (Corte Suprema) — funciona
  - CIJ (Centro de Información Judicial) — funciona
  - SAIJ (Sistema Argentino de Información Jurídica) — puede estar inestable
• Indicador de estado por fuente
• No reemplaza la búsqueda manual, la complementa con orientación`,
  },  {
    id: "newsletter",
    titulo: "Newsletter",
    icon: Newspaper,
    contenido: `Publicaciones del estudio para la landing:

• Crear publicaciones: título, resumen, contenido, categoría, imagen
• Upload de imagen directo (no URLs)
• Estados: borrador → publicado → archivado
• Editar y eliminar publicaciones
• Las publicaciones con estado "publicado" aparecen automáticamente en la landing
• Categorías: Novedades Normativas, Casos de Éxito, Jurisprudencia, Eventos, Guías
• Suscripción por email para visitantes de la landing`,
  },
  {
    id: "clientes",
    titulo: "Clientes",
    icon: Users,
    contenido: `Alta y gestión de clientes del portal:

• Crear cliente: nombre, DNI, email, teléfono
• Clave de acceso: auto-generada o personalizada
• Copiar clave al portapapeles para compartir
• Editar datos del cliente
• Eliminar cliente (con confirmación)
• "Claves masivas": pegar lista de DNIs → genera claves para todos
• Los clientes usan DNI + clave para acceder al portal
• Cambio de clave obligatorio en primer ingreso`,
  },
  {
    id: "equipo",
    titulo: "Equipo",
    icon: UserPlus,
    contenido: `Gestión de abogados y personal:

• Alta de nuevos miembros: nombre, email, contraseña, rol
• Roles: Asociado (abogado), Administrativo (sin expedientes/IA)
• Editar datos de miembros (nombre, especialidad, matrícula)
• Resetear contraseña de cualquier miembro
• Desactivar/reactivar miembros
• Reasignación de expedientes al desactivar (si tiene casos activos)
• El director no es visible ni editable por asociados
• Administrativos no requieren especialidad ni matrícula
• Los asociados aparecen automáticamente en la landing`,
  },
  {
    id: "perfil",
    titulo: "Mi Perfil",
    icon: UserCog,
    contenido: `Datos personales y configuración de cuenta:

• Foto de perfil (upload directo, aparece en la landing)
• Foto de fondo (para la card en la landing)
• Nombre, especialidad, matrícula
• Número de WhatsApp (aparece como botón en la landing)
• Biografía profesional
• Áreas de práctica (separadas por coma)
• Experiencia
• Email y rol (no editables)`,
  },  {
    id: "configuracion",
    titulo: "Configuración",
    icon: Settings,
    contenido: `Ajustes del sistema:

General (todos):
• Valor del JUS verbal y escrito (se muestra en la landing)
• Dirección del estudio (se muestra en landing + mapa)
• Teléfono, email de contacto, horario
• Todos los cambios se reflejan automáticamente en la landing

Landing (todos):
• Tagline del hero
• Subir video/imagen de fondo (upload directo)
• Restaurar fondo original
• Descripción SEO
• Ubicación para el mapa

Notificaciones (todos):
• Activar/desactivar alertas por tipo
• Audiencias, tareas, turnos, mensajes, contacto

Seguridad, Integraciones, API Keys (solo director):
• Configuración avanzada del sistema`,
  },
  {
    id: "portal",
    titulo: "Portal de Clientes",
    icon: Users,
    contenido: `Acceso para clientes del estudio:

• Login con DNI + clave (generada por el abogado)
• Cambio de clave obligatorio en primer ingreso
• Tres secciones:
  - Mis Expedientes: ver estado, carátula, fuero
  - Turnos: solicitar turno con fecha/hora
  - Mensajes: chat directo con el abogado
• Firma electrónica: canvas para firmar documentos
• Accesible desde cualquier dispositivo (responsive)
• QR en el footer de la landing para acceso rápido`,
  },
  {
    id: "landing",
    titulo: "Landing Pública",
    icon: Globe,
    contenido: `Sitio web público del estudio (sin login):

• Hero animado con logo, partículas y CTAs
• Newsletter: últimas publicaciones del estudio
• Equipo: carousel con abogados activos (dinámico desde DB)
• Áreas de práctica (configurables)
• Servicios/JUS: costos de consulta (editables desde config)
• Contacto: formulario + Google Maps dinámico
• Chat IA: asistente que gestiona turnos y da info del estudio
• WhatsApp administración: botón flotante
• QR al portal en el footer
• SEO: JSON-LD, sitemap, robots, meta tags
• PWA: instalable como app desde el navegador
• Reservar turno directo desde la card del abogado`,
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
                    : "bg-burgos-dark border-burgos-gray-800 text-burgos-white hover:border-burgos-gray-700"
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
                      <p className="text-sm text-burgos-gray-400 leading-relaxed whitespace-pre-line">
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