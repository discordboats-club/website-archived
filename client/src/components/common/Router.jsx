import { BrowserRouter, Route, Switch } from 'react-router-dom';
import React, {Component} from 'react';

import Header from './Header/Header';

class Router extends Component {
    render() {
        return (
            <BrowserRouter>
                <div>
                    <Header />

                    <Switch>
                        <Route/>
                    </Switch>
                </div>
            </BrowserRouter>
        );
    }
}

export default Router;
