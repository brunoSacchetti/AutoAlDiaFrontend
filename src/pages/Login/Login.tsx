import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { authService } from '../../services/authService'
import './Login.css'

export const Login = () => {
  const navigate = useNavigate()
  const { login } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')

    if (!email || !password) {
      setError('Completá todos los campos')
      return
    }

    setLoading(true)
    try {
      const user = await authService.login(email, password)
      login(user)
      navigate('/dashboard')
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('Error al iniciar sesión. Intentá de nuevo.')
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
            <span className="auth-branding__icon">🚗</span>
            <h1 className="auth-branding__title">AutoAlDia</h1>
            <p className="auth-branding__subtitle">
              Tu compañero inteligente para el mantenimiento vehicular
            </p>
            <div className="auth-branding__features">
              <div className="auth-branding__feature">
                <span>📊</span>
                <span>Control total de tus vehículos</span>
              </div>
              <div className="auth-branding__feature">
                <span>🔔</span>
                <span>Recordatorios automáticos</span>
              </div>
              <div className="auth-branding__feature">
                <span>💰</span>
                <span>Seguimiento de gastos</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Form */}
        <div className="auth-form-section">
          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="auth-form__header">
              <h2 className="auth-form__title">Iniciar Sesión</h2>
              <p className="auth-form__subtitle">
                Ingresá tus datos para acceder a tu cuenta
              </p>
            </div>

            {error && (
              <div className="auth-error">
                <span>⚠️</span>
                <span>{error}</span>
              </div>
            )}

            <div className="form-group">
              <label className="form-label" htmlFor="login-email">Email</label>
              <input
                id="login-email"
                className="form-input"
                type="email"
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="login-password">Contraseña</label>
              <input
                id="login-password"
                className="form-input"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-lg auth-submit"
              disabled={loading}
            >
              {loading ? 'Ingresando...' : 'Iniciar Sesión'}
            </button>

            <p className="auth-switch">
              ¿No tenés cuenta?{' '}
              <Link to="/register" className="auth-switch__link">Registrate</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}
