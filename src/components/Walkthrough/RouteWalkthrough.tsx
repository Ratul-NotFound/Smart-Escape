// ==============================================================================
// RouteWalkthrough: Animated Simulation Walkthrough Player (Section 4.2 Extension)
// ==============================================================================

import React, { useEffect, useState, useRef } from 'react';
import { useSimulation } from '../../context/SimulationContext';
import { Play, Pause, SkipForward, RotateCcw, Activity } from 'lucide-react';

interface RouteWalkthroughProps {
  onStepChange: (nodeId: string | null) => void;
}

export const RouteWalkthrough: React.FC<RouteWalkthroughProps> = ({ onStepChange }) => {
  const { routeResult, t } = useSimulation();
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [speedMs, setSpeedMs] = useState<number>(1000);
  const timerRef = useRef<number | null>(null);

  const path = routeResult.path;
  const isAvailable = routeResult.status === 'OPTIMAL_ROUTE_FOUND' && path.length > 0;

  useEffect(() => {
    setIsPlaying(false);
    setCurrentIndex(0);
    onStepChange(null);
    if (timerRef.current) clearInterval(timerRef.current);
  }, [routeResult.statusString, onStepChange]);

  useEffect(() => {
    if (!isPlaying || !isAvailable) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = window.setInterval(() => {
      setCurrentIndex((prev) => {
        const next = prev + 1;
        if (next >= path.length) {
          setIsPlaying(false);
          return prev;
        }
        return next;
      });
    }, speedMs);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, speedMs, path.length, isAvailable]);

  useEffect(() => {
    if (isAvailable && path[currentIndex]) {
      onStepChange(path[currentIndex]);
    } else {
      onStepChange(null);
    }
  }, [currentIndex, isAvailable, path, onStepChange]);

  const handlePlayPause = () => {
    if (!isAvailable) return;
    if (currentIndex >= path.length - 1) {
      setCurrentIndex(0);
    }
    setIsPlaying(!isPlaying);
  };

  const handleStepForward = () => {
    if (!isAvailable) return;
    setIsPlaying(false);
    setCurrentIndex((prev) => Math.min(prev + 1, path.length - 1));
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentIndex(0);
    onStepChange(isAvailable ? path[0] : null);
  };

  if (!isAvailable) return null;

  return (
    <div className="walkthrough-card">
      <div className="walkthrough-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Activity size={16} style={{ color: 'var(--color-primary)' }} />
          <h4 style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-white)' }}>
            {t.walkthroughTitle}
          </h4>
        </div>
        <div style={{
          fontSize: '0.75rem',
          fontFamily: 'var(--font-mono)',
          color: 'var(--color-primary)',
          background: 'rgba(56, 189, 248, 0.1)',
          padding: '2px 8px',
          borderRadius: '6px',
          border: '1px solid rgba(56, 189, 248, 0.3)'
        }}>
          Step {currentIndex + 1} of {path.length}: <strong>{path[currentIndex]}</strong>
        </div>
      </div>

      <div className="walkthrough-controls-row">
        {/* Playback Button Group */}
        <div className="btn-player-group">
          <button
            type="button"
            onClick={handlePlayPause}
            className={`tactical-btn ${isPlaying ? 'tactical-btn-danger' : 'tactical-btn-primary'}`}
          >
            {isPlaying ? (
              <>
                <Pause size={13} />
                <span>{t.pauseWalkthrough}</span>
              </>
            ) : (
              <>
                <Play size={13} fill="currentColor" />
                <span>{t.playWalkthrough}</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleStepForward}
            disabled={currentIndex >= path.length - 1}
            className="tactical-btn"
            title={t.stepForward}
            style={{ opacity: currentIndex >= path.length - 1 ? 0.4 : 1 }}
          >
            <SkipForward size={14} />
          </button>

          <button
            type="button"
            onClick={handleReset}
            className="tactical-btn"
            title={t.resetWalkthrough}
          >
            <RotateCcw size={14} />
          </button>
        </div>

        {/* Speed Adjustment */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{t.speed}:</span>
          <div className="speed-segmented-control">
            {[1500, 1000, 500].map((ms, idx) => (
              <button
                key={ms}
                type="button"
                onClick={() => setSpeedMs(ms)}
                className={`speed-btn ${speedMs === ms ? 'active' : ''}`}
              >
                {idx === 0 ? '0.75x' : idx === 1 ? '1x' : '2x'}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
