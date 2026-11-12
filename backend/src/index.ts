import 'dotenv/config'
import express from 'express'
import cors from 'cors'

import authRoutes from './routes/auth'
import jurnalRoutes from './routes/jurnal'
import kelasRoutes from './routes/kelas'
import mapelRoutes from './routes/mapel'
import usersRoutes from './routes/users'

const app = express()
const PORT = process.env.PORT || 5000

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5173'],
  credentials: true,
}))
app.use(express.json())

// ─── Routes ──────────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes)
app.use('/api/jurnal', jurnalRoutes)
app.use('/api/kelas', kelasRoutes)
app.use('/api/mapel', mapelRoutes)
app.use('/api/users', usersRoutes)

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'OK', message: 'Backend Jurnal Harian Guru berjalan dengan baik.' })
})

// 404 handler
app.use((_req, res) => {
  res.status(404).json({ error: 'Endpoint tidak ditemukan.' })
})

// Error handler
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('❌ Error:', err)
  res.status(500).json({ error: 'Terjadi kesalahan pada server.' })
})

app.listen(PORT, () => {
  console.log(`\n🚀 Backend berjalan di http://localhost:${PORT}`)
  console.log(`📋 Health check: http://localhost:${PORT}/api/health\n`)
})
