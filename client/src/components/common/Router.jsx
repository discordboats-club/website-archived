import { BrowserRouter, Route, Switch } from 'react-router-dom';
import React, { Component } from 'react';
import { Container } from 'semantic-ui-react';

import Header from './Header/Header';
import Footer from './Footer/Footer';

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

                  <Container text>
                    <Switch>
                      <Route exact path="/" component={Home}/>
                      <Route exact path="/terms" component={Terms}/>
                      <Route exact path="/privacy" component={Privacy}/>
                      <Route exact path="/api" component={APIDocs}/>
                      <Route exact path="/view/:id" component={View}/>
                    </Switch>
                  </Container>
                  
                  <Footer />
                </div>
          </BrowserRouter>
        );
    }
}

export default Router;
