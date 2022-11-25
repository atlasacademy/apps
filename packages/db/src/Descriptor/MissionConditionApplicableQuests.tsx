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
        const enemyTraits: number[][] = [],
            questTraits: number[][] = [];
        for (const detail of details) {
            switch (detail.missionCondType) {
                case Mission.DetailCondType.DEFEAT_ENEMY_INDIVIDUALITY:
                case Mission.DetailCondType.ENEMY_INDIVIDUALITY_KILL_NUM:
                    if (detail.targetIds.length > 0) {
                        enemyTraits.push(detail.targetIds);
                    }
                    break;
                case Mission.DetailCondType.TARGET_QUEST_ITEM_GET_TOTAL:
                    if (detail.targetQuestIndividualities.length > 0) {
                        questTraits.push(detail.targetQuestIndividualities.map((trait) => trait.id));
                    }
                    break;
                default:
                    break;
            }
        }

        if (enemyTraits.length > 0 || questTraits.length > 0) {
            if (goToQuestSearchOnly) {
                return (
                    <>
                        {enemyTraits.length > 0
                            ? enemyTraits.map((enemyTrait) => (
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
                              ))
                            : null}
                        {questTraits.length > 0
                            ? questTraits.map((questTrait) => (
                                  <React.Fragment key={questTrait.toString()}>
                                      <Link
                                          to={`/${region}/quests?${getURLSearchParams({
                                              type: Quest.QuestType.FREE,
                                              fieldIndividuality: questTrait,
                                          }).toString()}`}
                                      >
                                          Search applicable quests <FontAwesomeIcon icon={faShare} />
                                      </Link>
                                      <br />
                                  </React.Fragment>
                              ))
                            : null}
                    </>
                );
            } else {
                return (
                    <CollapsibleLight
                        title="Applicable Quests"
                        content={
                            <>
                                {enemyTraits.length > 0
                                    ? enemyTraits.map((enemyTrait) => (
                                          <QuestSearchDescriptor
                                              key={enemyTrait.toString()}
                                              region={region}
                                              warId={warIds}
                                              enemyTrait={enemyTrait}
                                              hideSearchLink={true}
                                              returnList={true}
                                          />
                                      ))
                                    : null}
                                {questTraits.length > 0
                                    ? questTraits.map((questTrait) => (
                                          <QuestSearchDescriptor
                                              key={questTrait.toString()}
                                              region={region}
                                              warId={warIds}
                                              fieldIndividuality={questTrait}
                                              hideSearchLink={true}
                                              returnList={true}
                                          />
                                      ))
                                    : null}
                            </>
                        }
                        eventKey={`${region}-${warIds}-enemyTraits:${enemyTraits.toString()}`}
                        defaultActiveKey={""}
                        mountOnEnter
                    />
                );
            }
        }
    }

    return <></>;
};

export default MissionConditionApplicableQuests;
