import { faSearchPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import copy from "copy-to-clipboard";
import React from "react";
import { Button, Modal } from "react-bootstrap";
import ReactJson, { ThemeKeys } from "react-json-view";

import Manager from "../Setting/Manager";
import { Theme } from "../Setting/Theme";

interface IProps {
    data: object | string;
    text?: string;
    block?: boolean;
}

interface IState {
    data?: object;
    showing: boolean;
}

const viewerTheme: Map<Theme, ThemeKeys> = new Map([
    [Theme.CYBORG, "monokai"],
    [Theme.DARKLY, "monokai"],
    [Theme.SLATE, "monokai"],
    [Theme.SOLAR, "solarized"],
    [Theme.SUPERHERO, "monokai"],
]);

class RawDataViewer extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);

        this.state = {
            showing: false,
        };
    }

    hide() {
        this.setState({ showing: false });
    }

    async show() {
        if (this.state.data) {
            this.setState({ showing: true });
        } else if (typeof this.props.data === "object") {
            this.setState({ showing: true, data: this.props.data });
        } else {
            try {
                this.setState({
                    showing: true,
                    data: (await axios.get<any>(this.props.data)).data,
                });
            } catch (e) {
                this.setState({
                    showing: true,
                    data: { error: e },
                });
            }
        }
    }

    render() {
        const block = this.props.block ?? true;
        return (
            <>
                <Button
                    variant="outline-info"
                    block={block}
                    onClick={() => {
                        this.show();
                    }}
                >
                    {this.props.text || "View"}
                    &nbsp;
                    <FontAwesomeIcon icon={faSearchPlus} />
                </Button>

                <Modal size={"lg"} show={this.state.showing} onHide={() => this.hide()}>
                    <Modal.Header closeButton>
                        <Modal.Title>Raw Data Viewer</Modal.Title>
                    </Modal.Header>
                    <Modal.Body lang="en-US">
                        {this.state.data ? (
                            <ReactJson
                                style={{ wordBreak: "break-all" }}
                                src={this.state.data}
                                collapsed={1}
                                theme={viewerTheme.get(Manager.theme()) ?? "rjv-default"}
                                enableClipboard={(clipboard) => {
                                    if (typeof clipboard.src === "string") {
                                        copy(clipboard.src);
                                    }
                                }}
                            />
                        ) : null}
                    </Modal.Body>
                </Modal>
            </>
        );
    }
}

export default RawDataViewer;
