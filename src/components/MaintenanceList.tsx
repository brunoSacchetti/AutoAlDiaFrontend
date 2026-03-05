import type { Mantenimiento, Vehiculo } from '../types'
import { TipoServicioLabels } from '../types'
import './MaintenanceList.css'

interface MaintenanceListProps {
  mantenimientos?: Mantenimiento[]
  vehiculos?: Vehiculo[]
}

export const MaintenanceList = ({ mantenimientos = [], vehiculos = [] }: MaintenanceListProps) => {

  const getVehicleName = (vehiculoId: number) => {
    const v = vehiculos.find(v => v.id === vehiculoId)
    return v ? `${v.marca} ${v.modelo}` : 'Vehículo'
  }

  const formatCurrency = (value: number | null) => {
    if (value === null) return '-'
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      maximumFractionDigits: 0
    }).format(value)
  }

  const formatDate = (dateString: string) => {
    // Fallback if parsing fails
    try {
      const d = new Date(dateString)
      // Display as dd/MM/yyyy
      return new Intl.DateTimeFormat('es-AR').format(d)
    } catch {
      return dateString
    }
  }

  return (
    <div className="card maintenance-list">
      <h3 className="maintenance-list__title">Últimos Mantenimientos</h3>

      {mantenimientos.length === 0 ? (
        <p style={{ color: 'var(--text-tertiary)', fontSize: 'var(--font-size-sm)' }}>
          No hay mantenimientos recientes.
        </p>
      ) : (
        mantenimientos.map(mant => (
          <div key={mant.id} className="maintenance-item">
            <div className="maintenance-item__info">
              <span className="maintenance-item__name">
                {TipoServicioLabels[mant.tipoServicio] || 'Mantenimiento'}
              </span>
              <span className="maintenance-item__meta">
                {getVehicleName(mant.vehiculoId)} — {formatDate(mant.fecha_mantenimiento)}
              </span>
            </div>
            <span className="maintenance-item__cost">{formatCurrency(mant.costo)}</span>
          </div>
        ))
      )}
    </div>
  )
}
