import { Table } from "react-bootstrap";
import { useTranslation } from "react-i18next";

import { Quest } from "@atlasacademy/api-connector";

export const QuestSummaryTable = ({ quest }: { quest: Quest.Quest }) => {
    const { t } = useTranslation();

    return (
        <>
            <Table>
                <thead>
                    <th>
                        <td></td>
                    </th>
                </thead>
                <tbody></tbody>
            </Table>
        </>
    );
};
