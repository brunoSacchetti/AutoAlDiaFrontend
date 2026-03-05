import { Navbar } from '../../components/Navbar'
import { VehicleCard } from '../../components/VehicleCard'
import { StatsCard } from '../../components/StatsCard'
import { AlertsPanel } from '../../components/AlertsPanel'
import { MaintenanceList } from '../../components/MaintenanceList'
import './Dashboard.css'

export const Dashboard = () => {
  return (
    <div className="app-layout">
      <Navbar />

      <main className="page">
        <div className="container">
          <div className="page-header animate-fade-in">
            <h1 className="page-title">Dashboard</h1>
            <p className="page-subtitle">
              Resumen del estado de tus vehículos y mantenimientos
            </p>
          </div>

          <div className="stats-grid animate-fade-in">
            <StatsCard title="Vehículos" value="3" icon="🚗" color="primary" />
            <StatsCard title="Mantenimientos" value="8" icon="🔧" color="accent" />
            <StatsCard title="Alertas Activas" value="4" icon="⚠️" color="warning" />
            <StatsCard title="Gasto Total" value="$126.200" icon="💰" color="success" />
          </div>

          <div className="dashboard-grid">
            <section className="vehicles-section animate-fade-in">
              <div className="section-header">
                <h2 className="section-title">Mis Vehículos</h2>
                <button className="btn btn-primary btn-sm">+ Agregar</button>
              </div>
              <div className="vehicles-grid">
                <VehicleCard
                  name="Toyota Corolla"
                  year="2020"
                  plate="ABC 123"
                  km="45.000 km"
                />
                <VehicleCard
                  name="Volkswagen Golf"
                  year="2019"
                  plate="XYZ 789"
                  km="62.000 km"
                />
                <VehicleCard
                  name="Ford Focus"
                  year="2021"
                  plate="DEF 456"
                  km="28.000 km"
                />
              </div>
            </section>

            <aside className="sidebar animate-fade-in">
              <AlertsPanel />
              <MaintenanceList />
            </aside>
          </div>
        </div>
      </main>
    </div>
  )
}
