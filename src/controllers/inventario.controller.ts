import type { Request, Response } from 'express'

import { InventarioError } from '../services/inventario.errors.js'
import * as inventarioService from '../services/inventario.service.js'
import {
  validateCreateInventarioInput,
  validateInventarioFilters,
  validateInventarioId,
  validateUpdateInventarioInput,
} from '../validators/inventario.validator.js'

const handleInventarioError = (
  error: unknown,
  res: Response,
  fallback: string,
) => {
  if (error instanceof InventarioError) {
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

export const createInventario = async (req: Request, res: Response) => {
  try {
    const validation = validateCreateInventarioInput(req.body)

    if (!validation.value) {
      return res.status(400).json({
        success: false,
        message: validation.error,
        data: null,
      })
    }

    const inventario = await inventarioService.createInventario(
      validation.value,
    )

    return res.status(201).json({
      success: true,
      message: 'Inventario creado correctamente',
      data: inventario,
    })
  } catch (error) {
    return handleInventarioError(error, res, 'Error al crear inventario')
  }
}

export const listInventario = async (req: Request, res: Response) => {
  try {
    const validation = validateInventarioFilters(
      req.query as Record<string, unknown>,
    )

    if (!validation.value) {
      return res.status(400).json({
        success: false,
        message: validation.error,
        data: null,
      })
    }

    const data = await inventarioService.listInventario(validation.value)

    return res.status(200).json({
      success: true,
      message: 'Inventario obtenido correctamente',
      data,
    })
  } catch (error) {
    return handleInventarioError(error, res, 'Error al listar inventario')
  }
}

export const getInventarioById = async (req: Request, res: Response) => {
  try {
    const validation = validateInventarioId(String(req.params.id))

    if (!validation.value) {
      return res.status(400).json({
        success: false,
        message: validation.error,
        data: null,
      })
    }

    const inventario = await inventarioService.getInventarioById(
      validation.value,
    )

    return res.status(200).json({
      success: true,
      message: 'Registro de inventario obtenido correctamente',
      data: inventario,
    })
  } catch (error) {
    return handleInventarioError(error, res, 'Error al obtener inventario')
  }
}

export const updateInventario = async (req: Request, res: Response) => {
  try {
    const idValidation = validateInventarioId(String(req.params.id))

    if (!idValidation.value) {
      return res.status(400).json({
        success: false,
        message: idValidation.error,
        data: null,
      })
    }

    const bodyValidation = validateUpdateInventarioInput(req.body)

    if (!bodyValidation.value) {
      return res.status(400).json({
        success: false,
        message: bodyValidation.error,
        data: null,
      })
    }

    const inventario = await inventarioService.updateInventario(
      idValidation.value,
      bodyValidation.value,
    )

    return res.status(200).json({
      success: true,
      message: 'Inventario actualizado correctamente',
      data: inventario,
    })
  } catch (error) {
    return handleInventarioError(error, res, 'Error al actualizar inventario')
  }
}

export const deleteInventario = async (req: Request, res: Response) => {
  try {
    const validation = validateInventarioId(String(req.params.id))

    if (!validation.value) {
      return res.status(400).json({
        success: false,
        message: validation.error,
        data: null,
      })
    }

    await inventarioService.deleteInventario(validation.value)

    return res.status(200).json({
      success: true,
      message: 'Inventario eliminado correctamente',
      data: null,
    })
  } catch (error) {
    return handleInventarioError(error, res, 'Error al eliminar inventario')
  }
}

export const getLowStockInventario = async (req: Request, res: Response) => {
  try {
    const inventario = await inventarioService.getLowStockInventario()

    return res.status(200).json({
      success: true,
      message: 'Inventario con bajo stock obtenido correctamente',
      data: inventario,
    })
  } catch (error) {
    return handleInventarioError(
      error,
      res,
      'Error al obtener inventario bajo stock',
    )
  }
}
