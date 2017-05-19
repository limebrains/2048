export const MOVE = 'MOVE';
export const START = 'START';
export const UP = 'UP';
export const DOWN = 'DOWN';
export const LEFT = 'LEFT';
export const RIGHT = 'RIGHT';
export const UNDO = 'UNDO';
export const FETCHING_GAME = 'FETCHING_GAME';
export const FETCH_GAME_START = 'FETCH_GAME_START';
export const FETCH_GAME_ERROR = 'FETCH_GAME_ERROR';
export const FETCH_GAME_SUCCESS = 'FETCH_GAME_SUCCESS';
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
  slugNotResolved?: boolean;
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
