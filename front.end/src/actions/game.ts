import {IFIELD, IGAME, MOVE, START} from '../constants';
export const move = (direction: string) => {
  return {
    payload: direction,
    type: MOVE,
  };
};

export const newID = (game: IGAME, additionalTaken: number[]) => {
  let ids: boolean[] = [];
  let id = 1;
  game.board.map((field: IFIELD, index: number) => {
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

export const newSquare = (game: IGAME, id: number) => {
  let zeros: boolean[][] = [];
  for (let rowIndex = 0; rowIndex < game.rows; rowIndex++) {
    zeros[rowIndex] = [];
    for (let colIndex = 0; colIndex < game.cols; colIndex++) {
      zeros[rowIndex][colIndex] = true;
    }
  }
  game.board.map((field: IFIELD, index: number) => {
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
  if (zerosTuple.length === 0) { console.log('NO FREE FIELDS?!'); }
  let chosenField = zerosTuple[Math.floor((Math.random() * zerosTuple.length))];
  let newField: IFIELD = {
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

export const start = (rows: number, cols: number) => {
  let startingSetUp: IGAME = {
    allMoves: [],
    board: [],
    cols,
    direction: '',
    gameOver: false,
    rows,
    score: 0,
  };
  startingSetUp = newSquare(startingSetUp, newID(startingSetUp, []));
  startingSetUp = newSquare(startingSetUp, newID(startingSetUp, []));

  return {
    payload: startingSetUp,
    type: START,
  };
};

