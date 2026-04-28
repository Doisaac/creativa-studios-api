import type { Request, Response } from 'express'

import { MovimientoInventarioError } from '../services/movimiento-inventario.errors.js'
import * as movimientoInventarioService from '../services/movimiento-inventario.service.js'
import {
  validateCreateMovimientoInventarioInput,
  validateMovimientoInventarioFilters,
  validateMovimientoInventarioId,
} from '../validators/movimiento-inventario.validator.js'

const handleMovimientoInventarioError = (
  error: unknown,
  res: Response,
  fallback: string,
) => {
  if (error instanceof MovimientoInventarioError) {
    return res.status(error.statusCode).json({
      success: false,
      message: error.message,
      data: null,
    })
  }

  console.error(error)

  return res.status(500).json({
    success: false,
    message: fallback,
    data: null,
  })
}

export const createMovimientoInventario = async (
  req: Request,
  res: Response,
) => {
  try {
    const validation = validateCreateMovimientoInventarioInput(req.body)

    if (!validation.value) {
      return res.status(400).json({
        success: false,
        message: validation.error,
        data: null,
      })
    }

    const movimiento =
      await movimientoInventarioService.createMovimientoInventario(
        validation.value,
      )

    return res.status(201).json({
      success: true,
      message: 'Movimiento de inventario creado correctamente',
      data: movimiento,
    })
  } catch (error) {
    return handleMovimientoInventarioError(
      error,
      res,
      'Error al crear movimiento de inventario',
    )
  }
}

export const listMovimientoInventario = async (req: Request, res: Response) => {
  try {
    const validation = validateMovimientoInventarioFilters(
      req.query as Record<string, unknown>,
    )

    if (!validation.value) {
      return res.status(400).json({
        success: false,
        message: validation.error,
        data: null,
      })
    }

    const data = await movimientoInventarioService.listMovimientoInventario(
      validation.value,
    )

    return res.status(200).json({
      success: true,
      message: 'Movimientos de inventario obtenidos correctamente',
      data,
    })
  } catch (error) {
    return handleMovimientoInventarioError(
      error,
      res,
      'Error al listar movimientos de inventario',
    )
  }
}

export const getMovimientoInventarioById = async (
  req: Request,
  res: Response,
) => {
  try {
    const validation = validateMovimientoInventarioId(String(req.params.id))

    if (!validation.value) {
      return res.status(400).json({
        success: false,
        message: validation.error,
        data: null,
      })
    }

    const movimiento =
      await movimientoInventarioService.getMovimientoInventarioById(
        validation.value,
      )

    return res.status(200).json({
      success: true,
      message: 'Movimiento de inventario obtenido correctamente',
      data: movimiento,
    })
  } catch (error) {
    return handleMovimientoInventarioError(
      error,
      res,
      'Error al obtener movimiento de inventario',
    )
  }
}

export const getMovimientosByInventario = async (
  req: Request,
  res: Response,
) => {
  try {
    const validation = validateMovimientoInventarioId(
      String(req.params.idInventario),
    )

    if (!validation.value) {
      return res.status(400).json({
        success: false,
        message: validation.error,
        data: null,
      })
    }

    const movimientos =
      await movimientoInventarioService.getMovimientosByInventario(
        validation.value,
      )

    return res.status(200).json({
      success: true,
      message: 'Movimientos del inventario obtenidos correctamente',
      data: movimientos,
    })
  } catch (error) {
    return handleMovimientoInventarioError(
      error,
      res,
      'Error al obtener movimientos del inventario',
    )
  }
}
