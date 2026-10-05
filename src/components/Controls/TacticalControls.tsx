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
    <div className="controls-card">
      {/* 1. Start Location Picker */}
      <div>
        <label className="field-label" htmlFor="start-location-select">
          <Crosshair size={15} style={{ color: 'var(--color-amber)' }} />
          <span>{t.startLocation}</span>
        </label>
        <select
          id="start-location-select"
          value={startNodeId}
          onChange={(e) => setStartNodeId(e.target.value)}
          className="tactical-select"
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
        <div className="field-helper">{t.selectStartPrompt}</div>
      </div>

      {/* 2. Tactical Navigation Tabs */}
      <div className="tactical-tabs-bar">
        <button
          type="button"
          onClick={() => setActiveTab('presets')}
          className={`tab-nav-btn ${activeTab === 'presets' ? 'active' : ''}`}
        >
          <Sparkles size={14} />
          <span>{t.quickScenarios}</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('hazards')}
          className={`tab-nav-btn ${activeTab === 'hazards' ? 'active' : ''}`}
        >
          <AlertTriangle size={14} />
          <span>
            {t.hazardsTitle} ({blockedNodes.size + blockedEdges.size + closedExits.size})
          </span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('import')}
          className={`tab-nav-btn ${activeTab === 'import' ? 'active' : ''}`}
        >
          <Upload size={14} />
          <span>{t.uploadCustomJson}</span>
        </button>
      </div>

      {/* Tab 1: Section 4.1 Quick Scenarios */}
      {activeTab === 'presets' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
            One-click scenarios to verify Problem Statement Section 4.1:
          </div>
          <div className="preset-grid">
            <button
              type="button"
              onClick={() => applyPresetScenario('baseline')}
              className="preset-scenario-btn"
            >
              <CheckCircle size={15} style={{ color: 'var(--color-emerald)', flexShrink: 0 }} />
              <span>{t.scenarioBaseline}</span>
            </button>
            <button
              type="button"
              onClick={() => applyPresetScenario('blocked_c2')}
              className="preset-scenario-btn"
            >
              <AlertTriangle size={15} style={{ color: 'var(--color-amber)', flexShrink: 0 }} />
              <span>{t.scenarioBlockedJunction}</span>
            </button>
            <button
              type="button"
              onClick={() => applyPresetScenario('closed_exits')}
              className="preset-scenario-btn"
            >
              <AlertTriangle size={15} style={{ color: 'var(--color-crimson)', flexShrink: 0 }} />
              <span>{t.scenarioExitsClosed}</span>
            </button>
            <button
              type="button"
              onClick={() => applyPresetScenario('start_r2')}
              className="preset-scenario-btn"
            >
              <Crosshair size={15} style={{ color: 'var(--color-blue)', flexShrink: 0 }} />
              <span>{t.scenarioDifferentStart}</span>
            </button>
            <button
              type="button"
              onClick={() => applyPresetScenario('blocked_r1')}
              className="preset-scenario-btn col-span-full"
            >
              <AlertTriangle size={15} style={{ color: 'var(--color-crimson)', flexShrink: 0 }} />
              <span>{t.scenarioBlockedStart}</span>
            </button>
          </div>
        </div>
      )}

      {/* Tab 2: Hazard Checklist */}
      {activeTab === 'hazards' && (
        <div className="hazard-chips-wrapper">
          {/* Rooms and Junctions */}
          <div>
            <div className="hazard-group-title">Rooms & Junctions (Click to Block/Unblock)</div>
            <div className="hazard-chips-row">
              {candidateStarts.map((n) => {
                const isBlocked = blockedNodes.has(n.id);
                return (
                  <button
                    key={n.id}
                    type="button"
                    onClick={() => toggleNodeHazard(n.id)}
                    className={`chip-btn ${isBlocked ? 'blocked' : ''}`}
                  >
                    {isBlocked ? '✕ ' : ''}
                    {n.id}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Emergency Exits */}
          <div>
            <div className="hazard-group-title">Emergency Exits (Click to Close/Reopen)</div>
            <div className="hazard-chips-row">
              {buildingData.nodes
                .filter((n) => n.type === 'exit')
                .map((n) => {
                  const isClosed = closedExits.has(n.id);
                  return (
                    <button
                      key={n.id}
                      type="button"
                      onClick={() => toggleExitClosed(n.id)}
                      className={`chip-btn ${isClosed ? 'closed-exit' : 'open-exit'}`}
                    >
                      {isClosed ? '🚫 Closed: ' : '🟢 Open: '}
                      {n.id}
                    </button>
                  );
                })}
            </div>
          </div>

          {/* Corridors */}
          <div>
            <div className="hazard-group-title">Corridors ({buildingData.edges.length})</div>
            <div className="hazard-chips-row">
              {buildingData.edges.map((e) => {
                const isBlocked = blockedEdges.has(e.id);
                return (
                  <button
                    key={e.id}
                    type="button"
                    onClick={() => toggleEdgeHazard(e.id)}
                    className={`chip-btn ${isBlocked ? 'blocked' : ''}`}
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

      {/* Tab 3: Custom JSON Import */}
      {activeTab === 'import' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
            Import any unseen building graph JSON. Schema validation is automatically enforced per Section 3.1.
          </div>
          <label className="file-dropzone">
            <Upload size={24} style={{ color: 'var(--color-primary)' }} />
            <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-white)' }}>
              Select .json building file
            </span>
            <span style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>
              2-60 nodes, 1-150 corridors
            </span>
            <input
              type="file"
              accept=".json"
              onChange={handleFileUpload}
              style={{ display: 'none' }}
            />
          </label>

          {uploadError && (
            <div style={{
              padding: '0.75rem',
              borderRadius: '8px',
              background: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid var(--color-crimson)',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.5rem',
              color: '#fca5a5',
              fontSize: '0.75rem'
            }}>
              <FileWarning size={16} style={{ color: 'var(--color-crimson)', flexShrink: 0, marginTop: 2 }} />
              <div style={{ fontFamily: 'var(--font-mono)', wordBreak: 'break-all' }}>{uploadError}</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
