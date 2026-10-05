// ==============================================================================
// RouteHUD: Real-Time Tactical Status Banner & Evacuation Telemetry
// ==============================================================================

import React from 'react';
import { useSimulation } from '../../context/SimulationContext';
import { ShieldAlert, CheckCircle2, XCircle, ArrowRight, RotateCcw, Flame } from 'lucide-react';

export const RouteHUD: React.FC = () => {
  const {
    routeResult,
    startNodeId,
    buildingData,
    blockedNodes,
    blockedEdges,
    closedExits,
    resetToInitialState,
    t,
  } = useSimulation();

  const totalHazards = blockedNodes.size + blockedEdges.size + closedExits.size;
  const startNode = buildingData.nodes.find((n) => n.id === startNodeId);

  // Status Styling
  const isOptimal = routeResult.status === 'OPTIMAL_ROUTE_FOUND';
  const isStartBlocked = routeResult.status === 'START_LOCATION_BLOCKED';
  const isNoRoute = routeResult.status === 'NO_ROUTE_AVAILABLE';

  const statusVariant = isOptimal ? 'success' : isStartBlocked ? 'warning' : 'danger';

  return (
    <div className="route-hud-card">
      {/* 1. Main Status Banner with Official String */}
      <div className="hud-top-bar">
        <div className="hud-status-group">
          <div className={`hud-status-icon ${statusVariant}`}>
            {isOptimal && <CheckCircle2 size={26} />}
            {isStartBlocked && <ShieldAlert size={26} />}
            {isNoRoute && <XCircle size={26} />}
          </div>

          <div>
            <div className="hud-title-text">{t.evacuationRoute}</div>
            <div id="official-status-string" className={`hud-official-string ${statusVariant}`}>
              {routeResult.statusString}
            </div>
          </div>
        </div>

        {/* Action Controls: Metrics & Reset */}
        <div className="hud-metrics-row">
          {isOptimal && (
            <div className="metric-pill">
              <span>{t.targetExit}: <strong>{routeResult.exitId}</strong></span>
              <span style={{ color: 'var(--border-medium)' }}>|</span>
              <span>{t.totalCost}: <strong>{routeResult.totalCost}</strong></span>
            </div>
          )}

          <button
            type="button"
            onClick={resetToInitialState}
            className="tactical-btn tactical-btn-danger"
            title={t.resetTooltip}
          >
            <RotateCcw size={14} />
            <span>{t.resetButton}</span>
          </button>
        </div>
      </div>

      {/* 2. Step-by-Step Path Sequence Visual Breadcrumbs */}
      {isOptimal && routeResult.path.length > 0 && (
        <div className="path-chain-container">
          <span className="path-chain-label">Path Chain:</span>
          {routeResult.path.map((nodeId, idx) => {
            const node = buildingData.nodes.find((n) => n.id === nodeId);
            const isDestination = idx === routeResult.path.length - 1;
            const isStart = idx === 0;

            return (
              <React.Fragment key={`${nodeId}-${idx}`}>
                <div
                  className={`path-node-pill ${isDestination ? 'is-exit' : isStart ? 'is-start' : ''}`}
                  title={`${node?.label || nodeId} (${node?.type})`}
                >
                  <span>{nodeId}</span>
                  {node?.label && <span className="path-node-sub">({node.label})</span>}
                </div>
                {!isDestination && (
                  <ArrowRight size={14} className="path-arrow-divider" />
                )}
              </React.Fragment>
            );
          })}
        </div>
      )}

      {/* 3. Facility Telemetry Footer Strip */}
      <div className="hud-telemetry-bar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <span>
            {t.startLocation}:{' '}
            <strong style={{ color: 'var(--color-amber)', fontFamily: 'var(--font-mono)' }}>
              {startNode?.label || startNodeId} ({startNodeId})
            </strong>
          </span>
          <span style={{ color: 'var(--text-muted)' }}>•</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
            <Flame size={14} style={{ color: 'var(--color-crimson)' }} />
            {t.activeHazardsCount}:{' '}
            <strong style={{ color: 'var(--color-crimson)', fontFamily: 'var(--font-mono)' }}>
              {totalHazards}
            </strong>
          </span>
        </div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--text-muted)' }}>
          Engine: Dijkstra / Uniform Cost Search (Offline Client)
        </div>
      </div>
    </div>
  );
};
