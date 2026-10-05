// ==============================================================================
// NodeRenderer: Renders Rooms, Junctions, Exits, Start Beacons & Hazards
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

  // Visual Styling Definitions
  const size = type === 'room' ? 36 : type === 'exit' ? 38 : 30;
  const halfSize = size / 2;

  // Node Color Scheme
  let fillColor = '#3b82f6'; // default room blue
  let strokeColor = '#60a5fa';
  let badgeText = id;

  if (type === 'junction') {
    fillColor = '#8b5cf6';
    strokeColor = '#a78bfa';
  } else if (type === 'exit') {
    if (isClosedExit) {
      fillColor = '#ef4444';
      strokeColor = '#f87171';
    } else {
      fillColor = '#10b981';
      strokeColor = '#34d399';
    }
  }

  if (isBlocked) {
    fillColor = '#b91c1c';
    strokeColor = '#ef4444';
  }

  if (isStart) {
    fillColor = '#f59e0b';
    strokeColor = '#fbbf24';
  }

  // Generate SVG Hexagon points for exits
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
      className={`graph-node cursor-pointer transition-transform duration-150 hover:scale-110`}
      onClick={() => onClick(node)}
      style={{ cursor: 'pointer' }}
    >
      {/* 1. Pulsing radar rings for Start Node */}
      {isStart && (
        <g>
          <circle
            cx={x}
            cy={y}
            r={24}
            fill="none"
            stroke="#f59e0b"
            strokeWidth="2"
            opacity="0.75"
            className="radar-pulse-ring"
          />
          <circle
            cx={x}
            cy={y}
            r={32}
            fill="none"
            stroke="#f59e0b"
            strokeWidth="1.5"
            opacity="0.4"
            className="radar-pulse-ring"
            style={{ animationDelay: '0.6s' }}
          />
        </g>
      )}

      {/* 2. Route glow aura for nodes on optimal evacuation path */}
      {isOnRoute && !isStart && !isBlocked && (
        <circle
          cx={x}
          cy={y}
          r={halfSize + 6}
          fill="none"
          stroke="#10b981"
          strokeWidth="3"
          opacity="0.8"
          filter="url(#glow-filter)"
        />
      )}

      {/* 3. Base Node Geometry */}
      {type === 'room' && (
        <rect
          x={x - halfSize}
          y={y - halfSize}
          width={size}
          height={size}
          rx={8}
          ry={8}
          fill={fillColor}
          stroke={strokeColor}
          strokeWidth={isOnRoute ? 3 : 2}
          filter="drop-shadow(0 2px 5px rgba(0,0,0,0.5))"
        />
      )}

      {type === 'junction' && (
        <circle
          cx={x}
          cy={y}
          r={halfSize}
          fill={fillColor}
          stroke={strokeColor}
          strokeWidth={isOnRoute ? 3 : 2}
          filter="drop-shadow(0 2px 5px rgba(0,0,0,0.5))"
        />
      )}

      {type === 'exit' && (
        <polygon
          points={hexPoints(x, y, halfSize + 2)}
          fill={fillColor}
          stroke={strokeColor}
          strokeWidth={isOnRoute || !isClosedExit ? 3 : 2}
          className={!isClosedExit && isOnRoute ? 'active-exit-beacon' : ''}
          filter="drop-shadow(0 2px 6px rgba(0,0,0,0.6))"
        />
      )}

      {/* 4. Hazard Strikethrough diagonal hatch if Blocked */}
      {(isBlocked || isClosedExit) && (
        <g pointerEvents="none">
          <line
            x1={x - halfSize + 4}
            y1={y - halfSize + 4}
            x2={x + halfSize - 4}
            y2={y + halfSize - 4}
            stroke="#ffffff"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <line
            x1={x + halfSize - 4}
            y1={y - halfSize + 4}
            x2={x - halfSize + 4}
            y2={y + halfSize - 4}
            stroke="#ffffff"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </g>
      )}

      {/* 5. Center ID text */}
      <text
        x={x}
        y={y + 1}
        textAnchor="middle"
        dominantBaseline="central"
        fill="#ffffff"
        fontSize={type === 'exit' ? '12px' : '11px'}
        fontWeight="700"
        fontFamily="var(--font-mono)"
        pointerEvents="none"
        style={{ userSelect: 'none' }}
      >
        {badgeText}
      </text>

      {/* 6. External Node Label Below Geometry */}
      <text
        x={x}
        y={y + halfSize + 14}
        textAnchor="middle"
        fill={isBlocked || isClosedExit ? '#f87171' : isStart ? '#fbbf24' : '#cbd5e1'}
        fontSize="11px"
        fontWeight="600"
        fontFamily="var(--font-sans)"
        pointerEvents="none"
        style={{ userSelect: 'none' }}
      >
        {label}
      </text>

      {/* 7. Mode Hint Indicator Badge on Hover */}
      <title>
        {`${label} (${id}) [${type.toUpperCase()}]\n`}
        {isBlocked ? '⚠️ Hazard: Blocked\n' : ''}
        {isClosedExit ? '🚫 Status: Closed Exit\n' : ''}
        {isStart ? '📍 Current Starting Location\n' : ''}
        {interactionMode === 'select_start'
          ? 'Click to set as Start Location'
          : 'Click to toggle Hazard status'}
      </title>
    </g>
  );
};
