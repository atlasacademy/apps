import React from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { connect, ConnectedProps } from "react-redux";

import {
    playerActorConfigAddThunk,
    playerActorConfigCloseThunk,
    playerActorConfigUpdateServantOptions,
    playerActorConfigValidateServantOptions,
} from "../../app/playerActorConfig/thunks";
import { RootState } from "../../app/store";

const mapStateToProps = (state: RootState) => ({
        open: state.playerActorConfig.open,
        loading: state.playerActorConfig.loading,
        servantOptions: state.playerActorConfig.servantOptions,
    }),
    mapDispatchToProps = {
        add: playerActorConfigAddThunk,
        close: playerActorConfigCloseThunk,
        validate: playerActorConfigValidateServantOptions,
        updateServantOptions: playerActorConfigUpdateServantOptions,
    },
    connector = connect(mapStateToProps, mapDispatchToProps);

type Props = ConnectedProps<typeof connector>;

class PlayerActorConfigModal extends React.Component<Props> {
    private setLevel(value: string) {
        this.props.updateServantOptions({
            ...this.props.servantOptions,
            level: value,
        });
    }

    private setName(value: string) {
        this.props.updateServantOptions({
            ...this.props.servantOptions,
            name: value,
        });
    }

    render() {
        return (
            <Modal animation={false} show={this.props.open} size="xl" onHide={this.props.close}>
                <Modal.Header closeButton>
                    <Modal.Title>Servant Configuration</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <Form>
                        <Form.Group>
                            <Form.Label>Name</Form.Label>
                            <Form.Control
                                type="text"
                                disabled={this.props.loading}
                                onBlur={this.props.validate}
                                onChange={(event) => this.setName(event.target.value)}
                                value={this.props.servantOptions?.name}
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Level</Form.Label>
                            <Form.Control
                                type="number"
                                disabled={this.props.loading}
                                onBlur={this.props.validate}
                                onChange={(event) => this.setLevel(event.target.value)}
                                value={this.props.servantOptions.level}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={this.props.close}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={this.props.add}>
                        Add
                    </Button>
                </Modal.Footer>
            </Modal>
        );
    }
}

export default connector(PlayerActorConfigModal);
