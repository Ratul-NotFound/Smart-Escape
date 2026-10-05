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

    const padding = 65;
    return {
      minX: minX - padding,
      minY: minY - padding,
      width: maxX - minX + padding * 2,
      height: maxY - minY + padding * 2,
    };
  }, [buildingData.nodes]);

  // Handle Pan Dragging
  const handleMouseDown = (e: React.MouseEvent<SVGSVGElement>) => {
    // Only drag with left click and if target is svg background
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

  // Zoom Controls
  const handleZoomIn = () => setZoom((z) => Math.min(z + 0.2, 2.5));
  const handleZoomOut = () => setZoom((z) => Math.max(z - 0.2, 0.5));
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
      if (!blockedNodes.has(node.id)) {
        setStartNodeId(node.id);
      } else {
        // Start node blocked: allow selecting it anyway to demonstrate TC-5
        setStartNodeId(node.id);
      }
    } else {
      toggleNodeHazard(node.id);
    }
  };

  // Find walkthrough node coords
  const walkthroughNode = walkthroughNodeId ? nodeMap.get(walkthroughNodeId) : null;

  return (
    <div className="relative w-full h-[540px] glass-panel overflow-hidden border border-slate-700/60 rounded-xl bg-slate-950/80 shadow-2xl flex flex-col">
      {/* 1. Header Toolbar with Mode Selectors & Controls */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 border-b border-slate-800 bg-slate-900/60 backdrop-blur-md z-10">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            {buildingData.building}
          </span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono">
            {buildingData.nodes.length} Nodes • {buildingData.edges.length} Corridors
          </span>
        </div>

        {/* Interaction Mode Toggle */}
        <div className="flex items-center gap-1.5 bg-slate-950/80 p-1 rounded-lg border border-slate-800">
          <button
            type="button"
            className={`flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-md transition-all ${
              interactionMode === 'select_start'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            onClick={() => setInteractionMode('select_start')}
          >
            <Crosshair className="w-3.5 h-3.5" />
            <span>{t.startLocation}</span>
          </button>
          <button
            type="button"
            className={`flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-md transition-all ${
              interactionMode === 'toggle_hazard'
                ? 'bg-red-500/20 text-red-300 border border-red-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            onClick={() => setInteractionMode('toggle_hazard')}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>{t.hazardsTitle}</span>
          </button>
        </div>

        {/* Zoom & Canvas Actions */}
        <div className="flex items-center gap-1 bg-slate-950/80 p-1 rounded-lg border border-slate-800">
          <button
            type="button"
            onClick={handleZoomIn}
            className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors"
            title="Zoom In"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={handleZoomOut}
            className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors"
            title="Zoom Out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={handleResetZoom}
            className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors"
            title="Reset View"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 2. Interactive SVG Vector Canvas */}
      <div className="relative flex-1 w-full h-full overflow-hidden select-none">
        <svg
          id="evacuation-svg-canvas"
          className="w-full h-full cursor-grab active:cursor-grabbing"
          viewBox={`${minX} ${minY} ${width} ${height}`}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          {/* SVG Definitions */}
          <defs>
            {/* Emerald glow filter for active route */}
            <filter id="glow-filter" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>

            {/* Subtle Grid Background Pattern */}
            <pattern id="grid-pattern" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(51, 65, 85, 0.15)" strokeWidth="1" />
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
            {/* A. Render Corridors (Edges) First */}
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

            {/* B. Render Nodes on Top */}
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

            {/* C. Render Animated Walkthrough Avatar Marker */}
            {walkthroughNode && (
              <g
                className="walkthrough-avatar"
                transform={`translate(${walkthroughNode.x}, ${walkthroughNode.y})`}
                pointerEvents="none"
              >
                <circle r="14" fill="#00ffcc" opacity="0.4" className="radar-pulse-ring" />
                <circle r="8" fill="#00ffcc" stroke="#ffffff" strokeWidth="2" />
                <text
                  y="-14"
                  textAnchor="middle"
                  fill="#00ffcc"
                  fontSize="10px"
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
        <div className="absolute bottom-3 left-3 bg-slate-900/85 backdrop-blur-md border border-slate-800 rounded-lg p-2.5 flex flex-wrap items-center gap-3 text-[11px] text-slate-300 pointer-events-none shadow-lg">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-blue-500 border border-blue-400"></span>
            <span>{t.nodeTypeRoom}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-purple-500 border border-purple-400"></span>
            <span>{t.nodeTypeJunction}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm rotate-45 bg-emerald-500 border border-emerald-400"></span>
            <span>{t.nodeTypeExit}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-amber-500 border border-amber-400 ring-2 ring-amber-500/40"></span>
            <span>{t.startLocation}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-red-600 border border-red-500"></span>
            <span>{t.hazardsTitle}</span>
          </div>
        </div>

        {/* Navigation Hint at Bottom-Right */}
        <div className="absolute bottom-3 right-3 text-[10px] text-slate-500 bg-slate-950/60 px-2 py-1 rounded backdrop-blur border border-slate-900 pointer-events-none">
          {t.dragPanHelp}
        </div>
      </div>
    </div>
  );
};
