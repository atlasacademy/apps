import {Language} from "@atlasacademy/api-connector";
import 'bootstrap/dist/css/bootstrap.min.css';
import React, {Suspense} from 'react';
import {Container} from "react-bootstrap";
import 'react-bootstrap-typeahead/css/Typeahead.css';
import {Helmet} from "react-helmet";
import {HashRouter as Router, Route, Switch,} from "react-router-dom";
import Api from "./Api";

import "./App.css";
import ErrorStatus from "./Component/ErrorStatus";
import Loading from "./Component/Loading";
import Navigation from "./Component/Navigation";
import HomePage from "./Page/HomePage";
import Manager from "./Setting/Manager";
import {Theme} from "./Setting/Theme";

const BuffPage = React.lazy(() => import("./Page/BuffPage"));
const BuffsPage = React.lazy(() => import("./Page/BuffsPage"));
const ChangelogPage = React.lazy(() => import("./Page/ChangelogPage"));
const CommandCodePage = React.lazy(() => import("./Page/CommandCodePage"));
const CommandCodesPage = React.lazy(() => import("./Page/CommandCodesPage"));
const CraftEssencePage = React.lazy(() => import("./Page/CraftEssencePage"));
const CraftEssencesPage = React.lazy(() => import("./Page/CraftEssencesPage"));
const EnemyPage = React.lazy(() => import('./Page/EnemyPage'));
const EntitiesPage = React.lazy(() => import('./Page/EntitiesPage'));
const FuncPage = React.lazy(() => import('./Page/FuncPage'));
const FuncsPage = React.lazy(() => import('./Page/FuncsPage'));
const ItemPage = React.lazy(() => import('./Page/ItemPage'));
const ItemsPage = React.lazy(() => import('./Page/ItemsPage'));
const MysticCodePage = React.lazy(() => import("./Page/MysticCodePage"));
const MysticCodesPage = React.lazy(() => import("./Page/MysticCodesPage"));
const NoblePhantasmPage = React.lazy(() => import("./Page/NoblePhantasmPage"));
const QuestPage = React.lazy(() => import("./Page/QuestPage"));
const ServantPage = React.lazy(() => import("./Page/ServantPage"));
const ServantsPage = React.lazy(() => import("./Page/ServantsPage"));
const SkillPage = React.lazy(() => import("./Page/SkillPage"));

interface IState {
    language: Language,
    theme: Theme,
    changelogVisibleOnly: boolean,
    localTime: boolean
}

class App extends React.Component<any, IState> {
    constructor(props: any) {
        super(props);
        this.state = {
            language: Manager.language(),
            theme: Manager.theme(),
            changelogVisibleOnly: Manager.changelogVisibleOnly(),
            localTime: Manager.changelogLocalTimestamp()
        };

        Api.init(Manager.region(), Manager.language());

        Manager.onUpdate(() => {
            Api.init(Manager.region(), Manager.language());
            this.updateSettings()
        });
    }

    private updateSettings() {
        this.setState({
            language: Manager.language(),
            theme: Manager.theme(),
            changelogVisibleOnly: Manager.changelogVisibleOnly(),
            localTime: Manager.changelogLocalTimestamp()
        });
    }

    render() {
        return (
            <Router>
                <Navigation
                    language={this.state.language}
                    theme={this.state.theme}
                    />
                <br/>

                <Container id={'app'} key={`${this.state.language}`}>
                    <Helmet>
                        {this.state.theme === Theme.DEFAULT ? null : (
                            <link key='theme' rel="stylesheet"
                                  href={`https://stackpath.bootstrapcdn.com/bootswatch/4.5.0/${this.state.theme}/bootstrap.min.css`}/>
                        )}
                    </Helmet>
                    <Switch>
                        <Route exact={true} path="/:region(JP|NA)/buff/:id([0-9]+)" render={props => {
                            const {region, id} = props.match.params
                            return (
                                <Suspense fallback={<Loading/>}>
                                    <BuffPage key={`${region}-${id}`} region={region} id={id}/>
                                </Suspense>
                            );
                        }}/>
                        <Route exact={true} path="/:region(JP|NA)/command-code/:id([0-9]+)/:tab([a-z0-9\-]+)?"
                               render={props => {
                                   const {region, id, tab} = props.match.params
                                   return (
                                       <Suspense fallback={<Loading/>}>
                                           <CommandCodePage key={`${region}-${id}`} region={region} id={id} tab={tab}/>
                                       </Suspense>
                                   );
                               }}/>
                        <Route exact={true} path="/:region(JP|NA)/craft-essence/:id([0-9]+)/:tab([a-z0-9\-]+)?"
                               render={props => {
                                   const {region, id, tab} = props.match.params
                                   return (
                                       <Suspense fallback={<Loading/>}>
                                           <CraftEssencePage key={`${region}-${id}`} region={region} id={id} tab={tab}/>
                                       </Suspense>
                                   );
                               }}/>
                        <Route exact={true} path="/:region(JP|NA)/enemy/:id([0-9]+)/:tab([a-z0-9\-]+)?"
                               render={props => {
                                   const {region, id, tab} = props.match.params
                                   return (
                                       <Suspense fallback={<Loading/>}>
                                           <EnemyPage key={`${region}-${id}`} region={region} id={id} tab={tab}/>
                                       </Suspense>
                                   );
                               }}/>
                        <Route exact={true} path="/:region(JP|NA)/func/:id([0-9]+)" render={props => {
                            const {region, id} = props.match.params
                            return (
                                <Suspense fallback={<Loading/>}>
                                    <FuncPage key={`${region}-${id}`} region={region} id={id}/>
                                </Suspense>
                            );
                        }}/>
                        <Route exact={true} path="/:region(JP|NA)/item/:id([0-9]+)/:tab([a-z0-9\-]+)?" render={props => {
                            const {region, id, tab} = props.match.params
                            return (
                                <Suspense fallback={<Loading/>}>
                                    <ItemPage key={`${region}-${id}`} region={region} id={id} tab={tab}/>
                                </Suspense>
                            );
                        }}/>
                        <Route exact={true} path="/:region(JP|NA)/mystic-code/:id([0-9]+)/:tab([a-z0-9\-]+)?"
                               render={props => {
                                   const {region, id, tab} = props.match.params
                                   return (
                                       <Suspense fallback={<Loading/>}>
                                           <MysticCodePage key={`${region}-${id}`} region={region} id={id} tab={tab}/>
                                       </Suspense>
                                   );
                               }}/>
                        <Route exact={true} path="/:region(JP|NA)/noble-phantasm/:id([0-9]+)" render={props => {
                            const {region, id} = props.match.params
                            return (
                                <Suspense fallback={<Loading/>}>
                                    <NoblePhantasmPage key={`${region}-${id}`} region={region} id={id}/>
                                </Suspense>
                            );
                        }}/>
                        <Route exact={true} path="/:region(JP|NA)/quest/:id([0-9]+)/:phase([0-9]+)" render={props => {
                            const {region, id, phase} = props.match.params
                            return (
                                <Suspense fallback={<Loading/>}>
                                    <QuestPage key={`${region}-${id}-${phase}`} region={region} id={id} phase={phase}/>
                                </Suspense>
                            )
                        }}/>
                        <Route exact={true} path="/:region(JP|NA)/servant/:id([0-9]+)/:tab([a-z0-9\-]+)?"
                               render={props => {
                                   const {region, id, tab} = props.match.params;
                                   return (
                                       <Suspense fallback={<Loading/>}>
                                           <ServantPage key={`${region}-${id}`} region={region} id={id} tab={tab}/>
                                       </Suspense>
                                   )
                               }}/>
                        <Route exact={true} path="/:region(JP|NA)/skill/:id([0-9]+)" render={props => {
                            const {region, id} = props.match.params
                            return (
                                <Suspense fallback={<Loading/>}>
                                    <SkillPage key={`${region}-${id}`} region={region} id={id}/>
                                </Suspense>
                            )
                        }}/>
                        <Route exact={true} path="/:region(JP|NA)/buffs" render={props => {
                            const {region} = props.match.params;
                            return (
                                <Suspense fallback={<Loading/>}>
                                    <BuffsPage key={region} region={region}/>
                                </Suspense>
                            );
                        }}/>
                        <Route exact={true} path="/:region(JP|NA)/command-codes" render={props => {
                            const {region} = props.match.params;
                            return (
                                <Suspense fallback={<Loading/>}>
                                    <CommandCodesPage key={region} region={region}/>
                                </Suspense>
                            );
                        }}/>
                        <Route exact={true} path="/:region(JP|NA)/craft-essences" render={props => {
                            const {region} = props.match.params;
                            return (
                                <Suspense fallback={<Loading/>}>
                                    <CraftEssencesPage key={region} region={region}/>
                                </Suspense>
                            );
                        }}/>
                        <Route exact={true} path="/:region(JP|NA)/entities/trait/:id([0-9]+)" render={props => {
                            const {region, id} = props.match.params;
                            return (
                                <Suspense fallback={<Loading/>}>
                                    <EntitiesPage key={region} region={region} traitSelected={parseInt(id)}/>
                                </Suspense>
                            );
                        }}/>
                        <Route exact={true} path="/:region(JP|NA)/entities" render={props => {
                            const {region} = props.match.params;
                            return (
                                <Suspense fallback={<Loading/>}>
                                    <EntitiesPage key={region} region={region}/>
                                </Suspense>
                            );
                        }}/>
                        <Route exact={true} path="/:region(JP|NA)/funcs" render={props => {
                            const {region} = props.match.params;
                            return (
                                <Suspense fallback={<Loading/>}>
                                    <FuncsPage key={region} region={region}/>
                                </Suspense>
                            );
                        }}/>
                        <Route exact={true} path="/:region(JP|NA)/items/:tab([a-z0-9\-]+)?" render={props => {
                            const {region, tab} = props.match.params;
                            return (
                                <Suspense fallback={<Loading/>}>
                                    <ItemsPage key={region} region={region} tab={tab}/>
                                </Suspense>
                            );
                        }}/>
                        <Route exact={true} path="/:region(JP|NA)/mystic-codes" render={props => {
                            const {region} = props.match.params;
                            return (
                                <Suspense fallback={<Loading/>}>
                                    <MysticCodesPage key={region} region={region}/>
                                </Suspense>
                            )
                        }}/>
                        <Route exact={true} path="/:region(JP|NA)/servants" render={props => {
                            const {region} = props.match.params;
                            return (
                                <Suspense fallback={<Loading/>}>
                                    <ServantsPage key={region} region={region}/>
                                </Suspense>
                            )
                        }}/>
                        <Route exact path="/:region(JP|NA)/changes" render={props => {
                            const {region} = props.match.params;
                            return (
                                <Suspense fallback={<Loading/>}>
                                    <ChangelogPage
                                        key={region}
                                        region={region}
                                        localTime={this.state.localTime}
                                        visibleOnly={this.state.changelogVisibleOnly}/>
                                </Suspense>
                            )
                        }} />
                        <Route path="/:region(JP|NA)" exact={true} component={HomePage}/>
                        <Route path="/" exact={true} component={HomePage}/>
                        <Route path="*" exact={true} component={ErrorStatus}/>
                    </Switch>
                </Container>
            </Router>
        );
    }
}

export default App;
