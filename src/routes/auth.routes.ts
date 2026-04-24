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
  /* #swagger.tags = ['Auth']*/
  registerUser,
)

authRouter.post(
  '/login',
  /* #swagger.tags = ['Auth']*/
  loginUser,
)

authRouter.post(
  '/renew',
  /* #swagger.tags = ['Auth']*/
  validateJWT,
  renewJWT,
)

export default authRouter
