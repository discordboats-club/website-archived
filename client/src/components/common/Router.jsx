import { BrowserRouter, Route, Switch } from 'react-router-dom';
import React, {Component} from 'react';

import Header from './Header/Header';

import Terms from '../ToS/ToS';

class Router extends Component {
    render() {
        return (
            <BrowserRouter>
                <div>
                    <Header />

                    <Switch>
                      <Route exact path="/terms" component={Terms}/>
                    </Switch>
                </div>
            </BrowserRouter>
        );
    }
}

export default Router;
