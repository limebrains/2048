import * as React from 'react';
import { connect } from 'react-redux';
import * as ReactRouter from 'react-router';
import * as Swipeable from 'react-swipeable';
import { bindActionCreators } from 'redux';
import {fetchGame, move, start, undo} from '../../actions/game';
import {DOWN, IField, IGame, LEFT, RIGHT, UP} from '../../constants';

interface IProps {
  start: Function;
  game: IGame;
  params: { slug: string };
  fetchedSettings: any;
  dispatch: Function;
}
let undoMax = 0;
let rows = 4;
let cols = 4;
class GameLayout extends React.Component<IProps, {}> {
  public componentDidMount() {
    if (this.props.params.slug) {
      this.props.dispatch(fetchGame(this.props.dispatch, this.props.params.slug));
      if (this.props.fetchedSettings && this.props.fetchedSettings[this.props.params.slug]) {
        cols = this.props.fetchedSettings[this.props.params.slug].cols;
        rows = this.props.fetchedSettings[this.props.params.slug].rows;
      }
    } else {
      this.props.dispatch(start(rows, cols, undoMax));
    }
    document.addEventListener('keyup', this.determineMove);
  }
  public componentWillUnmount() {
    document.removeEventListener('keyup', this.determineMove);
  }
  public render() {
    let cssSize = this.props.game.rows > this.props.game.cols ? this.props.game.rows : this.props.game.cols;
    let message: JSX.Element;
    let gameGrid: JSX.Element[] = [];
    if (this.props.game.gameOver) {
      message = (
        <div className={`game_over
         game_over_at_${this.props.game.rows}_by_${this.props.game.cols}`}>GAME OVER</div>
      );
    }
    if (this.props.game.slugNotResolved) {
      message = (
        <div className={`game_over
         game_over_at_${this.props.game.rows}_by_${this.props.game.cols}`}>GAME NOT FOUND</div>
      );
    }
    for (let row = 0; row < this.props.game.rows; row++) {
      for (let col = 0; col < this.props.game.cols; col++) {
        gameGrid.push(
          <div
          key={`game_grid_${row}_${col}`}
          className={`field field_at_${cssSize} v0 game_grid_${row}_${col}_at_${cssSize}`}
          />);
      }
    }
    return (
      <Swipeable onSwiped={this.swiped} >
        <div key="GAME">
          <header>
            <ReactRouter.Link to="/" >
              <button className="btn btn-outline-primary" >
                Home
              </button>
            </ReactRouter.Link>
            <button
              className="btn btn-outline-danger"
              onClick={this.props.dispatch.bind(
                this,
                (start(rows, cols, undoMax)),
              )}>
              Restart
            </button>
            <button
              className="btn btn-outline-success disabled score" >
              {this.props.game.score}
            </button>
            <button
              className="btn btn-outline-warning"
              onClick={this.props.dispatch.bind(
                this,
                (undo()),
              )}>
              &larr;
            </button>
          </header>
          <div key="game_container" className={`game_container
          game_container_at_${this.props.game.rows}_by_${this.props.game.cols}`}>
            <div key="game_grid" className="game_grid">
              { gameGrid }
            </div>
            <div key="game_board" className="game_board">
              {this.props.game.board.map((field: IField, index: number) => {
                  let fieldClass = `field field_at_${cssSize} v${field.value} v${field.value}_at_${cssSize}
                   game_grid_${field.row + field.direction[1]}_${field.col + field.direction[0]}_at_${cssSize}`;
                  if (field.merged === 1) { fieldClass += ` merged`; }
                  if (field.born) { fieldClass += ` born`; }
                  return (
                    <div key={field.id} className={fieldClass} >{field.value}</div>
                  );
                })
              }
              { message }
            </div>
          </div>
        </div>
      </Swipeable>
    );
  }

  private swiped = (e: any, deltaX: number, deltaY: number, isFlick: any, velocity: any) => {
    if (this.props.game.gameOver) {
      return 0;
    }
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      if (deltaX > 0) {
        this.props.dispatch(move(LEFT));
      } else {
        this.props.dispatch(move(RIGHT));
      }
    } else {
      if (deltaY > 0) {
        this.props.dispatch(move(UP));
      } else {
        this.props.dispatch(move(DOWN));
      }
    }
  }
  private determineMove = (e: any) => {
    if (this.props.game.gameOver) {
      return 0;
    }
    const keyCode = e.keyCode;
    switch (keyCode) {
      case 39: {
        this.props.dispatch(move(RIGHT));
        break;
      }
      case 37: {
        this.props.dispatch(move(LEFT));
        break;
      }
      case 38: {
        this.props.dispatch(move(UP));
        break;
      }
      case 40: {
        this.props.dispatch(move(DOWN));
        break;
      }
      default:
        break;
    }
  }
}

const mapStateToProps = (state: any) => {
  return state;
};

export default connect(mapStateToProps, null)(GameLayout);
