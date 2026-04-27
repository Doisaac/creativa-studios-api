import type { NextFunction, Response } from 'express'

import type { AuthRequest, RolPermitido } from '../types/auth.types.js'

export const validateRole =
  (...allowedRoles: RolPermitido[]) =>
  (req: AuthRequest, res: Response, next: NextFunction) => {
    const userRole = req.user?.role

    if (!userRole) {
      return res.status(401).json({
        success: false,
        message: 'Usuario no autenticado',
        data: null,
      })
    }

    if (!allowedRoles.includes(userRole as RolPermitido)) {
      return res.status(403).json({
        success: false,
        message: 'No tiene permisos para realizar esta accion',
        data: null,
      })
    }

    next()
  }
