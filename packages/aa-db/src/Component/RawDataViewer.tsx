import {faSearchPlus} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import axios from "axios";
import React from "react";
import {Modal} from "react-bootstrap";
import ReactJson from "react-json-view";

interface IProps {
    data: object | string;
}

interface IState {
    data?: object;
    showing: boolean;
}

class RawDataViewer extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);

        this.state = {
            showing: false
        };
    }

    hide() {
        this.setState({showing: false});
    }

    async show() {
        if (this.state.data) {
            this.setState({showing: true});
        } else if (typeof this.props.data === "object") {
            this.setState({showing: true, data: this.props.data});
        } else {
            try {
                this.setState({
                    showing: true,
                    data: (await axios.get(this.props.data)).data,
                });
            } catch (e) {
                this.setState({
                    showing: true,
                    data: {error: e}
                });
            }
        }
    }

    render() {
        return (
            <div>
                <span className={'text-primary'}
                      style={{cursor: "pointer"}}
                      onClick={() => {
                          this.show();
                      }}>
                    View
                    &nbsp;
                    <FontAwesomeIcon icon={faSearchPlus}/>
                </span>

                <Modal size={"lg"} show={this.state.showing} onHide={() => this.hide()}>
                    <Modal.Header closeButton>
                        <Modal.Title>Raw Data Viewer</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {this.state.data ? (
                            <ReactJson src={this.state.data} collapsed={1}/>
                        ) : null}
                    </Modal.Body>
                </Modal>
            </div>
        );
    }
}

export default RawDataViewer;
