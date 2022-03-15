import React from "react";
import { Container } from "react-bootstrap";
import { connect, ConnectedProps } from "react-redux";

import { battleSetupInitThunk } from "./app/battleSetup/thunks";
import BattleDisplay from "./components/BattleDisplay";
import BattleSetup from "./components/BattleSetup/BattleSetup";
import EnemyActorConfigModal from "./components/EnemyActorConfig/EnemyActorConfigModal";
import Navigation from "./components/Navigation";
import PlayerActorConfigModal from "./components/PlayerActorConfig/PlayerActorConfigModal";

const mapDispatchToProps = {
        init: battleSetupInitThunk,
    },
    connector = connect(null, mapDispatchToProps);

type AppProps = ConnectedProps<typeof connector>;

class App extends React.Component<AppProps> {
    async componentDidMount() {
        await this.props.init();
    }

    render() {
        return (
            <div>
                <Navigation />
                <Container fluid>
                    <BattleSetup />
                    <PlayerActorConfigModal />
                    <EnemyActorConfigModal />
                    <BattleDisplay />
                </Container>
            </div>
        );
    }
}

export default connector(App);
