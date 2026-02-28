import React from 'react'

export interface StatsCardProps {
  title: string;
  value: string;
}
export const StatsCard = ({title, value} : StatsCardProps) => {
  return (
    <div className="card stats-card">
      <div className="stats-value">{value}</div>
      <div className="stats-title">{title}</div>
    </div>
)

}
