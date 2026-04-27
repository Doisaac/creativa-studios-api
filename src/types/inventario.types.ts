export interface Inventario {
  id: number
  nombre: string
  stock_actual: number
  stock_minimo: number
  unidad_de_medida: string
  created_at: Date
}

export interface CrearInventarioInput {
  nombre: string
  stock_actual: number
  stock_minimo: number
  unidad_de_medida: string
}

export interface ActualizarInventarioInput {
  nombre?: string
  stock_minimo?: number
  unidad_de_medida?: string
}

export interface InventarioFilters {
  page: number
  limit: number
  search?: string
  bajoStock?: boolean
}

export interface InventarioListItem {
  id: number
  nombre: string
  stock_actual: number
  stock_minimo: number
  unidad_de_medida: string
  created_at: Date
  bajo_stock: boolean
}

export interface InventarioListResult {
  items: InventarioListItem[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}
