import React from 'react';
import {Container} from "react-bootstrap";
import Navigation from "./Component/Navigation";
import ServantPage from "./Page/ServantPage";
import ServantsPage from "./Page/ServantsPage";
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
            <br/>

            <Container>
                <Switch>
                    <Route path="/servants" component={ServantsPage}/>
                    <Route path="/servant/:id" component={ServantPage}/>
                </Switch>
            </Container>
        </Router>
    );
}

export default App;
