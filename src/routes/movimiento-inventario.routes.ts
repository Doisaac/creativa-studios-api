import { Router, type Router as RouterType } from 'express'

import {
  createMovimientoInventario,
  getMovimientoInventarioById,
  getMovimientosByInventario,
  listMovimientoInventario,
} from '../controllers/movimiento-inventario.controller.js'
import { validateJWT } from '../middlewares/validate-jwt.middleware.js'

const movimientoInventarioRouter: RouterType = Router()

movimientoInventarioRouter.post(
  '/',
  /* #swagger.tags = ['Movimiento Inventario']
     #swagger.summary = 'Crear movimiento de inventario'
     #swagger.parameters['body'] = {
       in: 'body',
       required: true,
       schema: {
         tipo: 'entrada | salida | ajuste',
         cantidad: 10,
         id_inventario: 1
       }
     }
  */

  validateJWT,
  createMovimientoInventario,
)

movimientoInventarioRouter.get(
  '/',
  /* #swagger.tags = ['Movimiento Inventario']
     #swagger.summary = 'Listar movimientos de inventario'
     #swagger.parameters['page'] = {
       in: 'query',
       type: 'integer',
       required: false,
       example: 1
     }
     #swagger.parameters['limit'] = {
       in: 'query',
       type: 'integer',
       required: false,
       example: 10
     }
     #swagger.parameters['tipo'] = {
       in: 'query',
       type: 'string',
       required: false,
       example: 'entrada'
     }
     #swagger.parameters['id_inventario'] = {
       in: 'query',
       type: 'integer',
       required: false,
       example: 1
     }
  */

  validateJWT,
  listMovimientoInventario,
)

movimientoInventarioRouter.get(
  '/inventario/:idInventario',
  /* #swagger.tags = ['Movimiento Inventario']
     #swagger.summary = 'Obtener movimientos por inventario'
  */

  validateJWT,
  getMovimientosByInventario,
)

movimientoInventarioRouter.get(
  '/:id',
  /* #swagger.tags = ['Movimiento Inventario']
     #swagger.summary = 'Obtener movimiento de inventario por id'
  */

  validateJWT,
  getMovimientoInventarioById,
)

export default movimientoInventarioRouter
