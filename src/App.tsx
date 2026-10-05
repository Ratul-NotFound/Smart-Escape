// ==============================================================================
// Smart Escape Main Application Component
// High-Precision Architectural Evacuation Studio Dashboard
// ==============================================================================

import React, { useState } from 'react';
import { SimulationProvider, useSimulation } from './context/SimulationContext';
import { Header } from './components/Header';
import { RouteHUD } from './components/HUD/RouteHUD';
import { MapCanvas } from './components/Map/MapCanvas';
import { OperationsConsole } from './components/Console/OperationsConsole';
import { RouteWalkthrough } from './components/Walkthrough/RouteWalkthrough';
import { AlternativeRoutes } from './components/AlternativeRoutes/AlternativeRoutes';

const DashboardContent: React.FC = () => {
  const [interactionMode, setInteractionMode] = useState<'select_start' | 'toggle_hazard'>('select_start');
  const [walkthroughNodeId, setWalkthroughNodeId] = useState<string | null>(null);
  const { buildingData } = useSimulation();

  return (
    <div className="app-shell">
      {/* 1. Master Header with Localization & Top-Level Tactical Actions */}
      <Header />

      {/* 2. Main Center Workstation Container */}
      <main className="app-container">
        {/* Real-Time Egress Status Telemetry Ribbon */}
        <RouteHUD />

        {/* 2-Column Responsive Dashboard Layout */}
        <div className="dashboard-layout">
          {/* Left Column: Interactive Vector SVG Floorplan Stage & Telemetry Dock */}
          <div className="canvas-column-stage">
            <MapCanvas
              interactionMode={interactionMode}
              setInteractionMode={setInteractionMode}
              walkthroughNodeId={walkthroughNodeId}
            />

            {/* Bottom Telemetry Dock: Walkthrough Simulation Player & Detour Routes */}
            <div className="telemetry-dock-row">
              <RouteWalkthrough onStepChange={setWalkthroughNodeId} />
              <AlternativeRoutes />
            </div>
          </div>

          {/* Right Column: Unified Tactical Operations Console (Judge Suite, Hazards, Presets) */}
          <div className="console-column-panel">
            <OperationsConsole />
          </div>
        </div>
      </main>

      {/* 3. Streamlined Footer */}
      <footer className="app-footer">
        <div className="footer-inner">
          <div>
            <strong>Smart Escape</strong> • AI DevFest 2026 AI Vibe-Coding Contest (Solo)
          </div>
          <div style={{ fontFamily: 'var(--font-mono)' }}>
            Dataset: <strong style={{ color: 'var(--text-white)' }}>{buildingData.building}</strong>
          </div>
          <div>
            Released under <a href="./LICENSE" style={{ color: 'var(--color-primary)', textDecoration: 'underline' }}>MIT License</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export function App() {
  return (
    <SimulationProvider>
      <DashboardContent />
    </SimulationProvider>
  );
}

export default App;
