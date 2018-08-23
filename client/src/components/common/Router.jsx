import { BrowserRouter, Route, Switch } from 'react-router-dom';
import React, {Component} from 'react';

export default class Router extends Component {
    render() {
        return (
            <BrowserRouter>
                <Switch>
                    <Route/>
                </Switch>
            </BrowserRouter>
        );
    }
}