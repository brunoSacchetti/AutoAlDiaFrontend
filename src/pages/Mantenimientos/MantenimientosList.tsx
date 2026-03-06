import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Navbar } from '../../components/Navbar'
import { mantenimientoService } from '../../services/mantenimientoService'
import { vehiculoService } from '../../services/vehiculoService'
import { useAuth } from '../../context/AuthContext'
import type { Mantenimiento, Vehiculo } from '../../types'
import { TipoServicioLabels } from '../../types'
import './MantenimientosList.css'

export const MantenimientosList = () => {
  const { user } = useAuth()
  
  const [mantenimientos, setMantenimientos] = useState<Mantenimiento[]>([])
  const [vehiculos, setVehiculos] = useState<Vehiculo[]>([])
  const [loading, setLoading] = useState(true)

  // Filters
  const [selectedVehiculo, setSelectedVehiculo] = useState<string>('')
  const [selectedTipo, setSelectedTipo] = useState<string>('')

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return
      
      try {
        setLoading(true)
        const vehs = await vehiculoService.getByUsuarioId(user.id)
        setVehiculos(vehs)

        let allMants: Mantenimiento[] = []
        
        // Fetch maintenance for each vehicle
        const mantsPromises = vehs.map(async (v) => {
          return await mantenimientoService.getByVehiculoId(v.id)
        })

        const mantsArrays = await Promise.all(mantsPromises)
        mantsArrays.forEach(arr => {
          allMants = [...allMants, ...arr]
        })

        // Sort by date desc (newest first)
        allMants.sort((a, b) => 
          new Date(b.fecha_mantenimiento).getTime() - new Date(a.fecha_mantenimiento).getTime()
        )

        setMantenimientos(allMants)
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [user])

  const formatCurrency = (value: number | null) => {
    if (value === null || value === undefined) return '-'
    return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(value)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    // Add timezone offset to prevent shifting day back
    date.setMinutes(date.getMinutes() + date.getTimezoneOffset())
    return new Intl.DateTimeFormat('es-AR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    }).format(date)
  }

  const getVehiculoName = (vehiculoId: number) => {
    const v = vehiculos.find(v => v.id === vehiculoId)
    return v ? `${v.marca} ${v.modelo}` : 'Vehículo Desconocido'
  }

  // Derived filtered results
  const filteredMantenimientos = mantenimientos.filter(m => {
    const matchVehiculo = selectedVehiculo ? m.vehiculoId.toString() === selectedVehiculo : true
    const matchTipo = selectedTipo ? m.tipoServicio === selectedTipo : true
    return matchVehiculo && matchTipo
  })

  if (loading) {
    return (
      <div className="app-layout">
        <Navbar />
        <main className="page" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
          <p>Cargando historial...</p>
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
              <h1 className="page-title">Historial de Mantenimientos</h1>
              <Link to="/mantenimientos/nuevo" className="btn btn-primary">
                + Nuevo Registro
              </Link>
            </div>
            <p className="page-subtitle">
              Llevá el control de todos los servicios y reparaciones de tus vehículos.
            </p>
          </div>

          <div className="filters-card card animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <div className="filter-group">
              <label htmlFor="filter-vehiculo" className="filter-label">Vehículo</label>
              <select 
                id="filter-vehiculo" 
                className="filter-select"
                value={selectedVehiculo}
                onChange={e => setSelectedVehiculo(e.target.value)}
              >
                <option value="">Todos los vehículos</option>
                {vehiculos.map(v => (
                  <option key={v.id} value={v.id}>{v.marca} {v.modelo} ({v.patente})</option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label htmlFor="filter-tipo" className="filter-label">Tipo de Servicio</label>
              <select 
                id="filter-tipo" 
                className="filter-select"
                value={selectedTipo}
                onChange={e => setSelectedTipo(e.target.value)}
              >
                <option value="">Todos los tipos</option>
                {Object.entries(TipoServicioLabels).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="mantenimientos-grid animate-fade-in" style={{ animationDelay: '0.2s' }}>
            {filteredMantenimientos.length === 0 ? (
              <div className="empty-state card">
                <div className="empty-state__icon">🔧</div>
                <h3>No hay mantenimientos</h3>
                <p>No se encontraron registros de mantenimiento con los filtros seleccionados o todavía no agregaste ninguno.</p>
                <Link to="/mantenimientos/nuevo" className="btn btn-primary mt-4">
                  Registrar primer servicio
                </Link>
              </div>
            ) : (
              filteredMantenimientos.map(m => (
                <div key={m.id} className="card mant-card">
                  <div className="mant-card__header">
                    <div className="mant-card__icon">
                       {m.tipoServicio.includes('ACEITE') ? '🛢️' : m.tipoServicio.includes('FRENO') ? '🛑' : m.tipoServicio.includes('NEUMAT') ? '🛞' : '🔧'}
                    </div>
                    <div>
                      <h3 className="mant-card__title">{TipoServicioLabels[m.tipoServicio]}</h3>
                      <p className="mant-card__vehiculo">{getVehiculoName(m.vehiculoId)}</p>
                    </div>
                  </div>

                  <div className="mant-card__body">
                    {m.descripcion && (
                      <p className="mant-card__desc">"{m.descripcion}"</p>
                    )}
                    
                    <div className="mant-card__details">
                      <div className="mant-detail-item">
                        <span className="label">Fecha</span>
                        <span className="value">{formatDate(m.fecha_mantenimiento)}</span>
                      </div>
                      <div className="mant-detail-item">
                        <span className="label">Kilometraje</span>
                        <span className="value">{m.km_al_servicio.toLocaleString('es-AR')} km</span>
                      </div>
                      <div className="mant-detail-item">
                        <span className="label">Costo</span>
                        <span className="value mant-cost">{formatCurrency(m.costo)}</span>
                      </div>
                      {m.lugar && (
                        <div className="mant-detail-item">
                          <span className="label">Taller / Lugar</span>
                          <span className="value">{m.lugar}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mant-card__actions">
                    <Link to={`/mantenimientos/editar/${m.id}`} className="btn btn-outline btn-sm">Editar</Link>
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
