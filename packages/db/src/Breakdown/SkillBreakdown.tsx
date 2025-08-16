import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Alert, OverlayTrigger, Tooltip } from "react-bootstrap";

import { Region, Skill } from "@atlasacademy/api-connector";

import MLBIcon from "../Assets/icon_limit_on.png";
import SkillGroupOverWrite from "../Component/SkillGroupOverWrite";
import EventDescriptor from "../Descriptor/EventDescriptor";
import { MergeElementsOr } from "../Descriptor/MultipleDescriptors";
import QuestDescriptor from "../Descriptor/QuestDescriptor";
import SkillDescriptor from "../Descriptor/SkillDescriptor";
import { Renderable } from "../Helper/OutputHelper";
import { Ruby } from "../Helper/StringHelper";
import { lang } from "../Setting/Manager";
import EffectBreakdown from "./EffectBreakdown";

interface IProps {
    region: Region;
    skill: Skill.Skill;
    cooldowns: boolean;
    extraPassiveCond?: boolean;
    levels?: number;
    rankUp?: number;
    mlbSkill?: boolean;
}

class SkillBreakdown extends React.Component<IProps> {
    render() {
        const skill = this.props.skill;
        const skillAdd =
            this.props.skill.skillAdd.length > 0 ? (
                <Tooltip id="skillAdd-tooltip" style={{ fontSize: "1em" }} lang={lang(this.props.region)}>
                    <Ruby
                        region={this.props.region}
                        text={skill.skillAdd[0].name}
                        ruby={skill.skillAdd[0].ruby}
                        splitRank={true}
                    />
                </Tooltip>
            ) : null;

        return (
            <div>
                <h3>
                    <SkillDescriptor region={this.props.region} skill={skill} iconHeight={33} />
                    {skillAdd !== null ? (
                        <>
                            {" "}
                            <OverlayTrigger overlay={skillAdd}>
                                <FontAwesomeIcon icon={faInfoCircle} style={{ fontSize: "0.75em" }} />
                            </OverlayTrigger>
                        </>
                    ) : null}
                    {this.props.mlbSkill && (
                        <img alt="Max Limit Break Skill" className="ml-1" title="Max Limit Break Skill" src={MLBIcon} />
                    )}
                </h3>

                {this.props.rankUp !== undefined ? (
                    <Alert variant={"primary"}>Rank Up +{this.props.rankUp}</Alert>
                ) : null}

                {skill.condQuestId && skill.condQuestPhase ? (
                    <Alert variant={"primary"}>
                        Available after{" "}
                        <QuestDescriptor
                            region={this.props.region}
                            questId={skill.condQuestId}
                            questPhase={
                                ["91", "94"].includes(skill.condQuestId.toString().slice(0, 2))
                                    ? 1
                                    : skill.condQuestPhase
                            }
                        />
                    </Alert>
                ) : null}

                <p className="text-prewrap" lang={lang(this.props.region)}>
                    {skill.detail}
                </p>

                {this.props.extraPassiveCond && skill.extraPassive.length > 0 ? (
                    <>
                        <ExtraPassiveCondition region={this.props.region} extraPassive={skill.extraPassive[0]} />
                    </>
                ) : null}

                <EffectBreakdown
                    region={this.props.region}
                    cooldowns={this.props.cooldowns ? skill.coolDown : undefined}
                    funcs={skill.functions}
                    triggerSkillIdStack={[skill.id]}
                    levels={this.props.levels}
                    scripts={skill.script}
                    additionalSkillId={skill.script.additionalSkillId}
                    condBranchSkillInfo={skill.script.condBranchSkillInfo}
                />
                {skill.groupOverwrites && (
                    <SkillGroupOverWrite region={this.props.region} overwrites={skill.groupOverwrites} />
                )}
            </div>
        );
    }
}

export default SkillBreakdown;

const ExtraPassiveCondition = ({ region, extraPassive }: { region: Region; extraPassive: Skill.ExtraPassive }) => {
    const condElements = [] as Renderable[];

    if (extraPassive.condQuestId !== 0) {
        condElements.push(
            <>
                {extraPassive.flag === 2 ? "After" : "Before"}{" "}
                <QuestDescriptor
                    region={region}
                    questId={extraPassive.condQuestId}
                    questPhase={extraPassive.condQuestPhase !== 0 ? extraPassive.condQuestPhase : undefined}
                />
            </>
        );
    }

    if (extraPassive.condLv !== 0) {
        condElements.push(`Lv. ${extraPassive.condLv}`);
    }

    if (extraPassive.condLimitCount !== 0) {
        condElements.push(`Limit Break ${extraPassive.condLimitCount}`);
    }

    if (extraPassive.condFriendshipRank !== 0) {
        condElements.push(`Bond Lv. ${extraPassive.condFriendshipRank}`);
    }

    if (extraPassive.eventId !== 0) {
        condElements.push(
            <>
                Event <EventDescriptor region={region} eventId={extraPassive.eventId} />
            </>
        );
    }

    if (condElements.length === 0) return null;

    return (
        <>
            Condition{condElements.length > 1 ? "s" : ""}:{" "}
            <MergeElementsOr elements={condElements} lastJoinWord="and" />
            <br />
            <br />
        </>
    );
};
