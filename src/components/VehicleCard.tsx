import './VehicleCard.css'

export interface VehicleCardProps {
  name: string;
  year: string;
  plate: string;
  km: string;
}

export const VehicleCard = ({ name, year, plate, km }: VehicleCardProps) => {
  return (
    <div className="vehicle-card card card-interactive">
      <div className="vehicle-card__header">
        <div className="vehicle-card__avatar">🚗</div>
        <div className="vehicle-card__info">
          <h3 className="vehicle-card__name">{name}</h3>
          <span className="vehicle-card__year">{year}</span>
        </div>
      </div>

      <div className="vehicle-card__details">
        <div className="vehicle-card__detail">
          <span className="vehicle-card__detail-label">Patente</span>
          <span className="vehicle-card__detail-value">{plate}</span>
        </div>
        <div className="vehicle-card__detail">
          <span className="vehicle-card__detail-label">Kilometraje</span>
          <span className="vehicle-card__detail-value">{km}</span>
        </div>
      </div>

      <div className="vehicle-card__badges">
        <span className="badge badge-success">Seguro Activo</span>
        <span className="badge badge-warning">VTV Próxima</span>
      </div>
    </div>
  )
}
