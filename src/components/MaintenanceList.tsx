import React from 'react'

export const MaintenanceList = () => {
  return (
    <div className="card">
      <h3>Últimos Mantenimientos</h3>

      <div className="maintenance-item">
        <span>Cambio de aceite</span>
        <span>$8500</span>
      </div>

      <div className="maintenance-item">
        <span>Cambio de filtro</span>
        <span>$4200</span>
      </div>
    </div>
  )
}
