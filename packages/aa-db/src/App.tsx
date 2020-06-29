import React from 'react';
import Navigation from "./Component/Navigation";
import Servant from "./Route/Servant";
import Servants from "./Route/Servants";
import {
    HashRouter as Router,
    Switch,
    Route,
} from "react-router-dom";

import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
    return (
        <Router>
            <Navigation/>

            <Switch>
                <Route path="/servants" component={Servants}/>
                <Route path="/servant/:id" component={Servant}/>
            </Switch>
        </Router>
    );
}

export default App;
