import { Button, ButtonGroup } from "react-bootstrap";
import { useTranslation } from "react-i18next";

interface IProps {
    visibleOnly: boolean;
    updateVisibleOnly: (value: boolean) => void;

    localTime: boolean;
    updateLocalTime: (value: boolean) => void;
}

let Settings = ({ visibleOnly, updateVisibleOnly, localTime, updateLocalTime }: IProps) => {
    const { t } = useTranslation();
    return (
        <div>
            <ButtonGroup>
                <Button disabled variant="outline-dark">
                    {t("Showing")}{" "}
                </Button>
                <Button variant={visibleOnly ? "warning" : "success"} onClick={() => updateVisibleOnly(!visibleOnly)}>
                    {visibleOnly ? t("only entries with visible changes") : t("all entries")}
                </Button>
                <Button variant={localTime ? "warning" : "success"} onClick={() => updateLocalTime(!localTime)}>
                    {localTime ? t("with local timestamps") : t("with UTC timestamps")}
                </Button>
            </ButtonGroup>
            <br />
            &nbsp;
        </div>
    );
};

export default Settings;
