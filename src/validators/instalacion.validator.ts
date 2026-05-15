import type {
  ActualizarEstadoInstalacionInput,
  AsignarInstaladorInput,
  CrearInstalacionInput,
  InstalacionEstado,
  InstalacionFilters,
  ReprogramarInstalacionInput,
} from '../types/instalacion.types.js'
import { INSTALACION_ESTADOS } from '../types/instalacion.types.js'

const INSTALACION_LIMIT_DEFAULT = 10
const INSTALACION_LIMIT_MAX = 100

const isNonEmptyString = (value: unknown): value is string =>
  typeof value === 'string' && value.trim().length > 0

const parsePositiveInteger = (
  value: unknown,
  fieldName: string,
): number | string => {
  if (typeof value !== 'number' || !Number.isInteger(value) || value <= 0) {
    return `${fieldName} debe ser un número entero mayor a 0`
  }

  return value
}

const parsePositiveIntegerFromQuery = (
  value: unknown,
  fieldName: string,
): number | string | undefined => {
  if (value === undefined) {
    return undefined
  }

  if (typeof value !== 'string' || value.trim() === '') {
    return `${fieldName} debe ser un número entero mayor a 0`
  }

  const parsed = Number.parseInt(value, 10)

  if (!Number.isInteger(parsed) || parsed <= 0) {
    return `${fieldName} debe ser un número entero mayor a 0`
  }

  return parsed
}

const isValidDateString = (value: string): boolean => {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value)

  if (!match) {
    return false
  }

  const [, yearRaw, monthRaw, dayRaw] = match

  if (!yearRaw || !monthRaw || !dayRaw) {
    return false
  }

  const year = Number(yearRaw)
  const month = Number(monthRaw)
  const day = Number(dayRaw)

  const date = new Date(Date.UTC(year, month - 1, day))

  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  )
}

const isInstalacionEstado = (value: string): value is InstalacionEstado => {
  return INSTALACION_ESTADOS.includes(value as InstalacionEstado)
}

export const validateInstalacionId = (
  rawId: string,
): { value?: number; error?: string } => {
  const id = Number.parseInt(rawId, 10)

  if (!Number.isInteger(id) || id <= 0) {
    return { error: 'id invalido' }
  }

  return { value: id }
}

export const validateCreateInstalacionInput = (
  body: unknown,
): { value?: CrearInstalacionInput; error?: string } => {
  if (!body || typeof body !== 'object') {
    return { error: 'Payload invalido' }
  }

  const {
    id_instalador,
    fecha_programada,
    direccion_instalacion,
    observaciones,
  } = body as Record<string, unknown>

  const value: CrearInstalacionInput = {}

  if (id_instalador !== undefined && id_instalador !== null) {
    const parsedIdInstalador = parsePositiveInteger(
      id_instalador,
      'id_instalador',
    )

    if (typeof parsedIdInstalador === 'string') {
      return { error: parsedIdInstalador }
    }

    value.id_instalador = parsedIdInstalador
  }

  if (fecha_programada !== undefined && fecha_programada !== null) {
    if (!isNonEmptyString(fecha_programada)) {
      return { error: 'fecha_programada debe ser un texto no vacio' }
    }

    if (!isValidDateString(fecha_programada.trim())) {
      return { error: 'fecha_programada debe tener formato YYYY-MM-DD valido' }
    }

    value.fecha_programada = fecha_programada.trim()
  }

  if (direccion_instalacion !== undefined && direccion_instalacion !== null) {
    if (!isNonEmptyString(direccion_instalacion)) {
      return { error: 'direccion_instalacion debe ser un texto no vacio' }
    }

    value.direccion_instalacion = direccion_instalacion.trim()
  }

  if (observaciones !== undefined && observaciones !== null) {
    if (typeof observaciones !== 'string') {
      return { error: 'observaciones debe ser un texto' }
    }

    value.observaciones = observaciones.trim() || null
  }

  return { value }
}

export const validateAsignarInstaladorInput = (
  body: unknown,
): { value?: AsignarInstaladorInput; error?: string } => {
  if (!body || typeof body !== 'object') {
    return { error: 'Payload invalido' }
  }

  const { id_instalador } = body as Record<string, unknown>

  const parsedIdInstalador = parsePositiveInteger(
    id_instalador,
    'id_instalador',
  )

  if (typeof parsedIdInstalador === 'string') {
    return { error: parsedIdInstalador }
  }

  return {
    value: {
      id_instalador: parsedIdInstalador,
    },
  }
}

export const validateUpdateEstadoInstalacionInput = (
  body: unknown,
): { value?: ActualizarEstadoInstalacionInput; error?: string } => {
  if (!body || typeof body !== 'object') {
    return { error: 'Payload invalido' }
  }

  const { estado, observaciones } = body as Record<string, unknown>

  if (!isNonEmptyString(estado)) {
    return { error: 'estado es requerido' }
  }

  const cleanEstado = estado.trim()

  if (!isInstalacionEstado(cleanEstado)) {
    return {
      error:
        'estado debe ser uno de: pendiente, asignada, en_proceso, completada, no_realizada, cancelada',
    }
  }

  const value: ActualizarEstadoInstalacionInput = {
    estado: cleanEstado,
  }

  if (observaciones !== undefined && observaciones !== null) {
    if (typeof observaciones !== 'string') {
      return { error: 'observaciones debe ser un texto' }
    }

    value.observaciones = observaciones.trim() || null
  }

  return { value }
}

export const validateReprogramarInstalacionInput = (
  body: unknown,
): { value?: ReprogramarInstalacionInput; error?: string } => {
  if (!body || typeof body !== 'object') {
    return { error: 'Payload invalido' }
  }

  const { fecha_programada, observaciones } = body as Record<string, unknown>

  if (!isNonEmptyString(fecha_programada)) {
    return { error: 'fecha_programada es requerida' }
  }

  if (!isValidDateString(fecha_programada.trim())) {
    return { error: 'fecha_programada debe tener formato YYYY-MM-DD valido' }
  }

  const value: ReprogramarInstalacionInput = {
    fecha_programada: fecha_programada.trim(),
  }

  if (observaciones !== undefined && observaciones !== null) {
    if (typeof observaciones !== 'string') {
      return { error: 'observaciones debe ser un texto' }
    }

    value.observaciones = observaciones.trim() || null
  }

  return { value }
}

export const validateInstalacionFilters = (
  query: Record<string, unknown>,
): { value?: InstalacionFilters; error?: string } => {
  const rawPage = query.page
  const rawLimit = query.limit
  const rawEstado = query.estado
  const rawIdInstalador = query.idInstalador ?? query.id_instalador
  const rawIdPedido = query.idPedido ?? query.id_pedido

  const page =
    typeof rawPage === 'string' && rawPage.trim() !== ''
      ? Number.parseInt(rawPage, 10)
      : 1

  const limit =
    typeof rawLimit === 'string' && rawLimit.trim() !== ''
      ? Number.parseInt(rawLimit, 10)
      : INSTALACION_LIMIT_DEFAULT

  if (!Number.isInteger(page) || page <= 0) {
    return { error: 'page debe ser un entero mayor a 0' }
  }

  if (!Number.isInteger(limit) || limit <= 0 || limit > INSTALACION_LIMIT_MAX) {
    return {
      error: `limit debe ser un entero entre 1 y ${INSTALACION_LIMIT_MAX}`,
    }
  }

  const value: InstalacionFilters = {
    page,
    limit,
  }

  if (rawEstado !== undefined) {
    if (typeof rawEstado !== 'string' || rawEstado.trim() === '') {
      return { error: 'estado debe ser un texto no vacio' }
    }

    const cleanEstado = rawEstado.trim()

    if (!isInstalacionEstado(cleanEstado)) {
      return {
        error:
          'estado debe ser uno de: pendiente, asignada, en_proceso, completada, no_realizada, cancelada',
      }
    }

    value.estado = cleanEstado
  }

  const idInstalador = parsePositiveIntegerFromQuery(
    rawIdInstalador,
    'idInstalador',
  )

  if (typeof idInstalador === 'string') {
    return { error: idInstalador }
  }

  if (idInstalador !== undefined) {
    value.idInstalador = idInstalador
  }

  const idPedido = parsePositiveIntegerFromQuery(rawIdPedido, 'idPedido')

  if (typeof idPedido === 'string') {
    return { error: idPedido }
  }

  if (idPedido !== undefined) {
    value.idPedido = idPedido
  }

  return { value }
}
