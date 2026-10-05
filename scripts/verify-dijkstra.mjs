import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const buildingData = JSON.parse(fs.readFileSync(path.join(__dirname, '../building.json'), 'utf8'));

// Compare path sequences lexicographically
function comparePathSequences(a, b) {
  const minLen = Math.min(a.length, b.length);
  for (let i = 0; i < minLen; i++) {
    const cmp = a[i].localeCompare(b[i]);
    if (cmp !== 0) return cmp;
  }
  return a.length - b.length;
}

function solveEvacuationRoute(building, options) {
  const { startNodeId, blockedNodes, blockedEdges, closedExits } = options;

  if (blockedNodes.has(startNodeId)) {
    return {
      status: 'START_LOCATION_BLOCKED',
      statusString: 'Starting location blocked',
      path: [],
      edgeIds: [],
      exitId: null,
      totalCost: Infinity,
    };
  }

  const nodeMap = new Map(building.nodes.map((n) => [n.id, n]));
  const startNode = nodeMap.get(startNodeId);
  if (!startNode) {
    return {
      status: 'NO_ROUTE_AVAILABLE',
      statusString: 'No route available',
      path: [],
      edgeIds: [],
      exitId: null,
      totalCost: Infinity,
    };
  }

  const adj = new Map();
  for (const node of building.nodes) adj.set(node.id, []);

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

  if (openExits.size === 0) {
    return {
      status: 'NO_ROUTE_AVAILABLE',
      statusString: 'No route available',
      path: [],
      edgeIds: [],
      exitId: null,
      totalCost: Infinity,
    };
  }

  const bestCost = new Map();
  const bestPath = new Map();
  const bestEdges = new Map();

  const queue = [
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

  const exitRoutes = [];

  while (queue.length > 0) {
    queue.sort((a, b) => {
      if (a.cost !== b.cost) return a.cost - b.cost;
      return comparePathSequences(a.path, b.path);
    });

    const current = queue.shift();

    const recorded = bestCost.get(current.nodeId);
    if (recorded !== undefined && current.cost > recorded) continue;

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
        const prevPath = bestPath.get(neighbor.to);
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

  if (exitRoutes.length === 0) {
    return {
      status: 'NO_ROUTE_AVAILABLE',
      statusString: 'No route available',
      path: [],
      edgeIds: [],
      exitId: null,
      totalCost: Infinity,
    };
  }

  exitRoutes.sort((a, b) => {
    if (a.cost !== b.cost) return a.cost - b.cost;
    if (a.exitId !== b.exitId) return a.exitId.localeCompare(b.exitId);
    return comparePathSequences(a.path, b.path);
  });

  const optimal = exitRoutes[0];
  const formattedRoute = `${optimal.path.join(' - ')}; cost ${optimal.cost}`;

  return {
    status: 'OPTIMAL_ROUTE_FOUND',
    statusString: formattedRoute,
    path: optimal.path,
    edgeIds: optimal.edgeIds,
    exitId: optimal.exitId,
    totalCost: optimal.cost,
  };
}

// Run test cases
const tests = [
  {
    name: 'TC-1 Baseline (Start R1)',
    opts: { startNodeId: 'R1', blockedNodes: new Set(), blockedEdges: new Set(), closedExits: new Set() },
    expected: 'R1 - C1 - C2 - E1; cost 7'
  },
  {
    name: 'TC-2 Blocked junction (Start R1, block C2)',
    opts: { startNodeId: 'R1', blockedNodes: new Set(['C2']), blockedEdges: new Set(), closedExits: new Set() },
    expected: 'R1 - C1 - C3 - C4 - E2; cost 11'
  },
  {
    name: 'TC-3 Exits closed (Start R1, close E1 & E2)',
    opts: { startNodeId: 'R1', blockedNodes: new Set(), blockedEdges: new Set(), closedExits: new Set(['E1', 'E2']) },
    expected: 'No route available'
  },
  {
    name: 'TC-4 Different start (Start R2)',
    opts: { startNodeId: 'R2', blockedNodes: new Set(), blockedEdges: new Set(), closedExits: new Set() },
    expected: 'R2 - C3 - C4 - E2; cost 7'
  },
  {
    name: 'TC-5 Blocked start (Start R1, block R1)',
    opts: { startNodeId: 'R1', blockedNodes: new Set(['R1']), blockedEdges: new Set(), closedExits: new Set() },
    expected: 'Starting location blocked'
  }
];

let allPassed = true;
console.log('==================================================');
console.log('   OFFICIAL SECTION 4.1 VERIFICATION TEST RUNNER   ');
console.log('==================================================');

tests.forEach((t, i) => {
  const res = solveEvacuationRoute(buildingData, t.opts);
  const pass = res.statusString === t.expected;
  if (!pass) allPassed = false;
  console.log(`[${pass ? 'PASS' : 'FAIL'}] ${t.name}`);
  console.log(`       Expected: "${t.expected}"`);
  console.log(`       Actual:   "${res.statusString}"`);
});

console.log('==================================================');
if (allPassed) {
  console.log('>>> ALL 5 OFFICIAL SAMPLE CHECKS PASSED 100%! <<<');
} else {
  console.error('>>> SOME CHECKS FAILED! <<<');
  process.exit(1);
}
