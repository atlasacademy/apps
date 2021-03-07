import CondMissionDetailDescriptor from "./CondMissionDetailDescriptor";
import EventDescriptor from "./EventDescriptor";
import { QuestDescriptorId } from "./QuestDescriptor";
import ServantDescriptorId from "./ServantDescriptorId";
import {
    CondType,
    Mission,
    Quest,
    Region,
    Servant,
    Item,
    EnumList,
} from "@atlasacademy/api-connector";
import {
    missionRange,
    MultipleQuests,
    MultipleServants,
} from "./MultipleDescriptors";

export default function CondTargetNumDescriptor(props: {
    region: Region;
    cond: CondType;
    targets: number[];
    num: number;
    detail?: Mission.MissionConditionDetail;
    servants?: Map<number, Servant.ServantBasic>;
    quests?: Map<number, Quest.Quest>;
    missions?: Map<number, Mission.Mission>;
    items?: Map<number, Item.Item>;
    enums?: EnumList;
    handleNavigateMissionId?: (id: number) => void;
}) {
    const region = props.region,
        targets = props.targets,
        num = props.num;
    switch (props.cond) {
        case CondType.NONE:
            return null;
        case CondType.QUEST_CLEAR:
            return (
                <>
                    {num === targets.length
                        ? `Clear ${num === 1 ? "" : "all of "}`
                        : `Clear ${num} ${
                              num !== 1
                                  ? "different quests from "
                                  : "quest from "
                          }`}
                    <MultipleQuests
                        region={region}
                        questIds={targets}
                        quests={props.quests}
                    />
                </>
            );
        case CondType.QUEST_CLEAR_PHASE:
            return (
                <>
                    Has cleared arrow {num} of{" "}
                    <QuestDescriptorId
                        text=""
                        region={region}
                        questId={targets[0]}
                        questPhase={num}
                        quests={props.quests}
                        showType={false}
                    />
                </>
            );
        case CondType.QUEST_CLEAR_NUM:
            return (
                <>
                    {num} runs of{" "}
                    <MultipleQuests
                        region={region}
                        questIds={targets}
                        quests={props.quests}
                    />
                </>
            );
        case CondType.SVT_LIMIT:
            return (
                <>
                    <MultipleServants
                        region={region}
                        servantIds={targets}
                        servants={props.servants}
                    />{" "}
                    at ascension {num}
                </>
            );
        case CondType.SVT_FRIENDSHIP:
            return (
                <>
                    <MultipleServants
                        region={region}
                        servantIds={targets}
                        servants={props.servants}
                    />{" "}
                    at bond level {num}
                </>
            );
        case CondType.SVT_GET:
            return (
                <>
                    <ServantDescriptorId
                        region={region}
                        id={targets[0]}
                        servants={props.servants}
                    />{" "}
                    in Spirit Origin Collection
                </>
            );
        case CondType.EVENT_END:
            return (
                <>
                    Event{" "}
                    <EventDescriptor region={region} eventId={targets[0]} /> has
                    ended
                </>
            );
        case CondType.SVT_HAVING:
            return (
                <>
                    Presense of{" "}
                    <ServantDescriptorId
                        region={region}
                        id={targets[0]}
                        servants={props.servants}
                    />
                </>
            );
        case CondType.SVT_RECOVERD:
            return <>Servant recovered</>;
        case CondType.LIMIT_COUNT_ABOVE:
            return (
                <>
                    <ServantDescriptorId
                        region={region}
                        id={targets[0]}
                        servants={props.servants}
                    />{" "}
                    at ascension &ge; {num}
                </>
            );
        case CondType.LIMIT_COUNT_BELOW:
            return (
                <>
                    <ServantDescriptorId
                        region={region}
                        id={targets[0]}
                        servants={props.servants}
                    />{" "}
                    at ascension &le; {num}
                </>
            );
        case CondType.EVENT_MISSION_ACHIEVE:
            const mission = (props.missions ?? new Map([])).get(targets[0]);
            const missionDispNo = mission ? mission.dispNo : targets[0];
            const missionName = mission ? mission.name : "";
            return (
                <>
                    Achieved mission{" "}
                    {/* A dummy href is needed because bootstrap disables a styles without href */}
                    {/* https://github.com/twbs/bootstrap/blob/6d93a1371/scss/_reboot.scss#L262 */}
                    <a
                        href="javascript:;"
                        onClick={(_) =>
                            props.handleNavigateMissionId?.(targets[0])
                        }
                    >
                        {missionDispNo}: {missionName}
                    </a>
                </>
            );
        case CondType.EVENT_TOTAL_POINT:
            return <>Reached {num} event points</>;
        case CondType.EVENT_MISSION_CLEAR:
            const missionDispNos = targets.map((target) => {
                const mission = (props.missions ?? new Map([])).get(target);
                return mission ? mission.dispNo : target;
            });
            return (
                <>
                    {num === targets.length
                        ? `Clear ${num === 1 ? "mission " : "missions "}`
                        : `Clear ${num} different missions from `}
                    {missionRange(missionDispNos)}
                </>
            );
        case CondType.MISSION_CONDITION_DETAIL:
            if (props.detail !== undefined) {
                return (
                    <CondMissionDetailDescriptor
                        region={region}
                        detail={props.detail}
                        num={num}
                        servants={props.servants}
                        quests={props.quests}
                        items={props.items}
                        enums={props.enums}
                    />
                );
            } else {
                return (
                    <>
                        Unknown condition details {targets[0]} num {num}
                    </>
                );
            }
        case CondType.DATE:
            if (props.num !== undefined) {
                const date = new Date(props.num * 1000);
                return <>After {date.toLocaleString()}</>;
            } else {
                return <>After unknown date</>;
            }
        default:
            return (
                <>
                    {props.cond} target {targets.join(", ")} num {num}
                </>
            );
    }
}
