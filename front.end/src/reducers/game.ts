import { cloneDeep } from 'lodash';
import {newID, newSquare} from '../actions/game';
import {DOWN, IFIELD, IGAME, IREDUCEDGAME, LEFT, MOVE, RIGHT, START, UP} from '../constants';

const initialState: IGAME = {
  allMoves: [],
  board: [],
  cols: 0,
  direction: '',
  gameOver: false,
  rows: 0,
  score: 0,
};

const isOver = (game: IREDUCEDGAME): boolean => {
  let squareBoard: number[][] = [];
  for (let rowIndex = 0; rowIndex < game.rows; rowIndex++) {
    squareBoard[rowIndex] = [];
    for (let colIndex = 0; colIndex < game.cols; colIndex++) {
      squareBoard[rowIndex][colIndex] = 0;
    }
  }
  game.board.map((field: IFIELD, index: number) => {
    if (field.merged !== -1) {
      squareBoard[field.row + field.direction[1]][field.col + field.direction[0]] = field.value;
    }
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
                      gameOnlyForNewIds: IREDUCEDGAME): [boolean, IFIELD[], number, IFIELD[]] => {
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
          newFieldsPosition.col = line.length - newIndex - 1;
          direction = [difference, 0];
        } else {
          newFieldsPosition.col = newIndex;
          direction = [-difference, 0];
        }
      } else {
        newFieldsPosition.col = line[index].col;
        if (isInverted) {
          newFieldsPosition.row = line.length - newIndex - 1;
          direction = [0, difference];
        } else {
          newFieldsPosition.row = newIndex;
          direction = [0, -difference];
        }
      }
      line[index].direction = direction;
      line[index].merged = -1;
      line[newIndex].merged = -1;
      let newId = newID(gameOnlyForNewIds, takenIds);
      takenIds.push(newId);
      let mergedField: IFIELD = {
        born: false,
        col: newFieldsPosition.col,
        direction: [0, 0],
        id: newId,
        merged: 1,
        row: newFieldsPosition.row,
        value: line[index].value * 2,
      };
      added.push(mergedField);
      points += line[index].value * 2;
      line[newIndex] = mergedField;
      line[index] = {
        born: false,
        col: line[index].col,
        direction: [],
        id: 0,
        merged: 0,
        row: line[index].row,
        value: 0,
      };
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
      line[newIndex] = line[index];
      line[index] = {
        born: false,
        col: line[index].col,
        direction: [],
        id: 0,
        merged: 0,
        row: line[index].row,
        value: 0,
      };
      changed = true;
    }
  }
  return [changed, added, points, line];
};

const makeMoveForDirection = (game: IREDUCEDGAME, direction: string): [IREDUCEDGAME, number] => {
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
      i--;
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
      const reducedGame: IREDUCEDGAME = {
        board: state.board,
        cols: state.cols,
        direction: state.direction,
        gameOver: state.gameOver,
        rows: state.rows,
        score: state.score,
      };
      const gameAfterMove = makeMoveForDirection(cloneDeep(reducedGame), direction);
      const newMoves = [...state.allMoves];
      newMoves.push(reducedGame);
      return {
        allMoves: newMoves,
        board: gameAfterMove[0].board,
        cols: state.cols,
        direction: action.payload,
        gameOver: isOver(gameAfterMove[0]),
        rows: state.rows,
        score: state.score + gameAfterMove[1],
      };
    case START:
      return action.payload;
    default:
      return state;
  }
};

export {
  game,
};
