import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { Navbar } from '../../components/Navbar'
import { vehiculoService } from '../../services/vehiculoService'
import { mantenimientoService } from '../../services/mantenimientoService'
import { recordatorioService } from '../../services/recordatorioService'
import { useAuth } from '../../context/AuthContext'
import { ConfirmModal } from '../../components/ui/ConfirmModal'
import { MaintenanceList } from '../../components/MaintenanceList'
import { RecordatoriosPanel } from '../../components/RecordatoriosPanel'
import type { Vehiculo, Mantenimiento, RecordatorioMantenimiento } from '../../types'
import { EstadoRecordatorio } from '../../types'
import './VehiculoDetail.css'

export const VehiculoDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()

  const [vehiculo, setVehiculo] = useState<Vehiculo | null>(null)
  const [mantenimientos, setMantenimientos] = useState<Mantenimiento[]>([])
  const [recordatorios, setRecordatorios] = useState<RecordatorioMantenimiento[]>([])
  const [loading, setLoading] = useState(true)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<'info' | 'mantenimientos' | 'alertas'>('info')

  useEffect(() => {
    const fetchVehiculoData = async () => {
      if (!id || !user) return

      try {
        setLoading(true)
        const vehData = await vehiculoService.getById(Number(id))
        
        // Basic security redirect
        if (vehData.usuarioId !== user.id) {
          navigate('/vehiculos')
          return
        }

        setVehiculo(vehData)

        // Fetch related data
        const mants = await mantenimientoService.getByVehiculoId(vehData.id)
        setMantenimientos(mants)

        const recs = await recordatorioService.getByVehiculoId(vehData.id)
        setRecordatorios(recs)
      } catch (error) {
        console.error('Error fetching vehicle detail:', error)
        navigate('/vehiculos')
      } finally {
        setLoading(false)
      }
    }

    fetchVehiculoData()
  }, [id, user, navigate])

  const handleDelete = async () => {
    if (!vehiculo) return
    try {
      await vehiculoService.delete(vehiculo.id)
      navigate('/vehiculos')
    } catch (error) {
      console.error('Error deleting vehicle:', error)
      alert('Ocurrió un error al eliminar el vehículo.')
    }
  }

  const handleUpdateRecordatorioStatus = async (id: number, nuevoEstado: EstadoRecordatorio) => {
    try {
      // Optimizacion UI: actualizar estado localmente primero
      setRecordatorios(prev => 
        prev.map(r => r.id === id ? { ...r, estado: nuevoEstado } : r)
      )
      await recordatorioService.update(id, { estado: nuevoEstado } as any)
    } catch (error) {
      console.error('Error updating recordatorio status:', error)
      alert('Ocurrió un error al actualizar el estado del recordatorio.')
      // Revertir en caso de error (idealmente deberíamos refetchear o guardar el estado anterior)
    }
  }

  const handleDeleteRecordatorio = async (id: number) => {
    if (!window.confirm('¿Estás seguro de que deseás eliminar este recordatorio?')) return
    
    try {
      await recordatorioService.delete(id)
      setRecordatorios(prev => prev.filter(r => r.id !== id))
    } catch (error) {
      console.error('Error deleting recordatorio:', error)
      alert('Ocurrió un error al eliminar el recordatorio.')
    }
  }

  if (loading || !vehiculo) {
    return (
      <div className="app-layout">
        <Navbar />
        <main className="page" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
          <p>Cargando detalles del vehículo...</p>
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
            <Link to="/vehiculos" className="btn btn-outline btn-sm" style={{ marginBottom: 'var(--space-4)' }}>
              &larr; Volver a Mis Vehículos
            </Link>
            
            <div className="detail-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
                {vehiculo.url_foto ? (
                  <img src={vehiculo.url_foto} alt={vehiculo.marca} style={{ width: '64px', height: '64px', borderRadius: 'var(--radius-md)', objectFit: 'cover' }} />
                ) : (
                  <div style={{ width: '64px', height: '64px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--color-primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem' }}>🚗</div>
                )}
                <div>
                  <h1 className="page-title" style={{ marginBottom: 'var(--space-1)' }}>{vehiculo.marca} {vehiculo.modelo}</h1>
                  <p className="page-subtitle" style={{ margin: 0 }}>
                    {vehiculo.anio} • {vehiculo.patente || 'Sin Patente'}
                  </p>
                </div>
              </div>
              <div className="detail-actions">
                <Link to={`/vehiculos/editar/${vehiculo.id}`} className="btn btn-primary">
                  Editar
                </Link>
                <button 
                  className="btn btn-outline" 
                  style={{ color: 'var(--color-danger)', borderColor: 'rgba(239, 68, 68, 0.3)' }}
                  onClick={() => setIsDeleteModalOpen(true)}
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>

          <div className="tabs animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <button 
              className={`tab ${activeTab === 'info' ? 'active' : ''}`}
              onClick={() => setActiveTab('info')}
            >
              Info General
            </button>
            <button 
              className={`tab ${activeTab === 'mantenimientos' ? 'active' : ''}`}
              onClick={() => setActiveTab('mantenimientos')}
            >
              Mantenimientos ({mantenimientos.length})
            </button>
            <button 
              className={`tab ${activeTab === 'alertas' ? 'active' : ''}`}
              onClick={() => setActiveTab('alertas')}
            >
              Alertas ({recordatorios.length})
            </button>
          </div>

          <div className="tab-content animate-fade-in" style={{ animationDelay: '0.2s' }}>
            {activeTab === 'info' && (
              <div className="card info-card">
                <div className="info-grid">
                  <div className="info-item">
                    <span className="info-label">Marca</span>
                    <span className="info-value">{vehiculo.marca}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Modelo</span>
                    <span className="info-value">{vehiculo.modelo}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Año</span>
                    <span className="info-value">{vehiculo.anio}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Dominio / Patente</span>
                    <span className="info-value">{vehiculo.patente || '-'}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Kilometraje Actual</span>
                    <span className="info-value">{vehiculo.km_actual.toLocaleString('es-AR')} km</span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'mantenimientos' && (
              <div>
                <MaintenanceList mantenimientos={mantenimientos} vehiculos={[vehiculo]} />
              </div>
            )}

            {activeTab === 'alertas' && (
              <div>
                <RecordatoriosPanel 
                  recordatorios={recordatorios} 
                  vehiculo={vehiculo} 
                  onStatusChange={handleUpdateRecordatorioStatus}
                  onDelete={handleDeleteRecordatorio}
                />
              </div>
            )}
          </div>
        </div>
      </main>

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        title="Eliminar Vehículo"
        message={`¿Estás seguro de que deseás eliminar el ${vehiculo.marca} ${vehiculo.modelo}? Esta acción no se puede deshacer y eliminará todo su historial asociado.`}
        confirmText="Sí, eliminar"
        onCancel={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
      />
    </div>
  )
}
