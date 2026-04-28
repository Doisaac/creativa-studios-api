export class MovimientoInventarioError extends Error {
  public readonly statusCode: number

  constructor(message: string, statusCode = 400) {
    super(message)
    this.name = 'MovimientoInventarioError'
    this.statusCode = statusCode
  }
}
