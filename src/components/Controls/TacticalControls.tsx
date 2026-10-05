// ==============================================================================
// TacticalControls: Start Selector, Hazard Management & Preset Scenarios
// ==============================================================================

import React, { useState } from 'react';
import { useSimulation } from '../../context/SimulationContext';
import { validateBuildingData } from '../../domain/validator';
import {
  Crosshair,
  AlertTriangle,
  Upload,
  CheckCircle,
  FileWarning,
  Sparkles,
} from 'lucide-react';

export const TacticalControls: React.FC = () => {
  const {
    buildingData,
    startNodeId,
    blockedNodes,
    blockedEdges,
    closedExits,
    setStartNodeId,
    toggleNodeHazard,
    toggleEdgeHazard,
    toggleExitClosed,
    loadBuildingData,
    applyPresetScenario,
    t,
  } = useSimulation();

  const [uploadError, setUploadError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'presets' | 'hazards' | 'import'>('presets');

  // Candidate start locations (rooms and junctions)
  const candidateStarts = buildingData.nodes.filter(
    (n) => n.type === 'room' || n.type === 'junction'
  );

  // File Upload Handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        const validation = validateBuildingData(parsed);

        if (!validation.valid) {
          setUploadError(`Invalid JSON: ${validation.errors.join(' | ')}`);
          return;
        }

        loadBuildingData(parsed);
      } catch (err: unknown) {
        const errorMsg = err instanceof Error ? err.message : 'Unknown JSON syntax error';
        setUploadError(`Failed to parse JSON: ${errorMsg}`);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="w-full glass-panel border border-slate-700/60 p-4 rounded-xl shadow-xl space-y-4">
      {/* 1. Start Location Picker */}
      <div className="space-y-1.5">
        <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-300 uppercase tracking-wider">
          <Crosshair className="w-4 h-4 text-amber-400" />
          <span>{t.startLocation}</span>
        </label>
        <select
          id="start-location-select"
          value={startNodeId}
          onChange={(e) => setStartNodeId(e.target.value)}
          className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 font-mono focus:outline-none focus:border-amber-400"
        >
          {candidateStarts.map((node) => {
            const isBlocked = blockedNodes.has(node.id);
            return (
              <option key={node.id} value={node.id}>
                {node.id} — {node.label} ({node.type}) {isBlocked ? '⚠️ [BLOCKED]' : ''}
              </option>
            );
          })}
        </select>
        <div className="text-[11px] text-slate-400">{t.selectStartPrompt}</div>
      </div>

      {/* 2. Navigation Tabs */}
      <div className="flex border-b border-slate-800 text-xs font-medium">
        <button
          type="button"
          onClick={() => setActiveTab('presets')}
          className={`flex items-center gap-1.5 py-2 px-3 border-b-2 transition-all ${
            activeTab === 'presets'
              ? 'border-emerald-500 text-emerald-400 font-semibold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>{t.quickScenarios}</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('hazards')}
          className={`flex items-center gap-1.5 py-2 px-3 border-b-2 transition-all ${
            activeTab === 'hazards'
              ? 'border-red-500 text-red-400 font-semibold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>
            {t.hazardsTitle} ({blockedNodes.size + blockedEdges.size + closedExits.size})
          </span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('import')}
          className={`flex items-center gap-1.5 py-2 px-3 border-b-2 transition-all ${
            activeTab === 'import'
              ? 'border-cyan-500 text-cyan-400 font-semibold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Upload className="w-3.5 h-3.5" />
          <span>{t.uploadCustomJson}</span>
        </button>
      </div>

      {/* Tab 1: Section 4.1 Quick Scenarios */}
      {activeTab === 'presets' && (
        <div className="space-y-2">
          <div className="text-xs text-slate-400">
            One-click scenarios to verify Problem Statement Section 4.1:
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <button
              type="button"
              onClick={() => applyPresetScenario('baseline')}
              className="btn-tactical text-left justify-start py-2 px-2.5 bg-slate-900/80 hover:bg-slate-800"
            >
              <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>{t.scenarioBaseline}</span>
            </button>
            <button
              type="button"
              onClick={() => applyPresetScenario('blocked_c2')}
              className="btn-tactical text-left justify-start py-2 px-2.5 bg-slate-900/80 hover:bg-slate-800"
            >
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>{t.scenarioBlockedJunction}</span>
            </button>
            <button
              type="button"
              onClick={() => applyPresetScenario('closed_exits')}
              className="btn-tactical text-left justify-start py-2 px-2.5 bg-slate-900/80 hover:bg-slate-800"
            >
              <AlertTriangle className="w-3.5 h-3.5 text-red-400 shrink-0" />
              <span>{t.scenarioExitsClosed}</span>
            </button>
            <button
              type="button"
              onClick={() => applyPresetScenario('start_r2')}
              className="btn-tactical text-left justify-start py-2 px-2.5 bg-slate-900/80 hover:bg-slate-800"
            >
              <Crosshair className="w-3.5 h-3.5 text-blue-400 shrink-0" />
              <span>{t.scenarioDifferentStart}</span>
            </button>
            <button
              type="button"
              onClick={() => applyPresetScenario('blocked_r1')}
              className="btn-tactical text-left justify-start py-2 px-2.5 bg-slate-900/80 hover:bg-slate-800 sm:col-span-2"
            >
              <AlertTriangle className="w-3.5 h-3.5 text-red-500 shrink-0" />
              <span>{t.scenarioBlockedStart}</span>
            </button>
          </div>
        </div>
      )}

      {/* Tab 2: Detailed Hazard Toggles Checklist */}
      {activeTab === 'hazards' && (
        <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
          {/* Node Hazards */}
          <div>
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
              Rooms & Junctions
            </div>
            <div className="flex flex-wrap gap-1.5">
              {candidateStarts.map((n) => {
                const isBlocked = blockedNodes.has(n.id);
                return (
                  <button
                    key={n.id}
                    type="button"
                    onClick={() => toggleNodeHazard(n.id)}
                    className={`px-2 py-1 text-xs font-mono rounded border transition-all ${
                      isBlocked
                        ? 'bg-red-500/20 text-red-300 border-red-500 font-bold'
                        : 'bg-slate-900 text-slate-300 border-slate-700 hover:border-slate-500'
                    }`}
                  >
                    {isBlocked ? '✕ ' : ''}
                    {n.id}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Exit Hazards */}
          <div>
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
              Emergency Exits
            </div>
            <div className="flex flex-wrap gap-1.5">
              {buildingData.nodes
                .filter((n) => n.type === 'exit')
                .map((n) => {
                  const isClosed = closedExits.has(n.id);
                  return (
                    <button
                      key={n.id}
                      type="button"
                      onClick={() => toggleExitClosed(n.id)}
                      className={`px-2.5 py-1 text-xs font-mono rounded border transition-all ${
                        isClosed
                          ? 'bg-red-500/20 text-red-300 border-red-500 font-bold'
                          : 'bg-emerald-500/20 text-emerald-300 border-emerald-500 hover:bg-emerald-500/30'
                      }`}
                    >
                      {isClosed ? '🚫 Closed: ' : '🟢 Open: '}
                      {n.id}
                    </button>
                  );
                })}
            </div>
          </div>

          {/* Corridor Hazards */}
          <div>
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
              Corridors ({buildingData.edges.length})
            </div>
            <div className="flex flex-wrap gap-1.5">
              {buildingData.edges.map((e) => {
                const isBlocked = blockedEdges.has(e.id);
                return (
                  <button
                    key={e.id}
                    type="button"
                    onClick={() => toggleEdgeHazard(e.id)}
                    className={`px-2 py-1 text-xs font-mono rounded border transition-all ${
                      isBlocked
                        ? 'bg-red-500/20 text-red-300 border-red-500 font-bold'
                        : 'bg-slate-900 text-slate-300 border-slate-700 hover:border-slate-500'
                    }`}
                  >
                    {isBlocked ? '✕ ' : ''}
                    {e.id} ({e.from}-{e.to})
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Import Custom JSON */}
      {activeTab === 'import' && (
        <div className="space-y-2">
          <div className="text-xs text-slate-400">
            Import any unseen building graph JSON. Schema validation is automatically enforced per Section 3.1.
          </div>
          <label className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-slate-700 hover:border-cyan-500 rounded-lg cursor-pointer bg-slate-900/60 transition-all">
            <Upload className="w-6 h-6 text-cyan-400 mb-1" />
            <span className="text-xs font-medium text-slate-200">Select .json building file</span>
            <span className="text-[10px] text-slate-500 mt-0.5">2-60 nodes, 1-150 corridors</span>
            <input
              type="file"
              accept=".json"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>

          {uploadError && (
            <div className="p-3 bg-red-950/60 border border-red-500/50 rounded-lg text-xs text-red-300 flex items-start gap-2">
              <FileWarning className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <div className="font-mono text-[11px] break-all">{uploadError}</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
