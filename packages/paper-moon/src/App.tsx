import React from 'react';
import {Container} from "react-bootstrap";
import {connect, ConnectedProps} from "react-redux";
import {battleSetupInitThunk} from "./app/battleSetup/thunks";
import BattleDisplay from "./components/BattleDisplay";
import BattleSetup from "./components/BattleSetup";
import Navigation from "./components/Navigation";

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
                <Navigation/>
                <Container fluid>
                    <BattleSetup/>
                    <BattleDisplay/>
                </Container>
            </div>
        );
    }
}

export default connector(App);
