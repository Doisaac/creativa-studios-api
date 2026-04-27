import { pool } from '../db.js'
import * as inventarioRepository from '../repositories/inventario.repository.js'
import { InventarioError } from './inventario.errors.js'
import type {
  ActualizarInventarioInput,
  CrearInventarioInput,
  InventarioFilters,
  InventarioListResult,
} from '../types/inventario.types.js'

export const createInventario = async (payload: CrearInventarioInput) => {
  const client = await pool.connect()

  try {
    await client.query('BEGIN')

    const existingInventario =
      await inventarioRepository.findInventarioByNombre(payload.nombre, client)

    if (existingInventario) {
      throw new InventarioError('Ya existe un insumo con ese nombre', 409)
    }

    const inventario = await inventarioRepository.createInventario(
      payload,
      client,
    )

    await client.query('COMMIT')

    return inventario
  } catch (error) {
    await client.query('ROLLBACK')
    throw error
  } finally {
    client.release()
  }
}

export const listInventario = async (
  filters: InventarioFilters,
): Promise<InventarioListResult> => {
  const { items, total } = await inventarioRepository.listInventario(filters)

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

export const getInventarioById = async (id: number) => {
  const inventario = await inventarioRepository.findInventarioById(id)

  if (!inventario) {
    throw new InventarioError('Registro de inventario no encontrado', 404)
  }

  return inventario
}

export const updateInventario = async (
  id: number,
  payload: ActualizarInventarioInput,
) => {
  const client = await pool.connect()

  try {
    await client.query('BEGIN')

    const currentInventario = await inventarioRepository.findInventarioById(
      id,
      client,
    )

    if (!currentInventario) {
      throw new InventarioError('Registro de inventario no encontrado', 404)
    }

    if (
      payload.nombre &&
      payload.nombre.toLowerCase() !== currentInventario.nombre.toLowerCase()
    ) {
      const existingInventario =
        await inventarioRepository.findInventarioByNombre(
          payload.nombre,
          client,
        )

      if (existingInventario && existingInventario.id !== id) {
        throw new InventarioError('Ya existe un insumo con ese nombre', 409)
      }
    }

    const updatedInventario = await inventarioRepository.updateInventario(
      id,
      payload,
      client,
    )

    await client.query('COMMIT')

    return updatedInventario
  } catch (error) {
    await client.query('ROLLBACK')
    throw error
  } finally {
    client.release()
  }
}

export const deleteInventario = async (id: number) => {
  const client = await pool.connect()

  try {
    await client.query('BEGIN')

    const currentInventario = await inventarioRepository.findInventarioById(
      id,
      client,
    )

    if (!currentInventario) {
      throw new InventarioError('Registro de inventario no encontrado', 404)
    }

    const references = await inventarioRepository.getInventarioReferences(
      id,
      client,
    )

    if (references.productos > 0 || references.movimientos > 0) {
      throw new InventarioError(
        'No se puede eliminar el inventario porque tiene referencias asociadas',
        409,
      )
    }

    await inventarioRepository.deleteInventarioById(id, client)

    await client.query('COMMIT')
  } catch (error) {
    await client.query('ROLLBACK')
    throw error
  } finally {
    client.release()
  }
}

export const getLowStockInventario = async () =>
  inventarioRepository.getLowStockInventario()
