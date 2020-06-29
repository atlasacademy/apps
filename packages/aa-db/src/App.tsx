import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import {Container} from "react-bootstrap";
import {HashRouter as Router, Route, Switch,} from "react-router-dom";
import Navigation from "./Component/Navigation";
import ServantPage from "./Page/ServantPage";
import ServantsPage from "./Page/ServantsPage";

function App() {
    return (
        <Router>
            <Navigation/>
            <br/>

            <Container>
                <Switch>
                    <Route path="/servants" component={ServantsPage}/>
                    <Route path="/servant/:id" render={(
                        props => <ServantPage key={props.match.params.id} id={props.match.params.id}/>
                    )}/>
                    <Route path="/" component={ServantsPage}/>
                </Switch>
            </Container>
        </Router>
    );
}

export default App;
