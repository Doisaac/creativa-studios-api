import { Router, type Router as RouterType } from 'express'

import {
  loginUser,
  registerUser,
  renewJWT,
} from '../controllers/auth.controller.js'
import { validateJWT } from '../middlewares/validate-jwt.middleware.js'

const authRouter: RouterType = Router()

authRouter.post(
  '/register',
  /* #swagger.tags = ['Auth']
     #swagger.summary = 'Crear usuario para utilizar el sistema'
     #swagger.parameters['body'] = {
       in: 'body',
       required: true,
       schema: {
         nombre: 'Douglas Barrera',
         email: 'douglas@creativa.com',
         contraseña: 'password123',
         rol: 'ADMIN | RECEPCION | PRODUCCION | INSTALADOR'
       }
     }
  */

  registerUser,
)

authRouter.post(
  '/login',
  /* #swagger.tags = ['Auth']
     #swagger.summary = 'Iniciar sesión en el sistema'
  */
  loginUser,
)

authRouter.post(
  '/renew',
  /* #swagger.tags = ['Auth']
     #swagger.summary = 'Renovar token de autenticación'
  */
  validateJWT,
  renewJWT,
)

export default authRouter
