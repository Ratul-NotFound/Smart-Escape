// ==============================================================================
// Smart Escape Main Application Component
// ==============================================================================

import React, { useState } from 'react';
import { SimulationProvider, useSimulation } from './context/SimulationContext';
import { Header } from './components/Header';
import { RouteHUD } from './components/HUD/RouteHUD';
import { MapCanvas } from './components/Map/MapCanvas';
import { TacticalControls } from './components/Controls/TacticalControls';
import { JudgeTestRunner } from './components/Judge/JudgeTestRunner';
import { RouteWalkthrough } from './components/Walkthrough/RouteWalkthrough';
import { AlternativeRoutes } from './components/AlternativeRoutes/AlternativeRoutes';

const DashboardContent: React.FC = () => {
  const [interactionMode, setInteractionMode] = useState<'select_start' | 'toggle_hazard'>('select_start');
  const [walkthroughNodeId, setWalkthroughNodeId] = useState<string | null>(null);
  const { buildingData } = useSimulation();

  return (
    <div className="app-shell">
      {/* 1. Master Header with Localization & Actions */}
      <Header />

      {/* 2. Main Center Container */}
      <main className="app-container">
        {/* Top Emergency Status Banner & Breadcrumbs */}
        <RouteHUD />

        {/* 2-Column Responsive Dashboard Layout */}
        <div className="dashboard-layout">
          {/* Left Column: Interactive Vector SVG Map & Walkthrough Player */}
          <div className="column-stack">
            <MapCanvas
              interactionMode={interactionMode}
              setInteractionMode={setInteractionMode}
              walkthroughNodeId={walkthroughNodeId}
            />
            {/* Walkthrough Player */}
            <RouteWalkthrough onStepChange={setWalkthroughNodeId} />
            {/* Alternative Routes Detour Analysis */}
            <AlternativeRoutes />
          </div>

          {/* Right Column: Tactical Controls, Presets & Judge Verification Runner */}
          <div className="column-stack">
            {/* Start Node Selector, Hazard Checklists & Quick Presets */}
            <TacticalControls />

            {/* Official Judge Automated Verification Runner */}
            <JudgeTestRunner />
          </div>
        </div>
      </main>

      {/* 3. Footer */}
      <footer className="app-footer">
        <div className="footer-inner">
          <div>
            <strong>Smart Escape</strong> • AI DevFest 2026 AI Vibe-Coding Contest (Solo)
          </div>
          <div style={{ fontFamily: 'var(--font-mono)' }}>
            Active Dataset: <strong style={{ color: 'var(--text-white)' }}>{buildingData.building}</strong>
          </div>
          <div>
            Released under <a href="./LICENSE" style={{ color: 'var(--text-primary)', textDecoration: 'underline' }}>MIT License</a>
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
