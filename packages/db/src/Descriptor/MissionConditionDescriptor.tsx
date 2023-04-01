import { EnumList, Item, Mission, Quest, Region, Servant } from "@atlasacademy/api-connector";

import { lang } from "../Setting/Manager";
import CondTargetNumDescriptor from "./CondTargetNumDescriptor";
import MissionConditionApplicableQuests from "./MissionConditionApplicableQuests";

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
            <ul className="m-0">
                <li className="text-prewrap" lang={lang(props.region)}>
                    {props.cond.conditionMessage}
                </li>
                <li>
                    <CondTargetNumDescriptor
                        region={props.region}
                        cond={cond.condType}
                        targets={cond.targetIds}
                        num={cond.targetNum}
                        details={cond.details}
                        servants={props.servants}
                        quests={props.quests}
                        missions={props.missions}
                        items={props.items}
                        enums={props.enums}
                        handleNavigateMissionId={props.handleNavigateMissionId}
                    />
                </li>
                <MissionConditionApplicableQuests
                    region={props.region}
                    cond={cond.condType}
                    details={cond.details}
                    goToQuestSearchOnly={props.goToQuestSearchOnly}
                    warIds={props.warIds}
                />
            </ul>
        </>
    );
}
