import React from 'react'

export const AlertsPanel = () => {
  return (
    <div className="card">
      <h3>Alertas y Recordatorios</h3>

      <div className="alert warning">
        Próximo cambio de aceite
      </div>

      <div className="alert danger">
        VTV vencida
      </div>
    </div>
  )
}
