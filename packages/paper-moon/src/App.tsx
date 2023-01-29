import { FC, useEffect } from "react";
import { Container } from "react-bootstrap";
import { ConnectedProps, connect } from "react-redux";

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

const App: FC<AppProps> = (props) => {
    useEffect(() => {
        props.init();
    }, [props]);

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
};

export default connector(App);
