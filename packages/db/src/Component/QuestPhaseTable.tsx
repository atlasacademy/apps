import { Table } from "react-bootstrap";
import { Link } from "react-router-dom";

import { Quest, Region } from "@atlasacademy/api-connector";

import { QuestTypeDescription } from "../Page/QuestPage";

const QuestPhaseTable = ({ region, quests }: { region: Region; quests: Quest.QuestPhaseBasic[] }) => {
    return (
        <Table responsive>
            <thead>
                <tr>
                    <th>Quest ID</th>
                    <th className="col-center">Phase</th>
                    <th>Quest Name</th>
                    <th className="col-center">Quest Type</th>
                    <th className="col-center">War ID</th>
                    <th>War Long Name</th>
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
                            <td>
                                <Link to={questLink}>{quest.name}</Link>
                            </td>
                            <td className="col-center">{QuestTypeDescription.get(quest.type)}</td>
                            <td className="col-center">
                                <Link to={warLink}>{quest.warId}</Link>
                            </td>
                            <td>
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
