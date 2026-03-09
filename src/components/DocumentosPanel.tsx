import { Link } from 'react-router-dom'
import type { Documento, Vehiculo } from '../types'
import { TipoDocumentoLabels } from '../types'
import './DocumentosPanel.css'

interface DocumentosPanelProps {
  documentos: Documento[]
  vehiculo: Vehiculo
  onDelete?: (id: number) => void
}

export const DocumentosPanel = ({ documentos, vehiculo, onDelete }: DocumentosPanelProps) => {
  if (documentos.length === 0) {
    return (
      <div className="empty-state card">
        <div className="empty-state__icon">📄</div>
        <h3>No hay documentos</h3>
        <p>Aún no has agregado ningún documento para este vehículo.</p>
        <Link to={`/documentos/nuevo?vehiculoId=${vehiculo.id}`} className="btn btn-primary mt-4">
          + Agregar Documento
        </Link>
      </div>
    )
  }

  // Helper to determine the status of the document based on the expiration date
  const getDocumentStatus = (fechaExpiro: string) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    // Add timezone offset to prevent day shifting
    const expDate = new Date(fechaExpiro)
    expDate.setMinutes(expDate.getMinutes() + expDate.getTimezoneOffset())
    expDate.setHours(0, 0, 0, 0)
    
    const diffTime = expDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays < 0) {
      return { label: 'Vencido', className: 'badge-danger', isExpired: true, daysLeft: diffDays }
    } else if (diffDays <= 30) {
      return { label: `Vence en ${diffDays} días`, className: 'badge-warning', isExpired: false, daysLeft: diffDays }
    } else {
      return { label: 'Vigente', className: 'badge-success', isExpired: false, daysLeft: diffDays }
    }
  }

  return (
    <div className="documentos-panel">
      <div className="documentos-panel__header">
        <h3 className="section-title">Documentación</h3>
        <Link to={`/documentos/nuevo?vehiculoId=${vehiculo.id}`} className="btn btn-primary btn-sm">
          + Nuevo
        </Link>
      </div>

      <div className="documentos-grid">
        {documentos.map(doc => {
          const status = getDocumentStatus(doc.fecha_expiro)
          
          return (
            <div key={doc.id} className={`card doc-card ${status.isExpired ? 'doc-card--expired' : ''}`}>
              <div className="doc-card__header">
                <div className="doc-card__icon">
                  {doc.tipoDocumento === 'SEGURO' ? '🛡️' : doc.tipoDocumento === 'VTV' || doc.tipoDocumento === 'RTO' ? '✓' : '📄'}
                </div>
                <div className="doc-card__title-area">
                  <h4 className="doc-card__title">{TipoDocumentoLabels[doc.tipoDocumento]}</h4>
                  <span className={`badge ${status.className}`}>
                    {status.label}
                  </span>
                </div>
              </div>

              <div className="doc-card__body">
                <div className="doc-card__detail">
                  <span className="doc-label">Vencimiento:</span>
                  <span className={`doc-value ${status.isExpired ? 'text-danger' : ''}`}>
                    {new Date(doc.fecha_expiro + 'T12:00:00Z').toLocaleDateString('es-AR')}
                  </span>
                </div>
                {doc.notas && (
                  <div className="doc-card__detail doc-card__notes">
                    <span className="doc-label">Notas:</span>
                    <span className="doc-value">{doc.notas}</span>
                  </div>
                )}
                {doc.url_foto && (
                  <div className="doc-card__attachment">
                    <a href={doc.url_foto} target="_blank" rel="noopener noreferrer" className="btn btn-ghost btn-sm">
                      📎 Ver adjunto
                    </a>
                  </div>
                )}
              </div>

              <div className="doc-card__actions">
                <Link to={`/documentos/editar/${doc.id}`} className="btn btn-outline btn-sm ms-auto">
                  Editar
                </Link>
                {onDelete && (
                  <button 
                    className="btn btn-ghost btn-sm text-danger" 
                    onClick={() => onDelete(doc.id)}
                  >
                    Eliminar
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
