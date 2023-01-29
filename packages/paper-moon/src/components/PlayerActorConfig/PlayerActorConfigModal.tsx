import React, { useCallback } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { ConnectedProps, connect } from "react-redux";

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

const PlayerActorConfigModal: React.FC<Props> = (props) => {
    const setLevel = useCallback(
        (value: string) => {
            props.updateServantOptions({ ...props.servantOptions, level: value });
        },
        [props]
    );

    const setName = useCallback(
        (value: string) => {
            props.updateServantOptions({ ...props.servantOptions, name: value });
        },
        [props]
    );

    return (
        <Modal animation={false} show={props.open} size="xl" onHide={props.close}>
            <Modal.Header closeButton>
                <Modal.Title>Servant Configuration</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <Form>
                    <Form.Group>
                        <Form.Label>Name</Form.Label>
                        <Form.Control
                            type="text"
                            disabled={props.loading}
                            onBlur={props.validate}
                            onChange={(event) => setName(event.target.value)}
                            value={props.servantOptions?.name}
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Level</Form.Label>
                        <Form.Control
                            type="number"
                            disabled={props.loading}
                            onBlur={props.validate}
                            onChange={(event) => setLevel(event.target.value)}
                            value={props.servantOptions.level}
                        />
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
export default connector(PlayerActorConfigModal);
