import { MemoryRouter, Route, Switch } from 'react-router-dom';
import React, {Component} from 'react';

import Header from './Header/Header';

import Terms from '../ToS/ToS';
import Privacy from '../Privacy/Privacy';

class Router extends Component {
    render() {
        return (
          <MemoryRouter>
                <div>
                    <Header />

                    <div className="container">
                      <Switch>
                        <Route exact path="/terms" component={Terms}/>
                        <Route exact path="/privacy" component={Privacy}/>
                      </Switch>
                    </div>
                </div>
          </MemoryRouter>
        );
    }
}

export default Router;
