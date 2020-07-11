import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import {Container} from "react-bootstrap";
import {HashRouter as Router, Route, Switch,} from "react-router-dom";
import ErrorStatus from "./Component/ErrorStatus";
import Navigation from "./Component/Navigation";
import BuffPage from "./Page/BuffPage";
import CraftEssencePage from "./Page/CraftEssencePage";
import CraftEssencesPage from "./Page/CraftEssencesPage";
import FuncPage from './Page/FuncPage';
import HomePage from "./Page/HomePage";
import NoblePhantasmPage from "./Page/NoblePhantasmPage";
import QuestPage from "./Page/QuestPage";
import ServantPage from "./Page/ServantPage";
import ServantsPage from "./Page/ServantsPage";
import SkillPage from "./Page/SkillPage";
import Manager from "./Setting/Manager";
import {LanguageOption} from "./Setting/Option";

interface IState {
    language: LanguageOption,
}

class App extends React.Component<any, IState> {
    constructor(props: any) {
        super(props);
        this.state = {
            language: Manager.language(),
        };

        Manager.onUpdate(() => this.updateSettings());
    }

    private updateSettings() {
        this.setState({
            language: Manager.language(),
        });
    }

    render() {
        return (
            <Router>
                <Navigation/>
                <br/>

                <Container key={`${this.state.language}`}>
                    <Switch>
                        <Route exact={true} path="/:region(JP|NA)/buff/:id([0-9]+)" render={props => {
                            const region = props.match.params.region,
                                id = props.match.params.id,
                                key = `${region}-${id}`;
                            return <BuffPage key={key} region={region} id={id}/>;
                        }}/>
                        <Route exact={true} path="/:region(JP|NA)/craft-essence/:id([0-9]+)" render={props => {
                            const region = props.match.params.region,
                                id = props.match.params.id,
                                key = `${region}-${id}`;
                            return <CraftEssencePage key={key} region={region} id={id}/>;
                        }}/>
                        <Route exact={true} path="/:region(JP|NA)/func/:id([0-9]+)" render={props => {
                            const region = props.match.params.region,
                                id = props.match.params.id,
                                key = `${region}-${id}`;
                            return <FuncPage key={key} region={region} id={id}/>;
                        }}/>
                        <Route exact={true} path="/:region(JP|NA)/noble-phantasm/:id([0-9]+)" render={props => {
                            const region = props.match.params.region,
                                id = props.match.params.id,
                                key = `${region}-${id}`;
                            return <NoblePhantasmPage key={key} region={region} id={id}/>;
                        }}/>
                        <Route exact={true} path="/:region(JP|NA)/quest/:id([0-9]+)/:phase([0-9]+)" render={props => {
                            const region = props.match.params.region,
                                id = props.match.params.id,
                                phase = props.match.params.phase,
                                key = `${region}-${id}-${phase}`;
                            return <QuestPage key={key} region={region} id={id} phase={phase}/>;
                        }}/>
                        <Route exact={true} path="/:region(JP|NA)/servant/:id([0-9]+)" render={props => {
                            const region = props.match.params.region,
                                id = props.match.params.id,
                                key = `${region}-${id}`;
                            return <ServantPage key={key} region={region} id={id}/>;
                        }}/>
                        <Route exact={true} path="/:region(JP|NA)/skill/:id([0-9]+)" render={props => {
                            const region = props.match.params.region,
                                id = props.match.params.id,
                                key = `${region}-${id}`;
                            return <SkillPage key={key} region={region} id={id}/>
                        }}/>
                        <Route exact={true} path="/:region(JP|NA)/craft-essences" render={props => {
                            const region = props.match.params.region;
                            return <CraftEssencesPage key={region} region={region}/>;
                        }}/>
                        <Route exact={true} path="/:region(JP|NA)/servants" render={props => {
                            const region = props.match.params.region;
                            return <ServantsPage key={region} region={region}/>;
                        }}/>
                        <Route path="/" exact={true} render={props => {
                            return <HomePage/>;
                        }}/>
                        <Route path="*" exact={true} render={props => {
                            return <ErrorStatus/>;
                        }}/>
                    </Switch>
                </Container>
            </Router>
        );
    }
}

export default App;
