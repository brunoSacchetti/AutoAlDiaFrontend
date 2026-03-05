import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { Login } from './pages/Login/Login'
import { Register } from './pages/Register/Register'
import { Dashboard } from './pages/Dashboard/Dashboard'
import { ProtectedRoute } from './components/ProtectedRoute'
import { VehiculosList } from './pages/Vehiculos/VehiculosList'
import { VehiculoForm } from './pages/Vehiculos/VehiculoForm'
import { VehiculoDetail } from './pages/Vehiculos/VehiculoDetail' 

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* App routes (Protected) */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/vehiculos" element={<VehiculosList />} />
            <Route path="/vehiculos/nuevo" element={<VehiculoForm />} />
            <Route path="/vehiculos/editar/:id" element={<VehiculoForm />} />
            <Route path="/vehiculos/:id" element={<VehiculoDetail />} />
          </Route>

          {/* Default redirect */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
