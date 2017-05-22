import * as React from 'react';
import {connect} from 'react-redux';
import { Link } from 'react-router';
import {bindActionCreators} from 'redux';
import {fetchAllGames} from '../../actions/game';
import {IGame, ISetting} from '../../constants';

interface IProps {
  game: IGame;
  dispatch: Function;
}

class HomeLayout extends React.Component<IProps, {}> {
  public componentDidMount() {
    this.props.dispatch(fetchAllGames(this.props.dispatch));
  }
  public render() {
    let settings: JSX.Element[];
    let chosenSetting: JSX.Element;
    if (this.props.game.settings) {
      settings = this.props.game.settings.map((setting: ISetting, index: number) => {
        return (
          <div>
            <Link to={`game/${setting.slug}`} >
              <button className="btn btn-primary btn-lg btn-block play" >
                Play
              </button>
            </Link>
            <div key={setting.id} >
              <p>slug: { setting.slug }</p>
              <p>cols: { setting.cols }</p>
              <p>rows: { setting.rows }</p>
              <p>maxTotalUndo: { setting.maxTotalUndo }</p>
              <p>maxUndoInARow: { setting.maxUndoInARow }</p>
              <p>mergingRule: { setting.mergingRule }</p>
              <p>startingBoard: { setting.startingBoard }</p>
            </div>
          </div>
        );
      });
    }
    if (this.props.game.chosenSetting) {
      chosenSetting = (
        <div>
          <Link to={`game/${this.props.game.chosenSetting.slug}`} >
            <button className="btn btn-primary btn-lg btn-block play" >
              Play
            </button>
          </Link>
          <div>
            <p>slug: { this.props.game.chosenSetting.slug }</p>
            <p>cols: { this.props.game.chosenSetting.cols }</p>
            <p>rows: { this.props.game.chosenSetting.rows }</p>
            <p>maxTotalUndo: { this.props.game.chosenSetting.maxTotalUndo }</p>
            <p>maxUndoInARow: { this.props.game.chosenSetting.maxUndoInARow }</p>
            <p>mergingRule: { this.props.game.chosenSetting.mergingRule }</p>
            <p>startingBoard: { this.props.game.chosenSetting.startingBoard }</p>
          </div>
        </div>
      );
    } else {
      chosenSetting = (
        <Link to="game/222" >
          <button className="btn btn-primary btn-lg btn-block play" >
            Play
          </button>
        </Link>
      );
    }
    return (
      <div className="row">
        <div key="chosenSetting" className="col-6">
          { chosenSetting }
        </div>
        <div key="allSettings" className="col-6">
          { settings }
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state: any) => {
  return state;
};

const actions: any = {  };

const dispatchToProps = (dispatch: any) => {
  const object: any = Object;
  return object.assign({}, bindActionCreators(actions, dispatch), {dispatch});
};

export default connect(mapStateToProps, dispatchToProps)(HomeLayout);
