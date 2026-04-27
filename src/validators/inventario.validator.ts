import type {
  ActualizarInventarioInput,
  CrearInventarioInput,
  InventarioFilters,
} from '../types/inventario.types.js'

const INVENTARIO_LIMIT_DEFAULT = 10
const INVENTARIO_LIMIT_MAX = 100

const isNonEmptyString = (value: unknown): value is string =>
  typeof value === 'string' && value.trim().length > 0

const parseNonNegativeInteger = (
  value: unknown,
  fieldName: string,
): number | string => {
  if (typeof value !== 'number' || !Number.isInteger(value) || value < 0) {
    return `${fieldName} debe ser un entero mayor o igual a 0`
  }

  return value
}

export const validateCreateInventarioInput = (
  body: unknown,
): { value?: CrearInventarioInput; error?: string } => {
  if (!body || typeof body !== 'object') {
    return { error: 'Payload invalido' }
  }

  const {
    nombre,
    stock_actual = 0,
    stock_minimo = 0,
    unidad_de_medida,
  } = body as Record<string, unknown>

  if (!isNonEmptyString(nombre)) {
    return { error: 'nombre es requerido' }
  }

  const parsedStockActual = parseNonNegativeInteger(
    stock_actual,
    'stock_actual',
  )
  if (typeof parsedStockActual === 'string') {
    return { error: parsedStockActual }
  }

  const parsedStockMinimo = parseNonNegativeInteger(
    stock_minimo,
    'stock_minimo',
  )
  if (typeof parsedStockMinimo === 'string') {
    return { error: parsedStockMinimo }
  }

  if (!isNonEmptyString(unidad_de_medida)) {
    return { error: 'unidad_de_medida es requerida' }
  }

  return {
    value: {
      nombre: nombre.trim(),
      stock_actual: parsedStockActual,
      stock_minimo: parsedStockMinimo,
      unidad_de_medida: unidad_de_medida.trim(),
    },
  }
}

export const validateUpdateInventarioInput = (
  body: unknown,
): { value?: ActualizarInventarioInput; error?: string } => {
  if (!body || typeof body !== 'object') {
    return { error: 'Payload invalido' }
  }

  const { nombre, stock_minimo, unidad_de_medida, stock_actual } =
    body as Record<string, unknown>

  if (stock_actual !== undefined) {
    return {
      error: 'stock_actual no puede modificarse desde este endpoint',
    }
  }

  const value: ActualizarInventarioInput = {}

  if (nombre !== undefined) {
    if (!isNonEmptyString(nombre)) {
      return { error: 'nombre debe ser un texto no vacio' }
    }
    value.nombre = nombre.trim()
  }

  if (stock_minimo !== undefined) {
    const parsedStockMinimo = parseNonNegativeInteger(
      stock_minimo,
      'stock_minimo',
    )
    if (typeof parsedStockMinimo === 'string') {
      return { error: parsedStockMinimo }
    }
    value.stock_minimo = parsedStockMinimo
  }

  if (unidad_de_medida !== undefined) {
    if (!isNonEmptyString(unidad_de_medida)) {
      return { error: 'unidad_de_medida debe ser un texto no vacio' }
    }
    value.unidad_de_medida = unidad_de_medida.trim()
  }

  if (Object.keys(value).length === 0) {
    return { error: 'Debe enviar al menos un campo valido para actualizar' }
  }

  return { value }
}

export const validateInventarioFilters = (
  query: Record<string, unknown>,
): { value?: InventarioFilters; error?: string } => {
  const rawPage = query.page
  const rawLimit = query.limit
  const rawSearch = query.search
  const rawBajoStock = query.bajo_stock ?? query.bajoStock

  const page =
    typeof rawPage === 'string' && rawPage.trim() !== ''
      ? Number.parseInt(rawPage, 10)
      : 1
  const limit =
    typeof rawLimit === 'string' && rawLimit.trim() !== ''
      ? Number.parseInt(rawLimit, 10)
      : INVENTARIO_LIMIT_DEFAULT

  if (!Number.isInteger(page) || page <= 0) {
    return { error: 'page debe ser un entero mayor a 0' }
  }

  if (!Number.isInteger(limit) || limit <= 0 || limit > INVENTARIO_LIMIT_MAX) {
    return {
      error: `limit debe ser un entero entre 1 y ${INVENTARIO_LIMIT_MAX}`,
    }
  }

  if (
    rawSearch !== undefined &&
    (typeof rawSearch !== 'string' || rawSearch.trim() === '')
  ) {
    return { error: 'search debe ser un texto no vacio' }
  }

  if (
    rawBajoStock !== undefined &&
    rawBajoStock !== 'true' &&
    rawBajoStock !== 'false'
  ) {
    return { error: 'bajo_stock debe ser true o false' }
  }

  const value: InventarioFilters = {
    page,
    limit,
  }

  if (typeof rawSearch === 'string' && rawSearch.trim() !== '') {
    value.search = rawSearch.trim()
  }

  if (rawBajoStock === 'true') {
    value.bajoStock = true
  }

  return { value }
}

export const validateInventarioId = (
  rawId: string,
): { value?: number; error?: string } => {
  const id = Number.parseInt(rawId, 10)

  if (!Number.isInteger(id) || id <= 0) {
    return { error: 'id invalido' }
  }

  return { value: id }
}
