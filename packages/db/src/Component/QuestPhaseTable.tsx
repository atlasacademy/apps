import { Table } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import { Quest, Region } from "@atlasacademy/api-connector";

import { QuestTypeDescription } from "../Descriptor/QuestEnumDescription";
import { FGOText } from "../Helper/StringHelper";
import { lang } from "../Setting/Manager";

const QuestPhaseTable = ({ region, quests }: { region: Region; quests: Quest.QuestPhaseBasic[] }) => {
    const { t } = useTranslation();
    return (
        <Table responsive>
            <thead>
                <tr>
                    <th>{t("Quest")} ID</th>
                    <th className="col-center text-nowrap">{t("Phase")}</th>
                    <th>{t("Quest Name")}</th>
                    <th className="col-center">{t("Quest Type")}</th>
                    <th className="col-center">{t("War")} ID</th>
                    <th>{t("War Long Name")}</th>
                </tr>
            </thead>
            <tbody>
                {quests.map((quest) => {
                    const questLink = `/${region}/quest/${quest.id}/${quest.phase}`,
                        warLink = `/${region}/war/${quest.warId}`;
                    return (
                        <tr key={`${quest.id}-${quest.phase}`}>
                            <td>
                                <Link to={questLink}>{quest.id}</Link>
                            </td>
                            <td className="col-center">
                                <Link to={questLink}>{quest.phase}</Link>
                            </td>
                            <td lang={lang(region)}>
                                <Link to={questLink}>
                                    <FGOText text={quest.name} />
                                </Link>
                            </td>
                            <td className="col-center">
                                <QuestTypeDescription questType={quest.type} />
                            </td>
                            <td className="col-center">
                                <Link to={warLink}>{quest.warId}</Link>
                            </td>
                            <td lang={lang(region)}>
                                <Link to={warLink}>{quest.warLongName}</Link>
                            </td>
                        </tr>
                    );
                })}
            </tbody>
        </Table>
    );
};

export default QuestPhaseTable;
