import React from 'react'
import { AlertsPanel } from '../../components/AlertsPanel'
import { MaintenanceList } from '../../components/MaintenanceList'
import { VehicleCard } from '../../components/VehicleCard'
import { StatsCard } from '../../components/StatsCard'
import { Navbar } from '../../components/Navbar'
import './Dashboard.css'

export const Dashboard = () => {
  return (
    <div className="app">
      <Navbar />

      <div className="container">
        <div className="page-header">
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">
            Resumen del estado de tus vehículos y mantenimientos
          </p>
        </div>

        <div className="stats-grid">
          <StatsCard title="Vehículos" value="3" />
          <StatsCard title="Mantenimientos" value="8" />
          <StatsCard title="Alertas Activas" value="4" />
          <StatsCard title="Gasto Total" value="$126.200" />
        </div>

        <div className="main-grid">
          <div className="vehicles-section">
            <h2>Mis Vehículos</h2>
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
          </div>

          <div className="sidebar">
            <AlertsPanel />
            <MaintenanceList />
          </div>
        </div>
      </div>
    </div>
  )
}
