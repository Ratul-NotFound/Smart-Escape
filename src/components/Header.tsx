// ==============================================================================
// Header: Navigation, Bilingual Switcher & Top-Level Tactical Actions
// ==============================================================================

import React from 'react';
import { useSimulation } from '../context/SimulationContext';
import { exportMapAsPng } from '../utils/exportPng';
import { exportBuildingStateAsJson } from '../utils/exportJson';
import {
  Languages,
  Eye,
  Download,
  FileJson,
  Flame,
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    lang,
    setLang,
    isHighContrast,
    toggleHighContrast,
    buildingData,
    blockedNodes,
    blockedEdges,
    closedExits,
    t,
  } = useSimulation();

  const handleExportPng = () => {
    exportMapAsPng('evacuation-svg-canvas', `${buildingData.building.replace(/\s+/g, '_')}_evacuation_route.png`);
  };

  const handleExportJson = () => {
    exportBuildingStateAsJson(
      buildingData,
      blockedNodes,
      blockedEdges,
      closedExits,
      `${buildingData.building.replace(/\s+/g, '_')}_state.json`
    );
  };

  return (
    <header className="w-full glass-panel border-b border-slate-800 bg-slate-950/80 sticky top-0 z-50 px-4 py-3 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
        {/* Logo & Identity */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center shadow-lg shadow-emerald-500/20 border border-emerald-400/40">
            <Flame className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg md:text-xl font-extrabold text-white tracking-tight flex items-center gap-1.5">
                {t.appTitle}
              </h1>
              <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                {t.contestBadge}
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">{t.appSubtitle}</p>
          </div>
        </div>

        {/* Global Controls: Language, High Contrast, Export */}
        <div className="flex flex-wrap items-center gap-2">
          {/* 1. Bilingual Switcher (Section 3.2 & Rulebook 5.6) */}
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-1 text-xs font-semibold">
            <Languages className="w-3.5 h-3.5 text-slate-400 ml-1.5 mr-1" />
            <button
              type="button"
              onClick={() => setLang('en')}
              className={`px-2.5 py-1 rounded-md transition-all ${
                lang === 'en'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              EN
            </button>
            <button
              type="button"
              onClick={() => setLang('bn')}
              className={`px-2.5 py-1 rounded-md transition-all ${
                lang === 'bn'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              বাংলা
            </button>
          </div>

          {/* 2. High Contrast Accessibility Mode */}
          <button
            type="button"
            onClick={toggleHighContrast}
            className={`btn-tactical text-xs py-1.5 px-2.5 ${
              isHighContrast
                ? 'bg-yellow-400 text-black border-yellow-300 font-bold'
                : 'text-slate-300 hover:text-white'
            }`}
            title={isHighContrast ? t.normalContrastToggle : t.highContrastToggle}
          >
            <Eye className="w-3.5 h-3.5" />
            <span className="hidden md:inline">
              {isHighContrast ? 'Standard Mode' : 'High Contrast'}
            </span>
          </button>

          {/* 3. Export PNG */}
          <button
            type="button"
            onClick={handleExportPng}
            className="btn-tactical text-xs py-1.5 px-2.5 text-slate-300 hover:text-emerald-400 hover:border-emerald-500/40"
            title={t.exportPngButton}
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden lg:inline">PNG Map</span>
          </button>

          {/* 4. Export State JSON */}
          <button
            type="button"
            onClick={handleExportJson}
            className="btn-tactical text-xs py-1.5 px-2.5 text-slate-300 hover:text-cyan-400 hover:border-cyan-500/40"
            title={t.exportJsonButton}
          >
            <FileJson className="w-3.5 h-3.5" />
            <span className="hidden lg:inline">State JSON</span>
          </button>

          {/* 5. GitHub Link */}
          <a
            href="https://github.com/Ratul-NotFound/Smart-Escape"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-tactical text-xs py-1.5 px-2.5 text-slate-300 hover:text-white"
            title="GitHub Repository"
          >
            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
              <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
            </svg>
          </a>
        </div>
      </div>
    </header>
  );
};
