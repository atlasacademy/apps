import {AxiosError} from "axios";
import React from "react";

const images = [
    './assets/figure_016.png',
    './assets/figure_074.png',
    './assets/figure_127.png',
    './assets/figure_145.png',
    './assets/figure_150.png',
    './assets/figure_174.png',
    './assets/figure_189.png',
    './assets/figure_198.png',
    './assets/figure_241.png',
    './assets/figure_253.png',
];

interface IProps {
    error?: AxiosError;
}

interface ErrorDetail {
    loc: [string, string, number],
    msg: string,
    type: string,
}

class ErrorStatus extends React.Component<IProps> {
    render() {
        document.title = 'Error - Atlas Academy DB'
        let message: string;

        if (this.props.error === undefined) {
            message = 'Not Found';
        } else if (this.props.error.response?.status === 500) {
            message = 'Server Error';
        } else if (this.props.error.response?.status === 404) {
            message = 'Not Found';
        } else {
            message = 'Code: ' + this.props.error.response?.status;
        }

        if (
            typeof this.props.error?.response?.data === "object"
            && typeof this.props.error.response.data.detail === "string"
        ) {
            message = this.props.error.response.data.detail;
        }

        if (
            typeof this.props.error?.response?.data === "object"
            && typeof this.props.error.response.data.detail === "object"
        ) {
            const value_errors: string[] = this.props.error.response.data.detail.map((detail: ErrorDetail) => {
                if (detail.type.startsWith("value_error.number")) {
                    return detail.msg.replace("ensure this value", detail.loc[1]);
                } else {
                    return "";
                }
            });

            if (value_errors.length > 0)
                message = "Ensure " + value_errors.join(" and ")
        }

        const random = Math.floor(Math.random() * images.length),
            image = images[random];

        return (
            <div id={'error-status'}>
                <img alt={'Error'} src={image} style={{
                    display: "block",
                    height: 300,
                    margin: '0 auto',
                }}/>

                <p className={'text-center'} style={{margin: 50}}>
                    <strong>ERROR: {message}</strong>
                </p>
            </div>
        );
    }

}

export default ErrorStatus;
