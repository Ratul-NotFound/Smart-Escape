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
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(56, 189, 248, 0.08)" strokeWidth="1" />
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

                return (
                  <EdgeRenderer
                    key={edge.id}
                    edge={edge}
                    fromNode={fromNode}
                    toNode={toNode}
                    isBlocked={isEdgeBlocked}
                    isOnRoute={isOnRoute}
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

            {/* Walkthrough Avatar Marker */}
            {walkthroughNode && (
              <g
                className="walkthrough-avatar"
                transform={`translate(${walkthroughNode.x}, ${walkthroughNode.y})`}
                pointerEvents="none"
              >
                <circle r="16" fill="#00ffcc" opacity="0.4" className="radar-pulse-ring" />
                <circle r="9" fill="#00ffcc" stroke="#ffffff" strokeWidth="2" />
                <text
                  y="-16"
                  textAnchor="middle"
                  fill="#00ffcc"
                  fontSize="11px"
                  fontWeight="800"
                  fontFamily="var(--font-mono)"
                >
                  🚶 ESCAPE
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
