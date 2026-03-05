import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export const ProtectedRoute = () => {
  const { isAuthenticated, isLoading } = useAuth()

  // If still checking localStorage, we show a blank screen or a spinner
  if (isLoading) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p>Cargando...</p>
      </div>
    )
  }

  // If the user is authenticated, render the child routes (via Outlet)
  // Otherwise, redirect to login
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />
}
