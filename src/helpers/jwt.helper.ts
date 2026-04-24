import jwt from 'jsonwebtoken'

export const generateJWT = (id: number, name: string, role: string) => {
  const SECRET_WORD = process.env.JWT_SECRET as string

  const payload = { id, name, role }

  return new Promise<string>((resolve, reject) => {
    jwt.sign(payload, SECRET_WORD, { expiresIn: '2h' }, (error, token) => {
      if (error) {
        return reject(error)
      }
      resolve(token as string)
    })
  })
}
