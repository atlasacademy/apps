import { Button } from "react-bootstrap";

import { CondType, EnumList, Item, Mission, Quest, Region, Servant } from "@atlasacademy/api-connector";

import { mergeElements } from "../Helper/OutputHelper";
import { lang } from "../Setting/Manager";
import useApi from "../Hooks/useApi";
import CondMissionDetailDescriptor from "./CondMissionDetailDescriptor";
import EventDescriptor from "./EventDescriptor";
import {
    MultipleClassLevels,
    MultipleClassLimits,
    MultipleEquipRarityLevel,
    MultipleQuests,
    MultipleServants,
    missionRange,
} from "./MultipleDescriptors";
import { QuestDescriptorId } from "./QuestDescriptor";
import ServantDescriptorId from "./ServantDescriptorId";

interface CommonReleaseDescriptorProps {
    region: Region;
    commonReleaseId: number;
    num: number;
    details?: Mission.MissionConditionDetail[];
    servants?: Map<number, Servant.ServantBasic>;
    quests?: Map<number, Quest.QuestBasic>;
    missions?: Map<number, Mission.Mission>;
    items?: Map<number, Item.Item>;
    enums?: EnumList;
    nice?: boolean;
    handleNavigateMissionId?: (id: number) => void;
}

const CommonReleaseDescriptor: React.FC<CommonReleaseDescriptorProps> = (props) => {
    const {
        region,
        commonReleaseId,
        num,
        details,
        servants,
        quests,
        missions,
        items,
        enums,
        nice,
        handleNavigateMissionId,
    } = props;
    
    const { loading, data } = useApi("commonRelease", commonReleaseId);
    
    if (loading) {
        return <>Checking unlock requirement…</>;
    }

    if (!data) {
        if (num > 0) {
            return <>Requires common release ID {commonReleaseId} value ≥ {num}</>;
        }

        return <>Requires common release ID {commonReleaseId}</>;
    }

    const rendered = mergeElements(
        data.map((entry, idx) => {
            if (entry.condType === CondType.COMMON_RELEASE) {
                return <span key={`cr-${entry.condId}-${idx}`}>Common release chain {entry.condId}</span>;
            }
            
            
            return (
                <CondTargetNumDescriptor
                    key={`${entry.condType}-${entry.condId}-${idx}`}
                    region={region}
                    cond={entry.condType}
                    targets={[entry.condId]}
                    num={entry.condNum}
                    nice={nice}
                    details={details}
                    servants={servants}
                    quests={quests}
                    missions={missions}
                    items={items}
                    enums={enums}
                    handleNavigateMissionId={handleNavigateMissionId}
                />
            );
        }),
        " and "
    );

    if (num > 1) {
        return <>Complete {num} of: {rendered}</>;
    }

    return <>{rendered}</>;
};

export default function CondTargetNumDescriptor(props: {
    region: Region;
    cond: CondType;
    targets: number[];
    num: number;
    details?: Mission.MissionConditionDetail[];
    servants?: Map<number, Servant.ServantBasic>;
    quests?: Map<number, Quest.QuestBasic>;
    missions?: Map<number, Mission.Mission>;
    items?: Map<number, Item.Item>;
    enums?: EnumList;
    nice?: boolean;
    handleNavigateMissionId?: (id: number) => void;
}) {
    const region = props.region
    const targets = props.targets
    const num = props.num
    const nice = props.nice

    switch (props.cond) {
        case CondType.NONE:
            return null;
        case CondType.QUEST_CLEAR: {
            const label = <MultipleQuests region={region} questIds={targets} nice={nice} quests={props.quests} />;
            
            if (num === 0) {
                return <>Clear the following quest(s): {label}</>;
            }

            return (
                <>
                    {num === targets.length
                        ? `Clear ${num === 1 ? "" : "all of "}`
                        : `Clear ${num} ${num !== 1 ? "different quests from " : "quest from "}`}
                    {label}
                </>
            );
        }
        case CondType.QUEST_CLEAR_PHASE:
            return (
                <>
                    Has cleared arrow {num} of{" "}
                    <QuestDescriptorId
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
                    {num} runs of <MultipleQuests region={region} questIds={targets} quests={props.quests} />
                </>
            );
        case CondType.SVT_LIMIT:
            return (
                <>
                    <MultipleServants region={region} servantIds={targets} servants={props.servants} /> at ascension{" "}
                    {num}
                </>
            );
        case CondType.SVT_FRIENDSHIP:
            return (
                <>
                    <MultipleServants region={region} servantIds={targets} servants={props.servants} /> at bond level{" "}
                    {num}
                </>
            );
        case CondType.SVT_GET:
            return (
                <>
                    <ServantDescriptorId region={region} id={targets[0]} servants={props.servants} /> in Spirit Origin
                    Collection
                </>
            );
        case CondType.EVENT_END:
            return (
                <>
                    Event <EventDescriptor region={region} eventId={targets[0]} /> has ended
                </>
            );
        case CondType.SVT_HAVING:
            return (
                <>
                    Presence of <ServantDescriptorId region={region} id={targets[0]} servants={props.servants} />
                </>
            );
        case CondType.SVT_RECOVERD:
            return <>Servant recovered</>;
        case CondType.LIMIT_COUNT_ABOVE:
            return (
                <>
                    <ServantDescriptorId region={region} id={targets[0]} servants={props.servants} /> at ascension &ge;{" "}
                    {num}
                </>
            );
        case CondType.LIMIT_COUNT_BELOW:
            return (
                <>
                    <ServantDescriptorId region={region} id={targets[0]} servants={props.servants} /> at ascension &le;{" "}
                    {num}
                </>
            );
        case CondType.SVT_LEVEL_CLASS_NUM:
            return (
                <>
                    Raise {num}{" "}
                    <MultipleClassLevels targetIds={targets} classes={props.enums?.SvtClass} plural={num > 1} />
                </>
            );
        case CondType.SVT_LIMIT_CLASS_NUM:
            return (
                <>
                    Raise {num}{" "}
                    <MultipleClassLimits targetIds={targets} classes={props.enums?.SvtClass} plural={num > 1} />
                </>
            );
        case CondType.SVT_EQUIP_RARITY_LEVEL_NUM:
            return (
                <>
                    Raise {num} <MultipleEquipRarityLevel targetIds={targets} plural={num > 1} />
                </>
            );
        case CondType.EVENT_MISSION_ACHIEVE:
            if (targets.length === 1) {
                const mission = (props.missions ?? new Map([])).get(targets[0]);
                const missionDispNo = mission ? mission.dispNo : targets[0];
                const missionName = mission ? mission.name : "";
                return (
                    <>
                        Claim mission{" "}
                        <Button
                            variant="link"
                            className="reset-button-style"
                            onClick={() => props.handleNavigateMissionId?.(targets[0])}
                        >
                            {missionDispNo}: <span lang={lang(region)}>{missionName}</span>
                        </Button>
                    </>
                );
            } else {
                const missionDispNos = targets.map((target) => {
                    const mission = (props.missions ?? new Map([])).get(target);
                    return mission ? mission.dispNo : target;
                });
                return <>Claim missions {missionRange(missionDispNos)}</>;
            }
        case CondType.EVENT_TOTAL_POINT:
            return <>Reached {num.toLocaleString()} event points</>;
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
        case CondType.MASTER_MISSION: {
            const mission = (props.missions ?? new Map([])).get(targets[0]);
            const missionLabel = mission ? `${mission.dispNo}: ${mission.name}` : `#${targets[0]}`;
            if (num > 1) {
                return <>Complete {num} master missions including {missionLabel}</>;
            }
            return <>Complete master mission {missionLabel}</>;
        }
        case CondType.COMMON_RELEASE: {
            return (
                <CommonReleaseDescriptor
                    region={region}
                    commonReleaseId={targets[0]}
                    num={num}
                    nice={nice}
                    servants={props.servants}
                    quests={props.quests}
                    missions={props.missions}
                    items={props.items}
                    enums={props.enums}
                    handleNavigateMissionId={props.handleNavigateMissionId}
                    details={props.details}
                />
            );
        }
        case CondType.MISSION_CONDITION_DETAIL:
            if (props.details) {
                return (
                    <>
                        {mergeElements(
                            props.details.map((detail) => (
                                <CondMissionDetailDescriptor
                                    region={region}
                                    detail={detail}
                                    num={num}
                                    servants={props.servants}
                                    quests={props.quests}
                                    items={props.items}
                                    enums={props.enums}
                                />
                            )),
                            " or "
                        )}
                    </>
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
        case CondType.START_RANDOM_MISSION:
            return <>Random Mission Started</>;
        default:
            return (
                <>
                    {props.cond} target {targets.join(", ")} num {num}
                </>
            );
    }
}
