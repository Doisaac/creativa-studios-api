import type {
  CrearMovimientoInventarioInput,
  MovimientoInventarioFilters,
  TipoMovimientoInventario,
} from '../types/movimiento-inventario.types.js'

const MOVIMIENTO_LIMIT_DEFAULT = 10
const MOVIMIENTO_LIMIT_MAX = 100
const TIPOS_MOVIMIENTO = new Set<TipoMovimientoInventario>([
  'entrada',
  'salida',
  'ajuste',
])

const parsePositiveInteger = (
  value: unknown,
  fieldName: string,
): number | string => {
  if (typeof value !== 'number' || !Number.isInteger(value) || value <= 0) {
    return `${fieldName} debe ser un entero mayor a 0`
  }

  return value
}

const parseId = (value: unknown, fieldName: string): number | string => {
  if (typeof value !== 'number' || !Number.isInteger(value) || value <= 0) {
    return `${fieldName} debe ser un entero mayor a 0`
  }

  return value
}

export const validateCreateMovimientoInventarioInput = (
  body: unknown,
): { value?: CrearMovimientoInventarioInput; error?: string } => {
  if (!body || typeof body !== 'object') {
    return { error: 'Payload invalido' }
  }

  const { tipo, cantidad, id_inventario } = body as Record<string, unknown>

  if (
    typeof tipo !== 'string' ||
    !TIPOS_MOVIMIENTO.has(tipo as TipoMovimientoInventario)
  ) {
    return { error: 'tipo debe ser entrada, salida o ajuste' }
  }

  const parsedCantidad = parsePositiveInteger(cantidad, 'cantidad')
  if (typeof parsedCantidad === 'string') {
    return { error: parsedCantidad }
  }

  const parsedInventarioId = parseId(id_inventario, 'id_inventario')
  if (typeof parsedInventarioId === 'string') {
    return { error: parsedInventarioId }
  }

  return {
    value: {
      tipo: tipo as TipoMovimientoInventario,
      cantidad: parsedCantidad,
      id_inventario: parsedInventarioId,
    },
  }
}

export const validateMovimientoInventarioFilters = (
  query: Record<string, unknown>,
): { value?: MovimientoInventarioFilters; error?: string } => {
  const rawPage = query.page
  const rawLimit = query.limit
  const rawTipo = query.tipo
  const rawInventarioId = query.id_inventario ?? query.idInventario

  const page =
    typeof rawPage === 'string' && rawPage.trim() !== ''
      ? Number.parseInt(rawPage, 10)
      : 1
  const limit =
    typeof rawLimit === 'string' && rawLimit.trim() !== ''
      ? Number.parseInt(rawLimit, 10)
      : MOVIMIENTO_LIMIT_DEFAULT

  if (!Number.isInteger(page) || page <= 0) {
    return { error: 'page debe ser un entero mayor a 0' }
  }

  if (!Number.isInteger(limit) || limit <= 0 || limit > MOVIMIENTO_LIMIT_MAX) {
    return {
      error: `limit debe ser un entero entre 1 y ${MOVIMIENTO_LIMIT_MAX}`,
    }
  }

  if (
    rawTipo !== undefined &&
    (typeof rawTipo !== 'string' ||
      !TIPOS_MOVIMIENTO.has(rawTipo as TipoMovimientoInventario))
  ) {
    return { error: 'tipo debe ser entrada, salida o ajuste' }
  }

  let idInventario: number | undefined

  if (rawInventarioId !== undefined) {
    if (typeof rawInventarioId !== 'string' || rawInventarioId.trim() === '') {
      return { error: 'id_inventario debe ser un entero mayor a 0' }
    }

    idInventario = Number.parseInt(rawInventarioId, 10)

    if (!Number.isInteger(idInventario) || idInventario <= 0) {
      return { error: 'id_inventario debe ser un entero mayor a 0' }
    }
  }

  const value: MovimientoInventarioFilters = {
    page,
    limit,
  }

  if (typeof rawTipo === 'string') {
    value.tipo = rawTipo as TipoMovimientoInventario
  }

  if (idInventario !== undefined) {
    value.idInventario = idInventario
  }

  return { value }
}

export const validateMovimientoInventarioId = (
  rawId: string,
): { value?: number; error?: string } => {
  const id = Number.parseInt(rawId, 10)

  if (!Number.isInteger(id) || id <= 0) {
    return { error: 'id invalido' }
  }

  return { value: id }
}
