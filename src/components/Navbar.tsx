import { NavLink } from 'react-router-dom'
import './Navbar.css'

export const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="nav-content">
        <NavLink to="/dashboard" className="logo">
          <span className="logo-icon">🚗</span>
          <span className="logo-text">AutoAlDia</span>
        </NavLink>
        <div className="nav-links">
          <NavLink to="/dashboard" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            Dashboard
          </NavLink>
          <NavLink to="/vehiculos" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            Vehículos
          </NavLink>
          <NavLink to="/mantenimientos" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            Mantenimientos
          </NavLink>
          <NavLink to="/estadisticas" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            Estadísticas
          </NavLink>
        </div>

        {/* Mobile menu button */}
        <button className="mobile-menu-btn" id="mobile-menu-toggle" aria-label="Abrir menú">
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </nav>
  )
}
