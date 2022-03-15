import { faShare } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";

import { Mission, Quest, Region, Servant, Item, EnumList, CondType } from "@atlasacademy/api-connector";

import { CollapsibleLight } from "../Component/CollapsibleContent";
import { getURLSearchParams } from "../Helper/StringHelper";
import CondTargetNumDescriptor from "./CondTargetNumDescriptor";
import QuestSearchDescriptor from "./QuestSearchDescriptor";

import "../Helper/StringHelper.css";

export default function MissionConditionDescriptor(props: {
    region: Region;
    cond: Mission.MissionCondition;
    warIds?: number[];
    goToQuestSearchOnly?: boolean;
    servants?: Map<number, Servant.ServantBasic>;
    quests?: Map<number, Quest.QuestBasic>;
    missions?: Map<number, Mission.Mission>;
    items?: Map<number, Item.Item>;
    enums?: EnumList;
    handleNavigateMissionId?: (id: number) => void;
}) {
    const cond = props.cond;
    let progressType = cond.missionProgressType.toString();
    switch (cond.missionProgressType) {
        case Mission.ProgressType.OPEN_CONDITION:
            progressType = "Unlock condition";
            break;
        case Mission.ProgressType.START:
            progressType = "Show condition";
            break;
        case Mission.ProgressType.CLEAR:
            progressType = "Clear condition";
    }
    return (
        <>
            <i>{progressType}:</i>
            <ul style={{ margin: 0 }}>
                <li className="newline">{props.cond.conditionMessage}</li>
                <li>
                    <CondTargetNumDescriptor
                        region={props.region}
                        cond={cond.condType}
                        targets={cond.targetIds}
                        num={cond.targetNum}
                        detail={cond.detail}
                        servants={props.servants}
                        quests={props.quests}
                        missions={props.missions}
                        items={props.items}
                        enums={props.enums}
                        handleNavigateMissionId={props.handleNavigateMissionId}
                    />
                </li>
                {cond.condType === CondType.MISSION_CONDITION_DETAIL &&
                cond.detail !== undefined &&
                [
                    Mission.DetailCondType.DEFEAT_ENEMY_INDIVIDUALITY,
                    Mission.DetailCondType.ENEMY_INDIVIDUALITY_KILL_NUM,
                ].includes(cond.detail?.missionCondType) ? (
                    props.goToQuestSearchOnly ? (
                        <Link
                            to={`/${props.region}/quests?${getURLSearchParams({
                                type: Quest.QuestType.FREE,
                                enemyTrait: cond.detail.targetIds,
                            }).toString()}`}
                        >
                            Search applicable quests <FontAwesomeIcon icon={faShare} />
                        </Link>
                    ) : (
                        <CollapsibleLight
                            title="Applicable Quests"
                            content={
                                <QuestSearchDescriptor
                                    region={props.region}
                                    warId={props.warIds}
                                    enemyTrait={cond.detail.targetIds}
                                    hideSearchLink={true}
                                    returnList={true}
                                />
                            }
                            eventKey={`${props.region}-${props.warIds}-enemyTraits:${cond.detail.targetIds}`}
                            defaultActiveKey={""}
                        />
                    )
                ) : null}
            </ul>
        </>
    );
}
