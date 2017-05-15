import * as React from 'react';
import { connect } from 'react-redux';
import * as ReactRouter from 'react-router';
import { bindActionCreators } from 'redux';
import {move, start} from '../../actions/game';
import {DOWN, LEFT, RIGHT, UP} from '../../constants';

interface IProps {
  game: any;
  dispatch: Function;
}

let size = 4;
class GameLayout extends React.Component<IProps, {}> {
  public componentDidMount() {
    this.props.dispatch(start(size));
    document.addEventListener('keyup', this.determineMove);
  }
  public render() {
    let message: JSX.Element;
    if (this.props.game.gameOver) {
      message = (
        <div className="game_over">GAME OVER</div>
      );
    }
    return (
      <div>
        <header>
          <ReactRouter.Link to="/" ><button className="btn btn-primary" >Home</button></ReactRouter.Link>
          <button className="btn btn-warning" onClick={this.props.dispatch.bind(this, (start(size)))}>Restart</button>
          <button className="btn btn-success disabled score" >{this.props.game.score}</button>
        </header>
        <div className="game_container">
          {this.props.game.board.map((row: any, rowIndex: number) => {
            return (<div className="row">{row.map((field: any, colIndex: number) => {
              let fieldClass = `field v${field}`;
              if (field === 0) {
                return (<div className={fieldClass}> </div>);
              }
              return (<div className={fieldClass}>{field}</div>);
            })}</div>);
          })}
          { message }
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
