// Tipe data utama

export interface User {
  id: string
  name: string
  email: string
  role: 'teacher' | 'admin'
  createdAt?: string
}

export interface Class {
  id: string
  name: string
  studentCount: number
  createdAt?: string
}

export interface Subject {
  id: string
  name: string
}

export interface Journal {
  id: string
  journalDate: string
  lessonPeriod: string
  class: Class
  classId: string
  subject: Subject
  subjectId: string
  material: string
  learningActivities: string
  attendancePresent: number
  attendanceSick: number
  attendancePermitted: number
  attendanceAbsent: number
  reflectionNotes?: string | null
  teacher: { id: string; name: string }
  teacherId: string
  createdAt: string
  updatedAt: string
}

export interface JournalFormData {
  journalDate: string
  lessonPeriod: string
  classId: string
  subjectId: string
  material: string
  learningActivities: string
  attendancePresent: number
  attendanceSick: number
  attendancePermitted: number
  attendanceAbsent: number
  reflectionNotes: string
}

export interface AuthResponse {
  token: string
  user: User
}
