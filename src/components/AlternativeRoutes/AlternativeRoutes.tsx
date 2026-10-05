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
    <div className="alt-card">
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.5rem' }}>
        <GitBranch size={16} style={{ color: 'var(--color-purple)' }} />
        <h4 style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-white)' }}>
          {t.alternativeRoutesTitle}
        </h4>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {altRoutes.map((alt, idx) => (
          <div key={idx} className="alt-route-row">
            <div className="alt-chain">
              <span style={{ color: 'var(--color-purple)', fontWeight: 800 }}>Alt #{idx + 1}:</span>
              {alt.path.map((nodeId, nodeIdx) => (
                <React.Fragment key={nodeIdx}>
                  <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{nodeId}</span>
                  {nodeIdx < alt.path.length - 1 && (
                    <ArrowRight size={13} style={{ color: 'var(--text-muted)' }} />
                  )}
                </React.Fragment>
              ))}
            </div>

            <div className="alt-meta-tags">
              <span style={{ background: 'var(--bg-app)', padding: '2px 6px', borderRadius: '4px', border: '1px solid var(--border-subtle)' }}>
                Exit: <strong style={{ color: 'var(--color-emerald)' }}>{alt.exitId}</strong>
              </span>
              <span style={{ background: 'var(--bg-app)', padding: '2px 6px', borderRadius: '4px', border: '1px solid var(--border-subtle)' }}>
                Cost: <strong style={{ color: 'var(--text-white)' }}>{alt.totalCost}</strong>
              </span>
              <span className="alt-delta-badge">
                +{alt.deltaCost}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
