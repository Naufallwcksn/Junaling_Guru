import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ProtectedRoute, AdminRoute } from './components/ProtectedRoute'
import Layout from './components/Layout'
import LoginPage from './pages/LoginPage'
import BuatJurnalPage from './pages/BuatJurnalPage'
import RiwayatPage from './pages/RiwayatPage'
import DetailJurnalPage from './pages/DetailJurnalPage'
import EditJurnalPage from './pages/EditJurnalPage'
import PengaturanPage from './pages/PengaturanPage'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Halaman publik */}
          <Route path="/login" element={<LoginPage />} />

          {/* Halaman yang butuh login */}
          <Route element={<ProtectedRoute />}>
            <Route element={<Layout />}>
              <Route index element={<Navigate to="/jurnal/baru" replace />} />
              <Route path="/jurnal/baru" element={<BuatJurnalPage />} />
              <Route path="/jurnal/:id" element={<DetailJurnalPage />} />
              <Route path="/jurnal/:id/edit" element={<EditJurnalPage />} />
              <Route path="/riwayat" element={<RiwayatPage />} />

              {/* Halaman khusus admin */}
              <Route element={<AdminRoute />}>
                <Route path="/pengaturan" element={<PengaturanPage />} />
              </Route>
            </Route>
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}
