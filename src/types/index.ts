// ============================================
// Tipos base del sistema Burgos & Asociados
// ============================================

export type Rol = 'super_admin' | 'abogado' | 'administrativo' | 'cliente'

export interface Abogado {
  id: string
  nombre: string
  email: string
  especialidad: string
  matricula: string
  foto_url: string | null
  rol: 'director' | 'asociado'
  activo: boolean
  creado_en: string
}

export interface Area {
  id: string
  nombre: string
  descripcion: string
  icono: string
  abogado_id: string
}

export interface Cliente {
  id: string
  dni: string
  nombre: string
  abogado_id: string
  activo: boolean
  primer_ingreso: boolean
}

export interface Expediente {
  id: string
  caratula: string
  numero: string
  fuero: string
  juzgado: string
  numero_pjn: string | null
  estado: 'activo' | 'en_espera' | 'cerrado' | 'archivado'
  abogado_id: string
  cliente_id: string
  creado_en: string
}

export interface Turno {
  id: string
  abogado_id: string
  cliente_id: string | null
  fecha: string
  hora: string
  motivo: string
  estado: 'pendiente' | 'confirmado' | 'cancelado' | 'completado'
  origen: 'portal' | 'ia_publica' | 'manual'
}
