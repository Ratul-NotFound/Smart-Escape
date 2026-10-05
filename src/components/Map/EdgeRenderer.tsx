// ==============================================================================
// EdgeRenderer: Renders Undirected Corridors, Centered Cost Badges & Egress Chevrons
// High-Precision Architectural Blueprint & Directional Flow Visualization
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

  // Midpoint calculation for centered cost badge
  const midX = (x1 + x2) / 2;
  const midY = (y1 + y2) / 2;

  // Directional Angle for Egress Flow Chevrons
  const dx = x2 - x1;
  const dy = y2 - y1;
  const baseAngle = (Math.atan2(dy, dx) * 180) / Math.PI;
  const chevronAngle = flowDirection === 'forward' ? baseAngle : baseAngle + 180;

  // Chevron positions at 28% and 72% along corridor length
  const p1X = x1 + dx * 0.28;
  const p1Y = y1 + dy * 0.28;
  const p2X = x1 + dx * 0.72;
  const p2Y = y1 + dy * 0.72;

  // Visual Properties
  let strokeColor = '#334155'; // Architectural slate
  let strokeWidth = 3;

  if (isBlocked) {
    strokeColor = '#ef4444';
    strokeWidth = 3.5;
  } else if (isOnRoute) {
    strokeColor = '#2563eb'; // Route royal blue
    strokeWidth = 5;
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

      {/* 4. Directional Egress Chevrons pointing toward Exit */}
      {isOnRoute && !isBlocked && (
        <g pointerEvents="none">
          <g transform={`translate(${p1X}, ${p1Y}) rotate(${chevronAngle})`}>
            <path
              d="M -3 -4 L 3 0 L -3 4"
              fill="none"
              stroke="#93c5fd"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>
          <g transform={`translate(${p2X}, ${p2Y}) rotate(${chevronAngle})`}>
            <path
              d="M -3 -4 L 3 0 L -3 4"
              fill="none"
              stroke="#93c5fd"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>
        </g>
      )}

      {/* 5. Centered Corridor Cost Pill Badge */}
      <g transform={`translate(${midX}, ${midY})`} style={{ cursor: 'pointer' }}>
        <rect
          x="-16"
          y="-11"
          width="32"
          height="22"
          rx="6"
          ry="6"
          fill={isBlocked ? '#7f1d1d' : isOnRoute ? '#172554' : '#0f172a'}
          stroke={isBlocked ? '#ef4444' : isOnRoute ? '#60a5fa' : '#334155'}
          strokeWidth={isOnRoute || isBlocked ? 1.8 : 1.2}
          filter="drop-shadow(0 2px 6px rgba(0,0,0,0.6))"
        />
        <text
          x="0"
          y="1"
          textAnchor="middle"
          dominantBaseline="central"
          fill={isBlocked ? '#fca5a5' : isOnRoute ? '#bfdbfe' : '#94a3b8'}
          fontSize="11px"
          fontWeight="800"
          fontFamily="var(--font-mono)"
          pointerEvents="none"
          style={{ userSelect: 'none' }}
        >
          {isBlocked ? `✕${edge.cost}` : edge.cost}
        </text>
      </g>

      <title>{`Corridor ${edge.id}: ${fromNode.label} ↔ ${toNode.label}\nCost: ${edge.cost}\nStatus: ${
        isBlocked ? 'Blocked (Hazard)' : 'Open'
      }\nClick to toggle hazard`}</title>
    </g>
  );
};
