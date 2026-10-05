// ==============================================================================
// Domain Routing Engine: Dijkstra Algorithm with Strict Deterministic Tie-Breaking
// Section 3.3 & Section 4.1 Compliance + Yen's Style Alternative Route Discovery
// ==============================================================================

import { BuildingData, RouteResult, AlternativePath } from './types';

export function comparePathSequences(a: string[], b: string[]): number {
  const minLen = Math.min(a.length, b.length);
  for (let i = 0; i < minLen; i++) {
    const cmp = a[i].localeCompare(b[i]);
    if (cmp !== 0) return cmp;
  }
  return a.length - b.length;
}

export interface DijkstraOptions {
  startNodeId: string;
  blockedNodes: Set<string>;
  blockedEdges: Set<string>;
  closedExits: Set<string>;
}

interface PathState {
  cost: number;
  nodeId: string;
  path: string[];
  edgeIds: string[];
}

interface CandidateExitRoute {
  exitId: string;
  cost: number;
  path: string[];
  edgeIds: string[];
}

// Internal core solver that finds all reachable exit routes
function findReachableExitRoutes(
  building: BuildingData,
  options: DijkstraOptions
): CandidateExitRoute[] {
  const { startNodeId, blockedNodes, blockedEdges, closedExits } = options;

  if (blockedNodes.has(startNodeId)) return [];

  const nodeMap = new Map(building.nodes.map((n) => [n.id, n]));
  const startNode = nodeMap.get(startNodeId);
  if (!startNode) return [];

  interface Neighbor {
    to: string;
    edgeId: string;
    cost: number;
  }

  const adj = new Map<string, Neighbor[]>();
  for (const node of building.nodes) {
    adj.set(node.id, []);
  }

  for (const edge of building.edges) {
    if (blockedEdges.has(edge.id)) continue;
    if (blockedNodes.has(edge.from) || blockedNodes.has(edge.to)) continue;
    if (closedExits.has(edge.from) || closedExits.has(edge.to)) continue;

    adj.get(edge.from)?.push({ to: edge.to, edgeId: edge.id, cost: edge.cost });
    adj.get(edge.to)?.push({ to: edge.from, edgeId: edge.id, cost: edge.cost });
  }

  const openExits = new Set(
    building.nodes
      .filter((n) => n.type === 'exit' && !closedExits.has(n.id))
      .map((n) => n.id)
  );

  if (openExits.size === 0) return [];

  const bestCost = new Map<string, number>();
  const bestPath = new Map<string, string[]>();
  const bestEdges = new Map<string, string[]>();

  const queue: PathState[] = [
    {
      cost: 0,
      nodeId: startNodeId,
      path: [startNodeId],
      edgeIds: [],
    },
  ];

  bestCost.set(startNodeId, 0);
  bestPath.set(startNodeId, [startNodeId]);
  bestEdges.set(startNodeId, []);

  const exitRoutes: CandidateExitRoute[] = [];

  while (queue.length > 0) {
    queue.sort((a, b) => {
      if (a.cost !== b.cost) return a.cost - b.cost;
      return comparePathSequences(a.path, b.path);
    });

    const current = queue.shift()!;

    const recorded = bestCost.get(current.nodeId);
    if (recorded !== undefined && current.cost > recorded) {
      continue;
    }

    if (openExits.has(current.nodeId)) {
      exitRoutes.push({
        exitId: current.nodeId,
        cost: current.cost,
        path: current.path,
        edgeIds: current.edgeIds,
      });
      continue;
    }

    const neighbors = adj.get(current.nodeId) || [];
    for (const neighbor of neighbors) {
      if (current.path.includes(neighbor.to)) continue;

      const nextCost = current.cost + neighbor.cost;
      const nextPath = [...current.path, neighbor.to];
      const nextEdges = [...current.edgeIds, neighbor.edgeId];

      const prevCost = bestCost.get(neighbor.to);

      let shouldRelax = false;
      if (prevCost === undefined || nextCost < prevCost) {
        shouldRelax = true;
      } else if (nextCost === prevCost) {
        const prevPath = bestPath.get(neighbor.to)!;
        if (comparePathSequences(nextPath, prevPath) < 0) {
          shouldRelax = true;
        }
      }

      if (shouldRelax) {
        bestCost.set(neighbor.to, nextCost);
        bestPath.set(neighbor.to, nextPath);
        bestEdges.set(neighbor.to, nextEdges);

        queue.push({
          cost: nextCost,
          nodeId: neighbor.to,
          path: nextPath,
          edgeIds: nextEdges,
        });
      }
    }
  }

  return exitRoutes;
}

export function solveEvacuationRoute(
  building: BuildingData,
  options: DijkstraOptions
): RouteResult {
  const { startNodeId, blockedNodes } = options;

  // 1. Guard: Check if start node is blocked
  if (blockedNodes.has(startNodeId)) {
    return {
      status: 'START_LOCATION_BLOCKED',
      statusString: 'Starting location blocked',
      path: [],
      edgeIds: [],
      exitId: null,
      totalCost: Infinity,
      alternativeRoutes: [],
    };
  }

  // 2. Compute reachable exit routes
  const exitRoutes = findReachableExitRoutes(building, options);

  if (exitRoutes.length === 0) {
    return {
      status: 'NO_ROUTE_AVAILABLE',
      statusString: 'No route available',
      path: [],
      edgeIds: [],
      exitId: null,
      totalCost: Infinity,
      alternativeRoutes: [],
    };
  }

  // 3. Deterministic official tie-breaking (Section 3.3):
  // Tier 1: Minimum total cost
  // Tier 2: Lexicographically smallest exit ID ('E1' < 'E2')
  // Tier 3: Lexicographically smallest sequence of node IDs
  exitRoutes.sort((a, b) => {
    if (a.cost !== b.cost) return a.cost - b.cost;
    if (a.exitId !== b.exitId) return a.exitId.localeCompare(b.exitId);
    return comparePathSequences(a.path, b.path);
  });

  const optimal = exitRoutes[0];
  const formattedRoute = `${optimal.path.join(' - ')}; cost ${optimal.cost}`;

  // 4. Discovery of Alternative Routes:
  // Combines secondary exit candidates and edge-deviation detour paths
  const seenPaths = new Set<string>([optimal.path.join('->')]);
  const alternativeRoutes: AlternativePath[] = [];

  // A. Other exit candidates from the primary search
  for (let i = 1; i < exitRoutes.length; i++) {
    const candidate = exitRoutes[i];
    const key = candidate.path.join('->');
    if (!seenPaths.has(key)) {
      seenPaths.add(key);
      alternativeRoutes.push({
        path: candidate.path,
        edgeIds: candidate.edgeIds,
        exitId: candidate.exitId,
        totalCost: candidate.cost,
        deltaCost: candidate.cost - optimal.cost,
      });
    }
  }

  // B. Yen's style edge-deviation: temporarily disable each edge along optimal path to discover detours
  if (alternativeRoutes.length < 3) {
    for (const edgeId of optimal.edgeIds) {
      const devBlockedEdges = new Set(options.blockedEdges);
      devBlockedEdges.add(edgeId);

      const devRoutes = findReachableExitRoutes(building, {
        ...options,
        blockedEdges: devBlockedEdges,
      });

      if (devRoutes.length > 0) {
        devRoutes.sort((a, b) => {
          if (a.cost !== b.cost) return a.cost - b.cost;
          if (a.exitId !== b.exitId) return a.exitId.localeCompare(b.exitId);
          return comparePathSequences(a.path, b.path);
        });

        const devCandidate = devRoutes[0];
        const key = devCandidate.path.join('->');
        if (!seenPaths.has(key)) {
          seenPaths.add(key);
          alternativeRoutes.push({
            path: devCandidate.path,
            edgeIds: devCandidate.edgeIds,
            exitId: devCandidate.exitId,
            totalCost: devCandidate.cost,
            deltaCost: devCandidate.cost - optimal.cost,
          });
        }
      }

      if (alternativeRoutes.length >= 3) break;
    }
  }

  // Sort alternative routes by totalCost, then deltaCost, then exitId
  alternativeRoutes.sort((a, b) => {
    if (a.totalCost !== b.totalCost) return a.totalCost - b.totalCost;
    if (a.exitId !== b.exitId) return a.exitId.localeCompare(b.exitId);
    return comparePathSequences(a.path, b.path);
  });

  return {
    status: 'OPTIMAL_ROUTE_FOUND',
    statusString: formattedRoute,
    path: optimal.path,
    edgeIds: optimal.edgeIds,
    exitId: optimal.exitId,
    totalCost: optimal.cost,
    alternativeRoutes: alternativeRoutes.slice(0, 3),
  };
}
