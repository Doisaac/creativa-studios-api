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
     #swagger.summary = 'Crear insumo/material de inventario (ADMIN)'
     #swagger.parameters['body'] = {
       in: 'body',
       required: true,
       schema: {
         nombre: 'Camisas Talla S blanco 100% algodón',
         stock_actual: 25,
         stock_minimo: 10,
         unidad_de_medida: 'Unidades'
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
     #swagger.parameters['page'] = {
       in: 'query',
       description: 'Número de página a consultar',
       type: 'integer',
       required: false,
       example: 1
     }
     #swagger.parameters['limit'] = {
       in: 'query',
       description: 'Cantidad de registros por página',
       type: 'integer',
       required: false,
       example: 10
     }
     #swagger.parameters['search'] = {
       in: 'query',
       description: 'Texto para buscar por nombre de inventario',
       type: 'string',
       required: false,
       example: 'camisas'
     }
     #swagger.parameters['bajo_stock'] = {
       in: 'query',
       description: 'Filtra inventario con bajo stock; acepta true o false',
       type: 'boolean',
       required: false,
       example: true
     }
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
     #swagger.summary = 'Actualizar inventario sin modificar stock_actual (ADMIN)'
     #swagger.parameters['body'] = {
       in: 'body',
       required: true,
       schema: {
         nombre: 'Camisas Talla S blanco 100% algodón',
         stock_minimo: 12,
         unidad_de_medida: 'Unidades'
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
     #swagger.summary = 'Eliminar inventario si no tiene referencias (ADMIN)'
  */

  validateJWT,
  validateRole('ADMIN'),
  deleteInventario,
)

export default inventarioRouter
