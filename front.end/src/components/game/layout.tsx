import * as React from 'react';
import { connect } from 'react-redux';
import * as ReactRouter from 'react-router';
import { bindActionCreators } from 'redux';
import {move, start} from '../../actions/game';
import {DOWN, IFIELD, IGAME, LEFT, RIGHT, UP} from '../../constants';

interface IProps {
  game: IGAME;
  dispatch: Function;
}

let rows = 4; // TODO: change
let cols = 4;
let cssSize = 4;
class GameLayout extends React.Component<IProps, {}> {
  public componentDidMount() {
    this.props.dispatch(start(rows, cols));
    document.addEventListener('keyup', this.determineMove);
  }
  public render() {
    let message: JSX.Element;
    let gameGrid: JSX.Element[] = [];
    if (this.props.game.gameOver) {
      message = (
        <div className="game_over">GAME OVER</div>
      );
    }
    for (let row = 0; row < this.props.game.rows; row++) {
      for (let col = 0; col < this.props.game.cols; col++) {
        gameGrid.push(<div className={`field v0 game_grid_${row}_${col}_at_${cssSize}`}/>);
      }
    }
    return (
      <div>
        <header>
          <ReactRouter.Link to="/" >
            <button className="btn btn-primary" >
              Home
            </button>
          </ReactRouter.Link>
          <button
            className="btn btn-warning"
            onClick={this.props.dispatch.bind(this, (start(rows, cols)))}>
            Restart
          </button>
          <button
            className="btn btn-success disabled score" >
            {this.props.game.score}
          </button>
        </header>
        <div className="game_container">
          <div className="game_grid">
            { gameGrid }
          </div>
          <div className="game_board">
            {this.props.game.board.map((field: IFIELD, index: number) => {
                let fieldClass = `field v${field.value} game_grid_${field.row}_${field.col}_at_${cssSize}`;
                if (field.merged_or_new === 1) { fieldClass += ` merged_or_new`; }
                // TODO: add this class after mount?
                if (field.direction) { fieldClass += ` direction_${field.direction[0]}_${field.direction[1]}`; }
                {/*onClick={this.animateTranslate}*/}
                return (
                  <div key={field.id} className={fieldClass} >{field.value}</div>
                );
              })
            }
            { message }
          </div>
        </div>
      </div>
    );
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
  // private animateTranslate = (e: any) => {
  //   e.target.parentElement.className += ' move-to-top';
  // }
}

const mapStateToProps = (state: any) => {
  return state;
};

const actions: any = { start };

const dispatchToProps = (dispatch: any) => {
  const object: any = Object;
  return object.assign({}, bindActionCreators(actions, dispatch), {dispatch});
};

export default connect(mapStateToProps, dispatchToProps)(GameLayout);
