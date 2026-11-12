import { Router, Request, Response } from 'express'
import { z } from 'zod'
import { prisma } from '../lib/prisma'
import { requireAuth, requireAdmin, AuthRequest } from '../middleware/auth'

const router = Router()

const subjectSchema = z.object({
  name: z.string().min(1, 'Nama mata pelajaran wajib diisi'),
})

// GET /api/mapel
router.get('/', requireAuth, async (_req: Request, res: Response) => {
  const subjects = await prisma.subject.findMany({ orderBy: { name: 'asc' } })
  res.json(subjects)
})

// POST /api/mapel - Hanya admin
router.post('/', requireAdmin, async (req: AuthRequest, res: Response) => {
  const parsed = subjectSchema.safeParse(req.body)
  if (!parsed.success) { res.status(400).json({ error: parsed.error.flatten() }); return }
  const subject = await prisma.subject.create({ data: parsed.data })
  res.status(201).json(subject)
})

// PUT /api/mapel/:id - Hanya admin
router.put('/:id', requireAdmin, async (req: AuthRequest, res: Response) => {
  const id = String(req.params.id)
  const parsed = subjectSchema.safeParse(req.body)
  if (!parsed.success) { res.status(400).json({ error: parsed.error.flatten() }); return }
  const subject = await prisma.subject.update({ where: { id }, data: parsed.data })
  res.json(subject)
})

// DELETE /api/mapel/:id - Hanya admin
router.delete('/:id', requireAdmin, async (req: AuthRequest, res: Response) => {
  const id = String(req.params.id)
  await prisma.subject.delete({ where: { id } })
  res.json({ message: 'Mata pelajaran berhasil dihapus.' })
})

export default router
