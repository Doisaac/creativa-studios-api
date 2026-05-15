import { Router, type Router as RouterType } from 'express'

import {
  asignarInstalador,
  getInstalacionById,
  listInstalaciones,
  listMisInstalaciones,
  reprogramarInstalacion,
  updateEstadoInstalacion,
} from '../controllers/instalacion.controller.js'
import { validateJWT } from '../middlewares/validate-jwt.middleware.js'
import { validateRole } from '../middlewares/validate-role.middleware.js'

const instalacionRouter: RouterType = Router()

instalacionRouter.get(
  '/',
  /* #swagger.tags = ['Instalación']
     #swagger.summary = 'Listar instalaciones'
     #swagger.description = 'Obtiene el listado general de instalaciones registradas. Disponible para ADMIN y RECEPCION.'
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
     #swagger.parameters['estado'] = {
       in: 'query',
       description: 'Filtrar instalaciones por estado',
       type: 'string',
       required: false,
       enum: ['pendiente', 'asignada', 'en_proceso', 'completada', 'no_realizada', 'cancelada'],
       example: 'asignada'
     }
     #swagger.parameters['idInstalador'] = {
       in: 'query',
       description: 'Filtrar instalaciones por instalador asignado',
       type: 'integer',
       required: false,
       example: 4
     }
     #swagger.parameters['idPedido'] = {
       in: 'query',
       description: 'Filtrar instalaciones por pedido asociado',
       type: 'integer',
       required: false,
       example: 15
     }
  */

  validateJWT,
  validateRole('ADMIN', 'RECEPCION'),
  listInstalaciones,
)

instalacionRouter.get(
  '/mis-instalaciones',
  /* #swagger.tags = ['Instalación']
     #swagger.summary = 'Listar mis instalaciones'
     #swagger.description = 'Obtiene únicamente las instalaciones asignadas al usuario autenticado con rol INSTALADOR.'
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
     #swagger.parameters['estado'] = {
       in: 'query',
       description: 'Filtrar mis instalaciones por estado',
       type: 'string',
       required: false,
       enum: ['pendiente', 'asignada', 'en_proceso', 'completada', 'no_realizada', 'cancelada'],
       example: 'asignada'
     }
  */

  validateJWT,
  validateRole('INSTALADOR'),
  listMisInstalaciones,
)

instalacionRouter.get(
  '/:id',
  /* #swagger.tags = ['Instalación']
     #swagger.summary = 'Obtener instalación por id'
     #swagger.description = 'Obtiene el detalle de una instalación específica. El instalador solo puede consultar instalaciones asignadas a él.'
     #swagger.parameters['id'] = {
       in: 'path',
       description: 'ID de la instalación',
       type: 'integer',
       required: true,
       example: 1
     }
  */

  validateJWT,
  validateRole('ADMIN', 'RECEPCION', 'INSTALADOR'),
  getInstalacionById,
)

instalacionRouter.patch(
  '/:id/asignar',
  /* #swagger.tags = ['Instalación']
     #swagger.summary = 'Asignar instalador'
     #swagger.description = 'Asigna o reasigna un instalador a una instalación pendiente o asignada.'
     #swagger.parameters['id'] = {
       in: 'path',
       description: 'ID de la instalación',
       type: 'integer',
       required: true,
       example: 1
     }
     #swagger.parameters['body'] = {
       in: 'body',
       required: true,
       schema: {
         id_instalador: 4
       }
     }
  */

  validateJWT,
  validateRole('ADMIN', 'RECEPCION'),
  asignarInstalador,
)

instalacionRouter.patch(
  '/:id/estado',
  /* #swagger.tags = ['Instalación']
     #swagger.summary = 'Actualizar estado de instalación'
     #swagger.description = 'Actualiza el estado operativo de una instalación. Al marcar una instalación como completada, el pedido asociado pasa automáticamente a entregado.'
     #swagger.parameters['id'] = {
       in: 'path',
       description: 'ID de la instalación',
       type: 'integer',
       required: true,
       example: 1
     }
     #swagger.parameters['body'] = {
       in: 'body',
       required: true,
       schema: {
         estado: 'en_proceso',
         observaciones: 'Instalación iniciada por el equipo asignado'
       }
     }
  */

  validateJWT,
  validateRole('ADMIN', 'RECEPCION', 'INSTALADOR'),
  updateEstadoInstalacion,
)

instalacionRouter.patch(
  '/:id/reprogramar',
  /* #swagger.tags = ['Instalación']
     #swagger.summary = 'Reprogramar instalación'
     #swagger.description = 'Actualiza la fecha programada de una instalación y registra observaciones opcionales sobre la reprogramación.'
     #swagger.parameters['id'] = {
       in: 'path',
       description: 'ID de la instalación',
       type: 'integer',
       required: true,
       example: 1
     }
     #swagger.parameters['body'] = {
       in: 'body',
       required: true,
       schema: {
         fecha_programada: '2026-05-23',
         observaciones: 'Cliente solicitó cambio de fecha'
       }
     }
  */

  validateJWT,
  validateRole('ADMIN', 'RECEPCION'),
  reprogramarInstalacion,
)

export default instalacionRouter
