// ==============================================================================
// NodeRenderer: Renders Rooms, Junctions, Exits, Start Beacons & Hazards
// Authentic Architectural Floorplan & ISO 7010 Emergency Evacuation Vector Assets
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

  const isExit = type === 'exit';
  const isRoom = type === 'room';
  const size = isExit ? 46 : isRoom ? 42 : 36;
  const radius = size / 2;

  // Semantic color logic
  let fillColor = '#0f172a';
  let strokeColor = '#334155';
  let strokeWidth = 2;

  if (isBlocked || isClosedExit) {
    fillColor = '#7f1d1d';
    strokeColor = '#ef4444';
    strokeWidth = 2.5;
  } else if (isStart) {
    fillColor = '#b45309';
    strokeColor = '#f59e0b';
    strokeWidth = 3;
  } else if (isOnRoute) {
    if (isExit) {
      fillColor = '#065f46';
      strokeColor = '#10b981';
      strokeWidth = 3;
    } else {
      fillColor = '#1e3a8a';
      strokeColor = '#3b82f6';
      strokeWidth = 2.5;
    }
  } else {
    if (isExit) {
      fillColor = '#064e3b';
      strokeColor = '#059669';
    } else if (isRoom) {
      fillColor = '#172554';
      strokeColor = '#2563eb';
    } else {
      fillColor = '#2e1065';
      strokeColor = '#7c3aed';
    }
  }

  // Hexagon points generator for Exit shields
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
      {/* 1. Start Location Radar Wave Animation & Pinpoint Tag */}
      {isStart && (
        <g pointerEvents="none">
          <circle
            cx={x}
            cy={y}
            r={radius + 8}
            fill="none"
            stroke="#f59e0b"
            strokeWidth="2"
            opacity="0.8"
            className="radar-pulse-ring"
          />
          <circle
            cx={x}
            cy={y}
            r={radius + 18}
            fill="none"
            stroke="#f59e0b"
            strokeWidth="1.2"
            opacity="0.4"
            className="radar-pulse-ring"
            style={{ animationDelay: '0.6s' }}
          />

          {/* "YOU ARE HERE" Start Location Floating Badge */}
          <g transform={`translate(${x}, ${y - radius - 16})`}>
            <rect
              x="-48"
              y="-12"
              width="96"
              height="16"
              rx="4"
              fill="#b45309"
              stroke="#fbbf24"
              strokeWidth="1"
              filter="drop-shadow(0 2px 4px rgba(0,0,0,0.6))"
            />
            <text
              y="-1"
              textAnchor="middle"
              dominantBaseline="central"
              fill="#ffffff"
              fontSize="8.5px"
              fontWeight="800"
              fontFamily="var(--font-mono)"
              letterSpacing="0.04em"
            >
              📍 YOU ARE HERE
            </text>
          </g>
        </g>
      )}

      {/* 2. Route Glow Aura */}
      {isOnRoute && !isStart && !isBlocked && (
        <circle
          cx={x}
          cy={y}
          r={radius + 6}
          fill="none"
          stroke={isExit ? '#10b981' : '#38bdf8'}
          strokeWidth="3"
          opacity="0.65"
          filter="url(#glow-filter)"
          pointerEvents="none"
        />
      )}

      {/* 3. Base Node Geometry & Architectural Features */}
      {isRoom && (
        <g>
          {/* Room Outer Wall Casing */}
          <rect
            x={x - radius - 2}
            y={y - radius - 2}
            width={size + 4}
            height={size + 4}
            rx={9}
            ry={9}
            fill="none"
            stroke={isBlocked ? 'rgba(239, 68, 68, 0.4)' : 'rgba(59, 130, 246, 0.35)'}
            strokeWidth="1"
            pointerEvents="none"
          />
          {/* Room Compartment Interior */}
          <rect
            x={x - radius}
            y={y - radius}
            width={size}
            height={size}
            rx={7}
            ry={7}
            fill={fillColor}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            filter="drop-shadow(0 4px 8px rgba(0,0,0,0.5))"
          />
          {/* Architectural Doorway Swing Arc in bottom-right corner */}
          <path
            d={`M ${x + radius - 9} ${y + radius} A 9 9 0 0 0 ${x + radius} ${y + radius - 9}`}
            fill="none"
            stroke={isBlocked ? '#fca5a5' : '#60a5fa'}
            strokeWidth="1.2"
            strokeDasharray="2 2"
            opacity="0.6"
            pointerEvents="none"
          />
          <line
            x1={x + radius - 9}
            y1={y + radius}
            x2={x + radius - 9}
            y2={y + radius - 9}
            stroke={isBlocked ? '#fca5a5' : '#60a5fa'}
            strokeWidth="1.4"
            pointerEvents="none"
          />
        </g>
      )}

      {!isRoom && !isExit && (
        <g>
          {/* Hallway Junction Circle */}
          <circle
            cx={x}
            cy={y}
            r={radius}
            fill={fillColor}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            filter="drop-shadow(0 4px 8px rgba(0,0,0,0.5))"
          />
          {/* Corridor Convergence Crosshairs */}
          <line
            x1={x - 6}
            y1={y}
            x2={x + 6}
            y2={y}
            stroke={isBlocked ? '#fca5a5' : '#c4b5fd'}
            strokeWidth="1.2"
            opacity="0.5"
            pointerEvents="none"
          />
          <line
            x1={x}
            y1={y - 6}
            x2={x}
            y2={y + 6}
            stroke={isBlocked ? '#fca5a5' : '#c4b5fd'}
            strokeWidth="1.2"
            opacity="0.5"
            pointerEvents="none"
          />
        </g>
      )}

      {isExit && (
        <g>
          {/* ISO 7010 Exit Hexagonal Shield */}
          <polygon
            points={hexPoints(x, y, radius + 2)}
            fill={fillColor}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            filter="drop-shadow(0 4px 10px rgba(0,0,0,0.6))"
          />
          {/* Outward Egress Light Indicator (Pointing to Safe Zone) */}
          {!isClosedExit && (
            <g transform={`translate(${x + radius + 4}, ${y})`} pointerEvents="none">
              <path
                d="M 0 -4 L 6 0 L 0 4 Z"
                fill="#10b981"
                opacity={isOnRoute ? 0.95 : 0.6}
              />
            </g>
          )}
        </g>
      )}

      {/* 4. Diagonal Strikethrough Hazard Cross if Blocked */}
      {(isBlocked || isClosedExit) && (
        <g pointerEvents="none">
          <line
            x1={x - radius + 6}
            y1={y - radius + 6}
            x2={x + radius - 6}
            y2={y + radius - 6}
            stroke="#ffffff"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <line
            x1={x + radius - 6}
            y1={y - radius + 6}
            x2={x - radius + 6}
            y2={y + radius - 6}
            stroke="#ffffff"
            strokeWidth="3"
            strokeLinecap="round"
          />
          {/* Fire / Hazard Pill Label */}
          <g transform={`translate(${x}, ${y - radius - 12})`}>
            <rect
              x="-26"
              y="-8"
              width="52"
              height="14"
              rx="3"
              fill="#991b1b"
              stroke="#ef4444"
              strokeWidth="1"
            />
            <text
              y="-1"
              textAnchor="middle"
              dominantBaseline="central"
              fill="#fecaca"
              fontSize="7.5px"
              fontWeight="800"
              fontFamily="var(--font-mono)"
            >
              🔥 HAZARD
            </text>
          </g>
        </g>
      )}

      {/* 5. Center Node ID Text with Cartography Halo for Supreme Legibility */}
      <text
        x={x}
        y={y + 1}
        textAnchor="middle"
        dominantBaseline="central"
        fill="#ffffff"
        stroke="rgba(8, 10, 16, 0.95)"
        strokeWidth="3.5"
        paintOrder="stroke fill"
        fontSize={isExit ? '13px' : '12px'}
        fontWeight="800"
        fontFamily="var(--font-mono)"
        pointerEvents="none"
        style={{ userSelect: 'none' }}
      >
        {id}
      </text>

      {/* 6. External Node Label Below Node */}
      <text
        x={x}
        y={y + radius + 15}
        textAnchor="middle"
        fill={
          isBlocked || isClosedExit
            ? 'var(--color-crimson)'
            : isStart
            ? 'var(--color-amber)'
            : isOnRoute
            ? 'var(--map-label-route, #e2e8f0)'
            : 'var(--map-label-default, #94a3b8)'
        }
        stroke="var(--map-label-halo, rgba(8, 10, 16, 0.85))"
        strokeWidth="2.5"
        paintOrder="stroke fill"
        fontSize="11px"
        fontWeight="600"
        fontFamily="var(--font-sans)"
        pointerEvents="none"
        style={{ userSelect: 'none' }}
      >
        {label}
      </text>

      {/* Contextual SVG Tooltip */}
      <title>
        {`${label} (${id}) [${type.toUpperCase()}]\n`}
        {isBlocked ? '⚠️ Hazard: Blocked Node\n' : ''}
        {isClosedExit ? '🚫 Status: Closed Emergency Exit\n' : ''}
        {isStart ? '📍 Evacuee Starting Location\n' : ''}
        {interactionMode === 'select_start'
          ? 'Click to set as Starting Location'
          : 'Click to toggle Hazard status'}
      </title>
    </g>
  );
};
