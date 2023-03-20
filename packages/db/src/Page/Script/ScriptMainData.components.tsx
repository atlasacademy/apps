import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import { Quest, Region, Script } from "@atlasacademy/api-connector";

import { QuestDescriptionNoApi } from "../../Descriptor/QuestDescriptor";
import ScriptDescriptor, { getScriptType } from "../../Descriptor/ScriptDescriptor";
import { lang } from "../../Setting/Manager";

interface QuestWarDescriptorProps {
    region: Region;
    quest: Quest.Quest;
    questPhase: number;
}

const QuestWarDescriptor = ({ region, quest, questPhase }: QuestWarDescriptorProps) => {
    const { t } = useTranslation();
    return (
        <>
            <Link to={`/${region}/war/${quest.warId}`}>
                {t("War")} {quest.warId} <span lang={lang(region)}>{quest.warLongName}</span>
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

export const QuestListComponent = ({
    scriptData,
    scriptPhase,
    region,
    scriptId,
    previousScript,
    nextScript,
    firstScriptInWar,
    lastScriptInWar,
}: questListComponentProps): JSX.Element => {
    const { t } = useTranslation();
    return (
        <>
            <tr>
                <th>{scriptData.quests.length === 1 ? t("Quest") : t("Quests")}</th>
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
                    <th>{t("Phase")}</th>
                    <td colSpan={3}>{scriptPhase}</td>
                </tr>
            )}
            <tr>
                <th>{t("Script Type")}</th>
                <td colSpan={3}>{getScriptType(scriptId)}</td>
            </tr>
            <tr>
                <th>{t("Previous Script")}</th>
                <td className="script-nav-link">
                    {previousScript === undefined ? (
                        t("N/A") + `${firstScriptInWar ? `: ${t("This is the first script in this war")}` : ""}`
                    ) : (
                        <ScriptDescriptor region={region} scriptId={previousScript} scriptType="" />
                    )}
                </td>
                <th style={{ width: "25%" }}>{t("Next Script")}</th>
                <td className="script-nav-link">
                    {nextScript === undefined ? (
                        t("N/A") + `${lastScriptInWar ? `: ${t("This is the last script in this war")}` : ""}`
                    ) : (
                        <ScriptDescriptor region={region} scriptId={nextScript} scriptType="" />
                    )}
                </td>
            </tr>
        </>
    );
};
