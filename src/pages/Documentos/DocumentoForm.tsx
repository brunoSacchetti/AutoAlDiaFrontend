import { useState, useEffect } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { Navbar } from '../../components/Navbar'
import { documentoService } from '../../services/documentoService'
import { vehiculoService } from '../../services/vehiculoService'
import { useAuth } from '../../context/AuthContext'
import type { DocumentoCreate, Vehiculo } from '../../types'
import { TipoDocumentoLabels, TipoDocumento } from '../../types'
import './DocumentoForm.css'

export const DocumentoForm = () => {
  const { id } = useParams()
  const isEditing = Boolean(id)
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const queryVehiculoId = searchParams.get('vehiculoId')
  const { user } = useAuth()

  const [vehiculos, setVehiculos] = useState<Vehiculo[]>([])
  const [loadingConfig, setLoadingConfig] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  
  const [formData, setFormData] = useState<DocumentoCreate>({
    vehiculoId: queryVehiculoId ? Number(queryVehiculoId) : 0,
    tipoDocumento: TipoDocumento.SEGURO,
    fecha_expiro: '',
    url_foto: '',
    notas: ''
  })

  useEffect(() => {
    const fetchInitialData = async () => {
      if (!user) return
      
      try {
        setLoadingConfig(true)
        const userVehiculos = await vehiculoService.getByUsuarioId(user.id)
        setVehiculos(userVehiculos)
        
        if (!queryVehiculoId && !isEditing && userVehiculos.length > 0) {
          setFormData(prev => ({ ...prev, vehiculoId: userVehiculos[0].id }))
        }

        if (isEditing) {
          const docToEdit = await documentoService.getById(Number(id))
          setFormData({
            vehiculoId: docToEdit.vehiculoId,
            tipoDocumento: docToEdit.tipoDocumento,
            fecha_expiro: docToEdit.fecha_expiro,
            url_foto: docToEdit.url_foto || '',
            notas: docToEdit.notas || ''
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'vehiculoId' ? (value ? Number(value) : undefined) : value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      setSubmitting(true)
      
      if (isEditing) {
        await documentoService.update(Number(id), formData)
      } else {
        await documentoService.create(formData)
      }
      navigate(`/vehiculos/${formData.vehiculoId}`)
    } catch (error) {
      console.error('Error saving documento:', error)
      alert('Error al guardar el documento. Por favor, intente nuevamente.')
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
            <h1 className="page-title">{isEditing ? 'Editar Documento' : 'Añadir Documento'}</h1>
            <p className="page-subtitle">
              {isEditing ? 'Modificá los detalles de este documento' : 'Registrá un nuevo VTV, Seguro o cédula asociado al vehículo'}
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
                disabled={isEditing || Boolean(queryVehiculoId)}
              >
                <option value={0} disabled>Seleccione un vehículo</option>
                {vehiculos.map(v => (
                  <option key={v.id} value={v.id}>{v.marca} {v.modelo} {v.patente ? `(${v.patente})` : ''}</option>
                ))}
              </select>
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="tipoDocumento" className="form-label">Tipo de Documento</label>
                <select
                  id="tipoDocumento"
                  name="tipoDocumento"
                  className="form-input"
                  value={formData.tipoDocumento}
                  onChange={handleChange}
                  required
                >
                  {Object.entries(TipoDocumentoLabels).map(([key, label]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="fecha_expiro" className="form-label">Fecha de Vencimiento:</label>
                <input
                  type="date"
                  id="fecha_expiro"
                  name="fecha_expiro"
                  className="form-input"
                  value={formData.fecha_expiro}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
               <label htmlFor="url_foto" className="form-label">URL del Documento / Foto (Opcional):</label>
               <input
                 type="url"
                 id="url_foto"
                 name="url_foto"
                 className="form-input"
                 placeholder="https://..."
                 value={formData.url_foto || ''}
                 onChange={handleChange}
               />
               <span className="form-hint">Enlace para ver o descargar el archivo.</span>
            </div>

            <div className="form-group">
               <label htmlFor="notas" className="form-label">Notas (Opcional):</label>
               <textarea
                 id="notas"
                 name="notas"
                 className="form-input"
                 placeholder="Compañía de seguro, número de póliza, etc."
                 value={formData.notas || ''}
                 onChange={handleChange}
                 rows={3}
               />
            </div>

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
                {submitting ? 'Guardando...' : (isEditing ? 'Guardar Cambios' : 'Añadir Documento')}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}
