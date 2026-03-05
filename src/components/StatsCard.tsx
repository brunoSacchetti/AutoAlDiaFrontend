import './StatsCard.css'

export interface StatsCardProps {
  title: string;
  value: string;
  icon?: string;
  color?: 'primary' | 'accent' | 'success' | 'warning' | 'danger';
}

export const StatsCard = ({ title, value, icon, color = 'primary' }: StatsCardProps) => {
  return (
    <div className={`stats-card card card-interactive stats-card--${color}`}>
      <div className="stats-card__header">
        {icon && <span className="stats-card__icon">{icon}</span>}
      </div>
      <div className="stats-card__value">{value}</div>
      <div className="stats-card__title">{title}</div>
    </div>
  )
}
