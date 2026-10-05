// ==============================================================================
// Automated Verification: Section 4.1 Sample Checks
// ==============================================================================

import { defaultBuildingData } from '../data/defaultBuilding';
import { solveEvacuationRoute } from './dijkstra';

export interface TestCaseResult {
  id: string;
  scenario: string;
  expected: string;
  actual: string;
  passed: boolean;
}

export function runOfficialSection4Tests(): TestCaseResult[] {
  const results: TestCaseResult[] = [];

  // TC-1: Baseline -> Start R1
  const tc1 = solveEvacuationRoute(defaultBuildingData, {
    startNodeId: 'R1',
    blockedNodes: new Set(),
    blockedEdges: new Set(),
    closedExits: new Set(),
  });
  results.push({
    id: 'TC-1',
    scenario: 'Baseline (Start R1)',
    expected: 'R1 - C1 - C2 - E1; cost 7',
    actual: tc1.statusString,
    passed: tc1.statusString === 'R1 - C1 - C2 - E1; cost 7',
  });

  // TC-2: Blocked junction -> Start R1, block C2
  const tc2 = solveEvacuationRoute(defaultBuildingData, {
    startNodeId: 'R1',
    blockedNodes: new Set(['C2']),
    blockedEdges: new Set(),
    closedExits: new Set(),
  });
  results.push({
    id: 'TC-2',
    scenario: 'Blocked Junction (Start R1, block C2)',
    expected: 'R1 - C1 - C3 - C4 - E2; cost 11',
    actual: tc2.statusString,
    passed: tc2.statusString === 'R1 - C1 - C3 - C4 - E2; cost 11',
  });

  // TC-3: Exits closed -> Start R1, close E1 and E2
  const tc3 = solveEvacuationRoute(defaultBuildingData, {
    startNodeId: 'R1',
    blockedNodes: new Set(),
    blockedEdges: new Set(),
    closedExits: new Set(['E1', 'E2']),
  });
  results.push({
    id: 'TC-3',
    scenario: 'Exits closed (Start R1, close E1 & E2)',
    expected: 'No route available',
    actual: tc3.statusString,
    passed: tc3.statusString === 'No route available',
  });

  // TC-4: Different start -> Start R2
  const tc4 = solveEvacuationRoute(defaultBuildingData, {
    startNodeId: 'R2',
    blockedNodes: new Set(),
    blockedEdges: new Set(),
    closedExits: new Set(),
  });
  results.push({
    id: 'TC-4',
    scenario: 'Different start (Start R2)',
    expected: 'R2 - C3 - C4 - E2; cost 7',
    actual: tc4.statusString,
    passed: tc4.statusString === 'R2 - C3 - C4 - E2; cost 7',
  });

  // TC-5: Blocked start -> Start R1, then block R1
  const tc5 = solveEvacuationRoute(defaultBuildingData, {
    startNodeId: 'R1',
    blockedNodes: new Set(['R1']),
    blockedEdges: new Set(),
    closedExits: new Set(),
  });
  results.push({
    id: 'TC-5',
    scenario: 'Blocked start (Start R1, block R1)',
    expected: 'Starting location blocked',
    actual: tc5.statusString,
    passed: tc5.statusString === 'Starting location blocked',
  });

  return results;
}
