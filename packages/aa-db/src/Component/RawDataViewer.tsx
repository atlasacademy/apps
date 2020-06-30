import {faSearchPlus} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import React from "react";
import {Modal} from "react-bootstrap";
import ReactJson from "react-json-view";

interface IProps {
    data: object;
}

interface IState {
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

    show() {
        this.setState({showing: true});
    }

    render() {
        return (
            <div>
                <span className={'text-primary'}
                      style={{cursor: "pointer"}}
                      onClick={() => {
                          this.show();
                      }}>
                    View Raw
                    &nbsp;
                    <FontAwesomeIcon icon={faSearchPlus}/>
                </span>

                <Modal size={"lg"} show={this.state.showing} onHide={() => this.hide()}>
                    <Modal.Header closeButton>
                        <Modal.Title>Raw Data Viewer</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <ReactJson src={this.props.data}/>
                    </Modal.Body>
                </Modal>
            </div>
        );
    }
}

export default RawDataViewer;
