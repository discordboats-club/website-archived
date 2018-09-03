import { BrowserRouter, Route, Switch } from 'react-router-dom';
import React, {Component} from 'react';

import Header from './Header/Header';

import Terms from '../ToS/ToS';
import Privacy from '../Privacy/Privacy';
import APIDocs from '../APIDocs/APIDocs';
import Home from '../Home/Home';
import View from '../View/View';

class Router extends Component {
    render() {
        return (
          <BrowserRouter>
                <div>
                    <Header />

                    <div className="container">
                      <Switch>
                        <Route exact path="/" component={Home}/>
                        <Route path="/terms" component={Terms}/>
                        <Route path="/privacy" component={Privacy}/>
                        <Route path="/api" component={APIDocs}/>
                        <Route path="/view/:id" component={View} />
                      </Switch>
                    </div>
                </div>
          </BrowserRouter>
        );
    }
}

export default Router;
