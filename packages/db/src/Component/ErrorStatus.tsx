import { AxiosError } from "axios";
import React from "react";
import { Button } from "react-bootstrap";
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
    error?: AxiosError;
    endpoint?: string;
    region?: Region;
}

const getSanitizedEndpoint = (endpoint: string) => {
    const rawToNiceEndpoint = {
        CC: "command-code",
        MC: "mystic-code",
        equip: "craft-essence",
        mm: "master-mission",
        NP: "noble-phantasm",
        function: "func",
    };
    return endpoint in rawToNiceEndpoint ? rawToNiceEndpoint[endpoint as keyof typeof rawToNiceEndpoint] : endpoint;
};

class ErrorStatus extends React.Component<IProps> {
    render() {
        document.title = "Error - Atlas Academy DB";
        let message: string;

        const links = [
            <Link to={`/`}>
                <Button variant="primary" style={{ minWidth: "130px" }}>
                    {"DB Home"}
                </Button>
            </Link>,
            <Button variant="primary" style={{ minWidth: "130px" }} onClick={() => window.history.back()}>
                {"Previous Page"}
            </Button>,
        ];

        if (this.props.endpoint !== undefined && this.props.region !== undefined) {
            const endpoint = this.props.endpoint;
            message = "This page does not exist.";
            links.splice(
                links.length - 1,
                0,
                <Link to={`/${this.props.region}/${endpoint}s`}>
                    <Button variant="primary" style={{ minWidth: "130px" }}>{`${endpoint
                        .replace(/(^|-)./g, (match) => match.toUpperCase())
                        .replace("-", " ")}s`}</Button>
                </Link>
            );
        } else if (this.props.error === undefined || this.props.error.response === undefined) {
            message = "This page does not exist.";
        } else if (this.props.error.response.status === 500) {
            message = "Server Error";
        } else if (this.props.error.response.status === 404) {
            message = "Not Found";
        } else {
            message = "Code " + this.props.error.response.status;
        }

        if (
            typeof this.props.error?.response?.data === "object" &&
            this.props.error.response.data !== null &&
            typeof (this.props.error.response.data as any).detail === "string"
        ) {
            const [, , region, rawEndpoint] = this.props.error.response.config
                    .url!.match(/\/nice\/(NA|JP)\/.*(?=\/)/)![0]
                    .split("/"),
                niceEndpoint = getSanitizedEndpoint(rawEndpoint).replace(/(^|-)./g, (match) => match.toUpperCase());

            message = niceEndpoint.replace("-", " ") + " not found.";

            links.splice(
                links.length - 1,
                0,
                <Link to={`/${region}/${niceEndpoint.toLowerCase()}s`}>
                    <Button variant="primary" style={{ minWidth: "130px" }}>
                        {`${niceEndpoint.replace("-", " ")}`}
                        {"s"}
                    </Button>
                </Link>
            );
        }

        const random = Math.floor(Math.random() * images.length),
            image = images[random];

        return (
            <div id={"error-status"} style={{ maxWidth: "1000px" }}>
                <img
                    alt={"Error"}
                    src={image}
                    style={{
                        display: "block",
                        height: 300,
                        margin: "0 auto",
                    }}
                />
                <p style={{ width: "fit-content", margin: "0 auto", padding: "10px" }}>
                    <strong>ERROR: {message}</strong>
                </p>
                <ul
                    style={{
                        width: "fit-content",
                        listStyleType: "none",
                        margin: "0 auto",
                        padding: 0,
                    }}
                >
                    {links.map((link, idx) => (
                        <li key={idx} className="d-inline my-0 mx-1">
                            {link}
                        </li>
                    ))}
                </ul>
            </div>
        );
    }
}

export default ErrorStatus;
