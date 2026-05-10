export interface Cliente {
  id: number
  nombre_comercial: string | null
  nombre_contacto: string
  telefono: string
  email: string | null
  direccion: string
}

export interface CrearClienteInput {
  nombre_comercial?: string | null
  nombre_contacto: string
  telefono: string
  email?: string | null
  direccion: string
}

export interface ActualizarClienteInput {
  nombre_comercial?: string | null
  nombre_contacto?: string
  telefono?: string
  email?: string | null
  direccion?: string
}

export interface ClienteFilters {
  page: number
  limit: number
  search?: string
}

export interface ClienteListItem {
  id: number
  nombre_comercial: string | null
  nombre_contacto: string
  telefono: string
  email: string | null
  direccion: string
}

export interface ClienteListResult {
  items: ClienteListItem[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}
