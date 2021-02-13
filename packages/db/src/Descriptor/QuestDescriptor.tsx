import { Region, Quest } from "@atlasacademy/api-connector";
import { faShare } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Api from "../Api";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

interface IProps {
    text: string;
    region: Region;
    questId: number;
    questPhase: number;
}

export default function QuestDescriptor(props: IProps) {
    const [quest, setQuest] = useState<Quest.QuestPhase>(null as any);
    useEffect(() => {
        Api.questPhase(props.questId, props.questPhase).then((s) =>
            setQuest(s)
        );
    }, [props.questId, props.questPhase]);
    if (props.text) {
        return (
            <Link
                to={`/${props.region}/quest/${props.questId}/${props.questPhase}`}
            >
                {props.text} <FontAwesomeIcon icon={faShare} />
            </Link>
        );
    } else {
        const prefix = Math.floor(props.questId / 1000000);
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

        return (
            <Link
                to={`/${props.region}/quest/${props.questId}/${props.questPhase}`}
            >
                {type != "" ? `${type} ` : ""}
                {quest?.name} <FontAwesomeIcon icon={faShare} />
            </Link>
        );
    }
}
