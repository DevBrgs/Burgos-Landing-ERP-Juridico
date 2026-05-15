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
  Building2,
  Activity,
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
• KPIs en tiempo real: expedientes activos, turnos hoy, tareas pendientes, clientes totales
• Próximas audiencias (próximos 7 días) con cuenta regresiva
• Tareas por vencer (próximas 48hs)
• Actividad reciente del sistema (últimas acciones)
• Expedientes creados/actualizados recientemente
• Accesos rápidos a las secciones más usadas

Los datos se actualizan cada vez que entrás al dashboard. El director ve datos de todo el estudio; los asociados ven solo los propios.`,
  },
  {
    id: "metricas",
    titulo: "Métricas",
    icon: BarChart3,
    contenido: `Gráficos y estadísticas del estudio:

• Gráfico de barras: expedientes por abogado (distribución de carga)
• Gráfico de torta: distribución por fuero (civil, penal, laboral, etc.)
• KPIs globales: total expedientes, abogados activos, cobrado vs pendiente
• Comparativas mensuales de actividad
• Indicadores de rendimiento por período

Los gráficos se generan con datos reales de la base de datos usando Recharts. Visible para todos los roles con acceso al ERP.`,
  },
  {
    id: "expedientes",
    titulo: "Expedientes",
    icon: FolderOpen,
    contenido: `Gestión completa de casos legales — núcleo del sistema:

• Dos secciones: "Mis Expedientes" (personales) y "Generales" (compartidos)
• Crear expediente: carátula, número, fuero, juzgado, estado, partes
• Vincular un cliente al expediente (selector de clientes registrados)
• Detección automática de conflicto de intereses al crear (busca partes repetidas en lados opuestos)
• Filtros por estado, búsqueda por carátula o número
• Cambiar estado: activo, en espera, cerrado, archivado

Vista de detalle del expediente:
• Cliente vinculado: badge con nombre y DNI (click lleva a su ficha)
• Actuaciones: historial cronológico de movimientos del caso
• Documentos: upload drag & drop de archivos adjuntos
  - Ícono de ojo por documento: controla visibilidad para el cliente
  - Verde = visible en el portal del cliente
  - Gris = solo visible internamente (por defecto)
• Timer de horas trabajadas: Play/Stop para registrar tiempo dedicado
• Resumen automático con IA: botón "Resumir caso" genera resumen ejecutivo
• Análisis de plazos con IA: detecta vencimientos próximos
• Análisis de probabilidad con IA: orientación sobre chances del caso
• Alertas inteligentes: la IA avisa plazos críticos
• Descargar reporte PDF: documento profesional con toda la info del expediente
• Facturación por horas: timer × tarifa = honorario automático

El director ve todos los expedientes del estudio.`,
  },
  {
    id: "turnos",
    titulo: "Turnos",
    icon: Calendar,
    contenido: `Gestión de agenda y citas con clientes:

• Vista lista: turnos de hoy, próximos, historial completo
• Vista calendario: mensual con turnos coloreados por estado
• Crear turno: fecha, hora, motivo, cliente registrado o nombre externo
• Selector de cliente: elegir de la lista de clientes registrados
• Si el cliente no está registrado, se puede escribir nombre libre
• Validación de duplicados (no permite 2 turnos en la misma hora)
• Crear turno clickeando un día vacío en el calendario
• Editar turnos: cambiar fecha, hora, motivo
• Eliminar turnos con confirmación
• Confirmar, cancelar o marcar como completado

Fuentes de turnos (se unifican automáticamente):
• Creados manualmente por el abogado
• Solicitados desde la landing (card del abogado)
• Solicitados por el chat de IA pública
• Solicitados desde el portal de clientes

• Recordatorio automático por email 24hs antes (cron job)
• Cada abogado ve solo sus turnos; el director ve todos`,
  },
  {
    id: "calendario",
    titulo: "Calendario Unificado",
    icon: CalendarDays,
    contenido: `Vista única de todos los eventos del estudio en un solo lugar:

• Turnos (dorado): citas con clientes
• Audiencias (púrpura): fechas judiciales
• Tareas con vencimiento (rojo): deadlines de trabajo
• Vista mensual con navegación entre meses
• Click en un día muestra detalle de todos los eventos de esa fecha
• Leyenda de colores para identificar tipos rápidamente
• Útil para ver la carga de trabajo general del estudio
• El director ve eventos de todos los abogados`,
  },
  {
    id: "tareas",
    titulo: "Tareas",
    icon: CheckSquare,
    contenido: `Gestión de trabajo con tablero kanban visual:

• Tres columnas: Pendientes, En curso, Completadas
• Crear tarea con: título, descripción, prioridad (alta/media/baja), fecha límite
• Asignar a cualquier miembro del equipo
• Vincular a un expediente específico (link directo al caso)
• Subtareas con barra de progreso visual (%)
• Etiquetas/tags personalizables para categorizar
• Adjuntar archivos (PDF, Word, imágenes) con upload directo
• Comentarios por tarea (hilos de discusión entre miembros)
• Indicadores visuales: clip (adjunto), link (expediente vinculado), chat (comentarios)
• Filtros: todas, pendientes, en curso, completadas
• Alertas de vencimiento (tareas vencidas se marcan en rojo)
• Drag & drop entre columnas para cambiar estado`,
  },
  {
    id: "audiencias",
    titulo: "Audiencias",
    icon: Gavel,
    contenido: `Calendario judicial y alertas de fechas importantes:

• Vista lista: próximas audiencias y historial
• Vista calendario: mensual con tipos coloreados
• Tipos: Preliminar, De vista, Oral, Pericial, Conciliación, Sentencia
• Crear audiencia: tipo, fecha, hora, juzgado, expediente vinculado, notas
• Indicador "En X días" para cada audiencia próxima
• Marcar como: realizada, suspendida, reprogramada
• Alertas automáticas por email 72hs antes
• Click en calendario muestra detalle del día
• Vinculación directa con el expediente correspondiente`,
  },
  {
    id: "honorarios",
    titulo: "Honorarios",
    icon: DollarSign,
    contenido: `Control de cobros y facturación del estudio:

• Registrar honorarios por expediente y cliente
• Tipos: pactado, regulación, cuota litis, otro
• Estados: pendiente, facturado, cobrado, en mora
• Stats en tiempo real: total cobrado, facturado, pendiente
• Cambiar estado directamente desde la tabla
• Facturación por horas: timer del expediente × tarifa = honorario automático

Valores de JUS (configurables):
• JUS verbal y JUS escrito editables desde Configuración
• Los valores se muestran automáticamente en la landing (sección Servicios)
• En Catamarca se usa JUS como unidad de honorarios

El director ve honorarios de todo el estudio.`,
  },
  {
    id: "mensajes",
    titulo: "Mensajes",
    icon: MessageSquare,
    contenido: `Comunicación directa y segura con clientes:

• Lista de clientes a la izquierda, chat a la derecha
• Mensajes en tiempo real (polling cada 5 segundos)
• Historial completo de conversaciones por cliente
• En mobile: vista adaptada (lista o chat, no ambos simultáneamente)
• Los clientes acceden desde su portal (DNI + clave)
• Botón "Volver" en mobile para cambiar de cliente
• Notificación cuando hay mensajes nuevos sin leer
• Canal de comunicación, no de documentación legal`,
  },
  {
    id: "ia",
    titulo: "Asistente IA",
    icon: Sparkles,
    contenido: `Asistente jurídico personalizado con IA (Groq Llama 3.3 70B):

Sesiones de chat:
• Múltiples sesiones guardadas (panel lateral)
• "Nueva conversación" para empezar de cero
• Auto-título basado en el primer mensaje
• Eliminar sesiones que ya no necesitás
• Cada abogado tiene sus propias sesiones aisladas

Pestaña "Mis Documentos" (RAG):
• Subir PDFs, Word o textos propios
• Se procesan automáticamente (chunking + embeddings)
• La IA usa tus documentos como contexto al responder
• Estado visible: subido → procesando → listo
• Eliminar documentos cuando ya no son relevantes

Comportamiento de la IA:
• Solo responde temas jurídicos (no chatea de otros temas)
• Respuestas directas y fundamentadas
• Si falla: mensaje amigable + botón "Reintentar"
• Cada abogado tiene su propia IA con su propio contexto
• No comparte información entre abogados`,
  },
  {
    id: "escritos",
    titulo: "Escritos",
    icon: FilePen,
    contenido: `Generador de escritos judiciales con IA + plantillas propias:

Pestaña "Generar con IA":
• 8 tipos: demanda, contestación, apelación, alegato, cédula, oficio, contrato, poder
• Seleccionar expediente (opcional) para dar contexto al escrito
• Agregar contexto adicional (hechos, petitorio, datos relevantes)
• La IA genera el escrito en formato judicial argentino
• Copiar resultado al portapapeles con un click

Pestaña "Mis Plantillas":
• Guardar modelos propios de escritos reutilizables
• Crear plantilla: nombre, tipo, contenido con variables
• Editar y eliminar plantillas existentes
• Categorizar por tipo de escrito
• "Usar" copia el contenido al portapapeles
• Plantillas privadas por abogado (no se comparten)
• Útil para escritos que se repiten con variaciones`,
  },
  {
    id: "jurisprudencia",
    titulo: "Jurisprudencia",
    icon: BookOpen,
    contenido: `Búsqueda en fuentes oficiales con orientación de IA:

• Buscar por tema, artículo, carátula o palabras clave
• La IA genera orientación: qué esperar, leyes relevantes, consejos de búsqueda
• Links directos a 3 fuentes oficiales:
  - CSJN (Corte Suprema de Justicia de la Nación) — funciona
  - CIJ (Centro de Información Judicial) — funciona
  - SAIJ (Sistema Argentino de Información Jurídica) — puede estar inestable

Cómo funciona:
• Ingresás tu búsqueda (ej: "despido sin causa")
• La IA analiza tu consulta y genera orientación jurídica
• Se muestran links directos a las fuentes para que busques manualmente
• No reemplaza la búsqueda manual, la complementa con orientación
• Indicador de estado por fuente (disponible/no disponible)`,
  },
  {
    id: "newsletter",
    titulo: "Newsletter",
    icon: Newspaper,
    contenido: `Publicaciones del estudio para la landing pública:

Gestión de publicaciones:
• Crear: título, resumen, contenido completo, categoría, imagen de portada
• Upload de imagen directo (no URLs)
• Estados: borrador → publicado → archivado
• Editar publicaciones existentes (título, contenido, imagen, categoría)
• Eliminar publicaciones con confirmación
• Cambiar estado (publicar, archivar, volver a borrador)

Categorías disponibles:
• Novedades Normativas, Casos de Éxito, Jurisprudencia, Eventos, Guías

Comportamiento público:
• Las publicaciones con estado "publicado" aparecen automáticamente en la landing
• Se muestran con imagen de portada, título y resumen
• Los visitantes pueden suscribirse por email
• Feed paginado con filtros por categoría`,
  },
  {
    id: "clientes",
    titulo: "Clientes",
    icon: Users,
    contenido: `Alta y gestión de clientes del portal:

Crear cliente:
• Nombre completo, DNI, email, teléfono
• Clave de acceso: auto-generada o personalizada (a elección)
• Copiar clave al portapapeles para compartir al cliente

Gestión:
• Editar datos del cliente (nombre, email, teléfono)
• Eliminar cliente (con confirmación)
• Resetear clave de acceso
• Ver ficha completa del cliente (botón ojo)

Ficha del cliente (/erp/clientes/[id]):
• KPIs: expedientes, turnos, cobrado, pendiente
• Historial/timeline: línea de tiempo con toda la actividad del cliente
• Pestaña Expedientes: todos los casos vinculados
• Pestaña Turnos: historial de citas
• Pestaña Honorarios: montos cobrados y pendientes
• Fecha de alta y mensajes intercambiados

Acceso masivo:
• "Claves masivas": pegar lista de DNIs → genera claves para todos

Vinculación con el sistema:
• Al crear un expediente se puede vincular un cliente
• Al crear un turno se puede seleccionar un cliente registrado
• El cliente vinculado ve sus expedientes desde el portal
• El abogado controla qué documentos son visibles para el cliente`,
  },
  {
    id: "equipo",
    titulo: "Equipo",
    icon: UserPlus,
    contenido: `Gestión de abogados y personal del estudio:

Alta de nuevos miembros:
• Nombre, email, contraseña, rol
• Roles disponibles: Asociado (abogado) y Administrativo
• Los asociados pueden dar de alta a otros asociados y administrativos
• Nadie puede crear directores (solo existe uno)

Gestión de miembros:
• Editar datos: nombre, especialidad, matrícula, áreas
• Resetear contraseña de cualquier miembro
• Desactivar/reactivar miembros
• Reasignación de expedientes al desactivar (si tiene casos activos)

Reglas de visibilidad:
• El director (super admin) no es visible ni editable por asociados
• Administrativos no requieren especialidad ni matrícula
• Solo los asociados activos aparecen en la landing pública
• Los administrativos nunca aparecen en la landing`,
  },
  {
    id: "perfil",
    titulo: "Mi Perfil",
    icon: UserCog,
    contenido: `Datos personales y configuración de tu cuenta:

Información editable:
• Foto de perfil (upload directo — aparece en la landing)
• Foto de fondo (para tu card en la landing)
• Nombre completo y especialidad
• Matrícula profesional
• Número de WhatsApp (aparece como botón en tu card de la landing)
• Biografía profesional
• Áreas de práctica (separadas por coma)
• Años de experiencia

No editables:
• Email (se usa para login)
• Rol asignado

Tu foto y datos se reflejan automáticamente en la landing pública.`,
  },
  {
    id: "estudios",
    titulo: "Estudios (Multi-tenant)",
    icon: Building2,
    contenido: `Gestión de múltiples estudios jurídicos (solo director):

• Ver todos los estudios registrados en el sistema
• Crear nuevo estudio: nombre, slug, dominio personalizado
• Activar/desactivar estudios
• Cada estudio tiene su propio entorno aislado
• Preparado para escalar a múltiples clientes

Cómo funciona el multi-tenant:
• Cada estudio tiene un ID único
• Los abogados se asocian a un estudio específico
• Los datos (expedientes, turnos, clientes) se filtran por estudio
• Permite administrar varios estudios desde un solo panel

Nota: Esta sección solo es visible para el director (super admin).`,
  },
  {
    id: "actividad",
    titulo: "Log de Actividad",
    icon: Activity,
    contenido: `Registro de todas las acciones del sistema (solo director):

• Últimas 50 acciones registradas
• Cada entrada muestra: usuario, acción, entidad afectada, detalle, fecha/hora
• Tipos de acciones registradas:
  - Creación de expedientes, turnos, tareas
  - Modificaciones de estado
  - Alta/baja de miembros
  - Cambios de configuración
  - Accesos al sistema

Útil para:
• Auditoría de quién hizo qué y cuándo
• Supervisión del uso del sistema
• Detección de problemas o errores
• Control de actividad del equipo

Solo visible para el director (super admin).`,
  },
  {
    id: "configuracion",
    titulo: "Configuración",
    icon: Settings,
    contenido: `Ajustes del sistema organizados por categoría:

General (todos los roles):
• Valor del JUS verbal y escrito (se muestra en la landing)
• Dirección del estudio (se muestra en landing + mapa)
• Teléfono, email de contacto, horario de atención
• Todos los cambios se reflejan automáticamente en la landing

Landing (todos):
• Tagline del hero (texto principal)
• Subir video/imagen de fondo para el hero (upload directo)
• Restaurar fondo original si el subido no gusta
• Descripción SEO del sitio
• Ubicación para el mapa de Google

Notificaciones (todos):
• Activar/desactivar alertas por tipo
• Tipos: audiencias, tareas, turnos, mensajes, contacto

Seguridad, Integraciones, API Keys (solo director):
• Configuración avanzada del sistema
• Gestión de claves de API
• Parámetros de integraciones externas`,
  },
  {
    id: "portal",
    titulo: "Portal de Clientes",
    icon: Users,
    contenido: `Acceso web para los clientes del estudio (sin instalar nada):

Login:
• Ingreso con DNI + clave (generada por el abogado)
• Cambio de clave obligatorio en primer ingreso
• Accesible desde cualquier dispositivo (responsive)

Secciones del portal:
• Mis Expedientes: ver estado, carátula, fuero de sus casos
  - Documentos compartidos: solo los que el abogado habilitó
  - Cada documento tiene botón de descarga
• Turnos: solicitar turno eligiendo fecha y hora disponible
• Mensajes: chat directo con su abogado asignado
• Firma electrónica: canvas para firmar documentos digitalmente

Control de documentos (desde el ERP):
• El abogado sube documentos al expediente normalmente
• Cada documento tiene un ícono de visibilidad (ojo)
• Click para alternar: visible/oculto para el cliente
• Por defecto ningún documento es visible
• Solo los marcados como visibles aparecen en el portal

Firma electrónica:
• El cliente firma con el dedo o mouse sobre un canvas
• Se guarda como imagen asociada al documento
• No es firma digital legal (FEA) pero sirve para conformidades

Acceso rápido:
• QR en el footer de la landing para acceso directo
• Link compartible por WhatsApp o email`,
  },
  {
    id: "landing",
    titulo: "Landing Pública",
    icon: Globe,
    contenido: `Sitio web público del estudio (sin login requerido):

Secciones:
• Hero animado: logo, partículas doradas, parallax, tagline editable, CTAs
• Newsletter: últimas publicaciones del estudio (dinámico desde DB)
• Equipo: carousel con abogados activos (fotos, especialidad, WhatsApp)
• Áreas de práctica: configurables desde la base de datos
• Servicios/JUS: costos de consulta (editables desde configuración)
• Contacto: formulario funcional + Google Maps dinámico
• Footer: datos del estudio, QR al portal, links útiles

Funcionalidades interactivas:
• Chat IA pública: asistente que gestiona turnos y da info del estudio
• Botón WhatsApp flotante: contacto directo con administración
• Reservar turno directo desde la card de cada abogado
• Suscripción al newsletter por email

Técnico:
• SEO completo: JSON-LD, sitemap, robots.txt, meta tags, Open Graph
• PWA: instalable como app desde el navegador (Chrome, Safari, Edge)
• Responsive: adaptado a mobile, tablet y desktop
• Fondo del hero configurable (upload desde ERP o fondo original)
• Solo muestra abogados asociados activos (no director ni administrativos)`,
  },
];

export default function ManualPage() {
  const [openSection, setOpenSection] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const toggle = (id: string) => {
    setOpenSection(openSection === id ? null : id);
  };

  const filteredSections = secciones.filter(
    (s) =>
      s.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.contenido.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-burgos-white flex items-center gap-2">
          <HelpCircle size={24} className="text-burgos-gold" />
          Manual de Usuario
        </h1>
        <p className="text-burgos-gray-400 text-sm mt-1">
          Guía completa del ERP Jurídico — {secciones.length} secciones · Hacé clic en cada una para ver los detalles
        </p>
      </motion.div>

      {/* Buscador */}
      <div className="relative">
        <input
          type="text"
          placeholder="Buscar en el manual..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2.5 rounded-xl bg-burgos-dark border border-burgos-gray-800 text-burgos-white text-sm placeholder:text-burgos-gray-600 focus:outline-none focus:border-burgos-gold/40 transition-colors"
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-burgos-gray-500 hover:text-burgos-white text-xs"
          >
            ✕
          </button>
        )}
      </div>

      <div className="space-y-2">
        {filteredSections.map((seccion, index) => {
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

        {filteredSections.length === 0 && (
          <div className="text-center py-8">
            <p className="text-burgos-gray-500 text-sm">No se encontraron secciones con &quot;{searchTerm}&quot;</p>
          </div>
        )}
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
