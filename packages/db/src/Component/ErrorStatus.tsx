import { AxiosError } from "axios";
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
    error?: AxiosError;
    endpoint?: string;
    region?: Region;
}

class ErrorStatus extends React.Component<IProps> {
    render() {
        document.title = "Error - Atlas Academy DB";
        let message: string | JSX.Element;

        if (this.props.endpoint !== undefined && this.props.region !== undefined) {
            const endpoint = this.props.endpoint;
            message = (
                <>
                    {"Route not found."}
                    <br />
                    {`You can view all ${endpoint}s `}
                    <Link to={`/${this.props.region}/${endpoint}s`}>{"here"}</Link>
                    {"."}
                </>
            );
        } else if (this.props.error === undefined || this.props.error.response === undefined) {
            message = "Not Found";
        } else if (this.props.error.response.status === 500) {
            message = "Server Error";
        } else if (this.props.error.response.status === 404) {
            message = "Not Found";
        } else {
            message = "Code: " + this.props.error.response.status;
        }

        if (
            typeof this.props.error?.response?.data === "object" &&
            this.props.error.response.data !== null &&
            typeof (this.props.error.response.data as any).detail === "string"
        ) {
            const [, , region, endpoint] = this.props.error.response.config
                    .url!.match(/\/nice\/(NA|JP)\/.*(?=\/)/)![0]
                    .split("/"),
                errorDetail = (this.props.error.response.data as any).detail;

            message = (
                <>
                    {errorDetail}
                    <br />
                    {`You can view all ${endpoint}s `}
                    <Link to={`/${region}/${endpoint}s`}>{"here"}</Link>
                    {"."}
                </>
            );
        }

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
                    <strong>ERROR: {message}</strong>
                </p>
            </div>
        );
    }
}

export default ErrorStatus;
