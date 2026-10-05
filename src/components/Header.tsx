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
    <header className="app-header">
      <div className="header-inner">
        {/* Brand & Identity */}
        <div className="header-brand">
          <div className="brand-icon-box">
            <Flame size={22} />
          </div>
          <div className="brand-title-group">
            <h1>
              <span>{t.appTitle}</span>
              <span className="brand-badge">{t.contestBadge}</span>
            </h1>
            <p className="brand-subtitle">{t.appSubtitle}</p>
          </div>
        </div>

        {/* Global Action Toolbar */}
        <div className="header-actions">
          {/* Bilingual Switcher */}
          <div className="lang-switcher">
            <Languages size={14} style={{ marginLeft: 6, marginRight: 4, color: 'var(--text-muted)' }} />
            <button
              type="button"
              onClick={() => setLang('en')}
              className={`lang-btn ${lang === 'en' ? 'active' : ''}`}
            >
              EN
            </button>
            <button
              type="button"
              onClick={() => setLang('bn')}
              className={`lang-btn ${lang === 'bn' ? 'active' : ''}`}
            >
              বাংলা
            </button>
          </div>

          {/* High Contrast Mode */}
          <button
            type="button"
            onClick={toggleHighContrast}
            className={`tactical-btn ${isHighContrast ? 'tactical-btn-primary' : ''}`}
            title={isHighContrast ? t.normalContrastToggle : t.highContrastToggle}
          >
            <Eye size={14} />
            <span>{isHighContrast ? 'Standard Mode' : 'High Contrast'}</span>
          </button>

          {/* Export PNG */}
          <button
            type="button"
            onClick={handleExportPng}
            className="tactical-btn"
            title={t.exportPngButton}
          >
            <Download size={14} />
            <span>PNG Map</span>
          </button>

          {/* Export State JSON */}
          <button
            type="button"
            onClick={handleExportJson}
            className="tactical-btn"
            title={t.exportJsonButton}
          >
            <FileJson size={14} />
            <span>State JSON</span>
          </button>

          {/* GitHub Repo */}
          <a
            href="https://github.com/Ratul-NotFound/Smart-Escape"
            target="_blank"
            rel="noopener noreferrer"
            className="tactical-btn"
            title="GitHub Repository"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
            </svg>
          </a>
        </div>
      </div>
    </header>
  );
};
