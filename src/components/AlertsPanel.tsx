import './AlertsPanel.css'

export const AlertsPanel = () => {
  return (
    <div className="card alerts-panel">
      <h3 className="alerts-panel__title">Alertas y Recordatorios</h3>

      <div className="alert-item alert-item--warning">
        <div className="alert-item__icon">⚠️</div>
        <div className="alert-item__content">
          <span className="alert-item__text">Próximo cambio de aceite</span>
          <span className="alert-item__meta">Toyota Corolla — en 500 km</span>
        </div>
      </div>

      <div className="alert-item alert-item--danger">
        <div className="alert-item__icon">🔴</div>
        <div className="alert-item__content">
          <span className="alert-item__text">VTV vencida</span>
          <span className="alert-item__meta">Volkswagen Golf — venció hace 15 días</span>
        </div>
      </div>

      <div className="alert-item alert-item--info">
        <div className="alert-item__icon">📋</div>
        <div className="alert-item__content">
          <span className="alert-item__text">Seguro próximo a vencer</span>
          <span className="alert-item__meta">Ford Focus — vence en 20 días</span>
        </div>
      </div>
    </div>
  )
}
