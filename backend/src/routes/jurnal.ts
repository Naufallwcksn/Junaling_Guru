import { Router, Response } from 'express'
import { z } from 'zod'
import { prisma } from '../lib/prisma'
import { requireAuth, AuthRequest } from '../middleware/auth'

const router = Router()

const journalSchema = z.object({
  journalDate: z.string().min(1, 'Tanggal wajib diisi'),
  lessonPeriod: z.string().min(1, 'Jam pelajaran wajib diisi'),
  classId: z.string().min(1, 'Kelas wajib dipilih'),
  subjectId: z.string().min(1, 'Mata pelajaran wajib dipilih'),
  material: z.string().min(1, 'Materi wajib diisi'),
  learningActivities: z.string().min(1, 'Kegiatan pembelajaran wajib diisi'),
  attendancePresent: z.number().int().min(0, 'Jumlah hadir tidak boleh negatif'),
  attendanceSick: z.number().int().min(0, 'Jumlah sakit tidak boleh negatif'),
  attendancePermitted: z.number().int().min(0, 'Jumlah izin tidak boleh negatif'),
  attendanceAbsent: z.number().int().min(0, 'Jumlah alpa tidak boleh negatif'),
  reflectionNotes: z.string().optional().nullable(),
})

const include = {
  teacher: { select: { id: true, name: true } },
  class: true,
  subject: true,
}

// GET /api/jurnal - Ambil semua jurnal (dengan filter)
router.get('/', requireAuth, async (req: AuthRequest, res: Response) => {
  const { dateFrom, dateTo, classId, subjectId } = req.query
  const where: any = {}

  // Guru hanya lihat jurnal sendiri, admin lihat semua
  if (req.user!.role !== 'admin') {
    where.teacherId = req.user!.id
  }

  if (dateFrom || dateTo) {
    where.journalDate = {}
    if (dateFrom) where.journalDate.gte = new Date(dateFrom as string)
    if (dateTo) where.journalDate.lte = new Date(`${dateTo}T23:59:59`)
  }
  if (classId) where.classId = String(classId)
  if (subjectId) where.subjectId = String(subjectId)

  const journals = await prisma.journal.findMany({
    where,
    include,
    orderBy: { journalDate: 'desc' },
  })

  res.json(journals)
})

// GET /api/jurnal/:id - Detail satu jurnal
router.get('/:id', requireAuth, async (req: AuthRequest, res: Response) => {
  const id = String(req.params.id)
  const journal = await prisma.journal.findUnique({
    where: { id },
    include,
  })

  if (!journal) { res.status(404).json({ error: 'Jurnal tidak ditemukan.' }); return }
  if (req.user!.role !== 'admin' && journal.teacherId !== req.user!.id) {
    res.status(403).json({ error: 'Anda tidak memiliki akses ke jurnal ini.' }); return
  }

  res.json(journal)
})

// POST /api/jurnal - Buat jurnal baru
router.post('/', requireAuth, async (req: AuthRequest, res: Response) => {
  const parsed = journalSchema.safeParse(req.body)
  if (!parsed.success) {
    res.status(400).json({ error: 'Data tidak valid', details: parsed.error.flatten() }); return
  }

  const { journalDate, ...rest } = parsed.data
  const journal = await prisma.journal.create({
    data: {
      ...rest,
      journalDate: new Date(journalDate),
      teacherId: req.user!.id,
    },
    include,
  })

  res.status(201).json(journal)
})

// PUT /api/jurnal/:id - Update jurnal
router.put('/:id', requireAuth, async (req: AuthRequest, res: Response) => {
  const id = String(req.params.id)
  const existing = await prisma.journal.findUnique({ where: { id } })
  if (!existing) { res.status(404).json({ error: 'Jurnal tidak ditemukan.' }); return }
  if (req.user!.role !== 'admin' && existing.teacherId !== req.user!.id) {
    res.status(403).json({ error: 'Akses ditolak.' }); return
  }

  const parsed = journalSchema.safeParse(req.body)
  if (!parsed.success) {
    res.status(400).json({ error: 'Data tidak valid', details: parsed.error.flatten() }); return
  }

  const { journalDate, ...rest } = parsed.data
  const journal = await prisma.journal.update({
    where: { id },
    data: { ...rest, journalDate: new Date(journalDate) },
    include,
  })

  res.json(journal)
})

// DELETE /api/jurnal/:id - Hapus jurnal
router.delete('/:id', requireAuth, async (req: AuthRequest, res: Response) => {
  const id = String(req.params.id)
  const existing = await prisma.journal.findUnique({ where: { id } })
  if (!existing) { res.status(404).json({ error: 'Jurnal tidak ditemukan.' }); return }
  if (req.user!.role !== 'admin' && existing.teacherId !== req.user!.id) {
    res.status(403).json({ error: 'Akses ditolak.' }); return
  }

  await prisma.journal.delete({ where: { id } })
  res.json({ message: 'Jurnal berhasil dihapus.' })
})

export default router
