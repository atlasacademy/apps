import {Region, Language, Ai} from "@atlasacademy/api-connector";
import 'bootstrap/dist/css/bootstrap.min.css';
import React, {Suspense} from 'react';
import {Container} from "react-bootstrap";
import 'react-bootstrap-typeahead/css/Typeahead.css';
import {Helmet} from "react-helmet";
import {BrowserRouter as Router, Route, Switch, Redirect} from "react-router-dom";
import Api from "./Api";

import "./App.css";
import ErrorStatus from "./Component/ErrorStatus";
import Loading from "./Component/Loading";
import Navigation from "./Component/Navigation";
import HomePage from "./Page/HomePage";
import Manager from "./Setting/Manager";
import {Theme} from "./Setting/Theme";

const AiPage = React.lazy(() => import("./Page/AiPage"));
const BgmPage = React.lazy(() => import("./Page/BgmPage"));
const BgmsPage = React.lazy(() => import("./Page/BgmsPage"));
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
const MasterMissionPage = React.lazy(() => import("./Page/MasterMissionPage"));
const MasterMissionsPage = React.lazy(() => import("./Page/MasterMissionsPage"));
const MysticCodePage = React.lazy(() => import("./Page/MysticCodePage"));
const MysticCodesPage = React.lazy(() => import("./Page/MysticCodesPage"));
const NoblePhantasmPage = React.lazy(() => import("./Page/NoblePhantasmPage"));
const NoblePhantasmsPage = React.lazy(() => import("./Page/NoblePhantasmsPage"));
const QuestPage = React.lazy(() => import("./Page/QuestPage"));
const ScriptPage = React.lazy(() => import("./Page/ScriptPage"));
const ServantPage = React.lazy(() => import("./Page/ServantPage"));
const ServantsPage = React.lazy(() => import("./Page/ServantsPage"));
const SkillPage = React.lazy(() => import("./Page/SkillPage"));
const SkillsPage = React.lazy(() => import("./Page/SkillsPage"));
const EventPage = React.lazy(() => import("./Page/EventPage"));
const EventsPage = React.lazy(() => import("./Page/EventsPage"));
const WarPage = React.lazy(() => import("./Page/WarPage"));
const WarsPage = React.lazy(() => import("./Page/WarsPage"));

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
    }

    componentDidMount() {
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
            <Router basename="/db">
                <Navigation
                    language={this.state.language}
                    theme={this.state.theme}
                    />
                <br/>

                <Container fluid="xl" id={'app'} key={`${this.state.language}`}>
                    <Helmet>
                        {this.state.theme === Theme.DEFAULT ? null : (
                            <link key='theme' rel="stylesheet"
                                  href={`https://cdn.jsdelivr.net/npm/bootswatch@4.6.0/dist/${this.state.theme}/bootstrap.min.css`}/>
                        )}
                    </Helmet>
                    <Switch>
                        <Route exact={true} path="/:region(JP|NA)/bgm/:id([0-9]+)" render={props => {
                            const {region, id} = props.match.params;
                            return (
                                <Suspense fallback={<Loading/>}>
                                    <BgmPage key={`${region}-${id}`} region={region as Region} bgmId={parseInt(id)}/>
                                </Suspense>
                            );
                        }}/>
                        <Route exact={true} path="/:region(JP|NA)/bgms" render={props => {
                            const {region} = props.match.params;
                            return (
                                <Suspense fallback={<Loading/>}>
                                    <BgmsPage key={region} region={region as Region}/>
                                </Suspense>
                            );
                        }}/>
                        <Route exact={true} path="/:region(JP|NA)/buff/:id([0-9]+)" render={props => {
                            const {region, id} = props.match.params;
                            return (
                                <Suspense fallback={<Loading/>}>
                                    <BuffPage key={`${region}-${id}`} region={region as Region} id={parseInt(id)}/>
                                </Suspense>
                            );
                        }}/>
                        <Route exact={true} path="/:region(JP|NA)/command-code/:id([0-9]+)/:tab?"
                               render={props => {
                                   const {region, id, tab} = props.match.params;
                                   return (
                                       <Suspense fallback={<Loading/>}>
                                           <CommandCodePage key={`${region}-${id}`} region={region as Region} id={parseInt(id)} tab={tab}/>
                                       </Suspense>
                                   );
                               }}/>
                        <Route exact={true} path="/:region(JP|NA)/craft-essence/:id([0-9]+)/:tab?"
                               render={props => {
                                   const {region, id, tab} = props.match.params;
                                   return (
                                       <Suspense fallback={<Loading/>}>
                                           <CraftEssencePage key={`${region}-${id}`} region={region as Region} id={parseInt(id)} tab={tab}/>
                                       </Suspense>
                                   );
                               }}/>
                        <Route exact={true} path="/:region(JP|NA)/enemy/:id([0-9]+)/:tab?"
                               render={props => {
                                   const {region, id, tab} = props.match.params;
                                   return (
                                       <Suspense fallback={<Loading/>}>
                                           <EnemyPage key={`${region}-${id}`} region={region as Region} id={parseInt(id)} tab={tab}/>
                                       </Suspense>
                                   );
                               }}/>
                        <Route exact={true} path="/:region(JP|NA)/func/:id([0-9]+)" render={props => {
                            const {region, id} = props.match.params;
                            return (
                                <Suspense fallback={<Loading/>}>
                                    <FuncPage key={`${region}-${id}`} region={region as Region} id={parseInt(id)}/>
                                </Suspense>
                            );
                        }}/>
                        <Route exact={true} path="/:region(JP|NA)/item/:id([0-9]+)/:tab?" render={props => {
                            const {region, id, tab} = props.match.params;
                            return (
                                <Suspense fallback={<Loading/>}>
                                    <ItemPage key={`${region}-${id}`} region={region as Region} id={parseInt(id)} tab={tab}/>
                                </Suspense>
                            );
                        }}/>
                        <Route exact={true} path="/:region(JP|NA)/master-missions"
                               render={props => {
                                   const {region} = props.match.params;
                                   return (
                                       <Suspense fallback={<Loading/>}>
                                           <MasterMissionsPage key={region} region={region as Region}/>
                                       </Suspense>
                                   );
                               }}/>
                        <Route exact={true} path="/:region(JP|NA)/master-mission/:id([0-9]+)"
                               render={props => {
                                   const {region, id} = props.match.params;
                                   return (
                                       <Suspense fallback={<Loading/>}>
                                           <MasterMissionPage key={`${region}-${id}`} region={region as Region} masterMissionId={parseInt(id)}/>
                                       </Suspense>
                                   );
                               }}/>
                        <Route exact={true} path="/:region(JP|NA)/mystic-code/:id([0-9]+)/:tab?"
                               render={props => {
                                   const {region, id, tab} = props.match.params;
                                   return (
                                       <Suspense fallback={<Loading/>}>
                                           <MysticCodePage key={`${region}-${id}`} region={region as Region} id={parseInt(id)} tab={tab}/>
                                       </Suspense>
                                   );
                               }}/>
                        <Route exact={true} path="/:region(JP|NA)/noble-phantasm/:id([0-9]+)" render={props => {
                            const {region, id} = props.match.params;
                            return (
                                <Suspense fallback={<Loading/>}>
                                    <NoblePhantasmPage key={`${region}-${id}`} region={region as Region} id={parseInt(id)}/>
                                </Suspense>
                            );
                        }}/>
                        <Route exact={true} path="/:region(JP|NA)/noble-phantasms" render={props => {
                            const {region} = props.match.params;
                            return (
                                <Suspense fallback={<Loading/>}>
                                    <NoblePhantasmsPage key={region} region={region as Region} path="noble-phantasms"/>
                                </Suspense>
                            );
                        }}/>
                        <Route exact={true} path="/:region(JP|NA)/quest/:id([0-9]+)/:phase([0-9]+)/:stage?"
                        render={props => {
                            const {region, id, phase, stage} = props.match.params;
                            return (
                                <Suspense fallback={<Loading/>}>
                                    <QuestPage
                                        key={`${region}-${id}-${phase}`}
                                        region={region as Region}
                                        id={parseInt(id)}
                                        phase={parseInt(phase)}
                                        stage={stage ? parseInt(stage.replace("stage-", "")) : undefined}
                                    />
                                </Suspense>
                            )
                        }}/>
                        <Route exact={true} path="/:region(JP|NA)/script/:id" render={props => {
                            const {region, id} = props.match.params;
                            return (
                                <Suspense fallback={<Loading/>}>
                                    <ScriptPage region={region as Region} scriptId={id} />
                                </Suspense>
                            )
                        }}/>
                        <Route exact={true} path="/:region(JP|NA)/ai/:aiType(svt|field)/:id([0-9]+)" render={props => {
                            const {region, aiType, id} = props.match.params;
                            return (
                                <Suspense fallback={<Loading/>}>
                                    <AiPage key={`${region}-${aiType}-${id}`} region={region as Region} aiType={aiType as Ai.AiType} id={parseInt(id)}/>
                                </Suspense>
                            )
                        }}/>
                        <Route exact={true} path="/:region(JP|NA)/servant/:id([0-9]+)/:tab?"
                               render={props => {
                                   const {region, id, tab} = props.match.params;
                                   return (
                                       <Suspense fallback={<Loading/>}>
                                           <ServantPage key={`${region}-${id}`} region={region as Region} id={parseInt(id)} tab={tab}/>
                                       </Suspense>
                                   )
                               }}/>
                        <Route exact={true} path="/:region(JP|NA)/skills" render={props => {
                            const {region} = props.match.params;
                            return (
                                <Suspense fallback={<Loading/>}>
                                    <SkillsPage key={region} region={region as Region} path="skills"/>
                                </Suspense>
                            );
                        }}/>
                        <Route exact={true} path="/:region(JP|NA)/skill/:id([0-9]+)" render={props => {
                            const {region, id} = props.match.params;
                            return (
                                <Suspense fallback={<Loading/>}>
                                    <SkillPage key={`${region}-${id}`} region={region as Region} id={parseInt(id)}/>
                                </Suspense>
                            )
                        }}/>
                        <Route exact={true} path="/:region(JP|NA)/buffs" render={props => {
                            const {region} = props.match.params;
                            return (
                                <Suspense fallback={<Loading/>}>
                                    <BuffsPage key={region} region={region as Region} path="buffs"/>
                                </Suspense>
                            );
                        }}/>
                        <Route exact={true} path="/:region(JP|NA)/command-codes" render={props => {
                            const {region} = props.match.params;
                            return (
                                <Suspense fallback={<Loading/>}>
                                    <CommandCodesPage key={region} region={region as Region}/>
                                </Suspense>
                            );
                        }}/>
                        <Route exact={true} path="/:region(JP|NA)/craft-essences" render={props => {
                            const {region} = props.match.params;
                            return (
                                <Suspense fallback={<Loading/>}>
                                    <CraftEssencesPage key={region} region={region as Region}/>
                                </Suspense>
                            );
                        }}/>
                        <Route exact={true} path="/:region(JP|NA)/entities/trait/:id([0-9]+)" render={props => {
                            const {region, id} = props.match.params;
                            return (
                                <Suspense fallback={<Loading/>}>
                                    <EntitiesPage key={region} region={region as Region} traitSelected={parseInt(id)}/>
                                </Suspense>
                            );
                        }}/>
                        <Route exact={true} path="/:region(JP|NA)/entities" render={props => {
                            const {region} = props.match.params;
                            return (
                                <Suspense fallback={<Loading/>}>
                                    <EntitiesPage key={region} region={region as Region}/>
                                </Suspense>
                            );
                        }}/>
                        <Route exact={true} path="/:region(JP|NA)/funcs" render={props => {
                            const {region} = props.match.params;
                            return (
                                <Suspense fallback={<Loading/>}>
                                    <FuncsPage key={region} region={region as Region} path="funcs"/>
                                </Suspense>
                            );
                        }}/>
                        <Route exact={true} path="/:region(JP|NA)/items/:tab?" render={props => {
                            const {region, tab} = props.match.params;
                            return (
                                <Suspense fallback={<Loading/>}>
                                    <ItemsPage key={region} region={region as Region} tab={tab}/>
                                </Suspense>
                            );
                        }}/>
                        <Route exact={true} path="/:region(JP|NA)/event/:id([0-9]+)/:tab?" render={props => {
                            const {region, id, tab} = props.match.params;
                            return (
                                <Suspense fallback={<Loading/>}>
                                    <EventPage key={`${region}-event-${id}`} region={region as Region} eventId={parseInt(id)} tab={tab}/>
                                </Suspense>
                            )
                        }}/>
                        <Route exact={true} path="/:region(JP|NA)/events" render={props => {
                            const {region} = props.match.params;
                            return (
                                <Suspense fallback={<Loading/>}>
                                    <EventsPage key={region} region={region as Region}/>
                                </Suspense>
                            )
                        }}/>
                        <Route exact={true} path="/:region(JP|NA)/war/:id([0-9]+)" render={props => {
                            const {region, id} = props.match.params;
                            return (
                                <Suspense fallback={<Loading/>}>
                                    <WarPage key={`${region}-war-${id}`} region={region as Region} warId={parseInt(id)}/>
                                </Suspense>
                            )
                        }}/>
                        <Route exact={true} path="/:region(JP|NA)/wars" render={props => {
                            const {region} = props.match.params;
                            return (
                                <Suspense fallback={<Loading/>}>
                                    <WarsPage key={region} region={region as Region}/>
                                </Suspense>
                            )
                        }}/>
                        <Route exact={true} path="/:region(JP|NA)/mystic-codes" render={props => {
                            const {region} = props.match.params;
                            return (
                                <Suspense fallback={<Loading/>}>
                                    <MysticCodesPage key={region} region={region as Region}/>
                                </Suspense>
                            )
                        }}/>
                        <Route exact={true} path="/:region(JP|NA)/servants" render={props => {
                            const {region} = props.match.params;
                            return (
                                <Suspense fallback={<Loading/>}>
                                    <ServantsPage key={region} region={region as Region}/>
                                </Suspense>
                            )
                        }}/>
                        <Route exact path="/:region(JP|NA)/changes" render={props => {
                            const {region} = props.match.params;
                            return (
                                <Suspense fallback={<Loading/>}>
                                    <ChangelogPage
                                        key={region}
                                        region={region as Region}
                                        localTime={this.state.localTime}
                                        visibleOnly={this.state.changelogVisibleOnly}/>
                                </Suspense>
                            )
                        }} />
                        <Route path="/:region(JP|NA)" exact={true} render={props => {
                            const {region} = props.match.params;
                            return (
                                <Suspense fallback={<Loading/>}>
                                    <HomePage key={region} region={region as Region}/>
                                </Suspense>
                            )
                        }} />
                        <Route path="/" exact={true} render={({ location }) => {
                            return location.hash.includes("#") ? <Redirect to={location.hash.replace("#", "")} /> : <HomePage/>;
                        }} />
                        <Route path="*" exact={true} component={ErrorStatus}/>
                    </Switch>
                </Container>
            </Router>
        );
    }
}

export default App;
