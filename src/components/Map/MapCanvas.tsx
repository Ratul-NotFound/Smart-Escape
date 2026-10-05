// ==============================================================================
// MapCanvas: Interactive Vector SVG Building Map with Pan/Zoom & Auto-ViewBox
// ==============================================================================

import React, { useMemo, useState, useRef } from 'react';
import { useSimulation } from '../../context/SimulationContext';
import { NodeRenderer } from './NodeRenderer';
import { EdgeRenderer } from './EdgeRenderer';
import { GraphNode } from '../../domain/types';
import { ZoomIn, ZoomOut, RotateCcw, Crosshair, AlertTriangle } from 'lucide-react';

interface MapCanvasProps {
  interactionMode: 'select_start' | 'toggle_hazard';
  setInteractionMode: (mode: 'select_start' | 'toggle_hazard') => void;
  walkthroughNodeId?: string | null;
}

export const MapCanvas: React.FC<MapCanvasProps> = ({
  interactionMode,
  setInteractionMode,
  walkthroughNodeId,
}) => {
  const {
    buildingData,
    startNodeId,
    blockedNodes,
    blockedEdges,
    closedExits,
    routeResult,
    setStartNodeId,
    toggleNodeHazard,
    toggleEdgeHazard,
    toggleExitClosed,
    t,
  } = useSimulation();

  // Pan & Zoom Transform State
  const [zoom, setZoom] = useState<number>(1);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const dragStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Map node lookup
  const nodeMap = useMemo(() => {
    return new Map(buildingData.nodes.map((n) => [n.id, n]));
  }, [buildingData.nodes]);

  // Active route sets
  const routeNodeSet = useMemo(() => new Set(routeResult.path), [routeResult.path]);
  const routeEdgeSet = useMemo(() => new Set(routeResult.edgeIds), [routeResult.edgeIds]);

  // Compute dynamic auto-scaling viewBox bounds from node coordinates
  const { minX, minY, width, height } = useMemo(() => {
    if (buildingData.nodes.length === 0) {
      return { minX: 0, minY: 0, width: 600, height: 400 };
    }

    let minX = Infinity;
    let maxX = -Infinity;
    let minY = Infinity;
    let maxY = -Infinity;

    for (const node of buildingData.nodes) {
      if (node.x < minX) minX = node.x;
      if (node.x > maxX) maxX = node.x;
      if (node.y < minY) minY = node.y;
      if (node.y > maxY) maxY = node.y;
    }

    const padding = 70;
    return {
      minX: minX - padding,
      minY: minY - padding,
      width: maxX - minX + padding * 2,
      height: maxY - minY + padding * 2,
    };
  }, [buildingData.nodes]);

  // Compute safe exit boundary on right side of exits
  const maxExitX = useMemo(() => {
    const exitNodes = buildingData.nodes.filter((n) => n.type === 'exit');
    if (exitNodes.length === 0) return 0;
    return Math.max(...exitNodes.map((n) => n.x));
  }, [buildingData.nodes]);

  // Handle Pan Dragging
  const handleMouseDown = (e: React.MouseEvent<SVGSVGElement>) => {
    if (e.button !== 0) return;
    setIsDragging(true);
    dragStartRef.current = { x: e.clientX - pan.x, y: e.clientY - pan.y };
  };

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStartRef.current.x,
      y: e.clientY - dragStartRef.current.y,
    });
  };

  const handleMouseUp = () => setIsDragging(false);

  // Smooth Wheel Zoom Handler
  const handleWheel = (e: React.WheelEvent<SVGSVGElement>) => {
    e.preventDefault();
    const zoomDelta = e.deltaY > 0 ? -0.15 : 0.15;
    setZoom((z) => Math.min(Math.max(Number((z + zoomDelta).toFixed(2)), 0.5), 3));
  };

  // Zoom Controls
  const handleZoomIn = () => setZoom((z) => Math.min(Number((z + 0.2).toFixed(2)), 3));
  const handleZoomOut = () => setZoom((z) => Math.max(Number((z - 0.2).toFixed(2)), 0.5));
  const handleResetZoom = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  // Node Click Dispatcher
  const handleNodeClick = (node: GraphNode) => {
    if (node.type === 'exit') {
      toggleExitClosed(node.id);
      return;
    }

    if (interactionMode === 'select_start') {
      setStartNodeId(node.id);
    } else {
      toggleNodeHazard(node.id);
    }
  };

  const walkthroughNode = walkthroughNodeId ? nodeMap.get(walkthroughNodeId) : null;

  return (
    <div className="map-canvas-card">
      {/* 1. Header Toolbar */}
      <div className="map-toolbar">
        <div className="map-meta-group">
          <span className="building-title-tag">{buildingData.building}</span>
          <span className="graph-stats-chip">
            {buildingData.nodes.length} Nodes • {buildingData.edges.length} Corridors
          </span>
        </div>

        {/* Interaction Mode Toggle */}
        <div className="interaction-mode-switch">
          <button
            type="button"
            className={`mode-toggle-btn ${interactionMode === 'select_start' ? 'active-start' : ''}`}
            onClick={() => setInteractionMode('select_start')}
          >
            <Crosshair size={14} />
            <span>{t.startLocation}</span>
          </button>
          <button
            type="button"
            className={`mode-toggle-btn ${interactionMode === 'toggle_hazard' ? 'active-hazard' : ''}`}
            onClick={() => setInteractionMode('toggle_hazard')}
          >
            <AlertTriangle size={14} />
            <span>{t.hazardsTitle}</span>
          </button>
        </div>

        {/* Zoom & Canvas Controls */}
        <div className="zoom-btn-group">
          <button type="button" onClick={handleZoomIn} className="zoom-btn" title="Zoom In">
            <ZoomIn size={15} />
          </button>
          <button type="button" onClick={handleZoomOut} className="zoom-btn" title="Zoom Out">
            <ZoomOut size={15} />
          </button>
          <button type="button" onClick={handleResetZoom} className="zoom-btn" title="Reset View">
            <RotateCcw size={15} />
          </button>
        </div>
      </div>

      {/* 2. Interactive SVG Canvas Viewport */}
      <div className="map-svg-viewport">
        <svg
          id="evacuation-svg-canvas"
          className="map-svg-element"
          viewBox={`${minX} ${minY} ${width} ${height}`}
          style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onWheel={handleWheel}
        >
          {/* SVG Definitions */}
          <defs>
            <filter id="glow-filter" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>

            <pattern id="grid-pattern" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="var(--map-grid-stroke, rgba(56, 189, 248, 0.08))" strokeWidth="1" />
            </pattern>
          </defs>

          {/* Background Grid */}
          <rect
            x={minX - 500}
            y={minY - 500}
            width={width + 1000}
            height={height + 1000}
            fill="url(#grid-pattern)"
          />

          {/* Transform Layer for Pan & Zoom */}
          <g transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`}>
            {/* 1. Exterior Safe Assembly Zone (Outside Building Beyond Exits) */}
            {maxExitX > 0 && (
              <g className="assembly-safe-zone" pointerEvents="none">
                <line
                  x1={maxExitX + 46}
                  y1={minY - 200}
                  x2={maxExitX + 46}
                  y2={minY + height + 200}
                  stroke="rgba(16, 185, 129, 0.45)"
                  strokeWidth="2"
                  strokeDasharray="6 4"
                />
                <rect
                  x={maxExitX + 46}
                  y={minY - 200}
                  width="300"
                  height={height + 400}
                  fill="rgba(16, 185, 129, 0.04)"
                />
                <text
                  x={maxExitX + 62}
                  y={minY + 40}
                  fill="#34d399"
                  fontSize="9px"
                  fontWeight="800"
                  fontFamily="var(--font-mono)"
                  letterSpacing="0.1em"
                  transform={`rotate(90, ${maxExitX + 62}, ${minY + 40})`}
                  opacity="0.85"
                >
                  EXTERIOR SAFE ASSEMBLY AREA
                </text>
              </g>
            )}

            {/* 2. Blueprint Architectural Title & Metadata */}
            <g transform={`translate(${minX + 8}, ${minY + 16})`} pointerEvents="none">
              <text
                fill="rgba(255, 255, 255, 0.3)"
                fontSize="8px"
                fontWeight="700"
                fontFamily="var(--font-mono)"
                letterSpacing="0.08em"
              >
                LEVEL 01 • EVACUATION EGRESS BLUEPRINT
              </text>
            </g>

            {/* 3. Architectural Compass Rose (North Arrow) */}
            <g transform={`translate(${minX + width - 24}, ${minY + 24})`} pointerEvents="none">
              <circle r="14" fill="rgba(15, 23, 42, 0.7)" stroke="rgba(255, 255, 255, 0.15)" strokeWidth="1" />
              <path d="M 0 -10 L 3.5 3 L 0 0 L -3.5 3 Z" fill="#ef4444" />
              <path d="M 0 10 L 3.5 -3 L 0 0 L -3.5 -3 Z" fill="#94a3b8" />
              <text y="-11" textAnchor="middle" fill="#f87171" fontSize="8px" fontWeight="800" fontFamily="var(--font-mono)">N</text>
            </g>

            {/* 4. Metric Dimension Scale Bar */}
            <g transform={`translate(${minX + 8}, ${minY + height - 10})`} pointerEvents="none">
              <rect x="0" y="0" width="80" height="3" fill="#334155" />
              <rect x="0" y="0" width="40" height="3" fill="#38bdf8" />
              <line x1="0" y1="-2" x2="0" y2="5" stroke="#94a3b8" strokeWidth="1" />
              <line x1="40" y1="-2" x2="40" y2="5" stroke="#94a3b8" strokeWidth="1" />
              <line x1="80" y1="-2" x2="80" y2="5" stroke="#94a3b8" strokeWidth="1" />
              <text x="0" y="-4" fill="#94a3b8" fontSize="7.5px" fontFamily="var(--font-mono)">0</text>
              <text x="40" y="-4" fill="#94a3b8" fontSize="7.5px" fontFamily="var(--font-mono)">5m</text>
              <text x="80" y="-4" fill="#94a3b8" fontSize="7.5px" fontFamily="var(--font-mono)">10m</text>
            </g>

            {/* Corridors (Edges) */}
            <g className="edges-layer">
              {buildingData.edges.map((edge) => {
                const fromNode = nodeMap.get(edge.from);
                const toNode = nodeMap.get(edge.to);
                if (!fromNode || !toNode) return null;

                const isEdgeBlocked =
                  blockedEdges.has(edge.id) ||
                  blockedNodes.has(edge.from) ||
                  blockedNodes.has(edge.to) ||
                  closedExits.has(edge.from) ||
                  closedExits.has(edge.to);

                const isOnRoute = routeEdgeSet.has(edge.id);
                const fromIdx = routeResult.path.indexOf(edge.from);
                const toIdx = routeResult.path.indexOf(edge.to);
                const flowDirection = fromIdx !== -1 && toIdx !== -1 && fromIdx > toIdx ? 'reverse' : 'forward';

                return (
                  <EdgeRenderer
                    key={edge.id}
                    edge={edge}
                    fromNode={fromNode}
                    toNode={toNode}
                    isBlocked={isEdgeBlocked}
                    isOnRoute={isOnRoute}
                    flowDirection={flowDirection}
                    onToggleBlocked={toggleEdgeHazard}
                  />
                );
              })}
            </g>

            {/* Nodes */}
            <g className="nodes-layer">
              {buildingData.nodes.map((node) => {
                const isStart = node.id === startNodeId;
                const isBlocked = blockedNodes.has(node.id);
                const isClosedExit = closedExits.has(node.id);
                const isOnRoute = routeNodeSet.has(node.id);

                return (
                  <NodeRenderer
                    key={node.id}
                    node={node}
                    isStart={isStart}
                    isBlocked={isBlocked}
                    isClosedExit={isClosedExit}
                    isOnRoute={isOnRoute}
                    interactionMode={interactionMode}
                    onClick={handleNodeClick}
                  />
                );
              })}
            </g>

            {/* Walkthrough Evacuee Simulation Avatar */}
            {walkthroughNode && (
              <g
                className="walkthrough-avatar"
                transform={`translate(${walkthroughNode.x}, ${walkthroughNode.y})`}
                pointerEvents="none"
              >
                <circle r="20" fill="#10b981" opacity="0.35" className="radar-pulse-ring" />
                <circle r="11" fill="#10b981" stroke="#ffffff" strokeWidth="2.5" />
                {/* Evacuee Silhouette */}
                <circle cx="0" cy="-3.5" r="2.2" fill="#ffffff" />
                <path
                  d="M 0 -1 L 0 4.5 M -3 1.5 L 3 1.5 M 0 4.5 L -2.5 8 M 0 4.5 L 2.5 8"
                  stroke="#ffffff"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
                <rect
                  x="-32"
                  y="-27"
                  width="64"
                  height="16"
                  rx="4"
                  fill="#064e3b"
                  stroke="#10b981"
                  strokeWidth="1"
                  filter="drop-shadow(0 2px 4px rgba(0,0,0,0.5))"
                />
                <text
                  y="-16"
                  textAnchor="middle"
                  fill="#6ee7b7"
                  fontSize="9.5px"
                  fontWeight="800"
                  fontFamily="var(--font-mono)"
                >
                  EVACUEE
                </text>
              </g>
            )}
          </g>
        </svg>

        {/* Legend Overlay at Bottom-Left */}
        <div className="map-legend-overlay">
          <div className="legend-swatch">
            <span className="swatch-box" style={{ background: 'var(--color-blue)', border: '1px solid #60a5fa' }} />
            <span>{t.nodeTypeRoom}</span>
          </div>
          <div className="legend-swatch">
            <span className="swatch-circle" style={{ background: 'var(--color-purple)', border: '1px solid #a78bfa' }} />
            <span>{t.nodeTypeJunction}</span>
          </div>
          <div className="legend-swatch">
            <span className="swatch-diamond" style={{ background: 'var(--color-emerald)', border: '1px solid #34d399' }} />
            <span>{t.nodeTypeExit}</span>
          </div>
          <div className="legend-swatch">
            <span className="swatch-circle" style={{ background: 'var(--color-amber)', border: '2px solid #fbbf24' }} />
            <span>{t.startLocation}</span>
          </div>
          <div className="legend-swatch">
            <span className="swatch-box" style={{ background: 'var(--color-crimson)', border: '1px solid #f87171' }} />
            <span>{t.hazardsTitle}</span>
          </div>
        </div>

        {/* Navigation Hint at Bottom-Right */}
        <div className="map-hint-overlay">
          {t.dragPanHelp}
        </div>
      </div>
    </div>
  );
};
