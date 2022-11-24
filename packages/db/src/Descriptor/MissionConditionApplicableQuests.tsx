import { faShare } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Link } from "react-router-dom";

import { CondType, Quest, Region, Mission } from "@atlasacademy/api-connector";

import { CollapsibleLight } from "../Component/CollapsibleContent";
import { getURLSearchParams } from "../Helper/StringHelper";
import QuestSearchDescriptor from "./QuestSearchDescriptor";

const MissionConditionApplicableQuests = ({
    region,
    cond,
    details,
    goToQuestSearchOnly,
    warIds,
}: {
    region: Region;
    cond: CondType;
    details?: Mission.MissionConditionDetail[];
    goToQuestSearchOnly?: boolean;
    warIds?: number[];
}) => {
    if (cond === CondType.MISSION_CONDITION_DETAIL && details) {
        const enemyTraits: number[][] = [];
        for (const detail of details) {
            switch (detail.missionCondType) {
                case Mission.DetailCondType.DEFEAT_ENEMY_INDIVIDUALITY:
                case Mission.DetailCondType.ENEMY_INDIVIDUALITY_KILL_NUM:
                    enemyTraits.push(detail.targetIds);
                    break;
                default:
                    break;
            }
        }

        if (enemyTraits) {
            if (goToQuestSearchOnly) {
                return (
                    <>
                        {enemyTraits.map((enemyTrait) => (
                            <React.Fragment key={enemyTrait.toString()}>
                                <Link
                                    to={`/${region}/quests?${getURLSearchParams({
                                        type: Quest.QuestType.FREE,
                                        enemyTrait,
                                    }).toString()}`}
                                >
                                    Search applicable quests <FontAwesomeIcon icon={faShare} />
                                </Link>
                                <br />
                            </React.Fragment>
                        ))}
                    </>
                );
            } else {
                return (
                    <CollapsibleLight
                        title="Applicable Quests"
                        content={
                            <>
                                {enemyTraits.map((enemyTrait) => (
                                    <QuestSearchDescriptor
                                        key={enemyTrait.toString()}
                                        region={region}
                                        warId={warIds}
                                        enemyTrait={enemyTrait}
                                        hideSearchLink={true}
                                        returnList={true}
                                    />
                                ))}
                            </>
                        }
                        eventKey={`${region}-${warIds}-enemyTraits:${enemyTraits.toString()}`}
                        defaultActiveKey={""}
                    />
                );
            }
        }
    }

    return <></>;
};

export default MissionConditionApplicableQuests;
