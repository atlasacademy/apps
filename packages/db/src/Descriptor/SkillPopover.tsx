import { Region, Skill } from "@atlasacademy/api-connector";
import { OverlayTrigger, Popover } from "react-bootstrap";
import SkillDescriptor from "./SkillDescriptor";
import EffectBreakdown from "../Breakdown/EffectBreakdown";

const SkillPopover = (props: { region: Region; skill: Skill.Skill }) => {
    const { region, skill } = props;

    const popOverContent = (
        <Popover
            id="skill-popover"
            style={{ maxWidth: "100em", width: "auto" }}
        >
            <Popover.Title>
                <SkillDescriptor region={region} skill={skill} />
            </Popover.Title>
            <Popover.Content>
                <EffectBreakdown
                    region={region}
                    cooldowns={
                        skill.coolDown.length > 0 ? skill.coolDown : undefined
                    }
                    funcs={skill.functions}
                    levels={skill.functions[0]?.svals.length ?? 1}
                    scripts={skill.script}
                    narrowWidth={true}
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
                title={`View details of skill ${skill.name}`}
            >
                {SkillDescriptor.renderAsString(skill)}
            </a>
        </OverlayTrigger>
    );
};

export default SkillPopover;
