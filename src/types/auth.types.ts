import type { Request } from 'express'

export const ROLES_PERMITIDOS = [
  'ADMIN',
  'RECEPCION',
  'PRODUCCION',
  'INSTALADOR',
] as const

export type RolPermitido = (typeof ROLES_PERMITIDOS)[number]

export interface TokenInfo {
  id: number
  name: string
  role: string
}
export interface AuthRequest extends Request {
  user?: TokenInfo
}
