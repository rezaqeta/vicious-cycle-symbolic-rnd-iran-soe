
import type { SimulationNodeDatum } from 'd3';

export enum NodeType {
  AGGREGATED = 'AGGREGATED',
  SECONDARY = 'SECONDARY',
  INITIAL = 'INITIAL',
  QUOTE = 'QUOTE',
}

export interface DataItem {
  refCode: string;
  initialCode: string;
  secondaryTheme: string;
  aggregatedDimension: string;
  quote: string;
}

export interface Node extends SimulationNodeDatum {
  id: string;
  group: string;
  type: NodeType;
  label: string;
  radius: number;
  color: string;
}

export interface Link {
  source: string;
  target: string;
}

export interface GraphData {
  nodes: Node[];
  links: Link[];
}
