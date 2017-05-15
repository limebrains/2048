import { includes } from 'lodash';
import {newSquare} from '../actions/game';
import {DOWN, LEFT, MOVE, RIGHT, START, UP} from '../constants';

interface IState {
  allMoves: string[];
  board: number[];
  direction: string;
  gameOver: boolean;
  score: number;
}

const initialState: IState = {
  allMoves: [],
  board: [],
  direction: '',
  gameOver: false,
  score: 0,
};

const isOver = (game: any): boolean => {
  let size = game[0].length;
  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      if (game[row][col] === 0
        || ( col + 1 < size && game[row][col] === game[row][col + 1] )
        || ( row + 1 < size && game[row][col] === game[row + 1][col] ) ) {
        return false;
      }
    }
  }
  return true;
};

const compressLine = (line: number[]): [boolean, number[], number] => {
  let points = 0;
  let size = line.length;
  let merged: number[] = [];
  let changed = false;
  for (let index = 0; index < size; index++) {
    if (line[index] !== 0) {
      let newIndex = index;
      while (newIndex - 1 >= 0 && line[newIndex - 1] === 0) {
        newIndex -= 1;
      }
      if (!includes(merged, newIndex - 1)
        && line[newIndex - 1] === line[index]) {
        line[newIndex - 1] *= 2;
        line[index] = 0;
        merged.splice(0, 0, newIndex - 1);
        points += line[newIndex - 1];
        changed = true;
      } else if (newIndex !== index) {
        line[newIndex] = line[index];
        line[index] = 0;
        changed = true;
      }
    }
  }
  return [changed, line, points];
};

const makeMoveForDirection = (game: any, direction: any): [any, number] => {
  let points = 0;
  let size = game[0].length;
  let changed = false;
  switch (direction) {
    case LEFT:
      for (let rowIndex = 0; rowIndex < size; rowIndex++) {
        const compressedLine = compressLine(game[rowIndex]);
        if (compressedLine[0]) {
          game[rowIndex] = compressedLine[1];
          points += compressedLine[2];
          changed = true;
        }
      }
      break;
    case RIGHT:
      for (let rowIndex = 0; rowIndex < size; rowIndex++) {
        const compressedLine = compressLine(game[rowIndex].reverse());
        game[rowIndex].reverse();
        if (compressedLine[0]) {
          game[rowIndex] = compressedLine[1];
          points += compressedLine[2];
          changed = true;
        }
      }
      break;
    case UP:
      for (let colIndex = 0; colIndex < size; colIndex++) {
        let line: number[] = [];
        for (let rowIndex = 0; rowIndex < size; rowIndex++) {
          line.splice(0, 0, game[rowIndex][colIndex]);
        }
        const compressedLine = compressLine(line.reverse());
        if (compressedLine[0]) {
          for (let rowIndex = 0; rowIndex < size; rowIndex++) {
            game[rowIndex][colIndex] = compressedLine[1][rowIndex];
          }
          points += compressedLine[2];
          changed = true;
        }
      }
      break;
    case DOWN:
      for (let colIndex = 0; colIndex < size; colIndex++) {
        let line: number[] = [];
        for (let rowIndex = 0; rowIndex < size; rowIndex++) {
          line.splice(0, 0, game[rowIndex][colIndex]);
        }
        const compressedLine = compressLine(line);
        if (compressedLine[0]) {
          for (let rowIndex = 0; rowIndex < size; rowIndex++) {
            game[size - rowIndex - 1][colIndex] = compressedLine[1][rowIndex];
          }
          points += compressedLine[2];
          changed = true;
        }
      }
      break;
    default:
      break;
  }
  if (changed) {
    game = newSquare(game);
  }
  return [game, points];
};

const game = (state = initialState, action: any) => {
  switch (action.type) {
    case MOVE:
      const direction = action.payload;
      const gameAfterMove = makeMoveForDirection(state.board, direction);
      return {
        ...state,
        allMoves: state.allMoves.concat(action.payload),
        board: gameAfterMove[0],
        direction: action.payload,
        score: state.score + gameAfterMove[1],
        gameOver: isOver(gameAfterMove[0]),
      };
    case START:
      return {
        ...state,
        board: action.payload,
        score: 0,
        gameOver: false,
      };
    default:
      return state;
  }
};

export {
  game,
};
