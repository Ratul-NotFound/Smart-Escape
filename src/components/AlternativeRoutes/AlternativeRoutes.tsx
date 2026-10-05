// ==============================================================================
// AlternativeRoutes: Display Secondary Paths with Delta Cost (Section 4.2 Extension)
// ==============================================================================

import React from 'react';
import { useSimulation } from '../../context/SimulationContext';
import { GitBranch, ArrowRight } from 'lucide-react';

export const AlternativeRoutes: React.FC = () => {
  const { routeResult, t } = useSimulation();

  const altRoutes = routeResult.alternativeRoutes || [];

  if (routeResult.status !== 'OPTIMAL_ROUTE_FOUND' || altRoutes.length === 0) {
    return null;
  }

  return (
    <div className="w-full glass-panel border border-slate-700/60 p-4 rounded-xl shadow-xl space-y-2.5">
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <GitBranch className="w-4 h-4 text-purple-400" />
        <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
          {t.alternativeRoutesTitle}
        </h4>
      </div>

      <div className="space-y-2">
        {altRoutes.map((alt, idx) => (
          <div
            key={idx}
            className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
          >
            <div className="flex items-center gap-1.5 flex-wrap font-mono">
              <span className="text-purple-400 font-bold">Alt #{idx + 1}:</span>
              {alt.path.map((nodeId, nodeIdx) => (
                <React.Fragment key={nodeIdx}>
                  <span className="text-slate-200 font-semibold">{nodeId}</span>
                  {nodeIdx < alt.path.length - 1 && (
                    <ArrowRight className="w-3 h-3 text-slate-500 shrink-0" />
                  )}
                </React.Fragment>
              ))}
            </div>

            <div className="flex items-center gap-2 shrink-0 font-mono text-[11px]">
              <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                Exit: <strong>{alt.exitId}</strong>
              </span>
              <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                Cost: <strong>{alt.totalCost}</strong>
              </span>
              <span className="px-2 py-0.5 rounded bg-amber-950/60 text-amber-300 border border-amber-500/40 font-bold">
                +{alt.deltaCost}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
