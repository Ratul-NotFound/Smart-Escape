// ==============================================================================
// Simulation Context: Centralized Reactive State Store
// ==============================================================================

import React, { createContext, useContext, useState, useMemo, useCallback, useEffect } from 'react';
import { BuildingData, RouteResult } from '../domain/types';
import { defaultBuildingData } from '../data/defaultBuilding';
import { solveEvacuationRoute } from '../domain/dijkstra';
import { Language, translations } from '../i18n/translations';

interface SimulationContextValue {
  buildingData: BuildingData;
  startNodeId: string;
  blockedNodes: Set<string>;
  blockedEdges: Set<string>;
  closedExits: Set<string>;
  routeResult: RouteResult;
  lang: Language;
  t: typeof translations['en'];
  theme: 'dark' | 'light';
  isHighContrast: boolean;
  activeTestRunning: boolean;

  // Actions
  setStartNodeId: (id: string) => void;
  toggleNodeHazard: (id: string) => void;
  toggleEdgeHazard: (id: string) => void;
  toggleExitClosed: (id: string) => void;
  resetToInitialState: () => void;
  loadBuildingData: (data: BuildingData) => void;
  applyPresetScenario: (scenarioId: 'baseline' | 'blocked_c2' | 'closed_exits' | 'start_r2' | 'blocked_r1') => void;
  setLang: (lang: Language) => void;
  toggleTheme: () => void;
  setTheme: (theme: 'dark' | 'light') => void;
  toggleHighContrast: () => void;
}

const SimulationContext = createContext<SimulationContextValue | null>(null);

export const SimulationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [buildingData, setBuildingData] = useState<BuildingData>(defaultBuildingData);
  const [startNodeId, setStartNodeId] = useState<string>('R1');
  const [blockedNodes, setBlockedNodes] = useState<Set<string>>(
    () => new Set(defaultBuildingData.initial_state.blocked_nodes)
  );
  const [blockedEdges, setBlockedEdges] = useState<Set<string>>(
    () => new Set(defaultBuildingData.initial_state.blocked_edges)
  );
  const [closedExits, setClosedExits] = useState<Set<string>>(
    () => new Set(defaultBuildingData.initial_state.closed_exits)
  );

  const [lang, setLangState] = useState<Language>(() => {
    const saved = localStorage.getItem('smart_escape_lang');
    return saved === 'bn' ? 'bn' : 'en';
  });

  const [theme, setThemeState] = useState<'dark' | 'light'>(() => {
    const saved = localStorage.getItem('smart_escape_theme');
    return saved === 'light' ? 'light' : 'dark';
  });

  useEffect(() => {
    document.body.classList.toggle('theme-light', theme === 'light');
  }, [theme]);

  const [isHighContrast, setIsHighContrast] = useState<boolean>(() => {
    return localStorage.getItem('smart_escape_contrast') === 'high';
  });

  useEffect(() => {
    document.body.classList.toggle('high-contrast', isHighContrast);
  }, [isHighContrast]);

  const [activeTestRunning] = useState<boolean>(false);

  const setLang = useCallback((newLang: Language) => {
    setLangState(newLang);
    localStorage.setItem('smart_escape_lang', newLang);
  }, []);

  const setTheme = useCallback((newTheme: 'dark' | 'light') => {
    setThemeState(newTheme);
    localStorage.setItem('smart_escape_theme', newTheme);
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeState((prev) => {
      const next = prev === 'dark' ? 'light' : 'dark';
      localStorage.setItem('smart_escape_theme', next);
      return next;
    });
  }, []);

  const toggleHighContrast = useCallback(() => {
    setIsHighContrast((prev) => {
      const next = !prev;
      localStorage.setItem('smart_escape_contrast', next ? 'high' : 'normal');
      if (next) {
        document.body.classList.add('high-contrast');
      } else {
        document.body.classList.remove('high-contrast');
      }
      return next;
    });
  }, []);

  // Compute Dijkstra route reactively
  const routeResult = useMemo(() => {
    return solveEvacuationRoute(buildingData, {
      startNodeId,
      blockedNodes,
      blockedEdges,
      closedExits,
    });
  }, [buildingData, startNodeId, blockedNodes, blockedEdges, closedExits]);

  // Hazard Toggles
  const toggleNodeHazard = useCallback((nodeId: string) => {
    setBlockedNodes((prev) => {
      const next = new Set(prev);
      if (next.has(nodeId)) {
        next.delete(nodeId);
      } else {
        next.add(nodeId);
      }
      return next;
    });
  }, []);

  const toggleEdgeHazard = useCallback((edgeId: string) => {
    setBlockedEdges((prev) => {
      const next = new Set(prev);
      if (next.has(edgeId)) {
        next.delete(edgeId);
      } else {
        next.add(edgeId);
      }
      return next;
    });
  }, []);

  const toggleExitClosed = useCallback((exitId: string) => {
    setClosedExits((prev) => {
      const next = new Set(prev);
      if (next.has(exitId)) {
        next.delete(exitId);
      } else {
        next.add(exitId);
      }
      return next;
    });
  }, []);

  // Restore Initial State
  const resetToInitialState = useCallback(() => {
    setBlockedNodes(new Set(buildingData.initial_state.blocked_nodes));
    setBlockedEdges(new Set(buildingData.initial_state.blocked_edges));
    setClosedExits(new Set(buildingData.initial_state.closed_exits));
    // Default to first room/junction if start became invalid
    const firstStart = buildingData.nodes.find((n) => n.type === 'room' || n.type === 'junction')?.id || 'R1';
    setStartNodeId(firstStart);
  }, [buildingData]);

  // Load New Building
  const loadBuildingData = useCallback((newData: BuildingData) => {
    setBuildingData(newData);
    setBlockedNodes(new Set(newData.initial_state.blocked_nodes));
    setBlockedEdges(new Set(newData.initial_state.blocked_edges));
    setClosedExits(new Set(newData.initial_state.closed_exits));
    const firstRoom = newData.nodes.find((n) => n.type === 'room' || n.type === 'junction')?.id || 'R1';
    setStartNodeId(firstRoom);
  }, []);

  // Apply Section 4.1 Presets
  const applyPresetScenario = useCallback(
    (scenarioId: 'baseline' | 'blocked_c2' | 'closed_exits' | 'start_r2' | 'blocked_r1') => {
      switch (scenarioId) {
        case 'baseline':
          setStartNodeId('R1');
          setBlockedNodes(new Set());
          setBlockedEdges(new Set());
          setClosedExits(new Set());
          break;
        case 'blocked_c2':
          setStartNodeId('R1');
          setBlockedNodes(new Set(['C2']));
          setBlockedEdges(new Set());
          setClosedExits(new Set());
          break;
        case 'closed_exits':
          setStartNodeId('R1');
          setBlockedNodes(new Set());
          setBlockedEdges(new Set());
          setClosedExits(new Set(['E1', 'E2']));
          break;
        case 'start_r2':
          setStartNodeId('R2');
          setBlockedNodes(new Set());
          setBlockedEdges(new Set());
          setClosedExits(new Set());
          break;
        case 'blocked_r1':
          setStartNodeId('R1');
          setBlockedNodes(new Set(['R1']));
          setBlockedEdges(new Set());
          setClosedExits(new Set());
          break;
      }
    },
    []
  );

  const t = translations[lang];

  const value = {
    buildingData,
    startNodeId,
    blockedNodes,
    blockedEdges,
    closedExits,
    routeResult,
    lang,
    t,
    theme,
    isHighContrast,
    activeTestRunning,
    setStartNodeId,
    toggleNodeHazard,
    toggleEdgeHazard,
    toggleExitClosed,
    resetToInitialState,
    loadBuildingData,
    applyPresetScenario,
    setLang,
    toggleTheme,
    setTheme,
    toggleHighContrast,
  };

  return <SimulationContext.Provider value={value}>{children}</SimulationContext.Provider>;
};

export const useSimulation = (): SimulationContextValue => {
  const context = useContext(SimulationContext);
  if (!context) {
    throw new Error('useSimulation must be used within a SimulationProvider');
  }
  return context;
};
