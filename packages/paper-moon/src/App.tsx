import 'bootstrap/dist/css/bootstrap.min.css';
import {BattleTeam} from "@atlasacademy/battle/dist/Enum/BattleTeam";
import React from 'react';
import {Container} from "react-bootstrap";
import {ServantPicker} from "./Component/ServantPicker";

function App() {
    return (
        <div>
            <Container fluid>
                <h3>Paper Moon</h3>

                <div>NOTES:</div>
                <ul>
                    <li>No NP yet</li>
                    <li>You cannot swap enemy or player target at this point (everything will target first enemy and first player)</li>
                    <li>No trigger skills</li>
                    <li>A bunch of skill functions are yet to be implemented</li>
                </ul>

                <hr/>
                <h4>Add Actor</h4>
                <ServantPicker/>
                <select>
                    <option key={BattleTeam.PLAYER}>Player</option>
                    <option key={BattleTeam.ENEMY}>Enemy</option>
                </select>

            </Container>
        </div>
    );
}

export default App;
