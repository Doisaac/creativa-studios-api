export class PedidoError extends Error {
  public readonly statusCode: number

  constructor(message: string, statusCode = 400) {
    super(message)
    this.name = 'PedidoError'
    this.statusCode = statusCode
  }
}
