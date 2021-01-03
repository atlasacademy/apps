import React from "react";
import {Button, ButtonGroup} from "react-bootstrap";

interface IProps { visibleOnly: boolean, updateVisibleOnly: (value : boolean) => void }

export default ({ visibleOnly, updateVisibleOnly } : IProps) => (
    <div>
        <ButtonGroup>
            <Button disabled variant="outline-dark">Showing </Button>
            <Button
                variant={visibleOnly ? 'warning' : 'success'}
                onClick={() => updateVisibleOnly(!visibleOnly)}>
                {visibleOnly
                    ? 'only entries with visible changes'
                    : 'all entries'}
            </Button>
        </ButtonGroup>
        <br />&nbsp;
    </div>
)