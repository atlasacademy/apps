import { Link } from "react-router-dom";

import { Quest, Region, Script } from "@atlasacademy/api-connector";

import { QuestDescriptionNoApi } from "../../Descriptor/QuestDescriptor";
import ScriptDescriptor, { getScriptType } from "../../Descriptor/ScriptDescriptor";

interface QuestWarDescriptorProps {
    region: Region;
    quest: Quest.Quest;
    questPhase: number;
}

const QuestWarDescriptor = ({ region, quest, questPhase }: QuestWarDescriptorProps) => {
    return (
        <>
            <Link to={`/${region}/war/${quest.warId}`}>
                War {quest.warId} {quest.warLongName}
            </Link>
            {" — "}
            <QuestDescriptionNoApi region={region} quest={quest} questPhase={questPhase} showType={false} />
        </>
    );
};

interface questListComponentProps {
    scriptData: Script.Script;
    scriptPhase: number | undefined;
    region: Region;
    scriptId: string;
    previousScript?: string;
    nextScript?: string;
    firstScriptInWar?: boolean;
    lastScriptInWar?: boolean;
}

export const questListComponent = ({
    scriptData,
    scriptPhase,
    region,
    scriptId,
    previousScript,
    nextScript,
    firstScriptInWar,
    lastScriptInWar,
}: questListComponentProps): JSX.Element => {
    return (
        <>
            <tr>
                <th>{`Quest${scriptData.quests.length === 1 ? "" : "s"}`}</th>
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
                                    <QuestWarDescriptor region={region} quest={quest} questPhase={scriptPhase ?? 1} />
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
                        `N/A${firstScriptInWar ? ": This is the first script in this war" : ""}`
                    ) : (
                        <ScriptDescriptor region={region} scriptId={previousScript} scriptType="" />
                    )}
                </td>
                <th>Next Script</th>
                <td className="script-nav-link">
                    {nextScript === undefined ? (
                        `N/A${lastScriptInWar ? ": This is the last script in this war" : ""}`
                    ) : (
                        <ScriptDescriptor region={region} scriptId={nextScript} scriptType="" />
                    )}
                </td>
            </tr>
        </>
    );
};
