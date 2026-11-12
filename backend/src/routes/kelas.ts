import { Router, Request, Response } from 'express'
import { z } from 'zod'
import { prisma } from '../lib/prisma'
import { requireAuth, requireAdmin, AuthRequest } from '../middleware/auth'

const router = Router()

const classSchema = z.object({
  name: z.string().min(1, 'Nama kelas wajib diisi'),
  studentCount: z.number().int().min(0, 'Jumlah siswa tidak boleh negatif'),
})

// GET /api/kelas - Semua pengguna terautentikasi bisa akses
router.get('/', requireAuth, async (_req: Request, res: Response) => {
  const classes = await prisma.class.findMany({ orderBy: { name: 'asc' } })
  res.json(classes)
})

// POST /api/kelas - Hanya admin
router.post('/', requireAdmin, async (req: AuthRequest, res: Response) => {
  const parsed = classSchema.safeParse(req.body)
  if (!parsed.success) { res.status(400).json({ error: parsed.error.flatten() }); return }
  const cls = await prisma.class.create({ data: parsed.data })
  res.status(201).json(cls)
})

// PUT /api/kelas/:id - Hanya admin
router.put('/:id', requireAdmin, async (req: AuthRequest, res: Response) => {
  const id = String(req.params.id)
  const parsed = classSchema.safeParse(req.body)
  if (!parsed.success) { res.status(400).json({ error: parsed.error.flatten() }); return }
  const cls = await prisma.class.update({ where: { id }, data: parsed.data })
  res.json(cls)
})

// DELETE /api/kelas/:id - Hanya admin
router.delete('/:id', requireAdmin, async (req: AuthRequest, res: Response) => {
  const id = String(req.params.id)
  await prisma.class.delete({ where: { id } })
  res.json({ message: 'Kelas berhasil dihapus.' })
})

export default router
