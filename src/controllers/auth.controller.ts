import bcrypt from 'bcrypt'
import type { Request, Response } from 'express'

import { generateJWT } from '../helpers/jwt.helper.js'
import { pool } from '../db.js'
import type { AuthRequest } from '../types/auth.types.js'

export const registerUser = async (req: Request, res: Response) => {
  const client = await pool.connect()
  console.log(req.body)
  try {
    const { name, email, password, role = 'RECEPCION' } = req.body || {}

    // Validar campos
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Todos los campos son obligatorios',
      })
    }

    await client.query('BEGIN')

    // Verificar si el usuario ya existe
    const userExists = await client.query(
      'SELECT id FROM users WHERE email = $1',
      [email],
    )

    if (userExists.rows.length > 0) {
      await client.query('ROLLBACK')
      return res.status(400).json({
        success: false,
        message: 'El usuario ya existe',
      })
    }

    // Hash password
    const salt = bcrypt.genSaltSync()
    const hashedPassword = bcrypt.hashSync(password, salt)

    // Crear usuario
    const userResult = await client.query(
      `INSERT INTO users (name, email, password)
       VALUES ($1, $2, $3)
       RETURNING id, name`,
      [name, email, hashedPassword],
    )

    const user = userResult.rows[0]

    // Obtener role_id
    const roleResult = await client.query(
      'SELECT id, name FROM roles WHERE name = $1',
      [role],
    )

    if (roleResult.rows.length === 0) {
      await client.query('ROLLBACK')
      return res.status(400).json({
        success: false,
        message: 'Rol no válido',
      })
    }

    const roleData = roleResult.rows[0]

    // Insert en user_roles
    await client.query(
      `INSERT INTO user_roles (user_id, role_id)
       VALUES ($1, $2)`,
      [user.id, roleData.id],
    )

    await client.query('COMMIT')

    // Generar JWT con rol
    const token = await generateJWT(user.id, user.name, roleData.name)

    return res.status(201).json({
      success: true,
      data: {
        user: {
          id: user.id,
          name: user.name,
          role: roleData.name,
        },
        token,
      },
    })
  } catch (error) {
    await client.query('ROLLBACK')

    console.error(error)

    return res.status(500).json({
      success: false,
      message: 'Error en el registro',
    })
  } finally {
    client.release()
  }
}

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email y password son obligatorios',
      })
    }
    // Busca el usuario y su rol
    const result = await pool.query(
      `SELECT 
        u.id,
        u.name,
        u.email,
        u.password,
        r.name AS role
      FROM users u
      JOIN user_roles ur ON ur.user_id = u.id
      JOIN roles r ON r.id = ur.role_id
      WHERE u.email = $1
      LIMIT 1`,
      [email],
    )

    if (result.rows.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Credenciales inválidas',
      })
    }

    const user = result.rows[0]

    // Verificar contraseña
    const isValidPassword = bcrypt.compareSync(password, user.password)

    if (!isValidPassword) {
      return res.status(400).json({
        success: false,
        message: 'Credenciales inválidas',
      })
    }

    // Genera JWT con el rol del usuario
    const token = await generateJWT(user.id, user.name, user.role)

    return res.status(200).json({
      success: true,
      data: {
        user: {
          id: user.id,
          name: user.name,
          role: user.role,
        },
        token,
      },
    })
  } catch (error) {
    console.error(error)

    return res.status(500).json({
      success: false,
      message: 'Error en el login',
    })
  }
}

export const renewJWT = async (req: AuthRequest, res: Response) => {
  const { id, name, role } = req.user!

  const token = await generateJWT(id, name, role)

  return res.status(200).json({
    success: true,
    message: 'Token renovado',
    data: {
      user: {
        id,
        name,
        role,
      },
      token,
    },
  })
}
