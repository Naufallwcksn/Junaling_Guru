import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

export interface AuthUser {
  id: string
  name: string
  email: string
  role: string
}

export interface AuthRequest extends Request {
  user?: AuthUser
}

export function requireAuth(req: AuthRequest, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization
  if (!authHeader?.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Token tidak ditemukan. Silakan login terlebih dahulu.' })
    return
  }

  const token = authHeader.split(' ')[1]
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as AuthUser
    req.user = decoded
    next()
  } catch {
    res.status(401).json({ error: 'Token tidak valid atau sudah kadaluarsa. Silakan login kembali.' })
  }
}

export function requireAdmin(req: AuthRequest, res: Response, next: NextFunction): void {
  requireAuth(req, res, () => {
    if (req.user?.role !== 'admin') {
      res.status(403).json({ error: 'Hanya administrator yang dapat mengakses fitur ini.' })
      return
    }
    next()
  })
}
