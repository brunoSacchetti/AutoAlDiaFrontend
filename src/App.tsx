import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Dashboard } from './pages/Dashboard/Dashboard'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes (for future auth) */}
        {/* <Route path="/login" element={<Login />} /> */}
        {/* <Route path="/register" element={<Register />} /> */}

        {/* App routes */}
        <Route path="/dashboard" element={<Dashboard />} />

        {/* Default redirect */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
