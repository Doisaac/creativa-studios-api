import { pool } from '../db.js'
import * as movimientoInventarioRepository from '../repositories/movimiento-inventario.repository.js'
import { MovimientoInventarioError } from './movimiento-inventario.errors.js'
import type {
  CrearMovimientoInventarioInput,
  MovimientoInventarioFilters,
  MovimientoInventarioListResult,
} from '../types/movimiento-inventario.types.js'

const calculateNewStock = (
  currentStock: number,
  payload: CrearMovimientoInventarioInput,
): number => {
  if (payload.tipo === 'entrada') {
    return currentStock + payload.cantidad
  }

  if (payload.tipo === 'salida') {
    return currentStock - payload.cantidad
  }

  return payload.cantidad
}

export const createMovimientoInventario = async (
  payload: CrearMovimientoInventarioInput,
) => {
  const client = await pool.connect()

  try {
    await client.query('BEGIN')

    const inventario =
      await movimientoInventarioRepository.findInventarioByIdForUpdate(
        payload.id_inventario,
        client,
      )

    if (!inventario) {
      throw new MovimientoInventarioError(
        'Registro de inventario no encontrado',
        404,
      )
    }

    const newStock = calculateNewStock(inventario.stock_actual, payload)

    if (newStock < 0) {
      throw new MovimientoInventarioError(
        'La salida excede el stock disponible',
        409,
      )
    }

    const movimiento =
      await movimientoInventarioRepository.createMovimientoInventario(
        payload,
        client,
      )

    await movimientoInventarioRepository.updateInventarioStock(
      inventario.id,
      newStock,
      client,
    )

    await client.query('COMMIT')

    return movimiento
  } catch (error) {
    await client.query('ROLLBACK')
    throw error
  } finally {
    client.release()
  }
}

export const listMovimientoInventario = async (
  filters: MovimientoInventarioFilters,
): Promise<MovimientoInventarioListResult> => {
  const { items, total } =
    await movimientoInventarioRepository.listMovimientoInventario(filters)

  return {
    items,
    pagination: {
      page: filters.page,
      limit: filters.limit,
      total,
      totalPages: total === 0 ? 0 : Math.ceil(total / filters.limit),
    },
  }
}

export const getMovimientoInventarioById = async (id: number) => {
  const movimiento =
    await movimientoInventarioRepository.findMovimientoInventarioById(id)

  if (!movimiento) {
    throw new MovimientoInventarioError(
      'Movimiento de inventario no encontrado',
      404,
    )
  }

  return movimiento
}

export const getMovimientosByInventario = async (idInventario: number) => {
  const { items } =
    await movimientoInventarioRepository.listMovimientoInventario({
      page: 1,
      limit: 100,
      idInventario,
    })

  return items
}
