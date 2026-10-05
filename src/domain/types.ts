// ==============================================================================
// Domain Types: Smart Escape Graph & Routing Definitions
// ==============================================================================

export type NodeType = 'room' | 'junction' | 'exit';

export interface GraphNode {
  id: string;
  label: string;
  type: NodeType;
  x: number;
  y: number;
}

export interface GraphEdge {
  id: string;
  from: string;
  to: string;
  cost: number;
}

export interface InitialState {
  blocked_nodes: string[];
  blocked_edges: string[];
  closed_exits: string[];
}

export interface BuildingData {
  building: string;
  nodes: GraphNode[];
  edges: GraphEdge[];
  initial_state: InitialState;
}

export type RouteStatus =
  | 'OPTIMAL_ROUTE_FOUND'
  | 'START_LOCATION_BLOCKED'
  | 'NO_ROUTE_AVAILABLE';

export interface AlternativePath {
  path: string[];
  edgeIds: string[];
  exitId: string;
  totalCost: number;
  deltaCost: number;
}

export interface RouteResult {
  status: RouteStatus;
  statusString: string; // Exact official result string per Section 3.3 & 4.1
  path: string[];       // Sequence of node IDs: ['R1', 'C1', 'C2', 'E1']
  edgeIds: string[];    // Edge IDs traversed: ['L01', 'L02', 'L03']
  exitId: string | null;
  totalCost: number;
  alternativeRoutes?: AlternativePath[];
}

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}
