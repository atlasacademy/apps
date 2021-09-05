import { Quest, Region, Script } from "@atlasacademy/api-connector";
import { useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import Api from "../../Api";
import { QuestDescriptionNoApi } from "../../Descriptor/QuestDescriptor";
import ScriptDescriptor, {
    getScriptType,
} from "../../Descriptor/ScriptDescriptor";
import { flatten } from "../../Helper/PolyFill";

import "../../Component/DataTable.css";
import "./ScriptMainData.css";
import { dedupe } from "../../Helper/ArrayHelper";

const getQuestSortedScriptIds = (quest: Quest.Quest) => {
    const phaseScripts = quest.phaseScripts.sort((a, b) => a.phase - b.phase);
    const scriptIds = flatten(
        phaseScripts.map((phase) =>
            phase.scripts.sort((a, b) =>
                a.scriptId.localeCompare(b.scriptId, "en")
            )
        )
    ).map((script) => script.scriptId);

    return dedupe(scriptIds);
};

const QuestWarDescriptor = ({
    region,
    quest,
    questPhase,
}: {
    region: Region;
    quest: Quest.Quest;
    questPhase: number;
}) => {
    return (
        <>
            <Link to={`/${region}/war/${quest.warId}`}>
                War {quest.warId} {quest.warLongName}
            </Link>
            {" — "}
            <QuestDescriptionNoApi
                region={region}
                quest={quest}
                questPhase={questPhase}
                showType={false}
            />
        </>
    );
};

const ScriptMainData = ({
    region,
    scriptData,
}: {
    region: Region;
    scriptData: Script.Script;
}) => {
    const { scriptId } = scriptData;
    const [previousScript, setPreviousScript] = useState<string | undefined>(
        undefined
    );
    const [nextScript, setNextScript] = useState<string | undefined>(undefined);
    const [firstScriptInWar, setFirstScriptInWar] = useState<boolean>(false);
    const [lastScriptInWar, setLastScriptInWar] = useState<boolean>(false);

    useEffect(() => {
        setPreviousScript(undefined);
        setNextScript(undefined);
        setFirstScriptInWar(false);
        setLastScriptInWar(false);
        if (scriptData.quests.length > 0) {
            const quest = scriptData.quests[0];

            let foundPrevious = false,
                foundNext = false;

            const scriptIds = getQuestSortedScriptIds(quest);
            const questScriptIndex = scriptIds.indexOf(scriptId);

            if (questScriptIndex > 0) {
                setPreviousScript(scriptIds[questScriptIndex - 1]);
                foundPrevious = true;
            }

            if (questScriptIndex < scriptIds.length - 1) {
                setNextScript(scriptIds[questScriptIndex + 1]);
                foundNext = true;
            }

            const WARS_WITHOUT_MAIN_QUESTS = [
                1001, // Rank-up
                1003, // Interlude
                9999, // Chaldea Gate
            ];
            if (
                !WARS_WITHOUT_MAIN_QUESTS.includes(quest.warId) &&
                (!foundPrevious || !foundNext)
            ) {
                Api.war(quest.warId).then((war) => {
                    const warQuests = flatten(
                        war.spots.map((spot) =>
                            spot.quests.filter(
                                (quest) => quest.type === Quest.QuestType.MAIN
                            )
                        )
                    ).sort((a, b) => a.id - b.id);
                    const warScriptIds = dedupe(
                        flatten(
                            warQuests.map((quest) =>
                                getQuestSortedScriptIds(quest)
                            )
                        )
                    );

                    const warScriptIndex = warScriptIds.indexOf(scriptId);

                    if (!foundPrevious) {
                        if (warScriptIndex > 0) {
                            setPreviousScript(warScriptIds[warScriptIndex - 1]);
                            foundPrevious = true;
                        } else {
                            setFirstScriptInWar(true);
                        }
                    }

                    if (!foundNext) {
                        if (warScriptIndex < warScriptIds.length - 1) {
                            setNextScript(warScriptIds[warScriptIndex + 1]);
                            foundNext = true;
                        } else {
                            setLastScriptInWar(true);
                        }
                    }
                });
            }
        }
    }, [scriptData, scriptId]);

    const scriptIdPhase = scriptId.slice(scriptId.length - 1, scriptId.length),
        scriptIdPhaseNum = /[0-9]/.test(scriptIdPhase)
            ? parseInt(scriptIdPhase)
            : undefined;

    const scriptPhase =
        flatten(scriptData.quests.map((quest) => quest.phaseScripts)).find(
            (phaseScript) =>
                phaseScript.scripts
                    .map((script) => script.scriptId)
                    .includes(scriptId)
        )?.phase ?? scriptIdPhaseNum;

    const questList =
        scriptData.quests.length === 0 ? null : (
            <>
                <tr>
                    <th>{`Quest${
                        scriptData.quests.length === 1 ? "" : "s"
                    }`}</th>
                    <td colSpan={3}>
                        {scriptData.quests.length === 1 ? (
                            <QuestWarDescriptor
                                region={region}
                                quest={scriptData.quests[0]}
                                questPhase={scriptPhase ?? 1}
                            />
                        ) : (
                            <ul>
                                {scriptData.quests.map((quest) => (
                                    <li key={quest.id}>
                                        <QuestWarDescriptor
                                            region={region}
                                            quest={quest}
                                            questPhase={scriptPhase ?? 1}
                                        />
                                    </li>
                                ))}
                            </ul>
                        )}
                    </td>
                </tr>
                {scriptPhase === undefined ? null : (
                    <tr>
                        <th>Phase</th>
                        <td colSpan={3}>{scriptPhase}</td>
                    </tr>
                )}
                <tr>
                    <th>Script Type</th>
                    <td colSpan={3}>{getScriptType(scriptId)}</td>
                </tr>
                <tr>
                    <th>Previous Script</th>
                    <td className="script-nav-link">
                        {previousScript === undefined ? (
                            `N/A${
                                firstScriptInWar
                                    ? ": This is the first script in this war"
                                    : ""
                            }`
                        ) : (
                            <ScriptDescriptor
                                region={region}
                                scriptId={previousScript}
                                scriptType=""
                            />
                        )}
                    </td>
                    <th>Next Script</th>
                    <td className="script-nav-link">
                        {nextScript === undefined ? (
                            `N/A${
                                lastScriptInWar
                                    ? ": This is the last script in this war"
                                    : ""
                            }`
                        ) : (
                            <ScriptDescriptor
                                region={region}
                                scriptId={nextScript}
                                scriptType=""
                            />
                        )}
                    </td>
                </tr>
            </>
        );

    return (
        <Table bordered hover responsive className="data-table script-data">
            <tbody>
                <tr>
                    <th>Raw Size</th>
                    <td colSpan={3}>{`${(
                        scriptData.scriptSizeBytes / 1024
                    ).toFixed(2)} KiB`}</td>
                </tr>
                {questList}
            </tbody>
        </Table>
    );
};

export default ScriptMainData;
