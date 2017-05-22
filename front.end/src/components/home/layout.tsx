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
    if (this.props.game.settings) {
      settings = this.props.game.settings.map((setting: ISetting, index: number) => {
        return (
          <Link to={`game/${setting.slug}`} >
            <div key={setting.id} className="" >
              sadsdasdasdashbvhsvbvdsbvdbvhsdvbhshvbsdhvkbsdvhsdbvhsdvdsdjadhjbsdhasbdssdasdasdasdasda
              slug: { setting.slug }
              cols: { setting.cols }
              rows: { setting.rows }
              maxTotalUndo: { setting.maxTotalUndo }
              maxUndoInARow: { setting.maxUndoInARow }
              mergingRule: { setting.mergingRule }
              startingBoard: { setting.startingBoard }
            </div>
          </Link>
        );
      });
    }
    return (
      <div className="row">
        <div key="chosenSetting" className="col-6">
          <Link to="game/222" ><button className="btn btn-primary btn-lg btn-block play" >Play</button></Link>
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
