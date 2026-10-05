// ==============================================================================
// EdgeRenderer: Renders Undirected Corridors, Centered Cost Badges & Hazards
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

  // Midpoint for cost badge
  const midX = (x1 + x2) / 2;
  const midY = (y1 + y2) / 2;

  // Visual Properties
  let strokeColor = '#475569';
  let strokeWidth = 3;

  if (isBlocked) {
    strokeColor = '#ef4444';
    strokeWidth = 3.5;
  } else if (isOnRoute) {
    strokeColor = '#10b981';
    strokeWidth = 5;
  }

  return (
    <g className="graph-edge cursor-pointer" onClick={() => onToggleBlocked(edge.id)}>
      {/* 1. Transparent wider hit area for easy clicking */}
      <line
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke="transparent"
        strokeWidth="18"
        style={{ cursor: 'pointer' }}
      />

      {/* 2. Route glow backdrop if part of active route */}
      {isOnRoute && !isBlocked && (
        <line
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          stroke="#10b981"
          strokeWidth="10"
          opacity="0.4"
          strokeLinecap="round"
          filter="url(#glow-filter)"
        />
      )}

      {/* 3. Base corridor edge */}
      <line
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        strokeDasharray={isBlocked ? '6 4' : undefined}
        strokeLinecap="round"
        className={isOnRoute && !isBlocked ? 'route-flow-animation' : ''}
        style={{ cursor: 'pointer', transition: 'stroke 0.2s, stroke-width 0.2s' }}
      />

      {/* 4. Centered Corridor Cost Badge */}
      <g transform={`translate(${midX}, ${midY})`} style={{ cursor: 'pointer' }}>
        <rect
          x="-14"
          y="-10"
          width="28"
          height="20"
          rx="5"
          ry="5"
          fill={isBlocked ? '#7f1d1d' : isOnRoute ? '#064e3b' : '#1e293b'}
          stroke={isBlocked ? '#ef4444' : isOnRoute ? '#34d399' : '#64748b'}
          strokeWidth={isOnRoute || isBlocked ? 1.5 : 1}
          filter="drop-shadow(0 2px 4px rgba(0,0,0,0.5))"
        />
        <text
          x="0"
          y="1"
          textAnchor="middle"
          dominantBaseline="central"
          fill={isBlocked ? '#fca5a5' : isOnRoute ? '#6ee7b7' : '#e2e8f0'}
          fontSize="10px"
          fontWeight="700"
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
