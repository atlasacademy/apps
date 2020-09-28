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
            && this.props.error.response.data.detail !== undefined
        ) {
            message = this.props.error.response.data.detail;
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
