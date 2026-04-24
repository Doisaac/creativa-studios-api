import { Router, type Router as RouterType } from 'express'

import {
  loginUser,
  registerUser,
  renewJWT,
} from '../controllers/auth.controller.js'
import { validateJWT } from '../middlewares/validate-jwt.middleware.js'

const authRouter: RouterType = Router()

authRouter.post('/register', registerUser)
authRouter.post('/login', loginUser)
authRouter.post('/renew', validateJWT, renewJWT)

export default authRouter
