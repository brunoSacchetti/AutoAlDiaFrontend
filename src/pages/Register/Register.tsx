import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { authService } from '../../services/authService'
import '../Login/Login.css' // We reuse the shared auth styles

export const Register = () => {
  const navigate = useNavigate()
  const { login } = useAuth()

  const [nombre, setNombre] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')

    // Basic validation
    if (!nombre || !email || !password || !confirmPassword) {
      setError('Por favor completá todos los campos')
      return
    }

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden')
      return
    }

    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres')
      return
    }

    setLoading(true)
    try {
      // 1. Register the user via API
      const newUser = await authService.register({
        nombre,
        email,
        password,
      })

      // 2. Automatically log them in with the returned user data
      login(newUser)

      // 3. Redirect to dashboard
      navigate('/dashboard')
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('Error al registrar usuario. Intentá de nuevo.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-container animate-fade-in">
        {/* Left: Branding */}
        <div className="auth-branding">
          <div className="auth-branding__content">
            <span className="auth-branding__icon">🚀</span>
            <h1 className="auth-branding__title">Crea tu cuenta</h1>
            <p className="auth-branding__subtitle">
              Unite a AutoAlDia y mantené tus vehículos siempre impecables
            </p>
            <div className="auth-branding__features">
              <div className="auth-branding__feature">
                <span>📱</span>
                <span>Acceso desde cualquier dispositivo</span>
              </div>
              <div className="auth-branding__feature">
                <span>🔧</span>
                <span>Historial de servicios</span>
              </div>
              <div className="auth-branding__feature">
                <span>📄</span>
                <span>Gestión de documentos (VTV, Seguro)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Form */}
        <div className="auth-form-section">
          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="auth-form__header">
              <h2 className="auth-form__title">Registro</h2>
              <p className="auth-form__subtitle">
                Ingresá tus datos para comenzar
              </p>
            </div>

            {error && (
              <div className="auth-error animate-fade-in">
                <span>⚠️</span>
                <span>{error}</span>
              </div>
            )}

            <div className="form-group">
              <label className="form-label" htmlFor="register-nombre">Nombre completo</label>
              <input
                id="register-nombre"
                className="form-input"
                type="text"
                placeholder="Juan Pérez"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                autoComplete="name"
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="register-email">Email</label>
              <input
                id="register-email"
                className="form-input"
                type="email"
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="register-password">Contraseña</label>
              <input
                id="register-password"
                className="form-input"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="register-confirm">Confirmar Contraseña</label>
              <input
                id="register-confirm"
                className="form-input"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                autoComplete="new-password"
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-lg auth-submit"
              disabled={loading}
            >
              {loading ? 'Creando cuenta...' : 'Registrarme'}
            </button>

            <p className="auth-switch">
              ¿Ya tenés cuenta?{' '}
              <Link to="/login" className="auth-switch__link">Iniciá sesión</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}
