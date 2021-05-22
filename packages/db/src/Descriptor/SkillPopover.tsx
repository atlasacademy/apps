import { Region, Skill } from "@atlasacademy/api-connector";
import { useEffect, useState } from "react";
import { OverlayTrigger, Popover } from "react-bootstrap";
import Api from "../Api";
import EffectBreakdown from "../Breakdown/EffectBreakdown";
import SkillDescriptor from "./SkillDescriptor";

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
                    popOver={true}
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
                title={`Click to view details of skill ${skill.name}`}
            >
                {SkillDescriptor.renderAsString(skill)}
            </a>
        </OverlayTrigger>
    );
};

export default SkillPopover;

export const SkillPopOverId = (props: { region: Region; skillId: number }) => {
    const [skill, setSkill] = useState<Skill.Skill>(null as any);
    useEffect(() => {
        Api.skill(props.skillId, false).then((s) => setSkill(s));
    }, [props.skillId]);
    if (skill !== null) {
        return <SkillPopover region={props.region} skill={skill} />;
    } else {
        return null;
    }
};
