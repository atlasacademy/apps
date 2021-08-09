import { Quest, Region, ClassName } from "@atlasacademy/api-connector";
import { faShare } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Api from "../Api";
import { getURLSearchParams } from "../Helper/StringHelper";
import { QuestDescriptionNoApi } from "./QuestDescriptor";

interface IProps {
    region: Region;
    maxShowResults?: number;
    hideSearchLink?: boolean;
    name?: string;
    spotName?: string;
    warId?: number;
    type?: Quest.QuestType[];
    fieldIndividuality?: number[];
    battleBgId?: number;
    bgmId?: number;
    fieldAiId?: number;
    enemySvtId?: number;
    enemySvtAiId?: number;
    enemyTrait?: number[];
    enemyClassName?: ClassName[];
}

export default function QuestSearchDescriptor(props: IProps) {
    const [quests, setQuests] = useState<Quest.QuestPhaseBasic[]>([]);
    useEffect(() => {
        Api.searchQuestPhase(
            props.name,
            props.spotName,
            props.warId,
            props.type,
            props.fieldIndividuality,
            props.battleBgId,
            props.bgmId,
            props.fieldAiId,
            props.enemySvtId,
            props.enemySvtAiId,
            props.enemyTrait,
            props.enemyClassName
        )
            .then((s) => setQuests(s))
            .catch(() => {});
    }, [
        props.name,
        props.spotName,
        props.warId,
        props.type,
        props.fieldIndividuality,
        props.battleBgId,
        props.bgmId,
        props.fieldAiId,
        props.enemySvtId,
        props.enemySvtAiId,
        props.enemyTrait,
        props.enemyClassName,
    ]);
    if (quests.length === 0) {
        return null;
    }

    const maxShowResults = props.hideSearchLink
            ? quests.length
            : props.maxShowResults ?? 10,
        remainingCount = quests.length - maxShowResults,
        queryString = getURLSearchParams({
            name: props.name,
            spotName: props.spotName,
            warId: props.warId,
            type: props.type,
            fieldIndividuality: props.fieldIndividuality,
            battleBgId: props.battleBgId,
            bgmId: props.bgmId,
            fieldAiId: props.fieldAiId,
            enemySvtId: props.enemySvtId,
            enemySvtAiId: props.enemySvtAiId,
            enemyTrait: props.enemyTrait,
            enemyClassName: props.enemyClassName,
        }).toString();

    return (
        <>
            {quests.slice(0, maxShowResults).map((quest) => (
                <div key={`${quest.id}-${quest.phase}`}>
                    <QuestDescriptionNoApi
                        text=""
                        region={props.region}
                        quest={quest}
                        questPhase={quest.phase}
                    />
                    <br />
                </div>
            ))}
            {remainingCount > 0 ? `and ${remainingCount} other quests. ` : ""}
            {props.hideSearchLink ? null : (
                <Link to={`/${props.region}/quests?${queryString}`}>
                    Go to the quest search page{" "}
                    <FontAwesomeIcon icon={faShare} />
                </Link>
            )}
        </>
    );
}
