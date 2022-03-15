import { Button, ButtonGroup } from "react-bootstrap";

interface IProps {
    visibleOnly: boolean;
    updateVisibleOnly: (value: boolean) => void;

    localTime: boolean;
    updateLocalTime: (value: boolean) => void;
}

let Settings = ({ visibleOnly, updateVisibleOnly, localTime, updateLocalTime }: IProps) => (
    <div>
        <ButtonGroup>
            <Button disabled variant="outline-dark">
                Showing{" "}
            </Button>
            <Button variant={visibleOnly ? "warning" : "success"} onClick={() => updateVisibleOnly(!visibleOnly)}>
                {visibleOnly ? "only entries with visible changes" : "all entries"}
            </Button>
            <Button variant={localTime ? "warning" : "success"} onClick={() => updateLocalTime(!localTime)}>
                {localTime ? "with local timestamps" : "with UTC timestamps"}
            </Button>
        </ButtonGroup>
        <br />
        &nbsp;
    </div>
);

export default Settings;
