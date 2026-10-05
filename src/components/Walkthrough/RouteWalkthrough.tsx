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

  // Reset when route changes
  useEffect(() => {
    setIsPlaying(false);
    setCurrentIndex(0);
    onStepChange(null);
    if (timerRef.current) clearInterval(timerRef.current);
  }, [routeResult.statusString, onStepChange]);

  // Handle active playback
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

  // Update avatar node on step change
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
    <div className="w-full glass-panel border border-slate-700/60 p-4 rounded-xl shadow-xl space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-cyan-400" />
          <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
            {t.walkthroughTitle}
          </h4>
        </div>
        <div className="text-xs font-mono text-cyan-400 bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-500/30">
          Step {currentIndex + 1} of {path.length}: {path[currentIndex]}
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Playback Controls */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={handlePlayPause}
            className={`btn-tactical py-1.5 px-3 text-xs font-semibold ${
              isPlaying ? 'bg-amber-600/30 text-amber-300 border-amber-500/50' : 'btn-tactical-primary'
            }`}
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5" />
                <span>{t.pauseWalkthrough}</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>{t.playWalkthrough}</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleStepForward}
            disabled={currentIndex >= path.length - 1}
            className="btn-tactical py-1.5 px-2 text-xs disabled:opacity-40"
            title={t.stepForward}
          >
            <SkipForward className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={handleReset}
            className="btn-tactical py-1.5 px-2 text-xs"
            title={t.resetWalkthrough}
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Speed Adjustment */}
        <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
          <span>{t.speed}:</span>
          {[1500, 1000, 500].map((ms, idx) => (
            <button
              key={ms}
              type="button"
              onClick={() => setSpeedMs(ms)}
              className={`px-2 py-0.5 rounded border text-[11px] font-semibold transition-all ${
                speedMs === ms
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {idx === 0 ? '0.75x' : idx === 1 ? '1x' : '2x'}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
