import React from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { ConnectedProps, connect } from "react-redux";

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

const EnemyActorConfigModal: React.FC<Props> = (props) => {
    return (
        <Modal show={props.open} size="xl" onHide={props.close}>
            <Modal.Header closeButton>
                <Modal.Title>Enemy Configuration</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <Form>
                    <Form.Group>
                        <Form.Label>Name</Form.Label>
                        <Form.Control type="text" disabled={props.loading} value={props.servantOptions?.name} />
                    </Form.Group>
                </Form>
            </Modal.Body>

            <Modal.Footer>
                <Button variant="secondary" onClick={props.close}>
                    Close
                </Button>
                <Button variant="primary" onClick={props.add}>
                    Add
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default connector(EnemyActorConfigModal);
