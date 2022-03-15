import React from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { connect, ConnectedProps } from "react-redux";

import { enemyActorConfigAddThunk, enemyActorConfigCloseThunk } from "../../app/enemyActorConfig/thunks";
import { RootState } from "../../app/store";

const mapStateToProps = (state: RootState) => ({
        open: state.enemyActorConfig.open,
        loading: state.enemyActorConfig.loading,
        servantOptions: state.enemyActorConfig.servantOptions,
    }),
    mapDispatchToProps = {
        add: enemyActorConfigAddThunk,
        close: enemyActorConfigCloseThunk,
    },
    connector = connect(mapStateToProps, mapDispatchToProps);

type Props = ConnectedProps<typeof connector>;

class EnemyActorConfigModal extends React.Component<Props> {
    render() {
        return (
            <Modal show={this.props.open} size="xl" onHide={this.props.close}>
                <Modal.Header closeButton>
                    <Modal.Title>Enemy Configuration</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <Form>
                        <Form.Group>
                            <Form.Label>Name</Form.Label>
                            <Form.Control
                                type="text"
                                disabled={this.props.loading}
                                value={this.props.servantOptions?.name}
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

export default connector(EnemyActorConfigModal);
