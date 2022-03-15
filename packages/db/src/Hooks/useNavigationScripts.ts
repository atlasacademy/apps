import { useEffect, useState } from "react";

import { Quest, Script } from "@atlasacademy/api-connector";

import Api from "../Api";
import { dedupe } from "../Helper/ArrayHelper";
import { flatten } from "../Helper/PolyFill";

interface useNavigationScriptsProps {
    scriptData: Script.Script;
    scriptId: string;
}

const getQuestSortedScriptIds = (quest: Quest.Quest) => {
    const phaseScripts = quest.phaseScripts.sort((a, b) => a.phase - b.phase);
    const scriptIds = flatten(
        phaseScripts.map((phase) => phase.scripts.sort((a, b) => a.scriptId.localeCompare(b.scriptId, "en")))
    ).map((script) => script.scriptId);

    return dedupe(scriptIds);
};

export default function useNavigationScripts({ scriptData, scriptId }: useNavigationScriptsProps) {
    const [previousScript, setPreviousScript] = useState<string | undefined>(undefined);
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

            let foundPrevious = false;
            let foundNext = false;

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

            if (!WARS_WITHOUT_MAIN_QUESTS.includes(quest.warId) && (!foundPrevious || !foundNext)) {
                Api.war(quest.warId).then((war) => {
                    const warSpots = war.spots.map((spot) =>
                        spot.quests.filter((quest) => quest.type === Quest.QuestType.MAIN)
                    );

                    const warQuests = flatten(warSpots).sort((a, b) => a.id - b.id);

                    const warQuestsSortedScripts = warQuests.map((quest) => getQuestSortedScriptIds(quest));

                    const warScriptIds = dedupe(flatten(warQuestsSortedScripts));

                    const warScriptIndex = warScriptIds.indexOf(scriptId);

                    if (!foundPrevious) {
                        if (warScriptIndex > 0) {
                            setPreviousScript(warScriptIds[warScriptIndex - 1]);
                            foundPrevious = true;
                        } else if (warScriptIds.length > 0) {
                            setFirstScriptInWar(true);
                        }
                    }

                    if (!foundNext) {
                        if (warScriptIndex < warScriptIds.length - 1) {
                            setNextScript(warScriptIds[warScriptIndex + 1]);
                            foundNext = true;
                        } else if (warScriptIds.length > 0) {
                            setLastScriptInWar(true);
                        }
                    }
                });
            }
        }
    }, [scriptData, scriptId]);

    return { nextScript, firstScriptInWar, previousScript, lastScriptInWar };
}
