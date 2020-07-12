import 'bootstrap/dist/css/bootstrap.min.css';
import React, { Suspense } from 'react';
import {Container} from "react-bootstrap";
import {HashRouter as Router, Route, Switch,} from "react-router-dom";
import ErrorStatus from "./Component/ErrorStatus";
import Navigation from "./Component/Navigation";
// import BuffPage from "./Page/BuffPage";
// import CraftEssencePage from "./Page/CraftEssencePage";
// import CraftEssencesPage from "./Page/CraftEssencesPage";
// import FuncPage from './Page/FuncPage';
import HomePage from "./Page/HomePage";
// import MysticCodePage from "./Page/MysticCodePage";
// import MysticCodesPage from "./Page/MysticCodesPage";
// import NoblePhantasmPage from "./Page/NoblePhantasmPage";
// import QuestPage from "./Page/QuestPage";
// import ServantPage from "./Page/ServantPage";
// import ServantsPage from "./Page/ServantsPage";
// import SkillPage from "./Page/SkillPage";
import Manager from "./Setting/Manager";
import {LanguageOption} from "./Setting/Option";
import Loading from "./Component/Loading";

const BuffPage = React.lazy(() => import("./Page/BuffPage"));
const CraftEssencePage = React.lazy(() => import("./Page/CraftEssencePage"));
const CraftEssencesPage = React.lazy(() => import("./Page/CraftEssencesPage"));
const FuncPage = React.lazy(() => import('./Page/FuncPage'));

const MysticCodePage = React.lazy(() => import("./Page/MysticCodePage"));
const MysticCodesPage = React.lazy(() => import("./Page/MysticCodesPage"));
const NoblePhantasmPage = React.lazy(() => import("./Page/NoblePhantasmPage"));
const QuestPage = React.lazy(() => import("./Page/QuestPage"));
const ServantPage = React.lazy(() => import("./Page/ServantPage"));
const ServantsPage = React.lazy(() => import("./Page/ServantsPage"));
const SkillPage = React.lazy(() => import("./Page/SkillPage"));

import "./App.css";

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

                <Container id={'app'} key={`${this.state.language}`}>
                    <Switch>
                        <Route exact={true} path="/:region(JP|NA)/buff/:id([0-9]+)" render={props => {
                            const { region, id } = props.match.params
                            return (
                                <Suspense fallback={<Loading />}>
                                    <BuffPage key={`${region}-${id}`} region={region} id={id}/>
                                </Suspense>
                            );
                        }}/>
                        <Route exact={true} path="/:region(JP|NA)/craft-essence/:id([0-9]+)" render={props => {
                            const { region, id } = props.match.params
                            return (
                                <Suspense fallback={<Loading />}>
                                    <CraftEssencePage key={`${region}-${id}`} region={region} id={id}/>
                                </Suspense>
                            );
                        }}/>
                        <Route exact={true} path="/:region(JP|NA)/func/:id([0-9]+)" render={props => {
                            const { region, id } = props.match.params
                            return (
                                <Suspense fallback={<Loading />}>
                                    <FuncPage key={`${region}-${id}`} region={region} id={id}/>
                                </Suspense>
                            );
                        }}/>
                        <Route exact={true} path="/:region(JP|NA)/mystic-code/:id([0-9]+)" render={props => {
                            const { region, id } = props.match.params
                            return (
                                <Suspense fallback={<Loading />}>
                                    <MysticCodePage key={`${region}-${id}`} region={region} id={id}/>
                                </Suspense>
                            );
                        }}/>
                        <Route exact={true} path="/:region(JP|NA)/noble-phantasm/:id([0-9]+)" render={props => {
                            const { region, id } = props.match.params
                            return (
                                <Suspense fallback={<Loading />}>
                                    <NoblePhantasmPage key={`${region}-${id}`} region={region} id={id}/>
                                </Suspense>
                            );
                        }}/>
                        <Route exact={true} path="/:region(JP|NA)/quest/:id([0-9]+)/:phase([0-9]+)" render={props => {
                            const { region, id, phase } = props.match.params
                            return (
                                <Suspense fallback={<Loading />}>
                                    <QuestPage key={`${region}-${id}-${phase}`} region={region} id={id} phase={phase}/>
                                </Suspense>
                            )
                        }}/>
                        <Route exact={true} path="/:region(JP|NA)/servant/:id([0-9]+)" render={props => {
                            const { region, id } = props.match.params
                            return (
                                <Suspense fallback={<Loading />}>
                                    <ServantPage key={`${region}-${id}`} region={region} id={id}/>;
                                </Suspense>
                            )
                        }}/>
                        <Route exact={true} path="/:region(JP|NA)/skill/:id([0-9]+)" render={props => {
                            const { region, id } = props.match.params
                            return (
                                <Suspense fallback={<Loading />}>
                                    <SkillPage key={`${region}-${id}`} region={region} id={id}/>
                                </Suspense>
                            )
                        }}/>
                        <Route exact={true} path="/:region(JP|NA)/craft-essences" render={props => {
                            const { region } = props.match.params;
                            return (
                                <Suspense fallback={<Loading />}>
                                    <CraftEssencesPage key={region} region={region}/>
                                </Suspense>
                            );
                        }}/>
                        <Route exact={true} path="/:region(JP|NA)/mystic-codes" render={props => {
                            const { region } = props.match.params;
                            return (
                                <Suspense fallback={<Loading />}>
                                    <MysticCodesPage key={region} region={region}/>
                                </Suspense>
                            )
                        }}/>
                        <Route exact={true} path="/:region(JP|NA)/servants" render={props => {
                            const { region } = props.match.params;
                            return (
                                <Suspense fallback={<Loading />}>
                                    <ServantsPage key={region} region={region}/>
                                </Suspense>
                            )
                        }}/>
                        <Route path="/" exact={true} component={HomePage}/>
                        <Route path="*" exact={true} component={ErrorStatus}/>
                    </Switch>
                </Container>
            </Router>
        );
    }
}

export default App;
