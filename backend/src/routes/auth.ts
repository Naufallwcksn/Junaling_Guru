import { Router, Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { z } from 'zod'
import { prisma } from '../lib/prisma'

const router = Router()

const loginSchema = z.object({
  email: z.string().email('Format email tidak valid'),
  password: z.string().min(1, 'Kata sandi wajib diisi'),
})

// POST /api/auth/login
router.post('/login', async (req: Request, res: Response) => {
  const parsed = loginSchema.safeParse(req.body)
  if (!parsed.success) {
    res.status(400).json({ error: 'Data tidak valid', details: parsed.error.flatten() })
    return
  }

  const { email, password } = parsed.data

  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) {
    res.status(401).json({ error: 'Email atau kata sandi salah.' })
    return
  }

  const valid = await bcrypt.compare(password, user.password)
  if (!valid) {
    res.status(401).json({ error: 'Email atau kata sandi salah.' })
    return
  }

  const token = jwt.sign(
    { id: user.id, name: user.name, email: user.email, role: user.role },
    process.env.JWT_SECRET || 'secret',
    { expiresIn: '7d' }
  )

  res.json({
    token,
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
  })
})

// GET /api/auth/me
router.get('/me', async (req: Request, res: Response) => {
  const authHeader = req.headers.authorization
  if (!authHeader?.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Tidak terautentikasi.' })
    return
  }
  try {
    const token = authHeader.split(' ')[1]
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as any
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, name: true, email: true, role: true, createdAt: true },
    })
    if (!user) { res.status(404).json({ error: 'Pengguna tidak ditemukan.' }); return }
    res.json(user)
  } catch {
    res.status(401).json({ error: 'Token tidak valid.' })
  }
})

export default router
