import { useState, useEffect, type FormEvent } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { Navbar } from '../../components/Navbar'
import { vehiculoService } from '../../services/vehiculoService'
import { useAuth } from '../../context/AuthContext'
import type { VehiculoCreate } from '../../types'
import './VehiculoForm.css'

export const VehiculoForm = () => {
  const { id } = useParams()
  const isEditing = Boolean(id)
  const navigate = useNavigate()
  const { user } = useAuth()

  const [formData, setFormData] = useState<VehiculoCreate>({
    usuarioId: user?.id || 0,
    marca: '',
    modelo: '',
    anio: new Date().getFullYear(),
    patente: '',
    km_actual: 0,
    url_foto: ''
  })
  
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // If editing, load the vehicle data
  useEffect(() => {
    if (isEditing && id) {
      const loadVehiculo = async () => {
        try {
          setLoading(true)
          const data = await vehiculoService.getById(Number(id))
          // Only the owner should edit it, ideally checked on the backend
          if (data.usuarioId !== user?.id) {
            navigate('/vehiculos')
            return
          }
          setFormData({
            usuarioId: data.usuarioId,
            marca: data.marca,
            modelo: data.modelo,
            anio: data.anio,
            patente: data.patente || '',
            km_actual: data.km_actual,
            url_foto: data.url_foto || ''
          })
        } catch (err) {
          setError('Error al cargar los datos del vehículo.')
        } finally {
          setLoading(false)
        }
      }
      loadVehiculo()
    }
  }, [id, isEditing, user?.id, navigate])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value
    }))
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')

    // Basic validation
    if (!formData.marca || !formData.modelo || !formData.anio) {
      setError('Marca, modelo y año son obligatorios.')
      return
    }

    try {
      setLoading(true)
      if (isEditing && id) {
        await vehiculoService.update(Number(id), formData)
      } else {
        await vehiculoService.create(formData)
      }
      navigate('/vehiculos')
    } catch (err) {
      console.error(err)
      setError(`Error al ${isEditing ? 'actualizar' : 'crear'} el vehículo.`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="app-layout">
      <Navbar />
      <main className="page">
        <div className="container container--small">
          <div className="page-header animate-fade-in">
            <Link to="/vehiculos" className="btn btn-outline btn-sm" style={{ marginBottom: 'var(--space-4)' }}>
              &larr; Volver
            </Link>
            <h1 className="page-title">{isEditing ? 'Editar Vehículo' : 'Nuevo Vehículo'}</h1>
            <p className="page-subtitle">
              {isEditing ? 'Modificá los datos de tu vehículo.' : 'Ingresá los datos de tu nuevo vehículo.'}
            </p>
          </div>

          <div className="card form-card animate-fade-in" style={{ animationDelay: '0.1s' }}>
            {error && (
              <div className="alert-error">
                <span>⚠️</span> {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="crud-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="marca" className="form-label">Marca *</label>
                  <input
                    id="marca"
                    name="marca"
                    type="text"
                    className="form-input"
                    value={formData.marca}
                    onChange={handleChange}
                    placeholder="Ej. Toyota, Ford, Fiat..."
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="modelo" className="form-label">Modelo *</label>
                  <input
                    id="modelo"
                    name="modelo"
                    type="text"
                    className="form-input"
                    value={formData.modelo}
                    onChange={handleChange}
                    placeholder="Ej. Corolla, Focus, Cronos..."
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="anio" className="form-label">Año *</label>
                  <input
                    id="anio"
                    name="anio"
                    type="number"
                    className="form-input"
                    value={formData.anio}
                    onChange={handleChange}
                    min="1900"
                    max={new Date().getFullYear() + 1}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="patente" className="form-label">Patente / Dominio</label>
                  <input
                    id="patente"
                    name="patente"
                    type="text"
                    className="form-input"
                    value={formData.patente}
                    onChange={handleChange}
                    placeholder="Ej. AB 123 CD o AAA 123"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="km_actual" className="form-label">Kilometraje Actual</label>
                <div className="input-with-suffix">
                  <input
                    id="km_actual"
                    name="km_actual"
                    type="number"
                    className="form-input"
                    value={formData.km_actual}
                    onChange={handleChange}
                    min="0"
                  />
                  <span className="suffix">km</span>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="url_foto" className="form-label">URL de Foto (opcional)</label>
                <input
                  id="url_foto"
                  name="url_foto"
                  type="url"
                  className="form-input"
                  value={formData.url_foto}
                  onChange={handleChange}
                  placeholder="https://ejemplo.com/foto.jpg"
                />
              </div>

              <div className="form-actions">
                <Link to="/vehiculos" className="btn btn-outline">Cancelar</Link>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? 'Guardando...' : (isEditing ? 'Guardar Cambios' : 'Crear Vehículo')}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  )
}
