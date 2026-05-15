-- ============================================
-- Burgos & Asociados — Esquema de Base de Datos
-- Supabase (PostgreSQL)
-- ============================================

-- Extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- TABLA: abogados
-- Perfil profesional de cada abogado del estudio
-- ============================================
CREATE TABLE IF NOT EXISTS abogados (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  nombre TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  especialidad TEXT NOT NULL,
  matricula TEXT,
  foto_url TEXT,
  fondo_url TEXT,
  bio TEXT,
  areas TEXT[] DEFAULT '{}',
  experiencia TEXT,
  rol TEXT NOT NULL DEFAULT 'asociado' CHECK (rol IN ('director', 'asociado')),
  activo BOOLEAN NOT NULL DEFAULT true,
  creado_en TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  actualizado_en TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- TABLA: areas_practica
-- Áreas de práctica del estudio
-- ============================================
CREATE TABLE IF NOT EXISTS areas_practica (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nombre TEXT NOT NULL,
  descripcion TEXT,
  icono TEXT,
  abogado_id UUID REFERENCES abogados(id) ON DELETE SET NULL,
  activo BOOLEAN NOT NULL DEFAULT true,
  orden INT DEFAULT 0
);

-- ============================================
-- TABLA: clientes
-- Clientes del estudio (acceso por DNI + clave)
-- ============================================
CREATE TABLE IF NOT EXISTS clientes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  dni TEXT UNIQUE NOT NULL,
  nombre TEXT NOT NULL,
  email TEXT,
  telefono TEXT,
  clave_hash TEXT NOT NULL,
  abogado_id UUID REFERENCES abogados(id) ON DELETE SET NULL,
  activo BOOLEAN NOT NULL DEFAULT true,
  primer_ingreso BOOLEAN NOT NULL DEFAULT true,
  creado_en TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- TABLA: expedientes
-- Núcleo del ERP — ficha completa de cada caso
-- ============================================
CREATE TABLE IF NOT EXISTS expedientes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  caratula TEXT NOT NULL,
  numero TEXT,
  fuero TEXT,
  juzgado TEXT,
  numero_pjn TEXT,
  estado TEXT NOT NULL DEFAULT 'activo' CHECK (estado IN ('activo', 'en_espera', 'cerrado', 'archivado')),
  abogado_id UUID NOT NULL REFERENCES abogados(id) ON DELETE RESTRICT,
  cliente_id UUID REFERENCES clientes(id) ON DELETE SET NULL,
  notas_internas TEXT,
  creado_en TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  actualizado_en TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- TABLA: actuaciones
-- Historial de actuaciones por expediente
-- ============================================
CREATE TABLE IF NOT EXISTS actuaciones (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  expediente_id UUID NOT NULL REFERENCES expedientes(id) ON DELETE CASCADE,
  titulo TEXT NOT NULL,
  descripcion TEXT,
  fecha DATE NOT NULL DEFAULT CURRENT_DATE,
  creado_por UUID REFERENCES abogados(id) ON DELETE SET NULL,
  creado_en TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- TABLA: documentos
-- Archivos adjuntos a expedientes
-- ============================================
CREATE TABLE IF NOT EXISTS documentos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  expediente_id UUID NOT NULL REFERENCES expedientes(id) ON DELETE CASCADE,
  nombre TEXT NOT NULL,
  tipo TEXT,
  url TEXT NOT NULL,
  tamano_bytes BIGINT,
  version INT DEFAULT 1,
  visible_cliente BOOLEAN NOT NULL DEFAULT false,
  subido_por UUID REFERENCES abogados(id) ON DELETE SET NULL,
  creado_en TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- TABLA: turnos
-- Sistema de turnos (portal, IA pública, manual)
-- ============================================
CREATE TABLE IF NOT EXISTS turnos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  abogado_id UUID NOT NULL REFERENCES abogados(id) ON DELETE CASCADE,
  cliente_id UUID REFERENCES clientes(id) ON DELETE SET NULL,
  nombre_externo TEXT,
  fecha DATE NOT NULL,
  hora TIME NOT NULL,
  motivo TEXT,
  estado TEXT NOT NULL DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'confirmado', 'cancelado', 'completado')),
  origen TEXT NOT NULL DEFAULT 'manual' CHECK (origen IN ('portal', 'ia_publica', 'manual')),
  notas TEXT,
  creado_en TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- TABLA: audiencias
-- Audiencias judiciales vinculadas a expedientes
-- ============================================
CREATE TABLE IF NOT EXISTS audiencias (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  expediente_id UUID NOT NULL REFERENCES expedientes(id) ON DELETE CASCADE,
  abogado_id UUID NOT NULL REFERENCES abogados(id) ON DELETE CASCADE,
  tipo TEXT NOT NULL,
  fecha DATE NOT NULL,
  hora TIME,
  juzgado TEXT,
  notas TEXT,
  estado TEXT NOT NULL DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'realizada', 'suspendida', 'reprogramada')),
  creado_en TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- TABLA: tareas
-- Tareas internas del estudio
-- ============================================
CREATE TABLE IF NOT EXISTS tareas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  expediente_id UUID REFERENCES expedientes(id) ON DELETE SET NULL,
  asignado_a UUID NOT NULL REFERENCES abogados(id) ON DELETE CASCADE,
  creado_por UUID REFERENCES abogados(id) ON DELETE SET NULL,
  titulo TEXT NOT NULL,
  descripcion TEXT,
  prioridad TEXT NOT NULL DEFAULT 'normal' CHECK (prioridad IN ('urgente', 'normal', 'baja')),
  estado TEXT NOT NULL DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'en_curso', 'completada')),
  vence_en DATE,
  completada_en TIMESTAMPTZ,
  creado_en TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- TABLA: honorarios
-- Registro de honorarios por expediente
-- ============================================
CREATE TABLE IF NOT EXISTS honorarios (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  expediente_id UUID NOT NULL REFERENCES expedientes(id) ON DELETE CASCADE,
  cliente_id UUID REFERENCES clientes(id) ON DELETE SET NULL,
  monto DECIMAL(12,2) NOT NULL,
  tipo TEXT NOT NULL DEFAULT 'regulacion' CHECK (tipo IN ('regulacion', 'pactado', 'cuota_litis', 'otro')),
  estado TEXT NOT NULL DEFAULT 'pendiente' CHECK (estado IN ('facturado', 'cobrado', 'pendiente', 'en_mora')),
  fecha_factura DATE,
  fecha_cobro DATE,
  notas TEXT,
  creado_en TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- TABLA: mensajes
-- Mensajería segura cliente ↔ abogado
-- ============================================
CREATE TABLE IF NOT EXISTS mensajes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  expediente_id UUID REFERENCES expedientes(id) ON DELETE SET NULL,
  remitente_tipo TEXT NOT NULL CHECK (remitente_tipo IN ('abogado', 'cliente')),
  remitente_id UUID NOT NULL,
  cuerpo TEXT NOT NULL,
  leido BOOLEAN NOT NULL DEFAULT false,
  creado_en TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- TABLA: posts (Newsletter)
-- Publicaciones del newsletter jurídico
-- ============================================
CREATE TABLE IF NOT EXISTS posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  autor_id UUID NOT NULL REFERENCES abogados(id) ON DELETE CASCADE,
  titulo TEXT NOT NULL,
  cuerpo TEXT NOT NULL,
  resumen TEXT,
  categoria TEXT NOT NULL DEFAULT 'general',
  imagen_url TEXT,
  estado TEXT NOT NULL DEFAULT 'borrador' CHECK (estado IN ('borrador', 'publicado', 'archivado')),
  publicado_en TIMESTAMPTZ,
  creado_en TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  actualizado_en TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- TABLA: suscriptores
-- Suscriptores del newsletter
-- ============================================
CREATE TABLE IF NOT EXISTS suscriptores (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  activo BOOLEAN NOT NULL DEFAULT true,
  creado_en TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- TABLA: links_compartidos
-- Links temporales para compartir documentos
-- ============================================
CREATE TABLE IF NOT EXISTS links_compartidos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  documento_id UUID NOT NULL REFERENCES documentos(id) ON DELETE CASCADE,
  token TEXT UNIQUE NOT NULL DEFAULT encode(gen_random_bytes(32), 'hex'),
  expira_en TIMESTAMPTZ NOT NULL,
  revocado BOOLEAN NOT NULL DEFAULT false,
  vistas INT NOT NULL DEFAULT 0,
  creado_por UUID REFERENCES abogados(id) ON DELETE SET NULL,
  creado_en TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- TABLA: actividad_log
-- Log de auditoría del sistema
-- ============================================
CREATE TABLE IF NOT EXISTS actividad_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  usuario_id UUID,
  usuario_tipo TEXT CHECK (usuario_tipo IN ('abogado', 'cliente', 'admin')),
  accion TEXT NOT NULL,
  entidad TEXT,
  entidad_id UUID,
  detalles JSONB,
  creado_en TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- ÍNDICES
-- ============================================
CREATE INDEX IF NOT EXISTS idx_expedientes_abogado ON expedientes(abogado_id);
CREATE INDEX IF NOT EXISTS idx_expedientes_cliente ON expedientes(cliente_id);
CREATE INDEX IF NOT EXISTS idx_expedientes_estado ON expedientes(estado);
CREATE INDEX IF NOT EXISTS idx_turnos_abogado_fecha ON turnos(abogado_id, fecha);
CREATE INDEX IF NOT EXISTS idx_tareas_asignado ON tareas(asignado_a);
CREATE INDEX IF NOT EXISTS idx_tareas_vence ON tareas(vence_en);
CREATE INDEX IF NOT EXISTS idx_audiencias_fecha ON audiencias(fecha);
CREATE INDEX IF NOT EXISTS idx_posts_estado ON posts(estado, publicado_en DESC);
CREATE INDEX IF NOT EXISTS idx_mensajes_expediente ON mensajes(expediente_id);
CREATE INDEX IF NOT EXISTS idx_actuaciones_expediente ON actuaciones(expediente_id);
CREATE INDEX IF NOT EXISTS idx_clientes_dni ON clientes(dni);
CREATE INDEX IF NOT EXISTS idx_clientes_abogado ON clientes(abogado_id);

-- ============================================
-- FUNCIONES AUXILIARES
-- ============================================

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.actualizado_en = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers de actualización
CREATE TRIGGER tr_abogados_updated
  BEFORE UPDATE ON abogados
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER tr_expedientes_updated
  BEFORE UPDATE ON expedientes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER tr_posts_updated
  BEFORE UPDATE ON posts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
