import jwt from 'jsonwebtoken'
import type { Response, NextFunction } from 'express'

import type { AuthRequest, TokenInfo } from '../types/auth.types.js'

export const validateJWT = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  const token = req.header('x-token')

  if (!token) {
    return res.status(401).json({
      ok: false,
      msg: 'Falta el token en la petición',
    })
  }

  try {
    const { id, name, role } = jwt.verify(
      token,
      process.env.JWT_SECRET as string,
    ) as TokenInfo

    req.user = { id, name, role }

    next()
  } catch {
    return res.status(401).json({
      ok: false,
      message: 'El token no es válido',
    })
  }
}
