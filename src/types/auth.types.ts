import type { Request } from 'express'

export interface TokenInfo {
  id: number
  name: string
  role: string
}
export interface AuthRequest extends Request {
  user?: TokenInfo
}
