import React from 'react'

export interface VehicleCardProps {
  name: string;
  year: string;
  plate: string;
  km: string;
}

export const VehicleCard = ({name, year, plate, km} : VehicleCardProps) => {
  return (
    <div className="card vehicle-card">
      <h3>{name}</h3>
      <p>{year}</p>
      <p>Patente: {plate}</p>
      <p>Kilometraje: {km}</p>

      <div className="badges">
        <span className="badge success">Seguro Activo</span>
        <span className="badge warning">VTV Próxima</span>
      </div>
    </div>
  )
}
