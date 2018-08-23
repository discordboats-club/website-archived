import { BrowserRouter, Route, Switch, Link } from 'react-router-dom';

export default class Router extends Component {
    render() {
        return (
            <BrowserRouter>
                <Switch>
                    <Router/>
                </Switch>
            </BrowserRouter>
        );
    }
}