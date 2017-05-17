import { cloneDeep } from 'lodash';
import {newID, newSquare} from '../actions/game';
import {DOWN, IFIELD, IGAME, LEFT, MOVE, RIGHT, START, UP} from '../constants';

const initialState: IGAME = {
  allMoves: [],
  board: [],
  cols: 0,
  direction: '',
  gameOver: false,
  rows: 0,
  score: 0,
};

const isOver = (game: IGAME): boolean => {
  let squareBoard: number[][] = [];
  for (let rowIndex = 0; rowIndex < game.rows; rowIndex++) {
    squareBoard[rowIndex] = [];
    for (let colIndex = 0; colIndex < game.cols; colIndex++) {
      squareBoard[rowIndex][colIndex] = 0;
    }
  }
  game.board.map((field: IFIELD, index: number) => {
    squareBoard[field.row][field.col] = field.value;
  });
  for (let row = 0; row < game.rows; row++) {
    for (let col = 0; col < game.cols; col++) {
      if (squareBoard[row][col] === 0
        || ( col + 1 < game.cols && squareBoard[row][col] === squareBoard[row][col + 1] )
        || ( row + 1 < game.rows && squareBoard[row][col] === squareBoard[row + 1][col] ) ) {
        return false;
      }
    }
  }
  return true;
};

const compressLine = (line: IFIELD[],
                      byRows: boolean,
                      isInverted: boolean,
                      gameOnlyForNewIds: IGAME): [boolean, IFIELD[], number] => {
  let points = 0;
  let takenIds: number[] = [];
  let added: IFIELD[] = [];
  let size = line.length;
  let changed = false;
  for (let index = 0; index < size; index++) {
    if (line[index].value === 0) {
      continue;
    }
    let newIndex = index;
    while (newIndex - 1 >= 0 && line[newIndex - 1].value === 0) {
      newIndex -= 1;
    }
    // TODO: merging rules
    if (newIndex - 1 >= 0
      && line[newIndex - 1].merged !== 1
      && line[newIndex - 1].merged !== -1
      && line[newIndex - 1].value === line[index].value) {
      newIndex--;
      let direction: number[] = [];
      let difference = index - newIndex;
      let newFieldsPosition = {row: 0, col: 0};
      if (byRows) {
        newFieldsPosition.row = line[index].row;
        if (isInverted) {
          newFieldsPosition.col = line.length - newIndex;
          direction = [difference, 0];
        } else {
          newFieldsPosition.col = newIndex;
          direction = [-difference, 0];
        }
      } else {
        newFieldsPosition.col = line[index].col;
        if (isInverted) {
          newFieldsPosition.row = line.length - newIndex;
          direction = [0, difference];
        } else {
          newFieldsPosition.row = newIndex;
          direction = [0, -difference];
        }
      }
      line[index].direction = direction;
      line[index].merged = -1;
      line[newIndex].merged = -1;
      takenIds.push(newID(gameOnlyForNewIds, takenIds));
      let mergedField: IFIELD = {
        born: false,
        col: newFieldsPosition.col,
        direction: [],
        id: takenIds[-1],
        merged: 1,
        row: newFieldsPosition.row,
        value: line[index].value * 2,
      };
      added.push(mergedField);
      points += line[index].value * 2;
      changed = true;
    } else if (newIndex !== index) {
      let difference = index - newIndex;
      let direction: number[] = [];
      if (byRows) {
        if (isInverted) {
          direction = [difference, 0];
        } else {
          direction = [-difference, 0];
        }
      } else {
        if (isInverted) {
          direction = [0, difference];
        } else {
          direction = [0, -difference];
        }
      }
      line[index].direction = direction;
      changed = true;
    }
  }
  return [changed, added, points];
};

const makeMoveForDirection = (game: IGAME, direction: string): [IGAME, number] => {
  let points = 0;
  let changed = false;
  let squareBoard: IFIELD[][] = [];
  for (let rowIndex = 0; rowIndex < game.rows; rowIndex++) {
    squareBoard[rowIndex] = [];
    for (let colIndex = 0; colIndex < game.cols; colIndex++) {
      squareBoard[rowIndex][colIndex] = {
        born: false,
        col: colIndex,
        direction: [],
        id: 0,
        merged: 0,
        row: rowIndex,
        value: 0,
      };
    }
  }
  for (let i = 0; i < game.board.length; i++) {
    if (game.board[i].merged === -1) {
      game.board.splice(i, 1);
    }
  }
  game.board.map((field: IFIELD, index: number) => {
    field.merged = 0;
    field.born = false;
    if (field.direction !== [0, 0]) {
      field.col += field.direction[0];
      field.row += field.direction[1];
      field.direction = [0, 0];
    }
    squareBoard[field.row][field.col] = field;
  });
  switch (direction) {
    case LEFT:
      for (let rowIndex = 0; rowIndex < game.rows; rowIndex++) {
        const compressedLine = compressLine(squareBoard[rowIndex], true, false, game);
        if (compressedLine[0]) {
          game.board.push(...compressedLine[1]);
          points += compressedLine[2];
          changed = true;
        }
      }
      break;
    case RIGHT:
      for (let rowIndex = 0; rowIndex < game.rows; rowIndex++) {
        const compressedLine = compressLine(squareBoard[rowIndex].reverse(), true, true, game);
        if (compressedLine[0]) {
          game.board.push(...compressedLine[1]);
          points += compressedLine[2];
          changed = true;
        }
      }
      break;
    case UP:
      for (let colIndex = 0; colIndex < game.cols; colIndex++) {
        let line: IFIELD[] = [];
        for (let rowIndex = 0; rowIndex < game.rows; rowIndex++) {
          line.splice(0, 0, squareBoard[rowIndex][colIndex]);
        }
        const compressedLine = compressLine(line.reverse(), false, false, game);
        if (compressedLine[0]) {
          game.board.push(...compressedLine[1]);
          points += compressedLine[2];
          changed = true;
        }
      }
      break;
    case DOWN:
      for (let colIndex = 0; colIndex < game.cols; colIndex++) {
        let line: IFIELD[] = [];
        for (let rowIndex = 0; rowIndex < game.rows; rowIndex++) {
          line.splice(0, 0, squareBoard[rowIndex][colIndex]);
        }
        const compressedLine = compressLine(line, false, true, game);
        if (compressedLine[0]) {
          game.board.push(...compressedLine[1]);
          points += compressedLine[2];
          changed = true;
        }
      }
      break;
    default:
      break;
  }

  if (changed) {
    game = newSquare(game, newID(game, []));
  }
  return [game, points];
};

const game = (state: IGAME = initialState, action: any): IGAME => {
  switch (action.type) {
    case MOVE:
      const direction = action.payload;
      const gameAfterMove = makeMoveForDirection(cloneDeep(state), direction);
      return {
        ...state,
        allMoves: state.allMoves.concat(action.payload),
        board: gameAfterMove[0].board,
        direction: action.payload,
        gameOver: isOver(gameAfterMove[0]),
        score: state.score + gameAfterMove[1],
      };
    case START:
      return action.payload;
    default:
      return cloneDeep({...state});
  }
};

export {
  game,
};
