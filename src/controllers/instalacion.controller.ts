import type { Response } from 'express'

import { InstalacionError } from '../services/instalacion.errors.js'
import * as instalacionService from '../services/instalacion.service.js'
import type { AuthRequest } from '../types/auth.types.js'
import {
  validateAsignarInstaladorInput,
  validateCreateInstalacionInput,
  validateInstalacionFilters,
  validateInstalacionId,
  validateReprogramarInstalacionInput,
  validateUpdateEstadoInstalacionInput,
} from '../validators/instalacion.validator.js'

const handleInstalacionError = (
  error: unknown,
  res: Response,
  fallback: string,
) => {
  if (error instanceof InstalacionError) {
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

export const createInstalacionForPedido = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const idValidation = validateInstalacionId(String(req.params.id))

    if (!idValidation.value) {
      return res.status(400).json({
        success: false,
        message: idValidation.error,
        data: null,
      })
    }

    const bodyValidation = validateCreateInstalacionInput(req.body)

    if (!bodyValidation.value) {
      return res.status(400).json({
        success: false,
        message: bodyValidation.error,
        data: null,
      })
    }

    const instalacion = await instalacionService.createInstalacionForPedido(
      idValidation.value,
      bodyValidation.value,
    )

    return res.status(201).json({
      success: true,
      message: 'Instalación creada correctamente',
      data: instalacion,
    })
  } catch (error) {
    return handleInstalacionError(error, res, 'Error al crear instalación')
  }
}

export const listInstalaciones = async (req: AuthRequest, res: Response) => {
  try {
    const validation = validateInstalacionFilters(
      req.query as Record<string, unknown>,
    )

    if (!validation.value) {
      return res.status(400).json({
        success: false,
        message: validation.error,
        data: null,
      })
    }

    const data = await instalacionService.listInstalaciones(validation.value)

    return res.status(200).json({
      success: true,
      message: 'Instalaciones obtenidas correctamente',
      data,
    })
  } catch (error) {
    return handleInstalacionError(error, res, 'Error al listar instalaciones')
  }
}

export const listMisInstalaciones = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({
        success: false,
        message: 'Usuario no autenticado',
        data: null,
      })
    }

    const validation = validateInstalacionFilters(
      req.query as Record<string, unknown>,
    )

    if (!validation.value) {
      return res.status(400).json({
        success: false,
        message: validation.error,
        data: null,
      })
    }

    const data = await instalacionService.listMisInstalaciones(
      req.user.id,
      validation.value,
    )

    return res.status(200).json({
      success: true,
      message: 'Mis instalaciones obtenidas correctamente',
      data,
    })
  } catch (error) {
    return handleInstalacionError(
      error,
      res,
      'Error al listar mis instalaciones',
    )
  }
}

export const getInstalacionById = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Usuario no autenticado',
        data: null,
      })
    }

    const validation = validateInstalacionId(String(req.params.id))

    if (!validation.value) {
      return res.status(400).json({
        success: false,
        message: validation.error,
        data: null,
      })
    }

    const instalacion = await instalacionService.getInstalacionById(
      validation.value,
      req.user,
    )

    return res.status(200).json({
      success: true,
      message: 'Instalación obtenida correctamente',
      data: instalacion,
    })
  } catch (error) {
    return handleInstalacionError(error, res, 'Error al obtener instalación')
  }
}

export const asignarInstalador = async (req: AuthRequest, res: Response) => {
  try {
    const idValidation = validateInstalacionId(String(req.params.id))

    if (!idValidation.value) {
      return res.status(400).json({
        success: false,
        message: idValidation.error,
        data: null,
      })
    }

    const bodyValidation = validateAsignarInstaladorInput(req.body)

    if (!bodyValidation.value) {
      return res.status(400).json({
        success: false,
        message: bodyValidation.error,
        data: null,
      })
    }

    const instalacion = await instalacionService.asignarInstalador(
      idValidation.value,
      bodyValidation.value,
    )

    return res.status(200).json({
      success: true,
      message: 'Instalador asignado correctamente',
      data: instalacion,
    })
  } catch (error) {
    return handleInstalacionError(error, res, 'Error al asignar instalador')
  }
}

export const updateEstadoInstalacion = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Usuario no autenticado',
        data: null,
      })
    }

    const idValidation = validateInstalacionId(String(req.params.id))

    if (!idValidation.value) {
      return res.status(400).json({
        success: false,
        message: idValidation.error,
        data: null,
      })
    }

    const bodyValidation = validateUpdateEstadoInstalacionInput(req.body)

    if (!bodyValidation.value) {
      return res.status(400).json({
        success: false,
        message: bodyValidation.error,
        data: null,
      })
    }

    const instalacion = await instalacionService.updateEstadoInstalacion(
      idValidation.value,
      bodyValidation.value,
      req.user,
    )

    return res.status(200).json({
      success: true,
      message: 'Estado de instalación actualizado correctamente',
      data: instalacion,
    })
  } catch (error) {
    return handleInstalacionError(
      error,
      res,
      'Error al actualizar estado de instalación',
    )
  }
}

export const reprogramarInstalacion = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const idValidation = validateInstalacionId(String(req.params.id))

    if (!idValidation.value) {
      return res.status(400).json({
        success: false,
        message: idValidation.error,
        data: null,
      })
    }

    const bodyValidation = validateReprogramarInstalacionInput(req.body)

    if (!bodyValidation.value) {
      return res.status(400).json({
        success: false,
        message: bodyValidation.error,
        data: null,
      })
    }

    const instalacion = await instalacionService.reprogramarInstalacion(
      idValidation.value,
      bodyValidation.value,
    )

    return res.status(200).json({
      success: true,
      message: 'Instalación reprogramada correctamente',
      data: instalacion,
    })
  } catch (error) {
    return handleInstalacionError(
      error,
      res,
      'Error al reprogramar instalación',
    )
  }
}
