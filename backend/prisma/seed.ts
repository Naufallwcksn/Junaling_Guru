import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Memulai proses seed...')

  // Buat akun Admin
  const adminPw = await bcrypt.hash('admin123', 10)
  await prisma.user.upsert({
    where: { email: 'admin@sekolah.sch.id' },
    update: {},
    create: { name: 'Administrator', email: 'admin@sekolah.sch.id', password: adminPw, role: 'admin' },
  })
  console.log('✅ Admin dibuat')

  // Buat akun Guru
  const guruPw = await bcrypt.hash('guru123', 10)
  const guruList = [
    { name: 'Budi Santoso, S.Pd', email: 'budi@sekolah.sch.id' },
    { name: 'Sari Dewi, S.Pd', email: 'sari@sekolah.sch.id' },
    { name: 'Ahmad Fauzi, M.Pd', email: 'ahmad@sekolah.sch.id' },
  ]
  for (const guru of guruList) {
    await prisma.user.upsert({
      where: { email: guru.email },
      update: {},
      create: { ...guru, password: guruPw, role: 'teacher' },
    })
  }
  console.log('✅ Akun guru dibuat')

  // Buat daftar kelas
  const kelasList = [
    { name: 'VII A', studentCount: 32 },
    { name: 'VII B', studentCount: 30 },
    { name: 'VII C', studentCount: 31 },
    { name: 'VIII A', studentCount: 33 },
    { name: 'VIII B', studentCount: 31 },
    { name: 'VIII C', studentCount: 32 },
    { name: 'IX A', studentCount: 34 },
    { name: 'IX B', studentCount: 32 },
    { name: 'IX C', studentCount: 33 },
  ]
  for (const kelas of kelasList) {
    await prisma.class.upsert({
      where: { name: kelas.name },
      update: {},
      create: kelas,
    })
  }
  console.log('✅ Daftar kelas dibuat')

  // Buat daftar mata pelajaran
  const mapelList = [
    'Matematika',
    'Bahasa Indonesia',
    'Bahasa Inggris',
    'IPA (Ilmu Pengetahuan Alam)',
    'IPS (Ilmu Pengetahuan Sosial)',
    'PKn (Pendidikan Kewarganegaraan)',
    'Pendidikan Agama Islam',
    'Seni Budaya',
    'Pendidikan Jasmani dan Kesehatan',
    'Prakarya dan Kewirausahaan',
    'Bimbingan dan Konseling',
    'Teknologi Informasi dan Komunikasi',
  ]
  for (const name of mapelList) {
    await prisma.subject.upsert({
      where: { name },
      update: {},
      create: { name },
    })
  }
  console.log('✅ Daftar mata pelajaran dibuat')

  console.log('\n🎉 Seed selesai!')
  console.log('Akun admin    : admin@sekolah.sch.id / admin123')
  console.log('Akun guru     : budi@sekolah.sch.id  / guru123')
}

main()
  .catch((e) => { console.error('❌ Seed gagal:', e); process.exit(1) })
  .finally(() => prisma.$disconnect())
