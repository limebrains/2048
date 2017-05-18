export const MOVE = 'MOVE';
export const START = 'START';
export const UP = 'UP';
export const DOWN = 'DOWN';
export const LEFT = 'LEFT';
export const RIGHT = 'RIGHT';
export const UNDO = 'UNDO';
export interface IReducedGame {
  board: IField[];
  cols: number;
  direction: string;
  gameOver: boolean;
  rows: number;
  score: number;
}
export interface IGame {
  allMoves: IReducedGame[];
  board: IField[];
  cols: number;
  direction: string;
  gameOver: boolean;
  rows: number;
  score: number;
  undoCount: number;
  undoMax: number;
}
export interface IField {
  born: boolean;
  col: number;
  direction: number[];
  id: number;
  merged: number;
  row: number;
  value: number;
}
