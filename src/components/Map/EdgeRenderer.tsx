// ==============================================================================
// EdgeRenderer: Architectural Corridor Hallways & Egress Directional Visualization
// Authentic Building Blueprint Styling with Real Hallway Width & Dynamic Chevrons
// ==============================================================================

import React from 'react';
import { GraphEdge, GraphNode } from '../../domain/types';

interface EdgeRendererProps {
  edge: GraphEdge;
  fromNode: GraphNode;
  toNode: GraphNode;
  isBlocked: boolean;
  isOnRoute: boolean;
  flowDirection?: 'forward' | 'reverse';
  onToggleBlocked: (edgeId: string) => void;
}

export const EdgeRenderer: React.FC<EdgeRendererProps> = ({
  edge,
  fromNode,
  toNode,
  isBlocked,
  isOnRoute,
  flowDirection = 'forward',
  onToggleBlocked,
}) => {
  const x1 = fromNode.x;
  const y1 = fromNode.y;
  const x2 = toNode.x;
  const y2 = toNode.y;

  // Midpoint calculation for centered dimension badge
  const midX = (x1 + x2) / 2;
  const midY = (y1 + y2) / 2;

  // Directional Vector & Angle for Egress Flow Chevrons
  const dx = x2 - x1;
  const dy = y2 - y1;
  const baseAngle = (Math.atan2(dy, dx) * 180) / Math.PI;
  const chevronAngle = flowDirection === 'forward' ? baseAngle : baseAngle + 180;

  // 3 Chevron positions along corridor length (22%, 50% offset slightly, 78%)
  const p1X = x1 + dx * 0.22;
  const p1Y = y1 + dy * 0.22;
  const p2X = x1 + dx * 0.78;
  const p2Y = y1 + dy * 0.78;

  return (
    <g
      className="graph-edge-group cursor-pointer"
      onClick={() => onToggleBlocked(edge.id)}
    >
      {/* 1. Transparent wider hit area for effortless clicking */}
      <line
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke="transparent"
        strokeWidth="28"
        style={{ cursor: 'pointer' }}
      />

      {/* 2. Architectural Hallway Slab (Real blueprint corridor width) */}
      <line
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke={isBlocked ? 'rgba(239, 68, 68, 0.15)' : isOnRoute ? 'rgba(16, 185, 129, 0.15)' : 'var(--corridor-slab, rgba(30, 41, 59, 0.45))'}
        strokeWidth="16"
        strokeLinecap="round"
        pointerEvents="none"
      />

      {/* 3. Hallway Outer Wall Boundary Lines (Architectural Blueprint Casing) */}
      <line
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke={isBlocked ? 'rgba(239, 68, 68, 0.35)' : isOnRoute ? 'rgba(16, 185, 129, 0.4)' : 'var(--corridor-casing, rgba(71, 85, 105, 0.35))'}
        strokeWidth="17"
        strokeDasharray="1 16"
        strokeLinecap="round"
        pointerEvents="none"
      />

      {/* 4. Active Route Egress Glow Backdrop */}
      {isOnRoute && !isBlocked && (
        <line
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          stroke="#10b981"
          strokeWidth="10"
          opacity="0.3"
          strokeLinecap="round"
          filter="url(#glow-filter)"
          pointerEvents="none"
        />
      )}

      {/* 5. Central Corridor Path Line */}
      <line
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke={isBlocked ? '#ef4444' : isOnRoute ? '#10b981' : 'var(--corridor-stroke, #475569)'}
        strokeWidth={isOnRoute ? 4 : isBlocked ? 3 : 2}
        strokeDasharray={isBlocked ? '6 4' : undefined}
        strokeLinecap="round"
        className={isOnRoute && !isBlocked ? 'route-flow-animation' : ''}
        style={{ cursor: 'pointer', transition: 'stroke 0.2s, stroke-width 0.2s' }}
      />

      {/* 6. Directional Egress Chevrons (Point toward exit along route) */}
      {isOnRoute && !isBlocked && (
        <g pointerEvents="none">
          <g transform={`translate(${p1X}, ${p1Y}) rotate(${chevronAngle})`}>
            <path
              d="M -4 -5 L 3 0 L -4 5"
              fill="none"
              stroke="#6ee7b7"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>
          <g transform={`translate(${p2X}, ${p2Y}) rotate(${chevronAngle})`}>
            <path
              d="M -4 -5 L 3 0 L -4 5"
              fill="none"
              stroke="#6ee7b7"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>
        </g>
      )}

      {/* 7. Centered Corridor Cost Dimension Pill Badge */}
      <g transform={`translate(${midX}, ${midY})`} style={{ cursor: 'pointer' }}>
        <rect
          x="-18"
          y="-11"
          width="36"
          height="22"
          rx="6"
          ry="6"
          fill={isBlocked ? '#7f1d1d' : isOnRoute ? '#064e3b' : 'var(--corridor-badge-bg, #0b0f19)'}
          stroke={isBlocked ? '#ef4444' : isOnRoute ? '#10b981' : 'var(--corridor-badge-border, #334155)'}
          strokeWidth={isOnRoute || isBlocked ? 1.8 : 1.2}
          filter="drop-shadow(0 2px 6px rgba(0,0,0,0.7))"
        />
        <text
          x="0"
          y="1"
          textAnchor="middle"
          dominantBaseline="central"
          fill={isBlocked ? '#fca5a5' : isOnRoute ? '#a7f3d0' : 'var(--corridor-badge-text, #cbd5e1)'}
          fontSize="11px"
          fontWeight="800"
          fontFamily="var(--font-mono)"
          pointerEvents="none"
          style={{ userSelect: 'none' }}
        >
          {isBlocked ? `✕${edge.cost}` : `${edge.cost}`}
        </text>
      </g>

      <title>{`Corridor ${edge.id}: ${fromNode.label} ↔ ${toNode.label}\nCost: ${edge.cost} units\nStatus: ${
        isBlocked ? 'BLOCKED (HAZARD)' : 'OPEN EGRESS ROUTE'
      }\nClick to toggle hazard`}</title>
    </g>
  );
};
