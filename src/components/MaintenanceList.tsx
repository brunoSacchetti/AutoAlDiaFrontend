import './MaintenanceList.css'

export const MaintenanceList = () => {
  return (
    <div className="card maintenance-list">
      <h3 className="maintenance-list__title">Últimos Mantenimientos</h3>

      <div className="maintenance-item">
        <div className="maintenance-item__info">
          <span className="maintenance-item__name">Cambio de aceite</span>
          <span className="maintenance-item__meta">Toyota Corolla — 12/02/2026</span>
        </div>
        <span className="maintenance-item__cost">$8.500</span>
      </div>

      <div className="maintenance-item">
        <div className="maintenance-item__info">
          <span className="maintenance-item__name">Cambio de filtro</span>
          <span className="maintenance-item__meta">Volkswagen Golf — 05/02/2026</span>
        </div>
        <span className="maintenance-item__cost">$4.200</span>
      </div>

      <div className="maintenance-item">
        <div className="maintenance-item__info">
          <span className="maintenance-item__name">Alineación y balanceo</span>
          <span className="maintenance-item__meta">Ford Focus — 28/01/2026</span>
        </div>
        <span className="maintenance-item__cost">$6.800</span>
      </div>
    </div>
  )
}
