import { Region, NoblePhantasm } from "@atlasacademy/api-connector";
import { Button, OverlayTrigger, Popover } from "react-bootstrap";
import EffectBreakdown from "../Breakdown/EffectBreakdown";
import "../Component/MoveButton.css";

const NoblePhantasmPopover = (props: {
    region: Region;
    noblePhantasm: NoblePhantasm.NoblePhantasm;
}) => {
    const { region, noblePhantasm } = props;

    const popOverContent = (
        <Popover
            id="skill-popover"
            style={{ maxWidth: "100em", width: "auto" }}
        >
            <Popover.Title>[{noblePhantasm.name}]</Popover.Title>
            <Popover.Content>
                <EffectBreakdown
                    region={region}
                    funcs={noblePhantasm.functions}
                    gain={noblePhantasm.npGain}
                    levels={noblePhantasm.functions[0]?.svals.length ?? 1}
                    popOver={true}
                />
            </Popover.Content>
        </Popover>
    );

    return (
        <OverlayTrigger
            trigger="click"
            rootClose
            placement="auto"
            overlay={popOverContent}
            popperConfig={{
                modifiers: [
                    {
                        name: "offset",
                        options: {
                            offset: [0, 10],
                        },
                    },
                ],
            }}
        >
            <Button
                variant="link"
                className="move-button"
                title={`Click to view details of noble phantasm ${noblePhantasm.name}`}
            >
                [{noblePhantasm.name}]
            </Button>
        </OverlayTrigger>
    );
};

export default NoblePhantasmPopover;
