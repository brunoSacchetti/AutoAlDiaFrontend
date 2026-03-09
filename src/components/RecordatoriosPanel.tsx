import { Link } from 'react-router-dom'
import type { RecordatorioMantenimiento, Vehiculo } from '../types'
import { TipoServicioLabels, EstadoRecordatorio, EstadoRecordatorioLabels, TipoRecordatorio } from '../types'
import './RecordatoriosPanel.css'

interface RecordatoriosPanelProps {
  recordatorios: RecordatorioMantenimiento[]
  vehiculo: Vehiculo
  onStatusChange?: (id: number, newStatus: EstadoRecordatorio) => void
  onDelete?: (id: number) => void
}

export const RecordatoriosPanel = ({ recordatorios, vehiculo, onStatusChange, onDelete }: RecordatoriosPanelProps) => {
  if (recordatorios.length === 0) {
    return (
      <div className="empty-state card">
        <div className="empty-state__icon">📅</div>
        <h3>No hay recordatorios</h3>
        <p>Aún no hay recordatorios programados para este vehículo.</p>
        <Link to={`/recordatorios/nuevo?vehiculoId=${vehiculo.id}`} className="btn btn-primary mt-4">
          + Crear Recordatorio
        </Link>
      </div>
    )
  }

  // Helper para mostrar la condición de activación del recordatorio
  const renderCondicion = (rec: RecordatorioMantenimiento) => {
    const parts = []
    
    // Mostramos info basada en el tipo de recordatorio
    if (rec.tipoRecordatorio === TipoRecordatorio.BASADO_EN_KM || rec.tipoRecordatorio === TipoRecordatorio.AMBOS) {
      if (rec.recordatorio_km) {
        const kmFaltantes = rec.recordatorio_km - vehiculo.km_actual
        parts.push(
          <div key="km">
            <strong>A los {rec.recordatorio_km.toLocaleString('es-AR')} km</strong>
            <span className={`text-muted ms-2 px-2 rounded text-xs ${kmFaltantes <= 500 && kmFaltantes > 0 ? 'bg-warning-light text-warning' : kmFaltantes <= 0 ? 'bg-danger-light text-danger' : ''}`}>
              ({kmFaltantes > 0 ? `faltan ${kmFaltantes.toLocaleString('es-AR')} km` : `vencido por ${Math.abs(kmFaltantes).toLocaleString('es-AR')} km`})
            </span>
          </div>
        )
      }
    }
    
    if (rec.tipoRecordatorio === TipoRecordatorio.BASADO_EN_FECHA || rec.tipoRecordatorio === TipoRecordatorio.AMBOS) {
      if (rec.recordatorio_fecha) {
        // En un caso real se calcularía la diferencia en días
        parts.push(
          <div key="fecha">
            <strong>El {new Date(rec.recordatorio_fecha + 'T12:00:00Z').toLocaleDateString('es-AR')}</strong>
          </div>
        )
      }
    }
    
    return parts
  }

  return (
    <div className="recordatorios-panel">
      <div className="recordatorios-panel__header">
        <h3 className="section-title">Recordatorios Programados</h3>
        <Link to={`/recordatorios/nuevo?vehiculoId=${vehiculo.id}`} className="btn btn-primary btn-sm">
          + Nuevo
        </Link>
      </div>

      <div className="recordatorios-grid">
        {recordatorios.map(rec => (
          <div key={rec.id} className={`card rec-card border-left-${rec.estado.toLowerCase()}`}>
            <div className="rec-card__header">
              <div className="rec-card__icon">
                {rec.tipoServicio.includes('ACEITE') ? '🛢️' : rec.tipoServicio.includes('FRENO') ? '🛑' : rec.tipoServicio.includes('NEUMAT') ? '🛞' : '📅'}
              </div>
              <div className="rec-card__title-area">
                <h4 className="rec-card__title">{TipoServicioLabels[rec.tipoServicio]}</h4>
                <span className={`badge badge-${rec.estado === EstadoRecordatorio.COMPLETADO ? 'success' : rec.estado === EstadoRecordatorio.PENDIENTE ? 'warning' : 'default'}`}>
                  {EstadoRecordatorioLabels[rec.estado]}
                </span>
              </div>
            </div>

            <div className="rec-card__body">
              <div className="rec-card__condicion">
                {renderCondicion(rec)}
              </div>
            </div>

            <div className="rec-card__actions">
              {rec.estado === EstadoRecordatorio.PENDIENTE && onStatusChange && (
                <button 
                  className="btn btn-outline btn-smtext-success" 
                  onClick={() => onStatusChange(rec.id, EstadoRecordatorio.COMPLETADO)}
                >
                  ✓ Completar
                </button>
              )}
              {rec.estado === EstadoRecordatorio.PENDIENTE && onStatusChange && (
                <button 
                  className="btn btn-ghost btn-sm text-muted" 
                  onClick={() => onStatusChange(rec.id, EstadoRecordatorio.DESCARTADO)}
                >
                  ⨯ Descartar
                </button>
              )}
              
              <Link to={`/recordatorios/editar/${rec.id}`} className="btn btn-outline btn-sm ms-auto">
                Editar
              </Link>
              {onDelete && (
                <button 
                  className="btn btn-ghost btn-sm text-danger" 
                  onClick={() => onDelete(rec.id)}
                >
                  Eliminar
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
