import type {
  ActualizarClienteInput,
  ClienteFilters,
  CrearClienteInput,
} from '../types/cliente.types.js'

const CLIENTE_LIMIT_DEFAULT = 9
const CLIENTE_LIMIT_MAX = 100

const isNonEmptyString = (value: unknown): value is string =>
  typeof value === 'string' && value.trim().length > 0

const isValidEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)

const normalizeOptionalNullableString = (
  value: unknown,
): string | null | undefined => {
  if (value === undefined) return undefined
  if (value === null) return null

  if (typeof value !== 'string') {
    return undefined
  }

  const trimmedValue = value.trim()

  return trimmedValue.length > 0 ? trimmedValue : null
}

export const validateCreateClienteInput = (
  body: unknown,
): { value?: CrearClienteInput; error?: string } => {
  if (!body || typeof body !== 'object') {
    return { error: 'Payload invalido' }
  }

  const { nombre_comercial, nombre_contacto, telefono, email, direccion } =
    body as Record<string, unknown>

  if (!isNonEmptyString(nombre_contacto)) {
    return { error: 'nombre_contacto es requerido' }
  }

  if (nombre_contacto.trim().length > 100) {
    return {
      error: 'nombre_contacto no debe exceder los 100 caracteres',
    }
  }

  if (!isNonEmptyString(telefono)) {
    return { error: 'telefono es requerido' }
  }

  if (telefono.trim().length > 20) {
    return { error: 'telefono no debe exceder los 20 caracteres' }
  }

  if (!isNonEmptyString(direccion)) {
    return { error: 'direccion es requerida' }
  }

  if (direccion.trim().length > 150) {
    return { error: 'direccion no debe exceder los 150 caracteres' }
  }

  const normalizedNombreComercial =
    normalizeOptionalNullableString(nombre_comercial)

  if (
    normalizedNombreComercial !== undefined &&
    normalizedNombreComercial !== null &&
    normalizedNombreComercial.length > 100
  ) {
    return {
      error: 'nombre_comercial no debe exceder los 100 caracteres',
    }
  }

  const normalizedEmail = normalizeOptionalNullableString(email)

  if (
    normalizedEmail !== undefined &&
    normalizedEmail !== null &&
    normalizedEmail.length > 150
  ) {
    return { error: 'email no debe exceder los 150 caracteres' }
  }

  if (
    normalizedEmail !== undefined &&
    normalizedEmail !== null &&
    !isValidEmail(normalizedEmail)
  ) {
    return { error: 'email debe tener un formato valido' }
  }

  const value: CrearClienteInput = {
    nombre_contacto: nombre_contacto.trim(),
    telefono: telefono.trim(),
    direccion: direccion.trim(),
  }

  if (normalizedNombreComercial !== undefined) {
    value.nombre_comercial = normalizedNombreComercial
  }

  if (normalizedEmail !== undefined) {
    value.email = normalizedEmail
  }

  return { value }
}

export const validateUpdateClienteInput = (
  body: unknown,
): { value?: ActualizarClienteInput; error?: string } => {
  if (!body || typeof body !== 'object') {
    return { error: 'Payload invalido' }
  }

  const { nombre_comercial, nombre_contacto, telefono, email, direccion } =
    body as Record<string, unknown>

  const value: ActualizarClienteInput = {}

  if (nombre_comercial !== undefined) {
    const normalizedNombreComercial =
      normalizeOptionalNullableString(nombre_comercial)

    if (normalizedNombreComercial === undefined) {
      return {
        error: 'nombre_comercial debe ser un texto valido o null',
      }
    }

    if (
      normalizedNombreComercial !== null &&
      normalizedNombreComercial.length > 100
    ) {
      return {
        error: 'nombre_comercial no debe exceder los 100 caracteres',
      }
    }

    value.nombre_comercial = normalizedNombreComercial
  }

  if (nombre_contacto !== undefined) {
    if (!isNonEmptyString(nombre_contacto)) {
      return { error: 'nombre_contacto debe ser un texto no vacio' }
    }

    if (nombre_contacto.trim().length > 100) {
      return {
        error: 'nombre_contacto no debe exceder los 100 caracteres',
      }
    }

    value.nombre_contacto = nombre_contacto.trim()
  }

  if (telefono !== undefined) {
    if (!isNonEmptyString(telefono)) {
      return { error: 'telefono debe ser un texto no vacio' }
    }

    if (telefono.trim().length > 20) {
      return { error: 'telefono no debe exceder los 20 caracteres' }
    }

    value.telefono = telefono.trim()
  }

  if (email !== undefined) {
    const normalizedEmail = normalizeOptionalNullableString(email)

    if (normalizedEmail === undefined) {
      return { error: 'email debe ser un texto valido o null' }
    }

    if (normalizedEmail !== null && normalizedEmail.length > 150) {
      return { error: 'email no debe exceder los 150 caracteres' }
    }

    if (normalizedEmail !== null && !isValidEmail(normalizedEmail)) {
      return { error: 'email debe tener un formato valido' }
    }

    value.email = normalizedEmail
  }

  if (direccion !== undefined) {
    if (!isNonEmptyString(direccion)) {
      return { error: 'direccion debe ser un texto no vacio' }
    }

    if (direccion.trim().length > 150) {
      return { error: 'direccion no debe exceder los 150 caracteres' }
    }

    value.direccion = direccion.trim()
  }

  if (Object.keys(value).length === 0) {
    return { error: 'Debe enviar al menos un campo valido para actualizar' }
  }

  return { value }
}

export const validateClienteFilters = (
  query: Record<string, unknown>,
): { value?: ClienteFilters; error?: string } => {
  const rawPage = query.page
  const rawLimit = query.limit
  const rawSearch = query.search

  const page =
    typeof rawPage === 'string' && rawPage.trim() !== ''
      ? Number.parseInt(rawPage, 10)
      : 1

  const limit =
    typeof rawLimit === 'string' && rawLimit.trim() !== ''
      ? Number.parseInt(rawLimit, 10)
      : CLIENTE_LIMIT_DEFAULT

  if (!Number.isInteger(page) || page <= 0) {
    return { error: 'page debe ser un entero mayor a 0' }
  }

  if (!Number.isInteger(limit) || limit <= 0 || limit > CLIENTE_LIMIT_MAX) {
    return {
      error: `limit debe ser un entero entre 1 y ${CLIENTE_LIMIT_MAX}`,
    }
  }

  if (
    rawSearch !== undefined &&
    (typeof rawSearch !== 'string' || rawSearch.trim() === '')
  ) {
    return { error: 'search debe ser un texto no vacio' }
  }

  const value: ClienteFilters = {
    page,
    limit,
  }

  if (typeof rawSearch === 'string' && rawSearch.trim() !== '') {
    value.search = rawSearch.trim()
  }

  return { value }
}

export const validateClienteId = (
  rawId: string,
): { value?: number; error?: string } => {
  const id = Number.parseInt(rawId, 10)

  if (!Number.isInteger(id) || id <= 0) {
    return { error: 'id invalido' }
  }

  return { value: id }
}
