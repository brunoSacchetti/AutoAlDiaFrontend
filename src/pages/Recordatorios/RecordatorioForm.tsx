import { useState, useEffect } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { Navbar } from '../../components/Navbar'
import { recordatorioService } from '../../services/recordatorioService'
import { vehiculoService } from '../../services/vehiculoService'
import { useAuth } from '../../context/AuthContext'
import type { RecordatorioCreate, Vehiculo } from '../../types'
import { TipoServicioLabels, TipoRecordatorioLabels, EstadoRecordatorioLabels, TipoRecordatorio, TipoServicio, EstadoRecordatorio } from '../../types'
import './RecordatorioForm.css'

export const RecordatorioForm = () => {
  const { id } = useParams() // if editing, we have an ID
  const isEditing = Boolean(id)
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const queryVehiculoId = searchParams.get('vehiculoId')
  const { user } = useAuth()

  const [vehiculos, setVehiculos] = useState<Vehiculo[]>([])
  const [loadingConfig, setLoadingConfig] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  
  const [formData, setFormData] = useState<RecordatorioCreate>({
    vehiculoId: queryVehiculoId ? Number(queryVehiculoId) : 0,
    tipoRecordatorio: TipoRecordatorio.BASADO_EN_FECHA,
    tipoServicio: TipoServicio.REVISION_GENERAL,
    recordatorio_km: undefined,
    recordatorio_fecha: '',
    estado: EstadoRecordatorio.PENDIENTE
  })

  useEffect(() => {
    const fetchInitialData = async () => {
      if (!user) return
      
      try {
        setLoadingConfig(true)
        const userVehiculos = await vehiculoService.getByUsuarioId(user.id)
        setVehiculos(userVehiculos)
        
        // Ensure the default vehicle is set if none was specified in query
        if (!queryVehiculoId && !isEditing && userVehiculos.length > 0) {
          setFormData(prev => ({ ...prev, vehiculoId: userVehiculos[0].id }))
        }

        if (isEditing) {
          const recToEdit = await recordatorioService.getById(Number(id))
          // For editing, populate the form
          setFormData({
            vehiculoId: recToEdit.vehiculoId,
            tipoRecordatorio: recToEdit.tipoRecordatorio,
            tipoServicio: recToEdit.tipoServicio,
            recordatorio_km: recToEdit.recordatorio_km || undefined,
            recordatorio_fecha: recToEdit.recordatorio_fecha || '',
            estado: recToEdit.estado
          })
        }
      } catch (error) {
        console.error('Error fetching data for form:', error)
        alert('Error al cargar datos necesarios.')
      } finally {
        setLoadingConfig(false)
      }
    }
    
    fetchInitialData()
  }, [id, isEditing, queryVehiculoId, user])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'vehiculoId' || name === 'recordatorio_km' 
        ? (value ? Number(value) : undefined) 
        : value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (formData.tipoRecordatorio === TipoRecordatorio.BASADO_EN_KM || formData.tipoRecordatorio === TipoRecordatorio.AMBOS) {
      if (!formData.recordatorio_km || formData.recordatorio_km <= 0) {
        alert('El kilometraje del recordatorio es requerido para este tipo y debe ser mayor a 0.')
        return
      }
    }
    
    if (formData.tipoRecordatorio === TipoRecordatorio.BASADO_EN_FECHA || formData.tipoRecordatorio === TipoRecordatorio.AMBOS) {
      if (!formData.recordatorio_fecha) {
        alert('La fecha del recordatorio es requerida para este tipo.')
        return
      }
    }

    try {
      setSubmitting(true)
      // Clean up fields based on type before sending
      const cleanData = { ...formData }
      if (cleanData.tipoRecordatorio === TipoRecordatorio.BASADO_EN_KM) cleanData.recordatorio_fecha = undefined
      if (cleanData.tipoRecordatorio === TipoRecordatorio.BASADO_EN_FECHA) cleanData.recordatorio_km = undefined
      
      if (isEditing) {
        await recordatorioService.update(Number(id), cleanData)
      } else {
        await recordatorioService.create(cleanData)
      }
      navigate(`/vehiculos/${formData.vehiculoId}`)
    } catch (error) {
      console.error('Error saving recordatorio:', error)
      alert('Error al guardar el recordatorio. Por favor, intente nuevamente.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loadingConfig) {
    return (
      <div className="app-layout">
        <Navbar />
        <main className="page" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <p>Cargando información del formulario...</p>
        </main>
      </div>
    )
  }

  return (
    <div className="app-layout">
      <Navbar />
      <main className="page">
        <div className="container form-container animate-fade-in">
          <div className="page-header">
            <button 
              onClick={() => navigate(-1)} 
              className="btn btn-ghost btn-sm" 
              style={{ marginBottom: 'var(--space-4)', padding: 0 }}
            >
              &larr; Volver
            </button>
            <h1 className="page-title">{isEditing ? 'Editar Recordatorio' : 'Añadir Recordatorio'}</h1>
            <p className="page-subtitle">
              {isEditing ? 'Modificá los detalles de este recordatorio' : 'Programá un aviso para el próximo servicio mecánico'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="card form-card">
            <div className="form-group">
              <label htmlFor="vehiculoId" className="form-label">Vehículo</label>
              <select
                id="vehiculoId"
                name="vehiculoId"
                className="form-input"
                value={formData.vehiculoId}
                onChange={handleChange}
                required
                disabled={isEditing || Boolean(queryVehiculoId)} // Lock if passed in query or editing
              >
                <option value={0} disabled>Seleccione un vehículo</option>
                {vehiculos.map(v => (
                  <option key={v.id} value={v.id}>{v.marca} {v.modelo} {v.patente ? `(${v.patente})` : ''}</option>
                ))}
              </select>
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="tipoServicio" className="form-label">Servicio a Realizar</label>
                <select
                  id="tipoServicio"
                  name="tipoServicio"
                  className="form-input"
                  value={formData.tipoServicio}
                  onChange={handleChange}
                  required
                >
                  {Object.entries(TipoServicioLabels).map(([key, label]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="tipoRecordatorio" className="form-label">Modo del Recordatorio</label>
                <select
                  id="tipoRecordatorio"
                  name="tipoRecordatorio"
                  className="form-input"
                  value={formData.tipoRecordatorio}
                  onChange={handleChange}
                  required
                >
                  {Object.entries(TipoRecordatorioLabels).map(([key, label]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Campos condicionales */}
            {(formData.tipoRecordatorio === TipoRecordatorio.BASADO_EN_FECHA || formData.tipoRecordatorio === TipoRecordatorio.AMBOS) && (
              <div className="form-group">
                <label htmlFor="recordatorio_fecha" className="form-label">Avisar en la Fecha:</label>
                <input
                  type="date"
                  id="recordatorio_fecha"
                  name="recordatorio_fecha"
                  className="form-input"
                  value={formData.recordatorio_fecha || ''}
                  onChange={handleChange}
                  required
                />
              </div>
            )}

            {(formData.tipoRecordatorio === TipoRecordatorio.BASADO_EN_KM || formData.tipoRecordatorio === TipoRecordatorio.AMBOS) && (
              <div className="form-group">
                <label htmlFor="recordatorio_km" className="form-label">Avisar a los (Kilómetros):</label>
                <input
                  type="number"
                  id="recordatorio_km"
                  name="recordatorio_km"
                  className="form-input"
                  placeholder="Ej: 50000"
                  value={formData.recordatorio_km || ''}
                  onChange={handleChange}
                  required
                  min="0"
                />
              </div>
            )}

            {isEditing && (
              <div className="form-group">
                <label htmlFor="estado" className="form-label">Estado del Recordatorio</label>
                <select
                  id="estado"
                  name="estado"
                  className="form-input"
                  value={formData.estado}
                  onChange={handleChange}
                  required
                >
                  {Object.entries(EstadoRecordatorioLabels).map(([key, label]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>
              </div>
            )}

            <div className="form-actions mt-4">
              <button 
                type="button" 
                className="btn btn-outline" 
                onClick={() => navigate(-1)}
                disabled={submitting}
              >
                Cancelar
              </button>
              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={submitting}
              >
                {submitting ? 'Guardando...' : (isEditing ? 'Guardar Cambios' : 'Añadir Recordatorio')}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}
