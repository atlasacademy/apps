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
        console.log(quest);
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
                type = "Interlude/Rank Up";
                break;
            case 94:
                type = "Event";
                break;
            case 1:
                type = "Part I";
                break;
            case 2:
                type = "EOR";
                break;
            case 3:
                type = "LB";
                break;
        }

        switch (quest?.warId) {
            case 1003:
                type = "Rank Up";
                break;
            case 102:
                type = "Interlude";
                break;
        }

        return (
            <Link
                to={`/${props.region}/quest/${props.questId}/${props.questPhase}`}
            >
                {type != "" ? `${type} ` : ""}Quest {quest?.name} <FontAwesomeIcon icon={faShare} />
            </Link>
        );
    }
}
