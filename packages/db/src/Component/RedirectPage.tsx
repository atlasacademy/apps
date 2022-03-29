import React from "react";
import { Link } from "react-router-dom";

import { Region } from "@atlasacademy/api-connector";

import figure_016 from "../Assets/figure_016.png";
import figure_074 from "../Assets/figure_074.png";
import figure_127 from "../Assets/figure_127.png";
import figure_145 from "../Assets/figure_145.png";
import figure_150 from "../Assets/figure_150.png";
import figure_174 from "../Assets/figure_174.png";
import figure_189 from "../Assets/figure_189.png";
import figure_198 from "../Assets/figure_198.png";
import figure_241 from "../Assets/figure_241.png";
import figure_253 from "../Assets/figure_253.png";

const images = [
    figure_016,
    figure_074,
    figure_127,
    figure_145,
    figure_150,
    figure_174,
    figure_189,
    figure_198,
    figure_241,
    figure_253,
];

interface IProps {
    basename: string;
    endpoint: string;
    region: Region;
}

class RedirectPage extends React.Component<IProps> {
    render() {
        document.title = "Error - Atlas Academy DB";

        const random = Math.floor(Math.random() * images.length),
            image = images[random];

        return (
            <div id={"error-status"}>
                <img
                    alt={"Error"}
                    src={image}
                    style={{
                        display: "block",
                        height: 300,
                        margin: "0 auto",
                    }}
                />

                <p className={"text-center"} style={{ margin: 50 }}>
                    <strong>
                        {"Route not found."}
                        <br />
                        {`You can view all ${this.props.endpoint}s `}
                        <Link to={`/${this.props.region}/${this.props.endpoint}s`}>{"here"}</Link>
                        {"."}
                    </strong>
                </p>
            </div>
        );
    }
}

export default RedirectPage;
