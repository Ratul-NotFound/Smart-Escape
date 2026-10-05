// ==============================================================================
// Utility: Export Current Simulation State as Valid JSON
// ==============================================================================

import { BuildingData } from '../domain/types';

export function exportBuildingStateAsJson(
  building: BuildingData,
  blockedNodes: Set<string>,
  blockedEdges: Set<string>,
  closedExits: Set<string>,
  filename = 'building_state.json'
): void {
  const exportPayload: BuildingData = {
    ...building,
    initial_state: {
      blocked_nodes: Array.from(blockedNodes),
      blocked_edges: Array.from(blockedEdges),
      closed_exits: Array.from(closedExits),
    },
  };

  const jsonString = JSON.stringify(exportPayload, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
