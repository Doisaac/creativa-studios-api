import { Router, type Router as RouterType } from 'express'

import { registerUser } from '../controllers/auth.controller.js'

const authRouter: RouterType = Router()

authRouter.post('/register', registerUser)

export default authRouter
