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

  return (
    <div className="w-full glass-panel border border-slate-700/60 p-4 rounded-xl shadow-xl space-y-3">
      {/* 1. Main Status Banner with Exact Strings */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          {isOptimal && (
            <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          )}
          {isStartBlocked && (
            <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <ShieldAlert className="w-5 h-5" />
            </div>
          )}
          {isNoRoute && (
            <div className="p-2 rounded-lg bg-red-500/20 text-red-400 border border-red-500/30">
              <XCircle className="w-5 h-5" />
            </div>
          )}

          <div>
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              {t.evacuationRoute}
            </div>
            {/* The exact official string required by the judges */}
            <div
              id="official-status-string"
              className={`text-lg md:text-xl font-bold font-mono tracking-tight ${
                isOptimal ? 'text-emerald-400' : isStartBlocked ? 'text-amber-400' : 'text-red-400'
              }`}
            >
              {routeResult.statusString}
            </div>
          </div>
        </div>

        {/* Action Controls: Reset & Quick Telemetry */}
        <div className="flex items-center gap-2">
          {isOptimal && (
            <div className="hidden sm:flex items-center gap-3 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono">
              <span className="text-slate-400">
                {t.targetExit}: <strong className="text-emerald-400">{routeResult.exitId}</strong>
              </span>
              <span className="text-slate-600">|</span>
              <span className="text-slate-400">
                {t.totalCost}: <strong className="text-emerald-400">{routeResult.totalCost}</strong>
              </span>
            </div>
          )}

          <button
            type="button"
            onClick={resetToInitialState}
            className="btn-tactical btn-tactical-danger text-xs font-semibold py-1.5 px-3"
            title={t.resetTooltip}
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{t.resetButton}</span>
          </button>
        </div>
      </div>

      {/* 2. Step-by-Step Path Sequence Visual Breadcrumbs */}
      {isOptimal && routeResult.path.length > 0 && (
        <div className="pt-2 border-t border-slate-800/80 flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mr-1">
            Path Chain:
          </span>
          {routeResult.path.map((nodeId, idx) => {
            const node = buildingData.nodes.find((n) => n.id === nodeId);
            const isDestination = idx === routeResult.path.length - 1;
            const isStart = idx === 0;

            return (
              <React.Fragment key={`${nodeId}-${idx}`}>
                <div
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-mono font-semibold border ${
                    isDestination
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-sm'
                      : isStart
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-sm'
                      : 'bg-slate-800/80 text-slate-200 border-slate-700'
                  }`}
                  title={`${node?.label || nodeId} (${node?.type})`}
                >
                  <span>{nodeId}</span>
                  <span className="text-[10px] text-slate-400 font-normal">
                    {node?.label ? `(${node.label})` : ''}
                  </span>
                </div>
                {!isDestination && (
                  <ArrowRight className="w-3 h-3 text-emerald-500/60 shrink-0" />
                )}
              </React.Fragment>
            );
          })}
        </div>
      )}

      {/* 3. Facility Status Quick Strip */}
      <div className="flex flex-wrap items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800/50">
        <div className="flex items-center gap-3">
          <span>
            {t.startLocation}:{' '}
            <strong className="text-amber-400 font-mono">
              {startNode?.label || startNodeId} ({startNodeId})
            </strong>
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <Flame className="w-3.5 h-3.5 text-red-400" />
            {t.activeHazardsCount}:{' '}
            <strong className="text-red-400 font-mono">{totalHazards}</strong>
          </span>
        </div>
        <div className="text-[11px] text-slate-500 font-mono">
          Algorithm: Dijkstra / Uniform Cost Search (Offline Client)
        </div>
      </div>
    </div>
  );
};
