import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Navbar } from '../../components/Navbar'
import { vehiculoService } from '../../services/vehiculoService'
import { useAuth } from '../../context/AuthContext'
import type { Vehiculo } from '../../types'
import './VehiculosList.css'

export const VehiculosList = () => {
  const { user } = useAuth()
  const [vehiculos, setVehiculos] = useState<Vehiculo[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchVehiculos = async () => {
      if (!user) return
      try {
        setLoading(true)
        const data = await vehiculoService.getByUsuarioId(user.id)
        setVehiculos(data)
      } catch (error) {
        console.error('Error fetching vehiculos:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchVehiculos()
  }, [user])

  if (loading) {
    return (
      <div className="app-layout">
        <Navbar />
        <main className="page" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
          <p>Cargando vehículos...</p>
        </main>
      </div>
    )
  }

  return (
    <div className="app-layout">
      <Navbar />
      <main className="page">
        <div className="container">
          <div className="page-header animate-fade-in">
            <div className="page-header__actions">
              <h1 className="page-title">Mis Vehículos</h1>
              <Link to="/vehiculos/nuevo" className="btn btn-primary">
                + Nuevo Vehículo
              </Link>
            </div>
            <p className="page-subtitle">
              Administrá todos tus vehículos registrados en AutoAlDia.
            </p>
          </div>

          <div className="vehiculos-grid animate-fade-in" style={{ animationDelay: '0.1s' }}>
            {vehiculos.length === 0 ? (
              <div className="empty-state card">
                <div className="empty-state__icon">🚗</div>
                <h3>No tenés vehículos</h3>
                <p>Agregá tu primer vehículo para empezar a gestionarlo.</p>
                <Link to="/vehiculos/nuevo" className="btn btn-primary">
                  Registrar mi primer vehículo
                </Link>
              </div>
            ) : (
              vehiculos.map(vehiculo => (
                <div key={vehiculo.id} className="card vehiculo-list-card">
                  <div className="vehiculo-list-card__header">
                    <div className="vehiculo-list-card__avatar">
                      {vehiculo.marca.charAt(0)}{vehiculo.modelo.charAt(0)}
                    </div>
                    <div className="vehiculo-list-card__title">
                      <h3>{vehiculo.marca} {vehiculo.modelo}</h3>
                      <span className="badge badge--primary">{vehiculo.anio}</span>
                    </div>
                  </div>
                  
                  <div className="vehiculo-list-card__body">
                    <div className="vehiculo-list-card__detail">
                      <span className="label">Patente</span>
                      <span className="value">{vehiculo.patente || 'N/A'}</span>
                    </div>
                    <div className="vehiculo-list-card__detail">
                      <span className="label">Kilometraje</span>
                      <span className="value">{vehiculo.km_actual.toLocaleString('es-AR')} km</span>
                    </div>
                  </div>

                  <div className="vehiculo-list-card__actions">
                    <Link to={`/vehiculos/${vehiculo.id}`} className="btn btn-outline btn-sm">
                      Ver detalle
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
