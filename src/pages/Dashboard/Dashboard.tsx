import { useEffect, useState } from 'react'
import { Navbar } from '../../components/Navbar'
import { VehicleCard } from '../../components/VehicleCard'
import { StatsCard } from '../../components/StatsCard'
import { AlertsPanel } from '../../components/AlertsPanel'
import { MaintenanceList } from '../../components/MaintenanceList'
import { useAuth } from '../../context/AuthContext'
import { vehiculoService } from '../../services/vehiculoService'
import { mantenimientoService } from '../../services/mantenimientoService'
import { recordatorioService } from '../../services/recordatorioService'
import type { Vehiculo, Mantenimiento, RecordatorioMantenimiento } from '../../types'
import './Dashboard.css'

export const Dashboard = () => {
  const { user } = useAuth()

  const [vehiculos, setVehiculos] = useState<Vehiculo[]>([])
  const [mantenimientos, setMantenimientos] = useState<Mantenimiento[]>([])
  const [recordatorios, setRecordatorios] = useState<RecordatorioMantenimiento[]>([])
  const [gastoTotal, setGastoTotal] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return

      try {
        setLoading(true)

        // 1. Fetch user's vehicles
        const vehs = await vehiculoService.getByUsuarioId(user.id)
        setVehiculos(vehs)

        // 2. Fetch active reminders for the user
        const recs = await recordatorioService.getActivosByUsuarioId(user.id)
        setRecordatorios(recs)

        // 3. Fetch maintenance records & calculate total cost
        // Note: The API gets them per vehicle, so we fetch all in parallel
        let allMantenimientos: Mantenimiento[] = []
        let totalCosto = 0

        const maintPromises = vehs.map(async (v) => {
          const mants = await mantenimientoService.getByVehiculoId(v.id)
          allMantenimientos = [...allMantenimientos, ...mants]
          
          try {
             const gastoVehiculo = await mantenimientoService.getGastoTotal(v.id)
             totalCosto += gastoVehiculo
          } catch {
             totalCosto = 0;
          }
        })

        await Promise.all(maintPromises)
        
        // Sort by date descending (newest first)
        allMantenimientos.sort((a, b) => 
          new Date(b.fecha_mantenimiento).getTime() - new Date(a.fecha_mantenimiento).getTime()
        )

        setMantenimientos(allMantenimientos)
        setGastoTotal(totalCosto)

      } catch (error) {
        console.error('Error fetching dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [user])

  // Helper method format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      maximumFractionDigits: 0
    }).format(value)
  }

  if (loading) {
    return (
      <div className="app-layout">
        <Navbar />
        <main className="page" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
          <p>Cargando tu información...</p>
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
            <h1 className="page-title">Hola, {user?.nombre?.split(' ')[0] || 'Usuario'}</h1>
            <p className="page-subtitle">
              Resumen del estado de tus vehículos y mantenimientos
            </p>
          </div>

          <div className="stats-grid animate-fade-in">
            <StatsCard title="Vehículos" value={vehiculos.length.toString()} icon="🚗" color="primary" />
            <StatsCard title="Mantenimientos" value={mantenimientos.length.toString()} icon="🔧" color="accent" />
            <StatsCard title="Alertas Activas" value={recordatorios.length.toString()} icon="⚠️" color="warning" />
            <StatsCard title="Gasto Total" value={formatCurrency(gastoTotal)} icon="💰" color="success" />
          </div>

          <div className="dashboard-grid">
            <section className="vehicles-section animate-fade-in" style={{ animationDelay: '0.1s' }}>
              <div className="section-header">
                <h2 className="section-title">Mis Vehículos</h2>
                <button className="btn btn-primary btn-sm">+ Agregar</button>
              </div>
              
              {vehiculos.length === 0 ? (
                <div className="card" style={{ textAlign: 'center', padding: 'var(--space-8)' }}>
                  <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-4)' }}>
                    No tenés ningún vehículo registrado aún.
                  </p>
                  <button className="btn btn-primary">Registrar mi primer vehículo</button>
                </div>
              ) : (
                <div className="vehicles-grid">
                  {vehiculos.map(v => (
                    <VehicleCard
                      key={v.id}
                      name={`${v.marca} ${v.modelo}`}
                      year={v.anio.toString()}
                      plate={v.patente || 'Sin patente'}
                      km={`${v.km_actual.toLocaleString('es-AR')} km`}
                    />
                  ))}
                </div>
              )}
            </section>

            <aside className="sidebar animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <AlertsPanel recordatorios={recordatorios} vehiculos={vehiculos} />
              <MaintenanceList mantenimientos={mantenimientos.slice(0, 5)} vehiculos={vehiculos} />
            </aside>
          </div>
        </div>
      </main>
    </div>
  )
}
