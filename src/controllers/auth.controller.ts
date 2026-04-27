import bcrypt from 'bcrypt'
import type { Request, Response } from 'express'

import { generateJWT } from '../helpers/jwt.helper.js'
import { pool } from '../db.js'
import type { AuthRequest } from '../types/auth.types.js'

export const registerUser = async (req: Request, res: Response) => {
  const client = await pool.connect()
  try {
    const { nombre, email, contrasena, rol = 'RECEPCION' } = req.body || {}

    // Validar campos
    if (!nombre || !email || !contrasena) {
      return res.status(400).json({
        success: false,
        message: 'Todos los campos son obligatorios',
      })
    }

    await client.query('BEGIN')

    // Verificar si el usuario ya existe
    const userExists = await client.query(
      'SELECT id FROM usuario WHERE email = $1',
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
    const hashedPassword = bcrypt.hashSync(contrasena, salt)

    // Obtener role_id
    const roleResult = await client.query(
      'SELECT id, nombre FROM rol WHERE nombre = $1',
      [rol],
    )

    if (roleResult.rows.length === 0) {
      await client.query('ROLLBACK')
      return res.status(400).json({
        success: false,
        message: 'Rol no válido',
      })
    }

    const roleData = roleResult.rows[0]

    // Crear usuario con rol asociado
    const userResult = await client.query(
      `INSERT INTO usuario (nombre, email, contrasena, id_rol)
       VALUES ($1, $2, $3, $4)
       RETURNING id, nombre`,
      [nombre, email, hashedPassword, roleData.id],
    )

    const user = userResult.rows[0]

    await client.query('COMMIT')

    // Generar JWT con rol
    const token = await generateJWT(user.id, user.nombre, roleData.nombre)

    return res.status(201).json({
      success: true,
      data: {
        user: {
          id: user.id,
          nombre: user.nombre,
          rol: roleData.nombre,
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
    const { email, contrasena } = req.body

    if (!email || !contrasena) {
      return res.status(400).json({
        success: false,
        message: 'Email y contrasena son obligatorios',
      })
    }
    // Busca el usuario y su rol
    const result = await pool.query(
      `SELECT 
        u.id,
        u.nombre,
        u.email,
        u.contrasena,
        r.nombre AS role
      FROM usuario u
      JOIN rol r ON r.id = u.id_rol
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
    const isValidPassword = bcrypt.compareSync(contrasena, user.contrasena)

    if (!isValidPassword) {
      return res.status(400).json({
        success: false,
        message: 'Credenciales inválidas',
      })
    }

    // Genera JWT con el rol del usuario
    const token = await generateJWT(user.id, user.nombre, user.role)

    return res.status(200).json({
      success: true,
      data: {
        user: {
          id: user.id,
          nombre: user.nombre,
          rol: user.role,
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
