import { Table } from "react-bootstrap";
import { useTranslation } from "react-i18next";

import { Event, Quest, Region } from "@atlasacademy/api-connector";

import CondTargetValueDescriptor from "../../Descriptor/CondTargetValueDescriptor";
import { mergeElements } from "../../Helper/OutputHelper";
import { lang } from "../../Setting/Manager";

import "./EventTable.css";

const BulletinReleaseGroup = ({
    region,
    releaseConds,
    questCache,
}: {
    region: Region;
    releaseConds: Event.EventBulletinBoardRelease[];
    questCache: Map<number, Quest.Quest>;
}) => {
    return (
        <>
            {mergeElements(
                releaseConds.map((releaseCond) => (
                    <CondTargetValueDescriptor
                        region={region}
                        cond={releaseCond.condType}
                        target={releaseCond.condTargetId}
                        value={releaseCond.condNum}
                        quests={questCache}
                    />
                )),
                " and "
            )}
        </>
    );
};

const EventBulletinBoardReleaseCondition = ({
    region,
    conditions,
    questCache,
}: {
    region: Region;
    conditions: Event.EventBulletinBoardRelease[];
    questCache: Map<number, Quest.Quest>;
}) => {
    const { t } = useTranslation();
    if (conditions.length === 0) return null;

    const groups = Array.from(new Set(conditions.map((condition) => condition.condGroup)));
    return (
        <>
            <b>
                {t("Release Condition")}
                {groups.length > 1 ? `${t("SforPlural")} (${t("Any of the following")}):` : ":"}
            </b>
            <br />
            {groups.length > 1 ? (
                <ul style={{ marginBottom: 0 }}>
                    {groups.map((group) => (
                        <li key={group}>
                            <BulletinReleaseGroup
                                region={region}
                                releaseConds={conditions.filter((cond) => cond.condGroup === group)}
                                questCache={questCache}
                            />
                        </li>
                    ))}
                </ul>
            ) : (
                <>
                    {groups.map((group) => (
                        <BulletinReleaseGroup
                            key={group}
                            region={region}
                            releaseConds={conditions.filter((cond) => cond.condGroup === group)}
                            questCache={questCache}
                        />
                    ))}
                </>
            )}
        </>
    );
};

const EventBulletinBoard = ({
    region,
    bulletinBoards,
    questCache,
}: {
    region: Region;
    bulletinBoards: Event.EventBulletinBoard[];
    questCache: Map<number, Quest.Quest>;
}) => {
    const { t } = useTranslation();
    return (
        <Table hover responsive className="event-table">
            <thead>
                <tr>
                    <th style={{ textAlign: "center" }}>#</th>
                    <th>{t("Detail")}</th>
                </tr>
            </thead>
            <tbody>
                {bulletinBoards.map((bulletinBoard) => {
                    return (
                        <tr key={bulletinBoard.bulletinBoardId}>
                            <td className="text-center font-weight-bold">{bulletinBoard.bulletinBoardId}</td>
                            <td>
                                <div className="mb-2">
                                    <b>{t("Message")}:</b> <span lang={lang(region)}>{bulletinBoard.message}</span>
                                </div>
                                <EventBulletinBoardReleaseCondition
                                    region={region}
                                    conditions={bulletinBoard.releaseConditions}
                                    questCache={questCache}
                                />
                            </td>
                        </tr>
                    );
                })}
            </tbody>
        </Table>
    );
};

export default EventBulletinBoard;
