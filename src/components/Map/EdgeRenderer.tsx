// ==============================================================================
// EdgeRenderer: Renders Undirected Corridors, Centered Cost Badges & Hazards
// Exact styling matching Smart Escape Problem Statement Section 1 & Section 3.2
// ==============================================================================

import React from 'react';
import { GraphEdge, GraphNode } from '../../domain/types';

interface EdgeRendererProps {
  edge: GraphEdge;
  fromNode: GraphNode;
  toNode: GraphNode;
  isBlocked: boolean;
  isOnRoute: boolean;
  onToggleBlocked: (edgeId: string) => void;
}

export const EdgeRenderer: React.FC<EdgeRendererProps> = ({
  edge,
  fromNode,
  toNode,
  isBlocked,
  isOnRoute,
  onToggleBlocked,
}) => {
  const x1 = fromNode.x;
  const y1 = fromNode.y;
  const x2 = toNode.x;
  const y2 = toNode.y;

  // Midpoint calculation for centered cost badge
  const midX = (x1 + x2) / 2;
  const midY = (y1 + y2) / 2;

  // Visual Properties
  let strokeColor = '#334155'; // Architectural slate
  let strokeWidth = 3.5;

  if (isBlocked) {
    strokeColor = '#ef4444';
    strokeWidth = 3.5;
  } else if (isOnRoute) {
    strokeColor = '#2563eb'; // Route royal blue (matching Problem Statement PDF diagram)
    strokeWidth = 5.5;
  }

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
        strokeWidth="24"
        style={{ cursor: 'pointer' }}
      />

      {/* 2. Route Glow Backdrop when active */}
      {isOnRoute && !isBlocked && (
        <line
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          stroke="#38bdf8"
          strokeWidth="12"
          opacity="0.35"
          strokeLinecap="round"
          filter="url(#glow-filter)"
          pointerEvents="none"
        />
      )}

      {/* 3. Base Corridor Line */}
      <line
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        strokeDasharray={isBlocked ? '6 5' : undefined}
        strokeLinecap="round"
        className={isOnRoute && !isBlocked ? 'route-flow-animation' : ''}
        style={{ cursor: 'pointer', transition: 'stroke 0.2s, stroke-width 0.2s' }}
      />

      {/* 4. Centered Corridor Cost Pill Badge */}
      <g transform={`translate(${midX}, ${midY})`} style={{ cursor: 'pointer' }}>
        <rect
          x="-15"
          y="-11"
          width="30"
          height="22"
          rx="6"
          ry="6"
          fill={isBlocked ? '#7f1d1d' : isOnRoute ? '#1e3a8a' : '#0f172a'}
          stroke={isBlocked ? '#ef4444' : isOnRoute ? '#60a5fa' : '#475569'}
          strokeWidth={isOnRoute || isBlocked ? 1.8 : 1.2}
          filter="drop-shadow(0 2px 5px rgba(0,0,0,0.6))"
        />
        <text
          x="0"
          y="1"
          textAnchor="middle"
          dominantBaseline="central"
          fill={isBlocked ? '#fca5a5' : isOnRoute ? '#bfdbfe' : '#e2e8f0'}
          fontSize="11px"
          fontWeight="800"
          fontFamily="var(--font-mono)"
          pointerEvents="none"
          style={{ userSelect: 'none' }}
        >
          {isBlocked ? '✕' : edge.cost}
        </text>
      </g>

      <title>{`Corridor ${edge.id}: ${fromNode.label} ↔ ${toNode.label}\nCost: ${edge.cost}\nStatus: ${
        isBlocked ? 'Blocked (Hazard)' : 'Open'
      }\nClick to toggle hazard`}</title>
    </g>
  );
};
