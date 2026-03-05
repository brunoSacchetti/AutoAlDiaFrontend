import type { RecordatorioMantenimiento, Vehiculo } from '../types'
import { TipoRecordatorioLabels, EstadoRecordatorio } from '../types'
import './AlertsPanel.css'

interface AlertsPanelProps {
  recordatorios?: RecordatorioMantenimiento[]
  vehiculos?: Vehiculo[]
}

export const AlertsPanel = ({ recordatorios = [], vehiculos = [] }: AlertsPanelProps) => {

  const getVehicleName = (vehiculoId: number) => {
    const v = vehiculos.find(v => v.id === vehiculoId)
    return v ? `${v.marca} ${v.modelo}` : 'Vehículo desconocido'
  }

  // Helper to determine the alert color/icon based on the reminder type or status
  const getAlertStyle = (recordatorio: RecordatorioMantenimiento) => {
    // Just as an example, if it's based on date and close, maybe warning.
    // Real logic would compare km_actual vs recordatorio_km, etc.
    // For now we just use warning for pending, success for completed
    if (recordatorio.estado === EstadoRecordatorio.COMPLETADO) {
      return { className: 'alert-item--success', icon: '✅' }
    }
    if (recordatorio.estado === EstadoRecordatorio.DESCARTADO) {
      return { className: 'alert-item--info', icon: 'ℹ️' }
    }
    
    // Default for pending: WARNING. Could be DANGER if overdue.
    return { className: 'alert-item--warning', icon: '⚠️' }
  }

  return (
    <div className="card alerts-panel">
      <h3 className="alerts-panel__title">Alertas y Recordatorios</h3>

      {recordatorios.length === 0 ? (
        <p style={{ color: 'var(--text-tertiary)', fontSize: 'var(--font-size-sm)' }}>
          No tenés alertas activas.
        </p>
      ) : (
        recordatorios.map(rec => {
          const style = getAlertStyle(rec)
          const metaText = rec.recordatorio_fecha 
            ? `${getVehicleName(rec.vehiculoId)} — Vence: ${rec.recordatorio_fecha}`
            : `${getVehicleName(rec.vehiculoId)} — a los ${rec.recordatorio_km?.toLocaleString('es-AR')} km`

          return (
            <div key={rec.id} className={`alert-item ${style.className}`}>
              <div className="alert-item__icon">{style.icon}</div>
              <div className="alert-item__content">
                <span className="alert-item__text">{TipoRecordatorioLabels[rec.tipoRecordatorio]}</span>
                <span className="alert-item__meta">{metaText}</span>
              </div>
            </div>
          )
        })
      )}
    </div>
  )
}
