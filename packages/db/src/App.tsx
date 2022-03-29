import React, { Suspense } from "react";
import { Container } from "react-bootstrap";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";

import { Region, Language, Ai } from "@atlasacademy/api-connector";

import Api from "./Api";
import ErrorStatus from "./Component/ErrorStatus";
import Loading from "./Component/Loading";
import Navigation from "./Component/Navigation";
import RedirectPage from "./Component/RedirectPage";
import HomePage from "./Page/HomePage";
import Manager from "./Setting/Manager";
import { Theme } from "./Setting/Theme";

import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-bootstrap-typeahead/css/Typeahead.css";

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
const EnemyPage = React.lazy(() => import("./Page/EnemyPage"));
const EnemyChangelogPage = React.lazy(() => import("./Page/EnemyChangelogPage"));
const EntitiesPage = React.lazy(() => import("./Page/EntitiesPage"));
const FaqPage = React.lazy(() => import("./Page/FaqPage"));
const FuncPage = React.lazy(() => import("./Page/FuncPage"));
const FuncsPage = React.lazy(() => import("./Page/FuncsPage"));
const ItemPage = React.lazy(() => import("./Page/ItemPage"));
const ItemsPage = React.lazy(() => import("./Page/ItemsPage"));
const MasterMissionPage = React.lazy(() => import("./Page/MasterMissionPage"));
const MasterMissionsPage = React.lazy(() => import("./Page/MasterMissionsPage"));
const MysticCodePage = React.lazy(() => import("./Page/MysticCodePage"));
const MysticCodesPage = React.lazy(() => import("./Page/MysticCodesPage"));
const NoblePhantasmPage = React.lazy(() => import("./Page/NoblePhantasmPage"));
const NoblePhantasmsPage = React.lazy(() => import("./Page/NoblePhantasmsPage"));
const QuestRedirect = React.lazy(() => import("./Page/QuestRedirect"));
const QuestPage = React.lazy(() => import("./Page/QuestPage"));
const QuestsPage = React.lazy(() => import("./Page/QuestsPage"));
const ScriptPage = React.lazy(() => import("./Page/ScriptPage"));
const ScriptsPage = React.lazy(() => import("./Page/ScriptsPage"));
const ServantPage = React.lazy(() => import("./Page/ServantPage"));
const ServantsPage = React.lazy(() => import("./Page/ServantsPage"));
const SkillPage = React.lazy(() => import("./Page/SkillPage"));
const SkillsPage = React.lazy(() => import("./Page/SkillsPage"));
const EventPage = React.lazy(() => import("./Page/EventPage"));
const EventsPage = React.lazy(() => import("./Page/EventsPage"));
const WarPage = React.lazy(() => import("./Page/WarPage"));
const WarsPage = React.lazy(() => import("./Page/WarsPage"));

interface IState {
    language: Language;
    theme: Theme;
    changelogVisibleOnly: boolean;
    localTime: boolean;
}

const BASE_NAME = "/db";

class App extends React.Component<any, IState> {
    constructor(props: any) {
        super(props);
        this.state = {
            language: Manager.language(),
            theme: Manager.theme(),
            changelogVisibleOnly: Manager.changelogVisibleOnly(),
            localTime: Manager.changelogLocalTimestamp(),
        };

        for (const region of Object.values(Region)) {
            if (window.location.pathname.startsWith(`${BASE_NAME}/${region}`)) {
                Manager.setRegion(region);
                break;
            }
        }

        Api.init(Manager.region(), Manager.language());
    }

    componentDidMount() {
        Manager.onUpdate(() => {
            Api.init(Manager.region(), Manager.language());
            this.updateSettings();
        });
    }

    private updateSettings() {
        this.setState({
            language: Manager.language(),
            theme: Manager.theme(),
            changelogVisibleOnly: Manager.changelogVisibleOnly(),
            localTime: Manager.changelogLocalTimestamp(),
        });
    }

    render() {
        return (
            <HelmetProvider>
                <Router basename={BASE_NAME}>
                    <Navigation language={this.state.language} theme={this.state.theme} />
                    <br />

                    <Container fluid="xl" id={"app"} key={`${this.state.language}`} lang={Manager.lang()}>
                        <Helmet>
                            {this.state.theme === Theme.DEFAULT ? null : (
                                <link
                                    key="theme"
                                    rel="stylesheet"
                                    href={`https://cdn.jsdelivr.net/npm/bootswatch@4.6.0/dist/${this.state.theme}/bootstrap.min.css`}
                                />
                            )}
                        </Helmet>
                        <Switch>
                            <Route
                                exact={true}
                                path="/:region(JP|NA|CN|KR|TW)/bgm/:id([0-9]+)"
                                render={(props) => {
                                    const { region, id } = props.match.params;
                                    return (
                                        <Suspense fallback={<Loading />}>
                                            <BgmPage
                                                key={`${region}-${id}`}
                                                region={region as Region}
                                                bgmId={parseInt(id)}
                                            />
                                        </Suspense>
                                    );
                                }}
                            />
                            <Route
                                exact={true}
                                path="/:region(JP|NA|CN|KR|TW)/bgms"
                                render={(props) => {
                                    const { region } = props.match.params;
                                    return (
                                        <Suspense fallback={<Loading />}>
                                            <BgmsPage key={region} region={region as Region} />
                                        </Suspense>
                                    );
                                }}
                            />
                            <Route
                                exact={true}
                                path="/:region(JP|NA|CN|KR|TW)/buff/:id([0-9]+)"
                                render={(props) => {
                                    const { region, id } = props.match.params;
                                    return (
                                        <Suspense fallback={<Loading />}>
                                            <BuffPage
                                                key={`${region}-${id}`}
                                                region={region as Region}
                                                id={parseInt(id)}
                                            />
                                        </Suspense>
                                    );
                                }}
                            />
                            <Route
                                exact={true}
                                path="/:region(JP|NA|CN|KR|TW)/command-code/:id([0-9]+)/:tab?"
                                render={(props) => {
                                    const { region, id, tab } = props.match.params;
                                    return (
                                        <Suspense fallback={<Loading />}>
                                            <CommandCodePage
                                                key={`${region}-${id}`}
                                                region={region as Region}
                                                id={parseInt(id)}
                                                tab={tab}
                                            />
                                        </Suspense>
                                    );
                                }}
                            />
                            <Route
                                exact={true}
                                path="/:region(JP|NA|CN|KR|TW)/craft-essence/:id([0-9]+)/:tab?"
                                render={(props) => {
                                    const { region, id, tab } = props.match.params;
                                    return (
                                        <Suspense fallback={<Loading />}>
                                            <CraftEssencePage
                                                key={`${region}-${id}`}
                                                region={region as Region}
                                                id={parseInt(id)}
                                                tab={tab}
                                            />
                                        </Suspense>
                                    );
                                }}
                            />
                            <Route
                                exact={true}
                                path="/:region(JP|NA|CN|KR|TW)/enemy/:id([0-9]+)/:tab?"
                                render={(props) => {
                                    const { region, id, tab } = props.match.params;
                                    return (
                                        <Suspense fallback={<Loading />}>
                                            <EnemyPage
                                                key={`${region}-${id}`}
                                                region={region as Region}
                                                id={parseInt(id)}
                                                tab={tab}
                                            />
                                        </Suspense>
                                    );
                                }}
                            />
                            <Route
                                exact={true}
                                path="/:region(JP|NA|CN|KR|TW)/func/:id([0-9]+)"
                                render={(props) => {
                                    const { region, id } = props.match.params;
                                    return (
                                        <Suspense fallback={<Loading />}>
                                            <FuncPage
                                                key={`${region}-${id}`}
                                                region={region as Region}
                                                id={parseInt(id)}
                                            />
                                        </Suspense>
                                    );
                                }}
                            />
                            <Route
                                exact={true}
                                path="/:region(JP|NA|CN|KR|TW)/item/:id([0-9]+)/:tab?"
                                render={(props) => {
                                    const { region, id, tab } = props.match.params;
                                    return (
                                        <Suspense fallback={<Loading />}>
                                            <ItemPage
                                                key={`${region}-${id}`}
                                                region={region as Region}
                                                id={parseInt(id)}
                                                tab={tab}
                                            />
                                        </Suspense>
                                    );
                                }}
                            />
                            <Route
                                exact={true}
                                path="/:region(JP|NA|CN|KR|TW)/master-missions"
                                render={(props) => {
                                    const { region } = props.match.params;
                                    return (
                                        <Suspense fallback={<Loading />}>
                                            <MasterMissionsPage key={region} region={region as Region} />
                                        </Suspense>
                                    );
                                }}
                            />
                            <Route
                                exact={true}
                                path="/:region(JP|NA|CN|KR|TW)/master-mission/:id([0-9]+)"
                                render={(props) => {
                                    const { region, id } = props.match.params;
                                    return (
                                        <Suspense fallback={<Loading />}>
                                            <MasterMissionPage
                                                key={`${region}-${id}`}
                                                region={region as Region}
                                                masterMissionId={parseInt(id)}
                                            />
                                        </Suspense>
                                    );
                                }}
                            />
                            <Route
                                exact={true}
                                path="/:region(JP|NA|CN|KR|TW)/mystic-code/:id([0-9]+)/:tab?"
                                render={(props) => {
                                    const { region, id, tab } = props.match.params;
                                    return (
                                        <Suspense fallback={<Loading />}>
                                            <MysticCodePage
                                                key={`${region}-${id}`}
                                                region={region as Region}
                                                id={parseInt(id)}
                                                tab={tab}
                                            />
                                        </Suspense>
                                    );
                                }}
                            />
                            <Route
                                exact={true}
                                path="/:region(JP|NA|CN|KR|TW)/noble-phantasm/:id([0-9]+)"
                                render={(props) => {
                                    const { region, id } = props.match.params;
                                    return (
                                        <Suspense fallback={<Loading />}>
                                            <NoblePhantasmPage
                                                key={`${region}-${id}`}
                                                region={region as Region}
                                                id={parseInt(id)}
                                            />
                                        </Suspense>
                                    );
                                }}
                            />
                            <Route
                                exact={true}
                                path="/:region(JP|NA|CN|KR|TW)/noble-phantasms"
                                render={(props) => {
                                    const { region } = props.match.params;
                                    return (
                                        <Suspense fallback={<Loading />}>
                                            <NoblePhantasmsPage
                                                key={region}
                                                region={region as Region}
                                                path="noble-phantasms"
                                            />
                                        </Suspense>
                                    );
                                }}
                            />
                            <Route
                                exact={true}
                                path="/:region(JP|NA|CN|KR|TW)/quest/:id([0-9]+)"
                                render={(props) => {
                                    const { region, id } = props.match.params;
                                    return (
                                        <Suspense fallback={<Loading />}>
                                            <QuestRedirect
                                                key={`${region}-${id}`}
                                                region={region as Region}
                                                id={parseInt(id)}
                                            />
                                        </Suspense>
                                    );
                                }}
                            />
                            <Route
                                exact={true}
                                path="/:region(JP|NA|CN|KR|TW)/quest/:id([0-9]+)/:phase([0-9]+)/:stage?"
                                render={(props) => {
                                    const { region, id, phase, stage } = props.match.params;
                                    return (
                                        <Suspense fallback={<Loading />}>
                                            <QuestPage
                                                key={`${region}-${id}`}
                                                region={region as Region}
                                                id={parseInt(id)}
                                                phase={parseInt(phase)}
                                                stage={stage ? parseInt(stage.replace("stage-", "")) : undefined}
                                            />
                                        </Suspense>
                                    );
                                }}
                            />
                            <Route
                                exact={true}
                                path="/:region(JP|NA|CN|KR|TW)/quests"
                                render={(props) => {
                                    const { region } = props.match.params;
                                    return (
                                        <Suspense fallback={<Loading />}>
                                            <QuestsPage key={region} region={region as Region} path="quests" />
                                        </Suspense>
                                    );
                                }}
                            />
                            <Route
                                exact={true}
                                path="/:region(JP|NA|CN|KR|TW)/script/:id"
                                render={(props) => {
                                    const { region, id } = props.match.params;
                                    return (
                                        <Suspense fallback={<Loading />}>
                                            <ScriptPage region={region as Region} scriptId={id} />
                                        </Suspense>
                                    );
                                }}
                            />
                            <Route
                                exact={true}
                                path="/:region(JP|NA|CN|KR|TW)/scripts"
                                render={(props) => {
                                    const { region } = props.match.params;
                                    return (
                                        <Suspense fallback={<Loading />}>
                                            <ScriptsPage key={region} region={region as Region} path="scripts" />
                                        </Suspense>
                                    );
                                }}
                            />
                            <Route
                                exact={true}
                                path="/:region(JP|NA|CN|KR|TW)/ai/:aiType(svt|field)/:id([0-9]+)"
                                render={(props) => {
                                    const { region, aiType, id } = props.match.params;
                                    return (
                                        <Suspense fallback={<Loading />}>
                                            <AiPage
                                                key={`${region}-${aiType}-${id}`}
                                                region={region as Region}
                                                aiType={aiType as Ai.AiType}
                                                id={parseInt(id)}
                                            />
                                        </Suspense>
                                    );
                                }}
                            />
                            <Route
                                exact={true}
                                path="/:region(JP|NA|CN|KR|TW)/servant/:id([0-9]+)/:tab?"
                                render={(props) => {
                                    const { region, id, tab } = props.match.params;
                                    return (
                                        <Suspense fallback={<Loading />}>
                                            <ServantPage
                                                key={`${region}-${id}`}
                                                region={region as Region}
                                                id={parseInt(id)}
                                                tab={tab}
                                            />
                                        </Suspense>
                                    );
                                }}
                            />
                            <Route
                                exact={true}
                                path="/:region(JP|NA|CN|KR|TW)/skills"
                                render={(props) => {
                                    const { region } = props.match.params;
                                    return (
                                        <Suspense fallback={<Loading />}>
                                            <SkillsPage key={region} region={region as Region} path="skills" />
                                        </Suspense>
                                    );
                                }}
                            />
                            <Route
                                exact={true}
                                path="/:region(JP|NA|CN|KR|TW)/skill/:id([0-9]+)"
                                render={(props) => {
                                    const { region, id } = props.match.params;
                                    return (
                                        <Suspense fallback={<Loading />}>
                                            <SkillPage
                                                key={`${region}-${id}`}
                                                region={region as Region}
                                                id={parseInt(id)}
                                            />
                                        </Suspense>
                                    );
                                }}
                            />
                            <Route
                                exact={true}
                                path="/:region(JP|NA|CN|KR|TW)/buffs"
                                render={(props) => {
                                    const { region } = props.match.params;
                                    return (
                                        <Suspense fallback={<Loading />}>
                                            <BuffsPage key={region} region={region as Region} path="buffs" />
                                        </Suspense>
                                    );
                                }}
                            />
                            <Route
                                exact={true}
                                path="/:region(JP|NA|CN|KR|TW)/command-codes"
                                render={(props) => {
                                    const { region } = props.match.params;
                                    return (
                                        <Suspense fallback={<Loading />}>
                                            <CommandCodesPage key={region} region={region as Region} />
                                        </Suspense>
                                    );
                                }}
                            />
                            <Route
                                exact={true}
                                path="/:region(JP|NA|CN|KR|TW)/craft-essences"
                                render={(props) => {
                                    const { region } = props.match.params;
                                    return (
                                        <Suspense fallback={<Loading />}>
                                            <CraftEssencesPage key={region} region={region as Region} />
                                        </Suspense>
                                    );
                                }}
                            />
                            <Route
                                exact={true}
                                path="/:region(JP|NA|CN|KR|TW)/entities/trait/:id([0-9]+)"
                                render={(props) => {
                                    const { region, id } = props.match.params;
                                    return (
                                        <Suspense fallback={<Loading />}>
                                            <EntitiesPage
                                                key={region}
                                                region={region as Region}
                                                traitSelected={parseInt(id)}
                                            />
                                        </Suspense>
                                    );
                                }}
                            />
                            <Route
                                exact={true}
                                path="/:region(JP|NA|CN|KR|TW)/entities"
                                render={(props) => {
                                    const { region } = props.match.params;
                                    return (
                                        <Suspense fallback={<Loading />}>
                                            <EntitiesPage key={region} region={region as Region} />
                                        </Suspense>
                                    );
                                }}
                            />
                            <Route
                                exact={true}
                                path="/:region(JP|NA|CN|KR|TW)/funcs"
                                render={(props) => {
                                    const { region } = props.match.params;
                                    return (
                                        <Suspense fallback={<Loading />}>
                                            <FuncsPage key={region} region={region as Region} path="funcs" />
                                        </Suspense>
                                    );
                                }}
                            />
                            <Route
                                exact={true}
                                path="/:region(JP|NA|CN|KR|TW)/items/:tab?"
                                render={(props) => {
                                    const { region, tab } = props.match.params;
                                    return (
                                        <Suspense fallback={<Loading />}>
                                            <ItemsPage key={region} region={region as Region} tab={tab} />
                                        </Suspense>
                                    );
                                }}
                            />
                            <Route
                                exact={true}
                                path="/:region(JP|NA|CN|KR|TW)/event/:id([0-9]+)/:tab?"
                                render={(props) => {
                                    const { region, id, tab } = props.match.params;
                                    return (
                                        <Suspense fallback={<Loading />}>
                                            <EventPage
                                                key={`${region}-event-${id}`}
                                                region={region as Region}
                                                eventId={parseInt(id)}
                                                tab={tab}
                                            />
                                        </Suspense>
                                    );
                                }}
                            />
                            <Route
                                exact={true}
                                path="/:region(JP|NA|CN|KR|TW)/events"
                                render={(props) => {
                                    const { region } = props.match.params;
                                    return (
                                        <Suspense fallback={<Loading />}>
                                            <EventsPage key={region} region={region as Region} />
                                        </Suspense>
                                    );
                                }}
                            />
                            <Route
                                exact={true}
                                path="/:region(JP|NA|CN|KR|TW)/war/:id([0-9]+)"
                                render={(props) => {
                                    const { region, id } = props.match.params;
                                    return (
                                        <Suspense fallback={<Loading />}>
                                            <WarPage
                                                key={`${region}-war-${id}`}
                                                region={region as Region}
                                                warId={parseInt(id)}
                                            />
                                        </Suspense>
                                    );
                                }}
                            />
                            <Route
                                exact={true}
                                path="/:region(JP|NA|CN|KR|TW)/wars"
                                render={(props) => {
                                    const { region } = props.match.params;
                                    return (
                                        <Suspense fallback={<Loading />}>
                                            <WarsPage key={region} region={region as Region} />
                                        </Suspense>
                                    );
                                }}
                            />
                            <Route
                                exact={true}
                                path="/:region(JP|NA|CN|KR|TW)/mystic-codes"
                                render={(props) => {
                                    const { region } = props.match.params;
                                    return (
                                        <Suspense fallback={<Loading />}>
                                            <MysticCodesPage key={region} region={region as Region} />
                                        </Suspense>
                                    );
                                }}
                            />
                            <Route
                                exact={true}
                                path="/:region(JP|NA|CN|KR|TW)/servants"
                                render={(props) => {
                                    const { region } = props.match.params;
                                    return (
                                        <Suspense fallback={<Loading />}>
                                            <ServantsPage key={region} region={region as Region} />
                                        </Suspense>
                                    );
                                }}
                            />
                            <Route
                                exact
                                path="/:region(JP|NA|CN|KR|TW)/changes"
                                render={(props) => {
                                    const { region } = props.match.params;
                                    return (
                                        <Suspense fallback={<Loading />}>
                                            <ChangelogPage
                                                key={region}
                                                region={region as Region}
                                                localTime={this.state.localTime}
                                                visibleOnly={this.state.changelogVisibleOnly}
                                            />
                                        </Suspense>
                                    );
                                }}
                            />
                            <Route
                                exact
                                path="/:region(JP|NA|CN|KR|TW)/enemy-changes"
                                render={(props) => {
                                    const { region } = props.match.params;
                                    return (
                                        <Suspense fallback={<Loading />}>
                                            <EnemyChangelogPage key={region} region={region as Region} />
                                        </Suspense>
                                    );
                                }}
                            />
                            <Route
                                exact
                                path="/:region(JP|NA|CN|KR|TW)/faq"
                                render={(props) => {
                                    const { region } = props.match.params;
                                    return (
                                        <Suspense fallback={<Loading />}>
                                            <FaqPage region={region as Region} />
                                        </Suspense>
                                    );
                                }}
                            />
                            <Route
                                exact={true}
                                path="/:region(JP|NA|CN|KR|TW)/:endpoint(bgm|buff|command-code|craft-essence|func|item|master-mission|mystic-code|noble-phantasm|quest|script|servant|skill|event|war)"
                                render={(props) => {
                                    const { region, endpoint } = props.match.params;
                                    return (
                                        <Suspense fallback={<Loading />}>
                                            <RedirectPage
                                                basename={BASE_NAME}
                                                endpoint={endpoint}
                                                region={region as Region}
                                            />
                                        </Suspense>
                                    );
                                }}
                            />
                            <Route
                                path="/:region(JP|NA|CN|KR|TW)"
                                exact={true}
                                render={(props) => {
                                    const { region } = props.match.params;
                                    return (
                                        <Suspense fallback={<Loading />}>
                                            <HomePage key={region} region={region as Region} />
                                        </Suspense>
                                    );
                                }}
                            />
                            <Route
                                path="/"
                                exact={true}
                                render={({ location }) => {
                                    return location.hash.includes("#") ? (
                                        <Redirect to={location.hash.replace("#", "")} />
                                    ) : (
                                        <HomePage />
                                    );
                                }}
                            />
                            <Route path="*" exact={true} component={ErrorStatus} />
                        </Switch>
                    </Container>
                </Router>
            </HelmetProvider>
        );
    }
}

export default App;
