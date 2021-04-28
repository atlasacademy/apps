import { Quest, Region } from "@atlasacademy/api-connector";
import { faShare } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Api from "../Api";

export function QuestDescriptionNoApi(props: {
    text: string;
    region: Region;
    quest: Quest.Quest;
    questPhase: number;
    questStage?: number;
    showType?: boolean;
}) {
    const quest = props.quest;
    if (props.text !== "") {
        return (
            <Link to={`/${props.region}/quest/${quest.id}/${props.questPhase}`}>
                {props.text} <FontAwesomeIcon icon={faShare} />
            </Link>
        );
    } else {
        const prefix = Math.floor(quest.id / 1000000);
        let type = "";

        switch (prefix) {
            case 91:
                type = "Interlude/Rank Up Quest";
                break;
            case 94:
                type = "Event Quest";
                break;
        }

        if (quest?.warId >= 100 && quest?.warId < 200) {
            type = "Part I Quest";
        } else if (quest?.warId >= 200 && quest?.warId < 300) {
            type = "EOR Quest";
        } else if (quest?.warId >= 300 && quest?.warId < 400) {
            type = "LB Quest";
        }

        if (
            quest?.type === Quest.QuestType.FRIENDSHIP ||
            quest?.warId === 1003
        ) {
            type = "Interlude Quest";
        }

        if (quest?.warId === 1001) {
            if (quest.name.startsWith("Rank Up")) {
                type = "";
            } else {
                type = "Rank Up Quest";
            }
        }

        const showType = props.showType ?? true;
        const stageUri = props.questStage ? `/stage-${props.questStage}` : "";
        return (
            <Link
                to={`/${props.region}/quest/${quest.id}/${props.questPhase}${stageUri}`}
            >
                {showType && type !== "" ? `${type} ` : ""}
                {quest?.name} <FontAwesomeIcon icon={faShare} />
            </Link>
        );
    }
}

interface IProps {
    text: string;
    region: Region;
    questId: number;
    questPhase: number;
    questStage?: number;
    showType?: boolean;
}

export default function QuestDescriptor(props: IProps) {
    const [quest, setQuest] = useState<Quest.Quest>(null as any);
    useEffect(() => {
        Api.questPhase(props.questId, props.questPhase)
            .then((s) => setQuest(s as Quest.Quest))
            .catch(() => {});
    }, [props.questId, props.questPhase]);
    if (quest !== null) {
        return (
            <QuestDescriptionNoApi
                text={props.text}
                region={props.region}
                quest={quest}
                questPhase={props.questPhase}
                questStage={props.questStage}
                showType={props.showType}
            />
        );
    } else {
        return (
            <>
                {props.text !== ""
                    ? props.text
                    : `Unknown Quest ${props.questId} `}
            </>
        );
    }
}

export function QuestDescriptorId(props: {
    text: string;
    region: Region;
    questId: number;
    questPhase: number;
    questStage?: number;
    showType?: boolean;
    quests?: Map<number, Quest.Quest>;
}) {
    if (props.quests !== undefined) {
        return (
            <QuestDescriptorMap
                text={props.text}
                region={props.region}
                questId={props.questId}
                questPhase={props.questPhase}
                questStage={props.questStage}
                quests={props.quests}
                showType={props.showType}
            />
        );
    } else {
        return (
            <QuestDescriptor
                text={props.text}
                region={props.region}
                questId={props.questId}
                questPhase={props.questPhase}
                questStage={props.questStage}
                showType={props.showType}
            />
        );
    }
}

export function QuestDescriptorMap(props: {
    text: string;
    region: Region;
    questId: number;
    questPhase: number;
    questStage?: number;
    quests: Map<number, Quest.Quest>;
    showType?: boolean;
}) {
    const quest = props.quests.get(props.questId);
    if (quest !== undefined && quest !== null) {
        return (
            <QuestDescriptionNoApi
                text={props.text}
                region={props.region}
                quest={quest}
                questPhase={props.questPhase}
                questStage={props.questStage}
                showType={props.showType}
            />
        );
    } else {
        return (
            <Link
                to={`/${props.region}/quest/${props.questId}/${props.questPhase}`}
            >
                Quest {props.questId} <FontAwesomeIcon icon={faShare} />
            </Link>
        );
    }
}
