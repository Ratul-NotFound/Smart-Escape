// ==============================================================================
// Domain Validator: JSON Schema & Graph Integrity Rules (Section 3.1)
// ==============================================================================

import { BuildingData, GraphNode, GraphEdge, ValidationResult, NodeType } from './types';

export function validateBuildingData(data: unknown): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!data || typeof data !== 'object') {
    return { valid: false, errors: ['Input data must be a valid JSON object.'], warnings: [] };
  }

  const raw = data as Partial<BuildingData>;

  // 1. Building Name
  if (typeof raw.building !== 'string' || raw.building.trim().length === 0) {
    errors.push('Missing or empty "building" name.');
  }

  // 2. Nodes Array
  if (!Array.isArray(raw.nodes)) {
    errors.push('"nodes" must be an array.');
    return { valid: false, errors, warnings };
  }

  if (raw.nodes.length < 2 || raw.nodes.length > 60) {
    errors.push(`Node count must be between 2 and 60 (found ${raw.nodes.length}).`);
  }

  const nodeMap = new Map<string, GraphNode>();
  let roomOrJunctionCount = 0;
  let exitCount = 0;

  raw.nodes.forEach((node, idx) => {
    if (!node || typeof node !== 'object') {
      errors.push(`Node at index ${idx} is not an object.`);
      return;
    }

    if (typeof node.id !== 'string' || node.id.trim().length === 0) {
      errors.push(`Node at index ${idx} must have a non-empty string "id".`);
      return;
    }

    if (nodeMap.has(node.id)) {
      errors.push(`Duplicate node id "${node.id}". Node IDs must be unique.`);
    }

    if (typeof node.label !== 'string' || node.label.trim().length === 0) {
      errors.push(`Node "${node.id}" has an invalid or empty "label".`);
    }

    const validTypes: NodeType[] = ['room', 'junction', 'exit'];
    if (!validTypes.includes(node.type as NodeType)) {
      errors.push(`Node "${node.id}" has invalid type "${node.type}". Must be 'room', 'junction', or 'exit'.`);
    } else {
      if (node.type === 'room' || node.type === 'junction') roomOrJunctionCount++;
      if (node.type === 'exit') exitCount++;
    }

    if (typeof node.x !== 'number' || isNaN(node.x) || typeof node.y !== 'number' || isNaN(node.y)) {
      errors.push(`Node "${node.id}" must have numeric display coordinates (x, y).`);
    }

    nodeMap.set(node.id, node as GraphNode);
  });

  if (roomOrJunctionCount < 1) {
    errors.push('The graph must contain at least one room or junction.');
  }

  if (exitCount < 1) {
    errors.push('The graph must contain at least one exit.');
  }

  // 3. Edges Array
  if (!Array.isArray(raw.edges)) {
    errors.push('"edges" must be an array.');
    return { valid: false, errors, warnings };
  }

  if (raw.edges.length < 1 || raw.edges.length > 150) {
    errors.push(`Edge count must be between 1 and 150 (found ${raw.edges.length}).`);
  }

  const edgeMap = new Map<string, GraphEdge>();
  const seenPairs = new Set<string>();

  raw.edges.forEach((edge, idx) => {
    if (!edge || typeof edge !== 'object') {
      errors.push(`Edge at index ${idx} is not an object.`);
      return;
    }

    if (typeof edge.id !== 'string' || edge.id.trim().length === 0) {
      errors.push(`Edge at index ${idx} must have a non-empty string "id".`);
      return;
    }

    if (edgeMap.has(edge.id)) {
      errors.push(`Duplicate edge id "${edge.id}". Edge IDs must be unique.`);
    }

    if (typeof edge.from !== 'string' || !nodeMap.has(edge.from)) {
      errors.push(`Edge "${edge.id}" references non-existent "from" node "${edge.from}".`);
    }

    if (typeof edge.to !== 'string' || !nodeMap.has(edge.to)) {
      errors.push(`Edge "${edge.id}" references non-existent "to" node "${edge.to}".`);
    }

    if (edge.from === edge.to) {
      errors.push(`Edge "${edge.id}" is a self-loop (from "${edge.from}" to "${edge.to}"). Self-loops are forbidden.`);
    }

    // Undirected pair check: sort pair so A-B and B-A collision is detected
    if (edge.from && edge.to) {
      const pairKey = [edge.from, edge.to].sort().join('<->');
      if (seenPairs.has(pairKey)) {
        errors.push(`Repeated edge connection between "${edge.from}" and "${edge.to}". Multiple edges between identical pairs are forbidden.`);
      }
      seenPairs.add(pairKey);
    }

    if (typeof edge.cost !== 'number' || !Number.isInteger(edge.cost) || edge.cost < 1) {
      errors.push(`Edge "${edge.id}" has invalid cost "${edge.cost}". Cost must be a positive integer.`);
    }

    edgeMap.set(edge.id, edge as GraphEdge);
  });

  // 4. Initial State Validation
  if (!raw.initial_state || typeof raw.initial_state !== 'object') {
    errors.push('Missing "initial_state" object.');
    return { valid: false, errors, warnings };
  }

  const init = raw.initial_state;

  if (!Array.isArray(init.blocked_nodes)) {
    errors.push('"initial_state.blocked_nodes" must be an array.');
  } else {
    init.blocked_nodes.forEach((nodeId) => {
      const node = nodeMap.get(nodeId);
      if (!node) {
        errors.push(`initial_state blocked_node "${nodeId}" does not exist in nodes list.`);
      } else if (node.type === 'exit') {
        errors.push(`initial_state blocked_node "${nodeId}" is an exit. Exits must be listed under "closed_exits", not "blocked_nodes".`);
      }
    });
  }

  if (!Array.isArray(init.blocked_edges)) {
    errors.push('"initial_state.blocked_edges" must be an array.');
  } else {
    init.blocked_edges.forEach((edgeId) => {
      if (!edgeMap.has(edgeId)) {
        errors.push(`initial_state blocked_edge "${edgeId}" does not exist in edges list.`);
      }
    });
  }

  if (!Array.isArray(init.closed_exits)) {
    errors.push('"initial_state.closed_exits" must be an array.');
  } else {
    init.closed_exits.forEach((exitId) => {
      const node = nodeMap.get(exitId);
      if (!node) {
        errors.push(`initial_state closed_exit "${exitId}" does not exist in nodes list.`);
      } else if (node.type !== 'exit') {
        errors.push(`initial_state closed_exit "${exitId}" is of type "${node.type}". Only exits can be listed in "closed_exits".`);
      }
    });
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}
