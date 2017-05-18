export const MOVE = 'MOVE';
export const START = 'START';
export const UP = 'UP';
export const DOWN = 'DOWN';
export const LEFT = 'LEFT';
export const RIGHT = 'RIGHT';
export interface IGAME {
  allMoves: IREDUCEDGAME[];
  board: IFIELD[];
  cols: number;
  direction: string;
  gameOver: boolean;
  rows: number;
  score: number;
}
export interface IREDUCEDGAME {
  board: IFIELD[];
  cols: number;
  direction: string;
  gameOver: boolean;
  rows: number;
  score: number;
}
export interface IFIELD {
  born: boolean;
  col: number;
  direction: number[];
  id: number;
  merged: number;
  row: number;
  value: number;
}
