export type Cheker = 'white' | 'black' | null;

export interface Cell {
  checker: Cheker;
}

export interface MoveCheckerType {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  eat?: boolean;
}
