import { Region, NoblePhantasm } from "@atlasacademy/api-connector";
import { OverlayTrigger, Popover } from "react-bootstrap";
import EffectBreakdown from "../Breakdown/EffectBreakdown";

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
                />
            </Popover.Content>
        </Popover>
    );

    return (
        <OverlayTrigger
            trigger="focus"
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
            <a
                href="#"
                onClick={(e) => e.preventDefault()}
                title={`View details of noble phantasm ${noblePhantasm.name}`}
            >
                [{noblePhantasm.name}]
            </a>
        </OverlayTrigger>
    );
};

export default NoblePhantasmPopover;
