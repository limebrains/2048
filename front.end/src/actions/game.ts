import axios from 'axios';
import {
  FETCHING_GAME,
  FETCH_GAME_START,
  FETCH_GAME_ERROR,
  FETCH_GAME_SUCCESS,
  IField,
  IGame,
  IReducedGame,
  MOVE,
  START,
  UNDO,
} from '../constants';
export const move = (direction: string) => {
  return {
    payload: direction,
    type: MOVE,
  };
};

export const newID = (game: IReducedGame, additionalTaken: number[]): number => {
  let ids: boolean[] = [];
  let id = 1;
  game.board.map((field: IField, index: number) => {
    ids[field.id] = true;
  });
  additionalTaken.map((takenId: number) => {
    ids[takenId] = true;
  });
  while (ids[id] === true) {
    id++;
  }
  return id;
};

export const newSquare = (game: IReducedGame, id: number): IReducedGame => {
  let zeros: boolean[][] = [];
  for (let rowIndex = 0; rowIndex < game.rows; rowIndex++) {
    zeros[rowIndex] = [];
    for (let colIndex = 0; colIndex < game.cols; colIndex++) {
      zeros[rowIndex][colIndex] = true;
    }
  }
  game.board.map((field: IField, index: number) => {
    if (field.merged !== -1) {
      zeros[field.row + field.direction[1]][field.col + field.direction[0]] = false;
    }
  });
  let zerosTuple: any[] = [];
  for (let rowIndex = 0; rowIndex < game.rows; rowIndex++) {
    for (let colIndex = 0; colIndex < game.cols; colIndex++) {
      if (zeros[rowIndex][colIndex]) {
        zerosTuple.push({row: rowIndex, col: colIndex});
      }
    }
  }
  let chosenField = zerosTuple[Math.floor((Math.random() * zerosTuple.length))];
  let newField: IField = {
    born: true,
    col: chosenField.col,
    direction: [0, 0],
    id,
    merged: 0,
    row: chosenField.row,
    value: Math.floor((Math.random() * 2) + 1) * 2,
  };
  game.board.push(newField);
  return game;
};

export const start = (rows: number, cols: number, undoMax: number): {payload: IGame, type: string} => {
  let startReduced: IReducedGame = {
    board: [],
    cols,
    direction: '',
    gameOver: false,
    rows,
    score: 0,
  };
  startReduced = newSquare(startReduced, newID(startReduced, []));
  startReduced = newSquare(startReduced, newID(startReduced, []));
  let startingSetUp: IGame = {
    ...startReduced,
    allMoves: [],
    undoCount: 0,
    undoMax,
  };

  return {
    payload: startingSetUp,
    type: START,
  };
};

export const undo = () => {
  return {
    payload: '',
    type: UNDO,
  };
};

export const fetchGame = (dispatch: any, slug: any) => {
  axios.defaults.headers.post['Content-Type'] = 'application/json;charset=utf-8';
  let request: any = axios.get(`http://127.0.0.1:8000/v1/game/?format=json`).then((success) => {
    dispatch(fetchGameSuccess(success, slug));
  }).catch((error) => {
    dispatch(fetchGameError(error));
  });

  return {
    type: FETCH_GAME_START,
  };
};

export const fetchGameSuccess = (data: any, slug: any) => {
  return {
    payload: data,
    slug,
    type: FETCH_GAME_SUCCESS,
  };
};

export const fetchGameError = (data: any) => {
  return {
    payload: data,
    type: FETCH_GAME_ERROR,
  };
};
