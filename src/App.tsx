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
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-emerald-500/30">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-5 space-y-4">
        {/* 1. Top Real-Time Evacuation HUD */}
        <RouteHUD />

        {/* 2. Main Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
          {/* Left Column: Interactive Map Canvas (7 cols on Desktop) */}
          <div className="lg:col-span-7 space-y-4">
            <MapCanvas
              interactionMode={interactionMode}
              setInteractionMode={setInteractionMode}
              walkthroughNodeId={walkthroughNodeId}
            />
            {/* Walkthrough Player beneath the map */}
            <RouteWalkthrough onStepChange={setWalkthroughNodeId} />
            {/* Alternative Routes beneath the walkthrough */}
            <AlternativeRoutes />
          </div>

          {/* Right Column: Tactical Controls & Official Test Runner (5 cols on Desktop) */}
          <div className="lg:col-span-5 space-y-4">
            {/* Start Node Selector, Hazard Checklists & Scenario Presets */}
            <TacticalControls />

            {/* Official Judge Automated Verification Runner */}
            <JudgeTestRunner />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-slate-900 bg-slate-950/80 py-4 px-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div>
            <strong>Smart Escape</strong> • Built for AI DevFest 2026 AI Vibe-Coding Contest (Solo)
          </div>
          <div className="font-mono text-[11px] text-slate-400">
            Active Dataset: {buildingData.building}
          </div>
          <div>
            Released under <a href="./LICENSE" className="text-slate-400 hover:underline">MIT License</a>
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
