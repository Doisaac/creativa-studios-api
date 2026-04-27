export class InventarioError extends Error {
  public readonly statusCode: number

  constructor(message: string, statusCode = 400) {
    super(message)
    this.name = 'InventarioError'
    this.statusCode = statusCode
  }
}
