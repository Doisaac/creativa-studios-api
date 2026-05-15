import type { PoolClient, QueryResultRow } from 'pg'

import { pool } from '../db.js'
import type {
  Instalacion,
  InstalacionEstado,
  InstalacionFilters,
  InstalacionListItem,
  PedidoParaInstalacion,
} from '../types/instalacion.types.js'

type Queryable = PoolClient | typeof pool

interface CrearInstalacionRepositoryInput {
  id_pedido: number
  id_instalador?: number | null
  estado: InstalacionEstado
  fecha_programada?: string | null
  direccion_instalacion: string
  observaciones?: string | null
}

const mapInstalacion = <T extends QueryResultRow>(row: T): Instalacion => ({
  id: row.id,
  id_pedido: row.id_pedido,
  id_instalador: row.id_instalador ?? null,
  estado: row.estado,
  fecha_programada: row.fecha_programada ?? null,
  fecha_realizada: row.fecha_realizada ?? null,
  direccion_instalacion: row.direccion_instalacion,
  observaciones: row.observaciones ?? null,
  created_at: row.created_at,
})

const mapInstalacionListItem = <T extends QueryResultRow>(
  row: T,
): InstalacionListItem => ({
  id: row.id,
  id_pedido: row.id_pedido,
  pedido_estado: row.pedido_estado,
  pedido_fecha_entrega: row.pedido_fecha_entrega ?? null,

  id_cliente: row.id_cliente,
  cliente_nombre_comercial: row.cliente_nombre_comercial ?? null,
  cliente_nombre_contacto: row.cliente_nombre_contacto,
  cliente_telefono: row.cliente_telefono,

  id_instalador: row.id_instalador ?? null,
  instalador_nombre: row.instalador_nombre ?? null,

  estado: row.estado,
  fecha_programada: row.fecha_programada ?? null,
  fecha_realizada: row.fecha_realizada ?? null,
  direccion_instalacion: row.direccion_instalacion,
  observaciones: row.observaciones ?? null,
  created_at: row.created_at,
})

export const findPedidoForInstalacionByIdForUpdate = async (
  idPedido: number,
  db: Queryable = pool,
): Promise<PedidoParaInstalacion | null> => {
  const result = await db.query(
    `SELECT
       p.id,
       p.estado,
       c.direccion AS direccion_cliente
     FROM pedido p
     INNER JOIN cliente c ON c.id = p.id_cliente
     WHERE p.id = $1
     FOR UPDATE OF p`,
    [idPedido],
  )

  return result.rows[0]
    ? {
        id: result.rows[0].id,
        estado: result.rows[0].estado,
        direccion_cliente: result.rows[0].direccion_cliente,
      }
    : null
}

export const findUsuarioInstaladorById = async (
  idInstalador: number,
  db: Queryable = pool,
): Promise<{ id: number; nombre: string } | null> => {
  const result = await db.query(
    `SELECT u.id, u.nombre
     FROM usuario u
     INNER JOIN rol r ON r.id = u.id_rol
     WHERE u.id = $1
       AND r.nombre = 'INSTALADOR'
     LIMIT 1`,
    [idInstalador],
  )

  return result.rows[0]
    ? {
        id: result.rows[0].id,
        nombre: result.rows[0].nombre,
      }
    : null
}

export const createInstalacion = async (
  payload: CrearInstalacionRepositoryInput,
  db: Queryable = pool,
): Promise<Instalacion> => {
  const result = await db.query(
    `INSERT INTO instalacion (
       id_pedido,
       id_instalador,
       estado,
       fecha_programada,
       direccion_instalacion,
       observaciones
     )
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING
       id,
       id_pedido,
       id_instalador,
       estado,
       fecha_programada,
       fecha_realizada,
       direccion_instalacion,
       observaciones,
       created_at`,
    [
      payload.id_pedido,
      payload.id_instalador ?? null,
      payload.estado,
      payload.fecha_programada ?? null,
      payload.direccion_instalacion,
      payload.observaciones ?? null,
    ],
  )

  return mapInstalacion(result.rows[0])
}

export const findInstalacionByPedidoId = async (
  idPedido: number,
  db: Queryable = pool,
): Promise<Instalacion | null> => {
  const result = await db.query(
    `SELECT
       id,
       id_pedido,
       id_instalador,
       estado,
       fecha_programada,
       fecha_realizada,
       direccion_instalacion,
       observaciones,
       created_at
     FROM instalacion
     WHERE id_pedido = $1
     LIMIT 1`,
    [idPedido],
  )

  return result.rows[0] ? mapInstalacion(result.rows[0]) : null
}

export const findInstalacionById = async (
  id: number,
  db: Queryable = pool,
): Promise<InstalacionListItem | null> => {
  const result = await db.query(
    `SELECT
       i.id,
       i.id_pedido,
       p.estado AS pedido_estado,
       p.fecha_entrega AS pedido_fecha_entrega,
       p.id_cliente,
       c.nombre_comercial AS cliente_nombre_comercial,
       c.nombre_contacto AS cliente_nombre_contacto,
       c.telefono AS cliente_telefono,
       i.id_instalador,
       u.nombre AS instalador_nombre,
       i.estado,
       i.fecha_programada,
       i.fecha_realizada,
       i.direccion_instalacion,
       i.observaciones,
       i.created_at
     FROM instalacion i
     INNER JOIN pedido p ON p.id = i.id_pedido
     INNER JOIN cliente c ON c.id = p.id_cliente
     LEFT JOIN usuario u ON u.id = i.id_instalador
     WHERE i.id = $1
     LIMIT 1`,
    [id],
  )

  return result.rows[0] ? mapInstalacionListItem(result.rows[0]) : null
}

export const findInstalacionByIdForUpdate = async (
  id: number,
  db: Queryable = pool,
): Promise<InstalacionListItem | null> => {
  const result = await db.query(
    `SELECT
       i.id,
       i.id_pedido,
       p.estado AS pedido_estado,
       p.fecha_entrega AS pedido_fecha_entrega,
       p.id_cliente,
       c.nombre_comercial AS cliente_nombre_comercial,
       c.nombre_contacto AS cliente_nombre_contacto,
       c.telefono AS cliente_telefono,
       i.id_instalador,
       u.nombre AS instalador_nombre,
       i.estado,
       i.fecha_programada,
       i.fecha_realizada,
       i.direccion_instalacion,
       i.observaciones,
       i.created_at
     FROM instalacion i
     INNER JOIN pedido p ON p.id = i.id_pedido
     INNER JOIN cliente c ON c.id = p.id_cliente
     LEFT JOIN usuario u ON u.id = i.id_instalador
     WHERE i.id = $1
     FOR UPDATE OF i, p`,
    [id],
  )

  return result.rows[0] ? mapInstalacionListItem(result.rows[0]) : null
}

export const listInstalaciones = async (
  filters: InstalacionFilters,
  db: Queryable = pool,
): Promise<{ items: InstalacionListItem[]; total: number }> => {
  const conditions: string[] = []
  const values: Array<string | number> = []

  if (filters.estado) {
    values.push(filters.estado)
    conditions.push(`i.estado = $${values.length}`)
  }

  if (filters.idInstalador) {
    values.push(filters.idInstalador)
    conditions.push(`i.id_instalador = $${values.length}`)
  }

  if (filters.idPedido) {
    values.push(filters.idPedido)
    conditions.push(`i.id_pedido = $${values.length}`)
  }

  const whereClause =
    conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : ''

  const countResult = await db.query<{ total: string }>(
    `SELECT COUNT(*) AS total
     FROM instalacion i
     ${whereClause}`,
    values,
  )

  values.push(filters.limit, (filters.page - 1) * filters.limit)

  const result = await db.query(
    `SELECT
       i.id,
       i.id_pedido,
       p.estado AS pedido_estado,
       p.fecha_entrega AS pedido_fecha_entrega,
       p.id_cliente,
       c.nombre_comercial AS cliente_nombre_comercial,
       c.nombre_contacto AS cliente_nombre_contacto,
       c.telefono AS cliente_telefono,
       i.id_instalador,
       u.nombre AS instalador_nombre,
       i.estado,
       i.fecha_programada,
       i.fecha_realizada,
       i.direccion_instalacion,
       i.observaciones,
       i.created_at
     FROM instalacion i
     INNER JOIN pedido p ON p.id = i.id_pedido
     INNER JOIN cliente c ON c.id = p.id_cliente
     LEFT JOIN usuario u ON u.id = i.id_instalador
     ${whereClause}
     ORDER BY i.fecha_programada ASC NULLS LAST, i.created_at DESC, i.id DESC
     LIMIT $${values.length - 1}
     OFFSET $${values.length}`,
    values,
  )

  return {
    items: result.rows.map(mapInstalacionListItem),
    total: Number.parseInt(countResult.rows[0]?.total ?? '0', 10),
  }
}

export const updateInstalacionInstalador = async (
  id: number,
  idInstalador: number,
  db: Queryable = pool,
): Promise<void> => {
  await db.query(
    `UPDATE instalacion
     SET
       id_instalador = $1,
       estado = 'asignada'
     WHERE id = $2`,
    [idInstalador, id],
  )
}

export const updateInstalacionEstado = async (
  id: number,
  estado: InstalacionEstado,
  observaciones: string | null | undefined,
  db: Queryable = pool,
): Promise<void> => {
  await db.query(
    `UPDATE instalacion
     SET
       estado = $1::varchar,
       observaciones = COALESCE($2::text, observaciones),
       fecha_realizada = CASE
         WHEN $1::varchar = 'completada' THEN now()
         ELSE fecha_realizada
       END
     WHERE id = $3`,
    [estado, observaciones ?? null, id],
  )
}

export const reprogramarInstalacion = async (
  id: number,
  fechaProgramada: string,
  observaciones: string | null | undefined,
  db: Queryable = pool,
): Promise<void> => {
  await db.query(
    `UPDATE instalacion
     SET
       fecha_programada = $1,
       observaciones = COALESCE($2, observaciones),
       estado = CASE
         WHEN id_instalador IS NULL THEN 'pendiente'
         ELSE 'asignada'
       END
     WHERE id = $3`,
    [fechaProgramada, observaciones ?? null, id],
  )
}

export const cancelInstalacionByPedidoId = async (
  idPedido: number,
  db: Queryable = pool,
): Promise<void> => {
  await db.query(
    `UPDATE instalacion
     SET estado = 'cancelada'
     WHERE id_pedido = $1
       AND estado NOT IN ('completada', 'cancelada')`,
    [idPedido],
  )
}
