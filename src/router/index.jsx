import React, { Component} from 'react';
import {Switch, Route, BrowserRouter} from 'react-router-dom';

import Home from "../pages/Home";

const PAGE_HOME_PATH = '/';

class Router extends Component {

    // componentDidUpdate(prevProps, prevState, snapshot) {
    //     const {location} = this.props;

    //     if (location.key !== prevProps.location.key) {
    //         window.scrollTo(0,0);
    //     }
    // }

    render() {
        // const {location} = this.props;

        return (
            <BrowserRouter>
                <Switch>
                    <Route exact path={PAGE_HOME_PATH} component={Home} key={PAGE_HOME_PATH}/>
                </Switch>
            </BrowserRouter>
            //</CSSTransition>
            //</TransitionGroup>
        )
    }
}

export default Router;