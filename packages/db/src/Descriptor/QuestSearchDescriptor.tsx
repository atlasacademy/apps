import { faShare } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRef } from "react";
import { Link } from "react-router-dom";

import { ClassName, Quest, Region } from "@atlasacademy/api-connector";

import { getURLSearchParams } from "../Helper/StringHelper";
import useApi from "../Hooks/useApi";
import { QuestDescriptionNoApi } from "./QuestDescriptor";

interface IProps {
    region: Region;
    maxNumQuestsShown?: number;
    hideSearchLink?: boolean;
    returnList?: boolean;
    name?: string;
    flag?: Quest.QuestFlag[];
    spotName?: string;
    warId?: number[];
    type?: Quest.QuestType[];
    fieldIndividuality?: number[];
    battleBgId?: number;
    bgmId?: number;
    fieldAiId?: number;
    enemySvtId?: number;
    enemySvtAiId?: number;
    enemyTrait?: number[];
    enemyClassName?: ClassName[];
    enemySkillId?: number[];
    enemyNoblePhantasmId?: number[];
}

export default function QuestSearchDescriptor(props: IProps) {
    const searchData = useRef({
        name: props.name,
        spotName: props.spotName,
        warId: props.warId,
        type: props.type,
        flag: props.flag,
        fieldIndividuality: props.fieldIndividuality,
        battleBgId: props.battleBgId,
        bgmId: props.bgmId,
        fieldAiId: props.fieldAiId,
        enemySvtId: props.enemySvtId,
        enemySvtAiId: props.enemySvtAiId,
        enemyTrait: props.enemyTrait,
        enemyClassName: props.enemyClassName,
        enemySkillId: props.enemySkillId,
        enemyNoblePhantasmId: props.enemyNoblePhantasmId,
    });
    const { data: quests } = useApi("searchQuestPhase", searchData.current);
    if (quests === undefined || quests.length === 0) {
        return null;
    }

    const maxShowResults = props.hideSearchLink ? quests.length : props.maxNumQuestsShown ?? 10,
        remainingCount = quests.length - maxShowResults,
        queryString = getURLSearchParams({
            name: props.name,
            spotName: props.spotName,
            warId: props.warId,
            type: props.type,
            flag: props.flag,
            fieldIndividuality: props.fieldIndividuality,
            battleBgId: props.battleBgId,
            bgmId: props.bgmId,
            fieldAiId: props.fieldAiId,
            enemySvtId: props.enemySvtId,
            enemySvtAiId: props.enemySvtAiId,
            enemyTrait: props.enemyTrait,
            enemyClassName: props.enemyClassName,
        }).toString();

    const questDescriptions = quests
        .slice(0, maxShowResults)
        .map((quest) => <QuestDescriptionNoApi region={props.region} quest={quest} questPhase={quest.phase} />);

    return (
        <>
            {props.returnList ? (
                <ul style={{ marginBottom: 0 }}>
                    {questDescriptions.map((quest, i) => (
                        <li key={i}>{quest}</li>
                    ))}
                </ul>
            ) : (
                <>
                    {questDescriptions.map((quest, i) => (
                        <div key={i}>
                            {quest}
                            <br />
                        </div>
                    ))}
                </>
            )}
            {remainingCount > 0 ? `and ${remainingCount} other quests. ` : ""}
            {props.hideSearchLink ? null : (
                <Link to={`/${props.region}/quests?${queryString}`}>
                    Go to the quest search page <FontAwesomeIcon icon={faShare} />
                </Link>
            )}
        </>
    );
}
