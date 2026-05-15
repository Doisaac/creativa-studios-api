export const INSTALACION_ESTADOS = [
  'pendiente',
  'asignada',
  'en_proceso',
  'completada',
  'no_realizada',
  'cancelada',
] as const

export type InstalacionEstado = (typeof INSTALACION_ESTADOS)[number]

export interface Instalacion {
  id: number
  id_pedido: number
  id_instalador: number | null
  estado: InstalacionEstado
  fecha_programada: Date | string | null
  fecha_realizada: Date | string | null
  direccion_instalacion: string
  observaciones: string | null
  created_at: Date
}

export interface CrearInstalacionInput {
  id_instalador?: number | null
  fecha_programada?: string | null
  direccion_instalacion?: string | null
  observaciones?: string | null
}

export interface AsignarInstaladorInput {
  id_instalador: number
}

export interface ActualizarEstadoInstalacionInput {
  estado: InstalacionEstado
  observaciones?: string | null
}

export interface ReprogramarInstalacionInput {
  fecha_programada: string
  observaciones?: string | null
}

export interface InstalacionFilters {
  page: number
  limit: number
  estado?: InstalacionEstado
  idInstalador?: number
  idPedido?: number
}

export interface InstalacionListItem {
  id: number
  id_pedido: number
  pedido_estado: string
  pedido_fecha_entrega: Date | string | null

  id_cliente: number
  cliente_nombre_comercial: string | null
  cliente_nombre_contacto: string
  cliente_telefono: string

  id_instalador: number | null
  instalador_nombre: string | null

  estado: InstalacionEstado
  fecha_programada: Date | string | null
  fecha_realizada: Date | string | null
  direccion_instalacion: string
  observaciones: string | null
  created_at: Date
}

export interface InstalacionListResult {
  items: InstalacionListItem[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export interface PedidoParaInstalacion {
  id: number
  estado: string
  direccion_cliente: string
}
