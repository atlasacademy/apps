import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import {Container} from "react-bootstrap";
import {HashRouter as Router, Route, Switch,} from "react-router-dom";
import Navigation from "./Component/Navigation";
import BuffPage from "./Page/BuffPage";
import FuncPage from './Page/FuncPage';
import NoblePhantasmPage from "./Page/NoblePhantasmPage";
import QuestPage from "./Page/QuestPage";
import ServantPage from "./Page/ServantPage";
import ServantsPage from "./Page/ServantsPage";
import SkillPage from "./Page/SkillPage";
import Manager from "./Setting/Manager";
import {LanguageOption, RegionOption} from "./Setting/Option";

interface IState {
    region: RegionOption,
    language: LanguageOption,
}

class App extends React.Component<any, IState> {
    constructor(props: any) {
        super(props);
        this.state = {
            region: Manager.region(),
            language: Manager.language(),
        };

        Manager.onUpdate(() => this.updateSettings());
    }

    private updateSettings() {
        this.setState({
            region: Manager.region(),
            language: Manager.language(),
        });
    }

    render() {
        return (
            <Router>
                <Navigation/>
                <br/>

                <Container key={`${this.state.region}-${this.state.language}`}>
                    <Switch>
                        <Route path="/buff/:id" render={(
                            props => <BuffPage key={props.match.params.id} id={props.match.params.id}/>
                        )}/>
                        <Route path="/func/:id" render={(
                            props => <FuncPage key={props.match.params.id} id={props.match.params.id}/>
                        )}/>
                        <Route path="/noble-phantasm/:id" render={(
                            props => <NoblePhantasmPage key={props.match.params.id} id={props.match.params.id}/>
                        )}/>
                        <Route path="/quest/:id/:phase" render={(
                            props => (
                                <QuestPage
                                    key={`${props.match.params.id}-${props.match.params.phase}`}
                                    id={props.match.params.id}
                                    phase={props.match.params.phase}/>
                            )
                        )}/>
                        <Route path="/servant/:id" render={(
                            props => <ServantPage key={props.match.params.id} id={props.match.params.id}/>
                        )}/>
                        <Route path="/skill/:id" render={(
                            props => <SkillPage key={props.match.params.id} id={props.match.params.id}/>
                        )}/>
                        <Route path="/servants" component={ServantsPage}/>
                        <Route path="/" component={ServantsPage}/>
                    </Switch>
                </Container>
            </Router>
        );
    }
}

export default App;
