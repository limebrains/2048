/* React */
import * as React from 'react';

/* React Router */
import { Provider } from 'react-redux';
import { IndexRoute, Route, Router } from 'react-router';

/* Router dependencies preparing */
import { history, store } from './prepare';

/* App configs */
import config from './config';

/* Components */
import { Layout, NotFound } from './components';
import { Game } from './components/game';
import { Home } from './components/home';

const { urlPrefix } = config;
class Routes extends React.Component<{}, {}> {
  public render() {
    return (
      <Provider store={ store }>
        <Router history={ history }>
          <Route path={ urlPrefix } component={ Layout }>
            <IndexRoute component={ Home }/>
            <Route path="game(/:slug)" component={ Game }/>
          </Route>
          <Route path="*" component={ NotFound }/>
        </Router>
      </Provider>
    );
  };
}

export default Routes;
