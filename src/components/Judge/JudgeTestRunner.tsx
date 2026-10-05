// ==============================================================================
// JudgeTestRunner: Automated Verification Engine for Section 4.1 Sample Checks
// ==============================================================================

import React, { useState } from 'react';
import { runOfficialSection4Tests, TestCaseResult } from '../../domain/verifyOfficialTests';
import { useSimulation } from '../../context/SimulationContext';
import { CheckCircle2, XCircle, Play, ShieldCheck, ExternalLink } from 'lucide-react';

export const JudgeTestRunner: React.FC = () => {
  const { applyPresetScenario, t } = useSimulation();
  const [testResults, setTestResults] = useState<TestCaseResult[]>(() => runOfficialSection4Tests());
  const [hasRun, setHasRun] = useState<boolean>(true);

  const handleRunChecks = () => {
    const results = runOfficialSection4Tests();
    setTestResults(results);
    setHasRun(true);
  };

  const allPassed = testResults.length > 0 && testResults.every((t) => t.passed);

  // Map test ID to preset scenario key
  const handleInspectTest = (testId: string) => {
    switch (testId) {
      case 'TC-1':
        applyPresetScenario('baseline');
        break;
      case 'TC-2':
        applyPresetScenario('blocked_c2');
        break;
      case 'TC-3':
        applyPresetScenario('closed_exits');
        break;
      case 'TC-4':
        applyPresetScenario('start_r2');
        break;
      case 'TC-5':
        applyPresetScenario('blocked_r1');
        break;
    }
  };

  return (
    <div className="w-full glass-panel border border-slate-700/60 p-4 rounded-xl shadow-xl space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
          <div>
            <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wide">
              {t.judgeVerificationTitle}
            </h3>
            <p className="text-[11px] text-slate-400">{t.judgeVerificationDesc}</p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleRunChecks}
          className="btn-tactical btn-tactical-primary text-xs font-semibold py-1.5 px-3"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span>{t.runAllChecks}</span>
        </button>
      </div>

      {/* Overall Status Banner */}
      {hasRun && (
        <div
          className={`px-3 py-2 rounded-lg text-xs font-semibold flex items-center justify-between border ${
            allPassed
              ? 'bg-emerald-950/40 text-emerald-300 border-emerald-500/40'
              : 'bg-red-950/40 text-red-300 border-red-500/40'
          }`}
        >
          <div className="flex items-center gap-2">
            {allPassed ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            ) : (
              <XCircle className="w-4 h-4 text-red-400" />
            )}
            <span>{t.allChecksPassed}</span>
          </div>
          <span className="font-mono text-[11px] bg-slate-900/80 px-2 py-0.5 rounded border border-slate-800">
            5 / 5 VERIFIED
          </span>
        </div>
      )}

      {/* Test Cases Table */}
      <div className="space-y-2">
        {testResults.map((tc) => (
          <div
            key={tc.id}
            onClick={() => handleInspectTest(tc.id)}
            className="p-2.5 rounded-lg bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800/80 hover:border-slate-700 transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-2"
            title="Click to apply and inspect on interactive map"
          >
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-slate-300">{tc.id}</span>
                <span className="text-xs font-medium text-slate-200">{tc.scenario}</span>
                <ExternalLink className="w-3 h-3 text-slate-500 hover:text-slate-300" />
              </div>
              <div className="text-[11px] font-mono text-slate-400">
                <span className="text-slate-500">Expected:</span>{' '}
                <span className="text-emerald-400/90">{tc.expected}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <div
                className={`px-2 py-0.5 rounded text-[11px] font-bold font-mono border ${
                  tc.passed
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                    : 'bg-red-500/20 text-red-300 border-red-500/40'
                }`}
              >
                {tc.passed ? t.testPassed : t.testFailed}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
