import {MOVE, START} from '../constants';
export const move = (direction: string) => {
  return {
    payload: direction,
    type: MOVE,
  };
};

export const newSquare = (game: any) => {
  let zeros: any[];
  zeros = [];
  let size = game[0].length;
  for (let rowIndex = 0; rowIndex < size; rowIndex++) {
    for (let colIndex = 0; colIndex < size; colIndex++) {
      if (game[rowIndex][colIndex] === 0) {
        zeros.splice(0, 0, [rowIndex, colIndex]);
      }
    }
  }
  let newField = Math.floor((Math.random() * zeros.length));
  game[zeros[newField][0]][zeros[newField][1]] = Math.floor((Math.random() * 2) + 1) * 2;
  return game;
};

export const start = (size: number) => {
  let startingSetUp: number[][] = [];
  for (let i = 0; i < size; i++) {
    startingSetUp.push([]);
    for (let j = 0; j < size; j++) {
      startingSetUp[i].push(0)
    }
  }
  startingSetUp = newSquare(newSquare(startingSetUp));

  return {
    payload: startingSetUp,
    type: START,
  };
};

