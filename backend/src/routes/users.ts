import { Router, Response } from 'express'
import bcrypt from 'bcryptjs'
import { z } from 'zod'
import { prisma } from '../lib/prisma'
import { requireAdmin, AuthRequest } from '../middleware/auth'

const router = Router()

const userSchema = z.object({
  name: z.string().min(1, 'Nama wajib diisi'),
  email: z.string().email('Format email tidak valid'),
  password: z.string().min(6, 'Kata sandi minimal 6 karakter'),
  role: z.enum(['teacher', 'admin']),
})

// GET /api/users - Hanya admin
router.get('/', requireAdmin, async (_req: AuthRequest, res: Response) => {
  const users = await prisma.user.findMany({
    select: { id: true, name: true, email: true, role: true, createdAt: true },
    orderBy: { name: 'asc' },
  })
  res.json(users)
})

// POST /api/users - Hanya admin
router.post('/', requireAdmin, async (req: AuthRequest, res: Response) => {
  const parsed = userSchema.safeParse(req.body)
  if (!parsed.success) { res.status(400).json({ error: parsed.error.flatten() }); return }

  const existing = await prisma.user.findUnique({ where: { email: parsed.data.email } })
  if (existing) { res.status(409).json({ error: 'Email sudah digunakan oleh pengguna lain.' }); return }

  const hashedPw = await bcrypt.hash(parsed.data.password, 10)
  const user = await prisma.user.create({
    data: { ...parsed.data, password: hashedPw },
    select: { id: true, name: true, email: true, role: true, createdAt: true },
  })
  res.status(201).json(user)
})

// DELETE /api/users/:id - Hanya admin
router.delete('/:id', requireAdmin, async (req: AuthRequest, res: Response) => {
  const id = String(req.params.id)
  if (id === req.user!.id) {
    res.status(400).json({ error: 'Tidak dapat menghapus akun Anda sendiri.' }); return
  }
  await prisma.user.delete({ where: { id } })
  res.json({ message: 'Pengguna berhasil dihapus.' })
})

export default router
