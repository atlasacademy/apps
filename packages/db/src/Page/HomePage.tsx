import React from "react";
import { Link } from "react-router-dom";

import { Region } from "@atlasacademy/api-connector";

import Manager from "../Setting/Manager";

interface IProps {
    region?: Region;
}

class HomePage extends React.Component<IProps> {
    componentDidMount() {
        if (this.props.region) {
            Manager.setRegion(this.props.region);
        }

        document.title = "Atlas Academy DB";
    }

    render() {
        return (
            <div>
                <h1>Atlas Academy DB</h1>

                <p>
                    <i>FGO Game Data Navigator — without any of the fluff.</i>
                </p>

                <hr />

                <p>
                    This tools lets you accurately navigate the raw data the game is using in the back. None of the data
                    that is being displayed on this tool is manually entered. Everything is accurately reflecting
                    exactly the raw data available from the most recent version of the game.
                </p>

                <p>
                    Please note that the skill/NP/effect descriptions are generated automatically and if there is an
                    unknown interaction or new function, there is a possibility that it is displayed incorrectly.
                </p>

                <p>
                    All the data that is being used to render this DB is publicly available at{" "}
                    <a href="https://api.atlasacademy.io" target="_blank" rel="noopener noreferrer">
                        https://api.atlasacademy.io
                    </a>
                    . The data at api.atlasacademy.io is automatically maintained and will be refreshed within an hour
                    of a new release of the game.
                </p>

                <p>
                    <Link to={`${this.props.region ?? "NA"}/faq`}>
                        <b>Frequently Asked Questions / How to navigate the DB</b>
                    </Link>
                </p>

                <br />

                <div>Credits:</div>
                <ul>
                    <li>
                        <a href="https://atlasacademy.io">Atlas Academy</a>
                        &nbsp; (
                        <a href="https://discord.gg/TKJmuCR" target="_blank" rel="noopener noreferrer">
                            Discord
                        </a>
                        )
                    </li>
                    <li>solution (solution#0286)</li>
                    <li>Cereal</li>
                    <li>
                        Cipher (<a href="https://github.com/minhducsun2002">minhducsun2002</a>)
                    </li>
                    <li>
                        <a href="https://github.com/Mitsunee">Mitsunee</a>
                    </li>
                    <li>
                        <a href="https://rayshift.io/" target="_blank" rel="noreferrer">
                            Neo
                        </a>
                    </li>
                    <li>
                        <a href="https://github.com/MaxAkito" target="_blank" rel="noreferrer">
                            Max
                        </a>{" "}
                        (MaxAkito#0096)
                    </li>
                </ul>
            </div>
        );
    }
}

export default HomePage;
