import { Router, type Router as RouterType } from 'express'

import {
  createInventario,
  deleteInventario,
  getInventarioById,
  getLowStockInventario,
  listInventario,
  updateInventario,
} from '../controllers/inventario.controller.js'
import { validateJWT } from '../middlewares/validate-jwt.middleware.js'
import { validateRole } from '../middlewares/validate-role.middleware.js'

const inventarioRouter: RouterType = Router()

inventarioRouter.post(
  '/',
  /* #swagger.tags = ['Inventario']
     #swagger.summary = 'Crear insumo/material de inventario'
     #swagger.requestBody = {
       required: true,
       content: {
         "application/json": {
           example: {
             "nombre": "Vinil mate blanco",
             "stock_actual": 25,
             "stock_minimo": 10,
             "unidad_de_medida": "metros"
           }
         }
       }
     }
  */

  validateJWT,
  validateRole('ADMIN'),
  createInventario,
)

inventarioRouter.get(
  '/',
  /* #swagger.tags = ['Inventario']
     #swagger.summary = 'Listar inventario'
  */

  validateJWT,
  listInventario,
)

inventarioRouter.get(
  '/low-stock',
  /* #swagger.tags = ['Inventario']
     #swagger.summary = 'Obtener inventario con bajo stock'
  */

  validateJWT,
  getLowStockInventario,
)

inventarioRouter.get(
  '/:id',
  /* #swagger.tags = ['Inventario']
     #swagger.summary = 'Obtener inventario por id'
  */

  validateJWT,
  getInventarioById,
)

inventarioRouter.patch(
  '/:id',
  /* #swagger.tags = ['Inventario']
     #swagger.summary = 'Actualizar inventario sin modificar stock_actual'
     #swagger.requestBody = {
       required: true,
       content: {
         "application/json": {
           example: {
             "nombre": "Vinil mate premium",
             "stock_minimo": 12,
             "unidad_de_medida": "metros"
           }
         }
       }
     }
  */

  validateJWT,
  validateRole('ADMIN'),
  updateInventario,
)

inventarioRouter.delete(
  '/:id',
  /* #swagger.tags = ['Inventario']
     #swagger.summary = 'Eliminar inventario si no tiene referencias'
  */

  validateJWT,
  validateRole('ADMIN'),
  deleteInventario,
)

export default inventarioRouter
