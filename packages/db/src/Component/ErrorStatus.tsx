import { AxiosError } from "axios";
import Fuse from "fuse.js";
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
    endpoint?: string;
    error?: AxiosError;
    id?: number;
    region?: Region;
}

const endpoints = [
    "bgm",
    "buff",
    "command-code",
    "craft-essence",
    "func",
    "item",
    "master-mission",
    "mystic-code",
    "noble-phantasm",
    "quest",
    "script",
    "servant",
    "skill",
    "event",
    "war",
];

const fuseEndpoints = new Fuse(endpoints, { includeScore: true });

const getSanitisedEndpoint = (endpoint: string) => {
    const rawToNiceEndpoint = {
        CC: { name: "command-code", display: "CC" },
        MC: { name: "mystic-code", display: "MC" },
        equip: { name: "craft-essence", display: "CE" },
        mm: { name: "master-mission", display: "MM" },
        NP: { name: "noble-phantasm", display: "NP" },
        function: { name: "func", display: "function" },
        bgm: { name: "bgm", display: "BGM" },
    };
    return endpoint in rawToNiceEndpoint
        ? rawToNiceEndpoint[endpoint as keyof typeof rawToNiceEndpoint]
        : { name: endpoint, display: endpoint.replace(/(^|-)./g, (match) => match.toUpperCase()).replace("-", " ") };
};

class ErrorStatus extends React.Component<IProps> {
    render() {
        document.title = "Error - Atlas Academy DB";
        let message: string | JSX.Element;

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

        if (this.props.endpoint !== undefined && this.props.region !== undefined && this.props.id !== undefined) {
            const { region, endpoint, id } = this.props;
            message = "This page does not exist. ";
            const searchResults = fuseEndpoints.search(endpoint);

            if (searchResults.length) {
                const match = searchResults[0].item;

                message = (
                    <>
                        {`This page does not exist.`}
                        <br />
                        {`Maybe you meant to go to `}
                        <Link to={`/${region}/${match}/${id}`}>{`${match}/${id}`}</Link>
                        {" instead?"}
                    </>
                );
            }
        } else if (this.props.endpoint !== undefined && this.props.region !== undefined) {
            message = "This page does not exist.";
            if (this.props.endpoint.length) {
                const endpoint = fuseEndpoints.search(this.props.endpoint)?.[0]?.item ?? "";
                if (endpoint.length) {
                    message += ` Maybe you meant to view all ${getSanitisedEndpoint(endpoint).display}s?`;
                    links.splice(
                        links.length - 1,
                        0,
                        <Link to={`/${this.props.region}/${getSanitisedEndpoint(endpoint).name}s`}>
                            <Button variant="primary" style={{ minWidth: "130px" }}>{`${
                                getSanitisedEndpoint(endpoint).display
                            }s`}</Button>
                        </Link>
                    );
                }
            }
        } else if (this.props.error === undefined || this.props.error.response === undefined) {
            message = "This page does not exist";
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
                    .url!.match(/\/nice\/(NA|JP|CN|KR|TW)\/.*(?=\/)/)![0]
                    .split("/"),
                niceEndpoint = getSanitisedEndpoint(rawEndpoint);

            message = `${niceEndpoint.display} not found.`;

            links.splice(
                links.length - 1,
                0,
                <Link to={`/${region}/${niceEndpoint.name}s`}>
                    <Button variant="primary" style={{ minWidth: "130px" }}>
                        {niceEndpoint.display}
                        {"s"}
                    </Button>
                </Link>
            );
        }

        const random = Math.floor(Math.random() * images.length),
            image = images[random];

        return (
            <div id={"error-status"} style={{ maxWidth: "1000px", margin: "0 auto" }}>
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
