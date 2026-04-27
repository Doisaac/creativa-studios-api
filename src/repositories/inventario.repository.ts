import type { PoolClient, QueryResultRow } from 'pg'

import { pool } from '../db.js'
import type {
  ActualizarInventarioInput,
  CrearInventarioInput,
  Inventario,
  InventarioFilters,
  InventarioListItem,
} from '../types/inventario.types.js'

type Queryable = PoolClient | typeof pool

const mapInventario = <T extends QueryResultRow>(row: T): Inventario => ({
  id: row.id,
  nombre: row.nombre,
  stock_actual: row.stock_actual,
  stock_minimo: row.stock_minimo,
  unidad_de_medida: row.unidad_de_medida,
  created_at: row.created_at,
})

export const findInventarioById = async (
  id: number,
  db: Queryable = pool,
): Promise<Inventario | null> => {
  const result = await db.query(
    `SELECT id, nombre, stock_actual, stock_minimo, unidad_de_medida, created_at
     FROM inventario
     WHERE id = $1
     LIMIT 1`,
    [id],
  )

  return result.rows[0] ? mapInventario(result.rows[0]) : null
}

export const findInventarioByNombre = async (
  nombre: string,
  db: Queryable = pool,
): Promise<Inventario | null> => {
  const result = await db.query(
    `SELECT id, nombre, stock_actual, stock_minimo, unidad_de_medida, created_at
     FROM inventario
     WHERE LOWER(nombre) = LOWER($1)
     LIMIT 1`,
    [nombre],
  )

  return result.rows[0] ? mapInventario(result.rows[0]) : null
}

export const createInventario = async (
  payload: CrearInventarioInput,
  db: Queryable = pool,
): Promise<Inventario> => {
  const result = await db.query(
    `INSERT INTO inventario (nombre, stock_actual, stock_minimo, unidad_de_medida)
     VALUES ($1, $2, $3, $4)
     RETURNING id, nombre, stock_actual, stock_minimo, unidad_de_medida, created_at`,
    [
      payload.nombre,
      payload.stock_actual,
      payload.stock_minimo,
      payload.unidad_de_medida,
    ],
  )

  return mapInventario(result.rows[0])
}

export const updateInventario = async (
  id: number,
  payload: ActualizarInventarioInput,
  db: Queryable = pool,
): Promise<Inventario> => {
  const fields: string[] = []
  const values: Array<string | number> = []

  if (payload.nombre !== undefined) {
    values.push(payload.nombre)
    fields.push(`nombre = $${values.length}`)
  }

  if (payload.stock_minimo !== undefined) {
    values.push(payload.stock_minimo)
    fields.push(`stock_minimo = $${values.length}`)
  }

  if (payload.unidad_de_medida !== undefined) {
    values.push(payload.unidad_de_medida)
    fields.push(`unidad_de_medida = $${values.length}`)
  }

  values.push(id)

  const result = await db.query(
    `UPDATE inventario
     SET ${fields.join(', ')}
     WHERE id = $${values.length}
     RETURNING id, nombre, stock_actual, stock_minimo, unidad_de_medida, created_at`,
    values,
  )

  return mapInventario(result.rows[0])
}

export const listInventario = async (
  filters: InventarioFilters,
  db: Queryable = pool,
): Promise<{ items: InventarioListItem[]; total: number }> => {
  const conditions: string[] = []
  const values: Array<string | number> = []

  if (filters.search) {
    values.push(`%${filters.search}%`)
    conditions.push(`nombre ILIKE $${values.length}`)
  }

  if (filters.bajoStock) {
    conditions.push('stock_actual <= stock_minimo')
  }

  const whereClause =
    conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : ''

  const countResult = await db.query<{ total: string }>(
    `SELECT COUNT(*) AS total
     FROM inventario
     ${whereClause}`,
    values,
  )

  values.push(filters.limit, (filters.page - 1) * filters.limit)

  const result = await db.query<InventarioListItem>(
    `SELECT
       id,
       nombre,
       stock_actual,
       stock_minimo,
       unidad_de_medida,
       created_at,
       (stock_actual <= stock_minimo) AS bajo_stock
     FROM inventario
     ${whereClause}
     ORDER BY nombre ASC, id ASC
     LIMIT $${values.length - 1}
     OFFSET $${values.length}`,
    values,
  )

  return {
    items: result.rows,
    total: Number.parseInt(countResult.rows[0]?.total ?? '0', 10),
  }
}

export const getLowStockInventario = async (
  db: Queryable = pool,
): Promise<InventarioListItem[]> => {
  const result = await db.query<InventarioListItem>(
    `SELECT
       id,
       nombre,
       stock_actual,
       stock_minimo,
       unidad_de_medida,
       created_at,
       true AS bajo_stock
     FROM inventario
     WHERE stock_actual <= stock_minimo
     ORDER BY (stock_minimo - stock_actual) DESC, nombre ASC, id ASC`,
  )

  return result.rows
}

export const getInventarioReferences = async (
  id: number,
  db: Queryable = pool,
): Promise<{ productos: number; movimientos: number }> => {
  const result = await db.query<{
    productos: string
    movimientos: string
  }>(
    `SELECT
       (SELECT COUNT(*) FROM producto WHERE id_insumo_inventario = $1) AS productos,
       (SELECT COUNT(*) FROM movimiento_inventario WHERE id_inventario = $1) AS movimientos`,
    [id],
  )

  return {
    productos: Number.parseInt(result.rows[0]?.productos ?? '0', 10),
    movimientos: Number.parseInt(result.rows[0]?.movimientos ?? '0', 10),
  }
}

export const deleteInventarioById = async (
  id: number,
  db: Queryable = pool,
): Promise<void> => {
  await db.query('DELETE FROM inventario WHERE id = $1', [id])
}
