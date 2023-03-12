import { Button, OverlayTrigger, Popover } from "react-bootstrap";

import { Region, Skill } from "@atlasacademy/api-connector";

import EffectBreakdown from "../Breakdown/EffectBreakdown";
import useApi from "../Hooks/useApi";
import { lang } from "../Setting/Manager";
import SkillDescriptor from "./SkillDescriptor";

import "../Component/MoveButton.css";
import "./PopOver.css";

const SkillPopover = (props: { region: Region; skill: Skill.Skill }) => {
    const { region, skill } = props;

    const popOverContent = (
        <Popover id={`skill-${skill.id}`} className="skill-popover">
            <Popover.Title>
                <SkillDescriptor region={region} skill={skill} />
            </Popover.Title>
            <Popover.Content>
                <EffectBreakdown
                    region={region}
                    cooldowns={skill.coolDown.length > 0 ? skill.coolDown : undefined}
                    funcs={skill.functions}
                    triggerSkillIdStack={[skill.id]}
                    levels={skill.functions[0]?.svals.length ?? 1}
                    scripts={skill.script}
                    popOver={true}
                    additionalSkillId={skill.script.additionalSkillId}
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
            <Button variant="link" className="move-button" title={`Click to view details of skill ${skill.name}`}>
                <span lang={lang(region)}>{SkillDescriptor.renderAsString(skill)}</span>
            </Button>
        </OverlayTrigger>
    );
};

export default SkillPopover;

export const SkillPopOverId = (props: { region: Region; skillId: number }) => {
    const { data: skill } = useApi("skill", props.skillId, false);
    if (skill !== undefined) {
        return <SkillPopover region={props.region} skill={skill} />;
    } else {
        return null;
    }
};
