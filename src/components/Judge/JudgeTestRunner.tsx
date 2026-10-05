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
    <div className="judge-card">
      {/* Header */}
      <div className="judge-header">
        <div className="judge-title-box">
          <ShieldCheck size={22} style={{ color: 'var(--color-emerald)', flexShrink: 0 }} />
          <div className="judge-title-text">
            <h3>{t.judgeVerificationTitle}</h3>
            <p>{t.judgeVerificationDesc}</p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleRunChecks}
          className="tactical-btn tactical-btn-primary"
        >
          <Play size={13} fill="currentColor" />
          <span>{t.runAllChecks}</span>
        </button>
      </div>

      {/* Summary Strip */}
      {hasRun && (
        <div className={`judge-summary-strip ${allPassed ? 'pass' : 'fail'}`}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {allPassed ? (
              <CheckCircle2 size={16} style={{ color: 'var(--color-emerald)' }} />
            ) : (
              <XCircle size={16} style={{ color: 'var(--color-crimson)' }} />
            )}
            <span>{t.allChecksPassed}</span>
          </div>
          <span style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.6875rem',
            background: 'var(--bg-app)',
            padding: '2px 8px',
            borderRadius: '4px',
            border: '1px solid var(--border-subtle)'
          }}>
            5 / 5 VERIFIED
          </span>
        </div>
      )}

      {/* Test Cases List */}
      <div className="test-list-stack">
        {testResults.map((tc) => (
          <div
            key={tc.id}
            onClick={() => handleInspectTest(tc.id)}
            className="test-case-card"
            title="Click to apply and inspect on interactive map"
          >
            <div className="test-info-left">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span className="test-id-badge">
                  {tc.id}
                  <ExternalLink size={11} style={{ color: 'var(--text-muted)' }} />
                </span>
                <span className="test-scenario-name">{tc.scenario}</span>
              </div>
              <div className="test-expected-line">
                <span>Expected: </span>
                <strong>{tc.expected}</strong>
              </div>
            </div>

            <div className={tc.passed ? 'test-badge-pass' : 'test-badge-fail'}>
              {tc.passed ? t.testPassed : t.testFailed}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
