export type TipoMovimientoInventario = 'entrada' | 'salida' | 'ajuste'

export interface MovimientoInventario {
  id: number
  tipo: TipoMovimientoInventario
  cantidad: number
  fecha_movimiento: Date
  id_inventario: number
}

export interface CrearMovimientoInventarioInput {
  tipo: TipoMovimientoInventario
  cantidad: number
  id_inventario: number
}

export interface MovimientoInventarioFilters {
  page: number
  limit: number
  tipo?: TipoMovimientoInventario
  idInventario?: number
}

export interface MovimientoInventarioListResult {
  items: MovimientoInventario[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}
