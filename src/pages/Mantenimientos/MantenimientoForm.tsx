import { useState, useEffect, type FormEvent } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { Navbar } from '../../components/Navbar'
import { mantenimientoService } from '../../services/mantenimientoService'
import { vehiculoService } from '../../services/vehiculoService'
import { useAuth } from '../../context/AuthContext'
import { ConfirmModal } from '../../components/ui/ConfirmModal'
import { TipoServicio, TipoServicioLabels, type MantenimientoCreate, type Vehiculo } from '../../types'
import './MantenimientoForm.css'

export const MantenimientoForm = () => {
  const { id } = useParams()
  const isEditing = Boolean(id)
  const navigate = useNavigate()
  const { user } = useAuth()

  const [vehiculos, setVehiculos] = useState<Vehiculo[]>([])
  const [formData, setFormData] = useState<MantenimientoCreate>({
    vehiculoId: 0,
    tipoServicio: TipoServicio.REVISION_GENERAL,
    descripcion: '',
    fecha_mantenimiento: new Date().toISOString().split('T')[0],
    km_al_servicio: 0,
    costo: 0,
    lugar: '',
    url_foto_recibo: ''
  })
  
  const [loading, setLoading] = useState(false)
  const [fetchingData, setFetchingData] = useState(true)
  const [error, setError] = useState('')
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

  useEffect(() => {
    const initForm = async () => {
      if (!user) return
      
      try {
        setFetchingData(true)
        
        // Load user's vehicles for the dropdown
        const userVehiculos = await vehiculoService.getByUsuarioId(user.id)
        setVehiculos(userVehiculos)

        // If editing, load the specific record
        if (isEditing && id) {
          const mData = await mantenimientoService.getById(Number(id))
          
          // Basic check: ensure the vehicle of this maintenance belongs to the user
          const belongsToUser = userVehiculos.some(v => v.id === mData.vehiculoId)
          if (!belongsToUser) {
            navigate('/mantenimientos')
            return
          }

          setFormData({
            vehiculoId: mData.vehiculoId,
            tipoServicio: mData.tipoServicio,
            descripcion: mData.descripcion || '',
            fecha_mantenimiento: mData.fecha_mantenimiento,
            km_al_servicio: mData.km_al_servicio,
            costo: mData.costo || 0,
            lugar: mData.lugar || '',
            url_foto_recibo: mData.url_foto_recibo || ''
          })
        } else if (userVehiculos.length > 0) {
          // If creating and vehicles exist, select the first one by default
          setFormData(prev => ({ ...prev, vehiculoId: userVehiculos[0].id }))
        }
      } catch (err) {
        console.error(err)
        setError('Error al cargar datos necesarios.')
      } finally {
        setFetchingData(false)
      }
    }

    initForm()
  }, [id, isEditing, user, navigate])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value
    }))
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')

    if (!formData.vehiculoId) {
      setError('Debes seleccionar un vehículo.')
      return
    }
    if (!formData.fecha_mantenimiento || formData.km_al_servicio < 0) {
      setError('Verificá la fecha y el kilometraje ingresado.')
      return
    }

    try {
      setLoading(true)
      if (isEditing && id) {
        await mantenimientoService.update(Number(id), formData)
      } else {
        await mantenimientoService.create(formData)
      }
      navigate('/mantenimientos')
    } catch (err) {
      console.error(err)
      setError(`Error al ${isEditing ? 'actualizar' : 'guardar'} el mantenimiento.`)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!id) return
    try {
      await mantenimientoService.delete(Number(id))
      navigate('/mantenimientos')
    } catch (err) {
      console.error(err)
      setError('Error al eliminar el mantenimiento.')
    }
  }

  if (fetchingData) {
    return (
      <div className="app-layout">
        <Navbar />
        <main className="page" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
          <p>Cargando información...</p>
        </main>
      </div>
    )
  }

  return (
    <div className="app-layout">
      <Navbar />
      <main className="page">
        <div className="container container--small">
          <div className="page-header animate-fade-in">
            <Link to="/mantenimientos" className="btn btn-outline btn-sm" style={{ marginBottom: 'var(--space-4)' }}>
              &larr; Volver
            </Link>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h1 className="page-title">{isEditing ? 'Editar Mantenimiento' : 'Registrar Mantenimiento'}</h1>
                <p className="page-subtitle">
                  Los registros de mantenimiento te ayudan a mantener el historial al día.
                </p>
              </div>
              
              {isEditing && (
                <button 
                  className="btn btn-outline" 
                  style={{ color: 'var(--color-danger)', borderColor: 'rgba(239, 68, 68, 0.3)' }}
                  onClick={() => setIsDeleteModalOpen(true)}
                >
                  Eliminar
                </button>
              )}
            </div>
          </div>

          <div className="card form-card animate-fade-in" style={{ animationDelay: '0.1s' }}>
            {vehiculos.length === 0 ? (
              <div className="alert-error" style={{ marginBottom: 0 }}>
                <span>⚠️</span> No podés cargar mantenimientos porque no tenés vehículos registrados.
                <div style={{ marginTop: 'var(--space-3)' }}>
                  <Link to="/vehiculos/nuevo" className="btn btn-outline btn-sm">Agregar Vehículo</Link>
                </div>
              </div>
            ) : (
              <>
                {error && (
                  <div className="alert-error">
                    <span>⚠️</span> {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="crud-form">
                  <div className="form-group">
                    <label htmlFor="vehiculoId" className="form-label">Vehículo asociado *</label>
                    <select
                      id="vehiculoId"
                      name="vehiculoId"
                      className="form-input"
                      value={formData.vehiculoId}
                      onChange={handleChange}
                      required
                    >
                      <option value="0" disabled>Seleccionar vehículo...</option>
                      {vehiculos.map(v => (
                        <option key={v.id} value={v.id}>{v.marca} {v.modelo} ({v.patente || 'Sin pte'})</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="tipoServicio" className="form-label">Servicio realizado *</label>
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

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="fecha_mantenimiento" className="form-label">Fecha del servicio *</label>
                      <input
                        id="fecha_mantenimiento"
                        name="fecha_mantenimiento"
                        type="date"
                        className="form-input"
                        value={formData.fecha_mantenimiento}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="km_al_servicio" className="form-label">Kilometraje *</label>
                      <div className="input-with-suffix">
                        <input
                          id="km_al_servicio"
                          name="km_al_servicio"
                          type="number"
                          className="form-input"
                          value={formData.km_al_servicio}
                          onChange={handleChange}
                          min="0"
                          required
                        />
                        <span className="suffix">km</span>
                      </div>
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="costo" className="form-label">Costo total ($)</label>
                      <div className="input-with-suffix">
                        <input
                          id="costo"
                          name="costo"
                          type="number"
                          className="form-input"
                          value={formData.costo}
                          onChange={handleChange}
                          min="0"
                          style={{ paddingLeft: '2.5rem' }}
                        />
                        <span className="suffix" style={{ left: '1rem', right: 'auto' }}>$</span>
                      </div>
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="lugar" className="form-label">Taller / Ubicación</label>
                      <input
                        id="lugar"
                        name="lugar"
                        type="text"
                        className="form-input"
                        value={formData.lugar}
                        onChange={handleChange}
                        placeholder="Ej. Taller Los Amigos"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="descripcion" className="form-label">Descripción / Notas</label>
                    <textarea
                      id="descripcion"
                      name="descripcion"
                      className="form-input"
                      rows={3}
                      value={formData.descripcion}
                      onChange={handleChange}
                      placeholder="Anotaciones sobre el servicio realizado..."
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="url_foto_recibo" className="form-label">URL Foto del Recibo (opcional)</label>
                    <input
                      id="url_foto_recibo"
                      name="url_foto_recibo"
                      type="url"
                      className="form-input"
                      value={formData.url_foto_recibo}
                      onChange={handleChange}
                      placeholder="https://ejemplo.com/ticket.jpg"
                    />
                  </div>

                  <div className="form-actions">
                    <Link to="/mantenimientos" className="btn btn-outline">Cancelar</Link>
                    <button type="submit" className="btn btn-primary" disabled={loading}>
                      {loading ? 'Guardando...' : (isEditing ? 'Guardar Cambios' : 'Registrar Mantenimiento')}
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      </main>

      {isEditing && (
        <ConfirmModal
          isOpen={isDeleteModalOpen}
          title="Eliminar Mantenimiento"
          message="¿Estás seguro de que deseás eliminar este registro de mantenimiento? Esta acción no se puede deshacer y el gasto se restará del total."
          confirmText="Sí, eliminar"
          onCancel={() => setIsDeleteModalOpen(false)}
          onConfirm={handleDelete}
        />
      )}
    </div>
  )
}
