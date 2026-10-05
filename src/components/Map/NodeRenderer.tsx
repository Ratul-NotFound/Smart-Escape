// ==============================================================================
// NodeRenderer: Renders Rooms, Junctions, Exits, Start Beacons & Hazards
// Exact styling matching Smart Escape Problem Statement Section 1 & Section 3.2
// ==============================================================================

import React from 'react';
import { GraphNode } from '../../domain/types';

interface NodeRendererProps {
  node: GraphNode;
  isStart: boolean;
  isBlocked: boolean;
  isClosedExit: boolean;
  isOnRoute: boolean;
  interactionMode: 'select_start' | 'toggle_hazard';
  onClick: (node: GraphNode) => void;
}

export const NodeRenderer: React.FC<NodeRendererProps> = ({
  node,
  isStart,
  isBlocked,
  isClosedExit,
  isOnRoute,
  interactionMode,
  onClick,
}) => {
  const { id, label, type, x, y } = node;

  // Geometry Dimensions
  const isExit = type === 'exit';
  const isRoom = type === 'room';
  const size = isExit ? 40 : isRoom ? 38 : 34;
  const radius = size / 2;

  // Exact Color Logic from Problem Statement PDF
  let fillColor = '#1e293b';       // Inactive slate-blue
  let strokeColor = '#475569';
  let strokeWidth = 2;

  if (isBlocked || isClosedExit) {
    fillColor = '#dc2626';        // Hazard crimson
    strokeColor = '#f87171';
    strokeWidth = 2.5;
  } else if (isStart) {
    fillColor = '#f59e0b';        // Amber starting beacon
    strokeColor = '#fde68a';
    strokeWidth = 3;
  } else if (isOnRoute) {
    if (isExit) {
      fillColor = '#10b981';      // Exit emerald
      strokeColor = '#6ee7b7';
      strokeWidth = 3;
    } else {
      fillColor = '#2563eb';      // Route blue (as in Problem Statement PDF)
      strokeColor = '#93c5fd';
      strokeWidth = 2.5;
    }
  } else {
    // Normal open unselected state
    if (isExit) {
      fillColor = '#065f46';
      strokeColor = '#10b981';
    } else if (isRoom) {
      fillColor = '#1e3a8a';
      strokeColor = '#3b82f6';
    } else {
      fillColor = '#312e81';
      strokeColor = '#8b5cf6';
    }
  }

  // Hexagon Generator for Exits
  const hexPoints = (cx: number, cy: number, r: number) => {
    const points: string[] = [];
    for (let i = 0; i < 6; i++) {
      const angle = (Math.PI / 3) * i - Math.PI / 6;
      points.push(`${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`);
    }
    return points.join(' ');
  };

  return (
    <g
      className="graph-node-group cursor-pointer"
      onClick={() => onClick(node)}
      style={{ cursor: 'pointer' }}
    >
      {/* 1. Concentric Pulsing Radar Rings for Start Node */}
      {isStart && (
        <g pointerEvents="none">
          <circle
            cx={x}
            cy={y}
            r={radius + 10}
            fill="none"
            stroke="#f59e0b"
            strokeWidth="2.5"
            opacity="0.8"
            className="radar-pulse-ring"
          />
          <circle
            cx={x}
            cy={y}
            r={radius + 20}
            fill="none"
            stroke="#f59e0b"
            strokeWidth="1.5"
            opacity="0.4"
            className="radar-pulse-ring"
            style={{ animationDelay: '0.6s' }}
          />
        </g>
      )}

      {/* 2. Route Glow Aura */}
      {isOnRoute && !isStart && !isBlocked && (
        <circle
          cx={x}
          cy={y}
          r={radius + 8}
          fill="none"
          stroke={isExit ? '#10b981' : '#3b82f6'}
          strokeWidth="3.5"
          opacity="0.75"
          filter="url(#glow-filter)"
          pointerEvents="none"
        />
      )}

      {/* 3. Base Node Shape */}
      {isRoom && (
        <rect
          x={x - radius}
          y={y - radius}
          width={size}
          height={size}
          rx={9}
          ry={9}
          fill={fillColor}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          filter="drop-shadow(0 3px 6px rgba(0,0,0,0.6))"
        />
      )}

      {!isRoom && !isExit && (
        <circle
          cx={x}
          cy={y}
          r={radius}
          fill={fillColor}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          filter="drop-shadow(0 3px 6px rgba(0,0,0,0.6))"
        />
      )}

      {isExit && (
        <polygon
          points={hexPoints(x, y, radius + 2)}
          fill={fillColor}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          className={!isClosedExit && isOnRoute ? 'active-exit-beacon' : ''}
          filter="drop-shadow(0 3px 8px rgba(0,0,0,0.7))"
        />
      )}

      {/* 4. Diagonal Strikethrough Hazard Cross if Blocked */}
      {(isBlocked || isClosedExit) && (
        <g pointerEvents="none">
          <line
            x1={x - radius + 5}
            y1={y - radius + 5}
            x2={x + radius - 5}
            y2={y + radius - 5}
            stroke="#ffffff"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          <line
            x1={x + radius - 5}
            y1={y - radius + 5}
            x2={x - radius + 5}
            y2={y + radius - 5}
            stroke="#ffffff"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
        </g>
      )}

      {/* 5. Center Node ID Text */}
      <text
        x={x}
        y={y + 1}
        textAnchor="middle"
        dominantBaseline="central"
        fill="#ffffff"
        fontSize={isExit ? '13px' : '12px'}
        fontWeight="800"
        fontFamily="var(--font-mono)"
        pointerEvents="none"
        style={{ userSelect: 'none' }}
      >
        {id}
      </text>

      {/* 6. External Node Label Below Node (Positioned with safe offset) */}
      <text
        x={x}
        y={y + radius + 16}
        textAnchor="middle"
        fill={
          isBlocked || isClosedExit
            ? '#f87171'
            : isStart
            ? '#fbbf24'
            : isOnRoute
            ? '#e2e8f0'
            : '#94a3b8'
        }
        fontSize="11.5px"
        fontWeight="700"
        fontFamily="var(--font-sans)"
        pointerEvents="none"
        style={{ userSelect: 'none' }}
      >
        {label}
      </text>

      {/* Tooltip */}
      <title>
        {`${label} (${id}) [${type.toUpperCase()}]\n`}
        {isBlocked ? '⚠️ Hazard: Blocked\n' : ''}
        {isClosedExit ? '🚫 Status: Closed Exit\n' : ''}
        {isStart ? '📍 Starting Location\n' : ''}
        {interactionMode === 'select_start'
          ? 'Click to select as Start Location'
          : 'Click to toggle Hazard status'}
      </title>
    </g>
  );
};
