import type { PoolClient, QueryResultRow } from 'pg'

import { pool } from '../db.js'
import type {
  CrearMovimientoInventarioInput,
  MovimientoInventario,
  MovimientoInventarioFilters,
} from '../types/movimiento-inventario.types.js'
import type { Inventario } from '../types/inventario.types.js'

type Queryable = PoolClient | typeof pool

const mapMovimientoInventario = <T extends QueryResultRow>(
  row: T,
): MovimientoInventario => ({
  id: row.id,
  tipo: row.tipo,
  cantidad: row.cantidad,
  fecha_movimiento: row.fecha_movimiento,
  id_inventario: row.id_inventario,
})

export const findMovimientoInventarioById = async (
  id: number,
  db: Queryable = pool,
): Promise<MovimientoInventario | null> => {
  const result = await db.query(
    `SELECT id, tipo, cantidad, fecha_movimiento, id_inventario
     FROM movimiento_inventario
     WHERE id = $1
     LIMIT 1`,
    [id],
  )

  return result.rows[0] ? mapMovimientoInventario(result.rows[0]) : null
}

export const createMovimientoInventario = async (
  payload: CrearMovimientoInventarioInput,
  db: Queryable = pool,
): Promise<MovimientoInventario> => {
  const result = await db.query(
    `INSERT INTO movimiento_inventario (tipo, cantidad, id_inventario)
     VALUES ($1, $2, $3)
     RETURNING id, tipo, cantidad, fecha_movimiento, id_inventario`,
    [payload.tipo, payload.cantidad, payload.id_inventario],
  )

  return mapMovimientoInventario(result.rows[0])
}

export const listMovimientoInventario = async (
  filters: MovimientoInventarioFilters,
  db: Queryable = pool,
): Promise<{ items: MovimientoInventario[]; total: number }> => {
  const conditions: string[] = []
  const values: Array<string | number> = []

  if (filters.tipo) {
    values.push(filters.tipo)
    conditions.push(`tipo = $${values.length}`)
  }

  if (filters.idInventario) {
    values.push(filters.idInventario)
    conditions.push(`id_inventario = $${values.length}`)
  }

  const whereClause =
    conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : ''

  const countResult = await db.query<{ total: string }>(
    `SELECT COUNT(*) AS total
     FROM movimiento_inventario
     ${whereClause}`,
    values,
  )

  values.push(filters.limit, (filters.page - 1) * filters.limit)

  const result = await db.query<MovimientoInventario>(
    `SELECT id, tipo, cantidad, fecha_movimiento, id_inventario
     FROM movimiento_inventario
     ${whereClause}
     ORDER BY fecha_movimiento DESC, id DESC
     LIMIT $${values.length - 1}
     OFFSET $${values.length}`,
    values,
  )

  return {
    items: result.rows,
    total: Number.parseInt(countResult.rows[0]?.total ?? '0', 10),
  }
}

export const findInventarioByIdForUpdate = async (
  id: number,
  db: Queryable = pool,
): Promise<Inventario | null> => {
  const result = await db.query(
    `SELECT id, nombre, stock_actual, stock_minimo, unidad_de_medida, created_at
     FROM inventario
     WHERE id = $1
     FOR UPDATE`,
    [id],
  )

  return result.rows[0]
    ? {
        id: result.rows[0].id,
        nombre: result.rows[0].nombre,
        stock_actual: result.rows[0].stock_actual,
        stock_minimo: result.rows[0].stock_minimo,
        unidad_de_medida: result.rows[0].unidad_de_medida,
        created_at: result.rows[0].created_at,
      }
    : null
}

export const updateInventarioStock = async (
  id: number,
  stockActual: number,
  db: Queryable = pool,
): Promise<void> => {
  await db.query(
    `UPDATE inventario
     SET stock_actual = $1
     WHERE id = $2`,
    [stockActual, id],
  )
}
