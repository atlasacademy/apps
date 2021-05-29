import React from 'react';
import {connect, ConnectedProps} from "react-redux";
import {battleSetupInitThunk} from "./app/battleSetup/thunks";
import BattleSetup from "./components/BattleSetup";

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
            <div className="App">
                <h3>Paper Moon</h3>
                <BattleSetup/>
            </div>
        );
    }
}

export default connector(App);
