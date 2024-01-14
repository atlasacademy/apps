import React from "react";
import { Table } from "react-bootstrap";
import { useTranslation } from "react-i18next";

import { Event, Item, Region, Servant } from "@atlasacademy/api-connector";
import { toTitleCase } from "@atlasacademy/api-descriptor";

import CondTargetValueDescriptor from "../../Descriptor/CondTargetValueDescriptor";
import GiftDescriptor from "../../Descriptor/GiftDescriptor";
import ServantDescriptorId from "../../Descriptor/ServantDescriptorId";
import { lang } from "../../Setting/Manager";

import "./EventTable.css";

const EventFortificationDetail = ({
    region,
    fortDetail,
}: {
    region: Region;
    fortDetail: Event.EventFortificationDetail;
}) => {
    return (
        <>
            <span lang={lang(region)}>{fortDetail.name}</span> &mdash; {toTitleCase(fortDetail.className)}
        </>
    );
};

const EventFortificationServant = ({
    region,
    fortServant,
    servantMap,
}: {
    region: Region;
    fortServant: Event.EventFortificationSvt;
    servantMap: Map<number, Servant.ServantBasic>;
}) => {
    return (
        <>
            <ServantDescriptorId region={region} id={fortServant.svtId} servants={servantMap} />{" "}
            {fortServant.type === Event.EventFortificationSvtType.NPC ? <>Lv. {fortServant.lv}</> : null}
        </>
    );
};

const EventFortification = ({
    region,
    fortifications,
    itemMap,
    servantMap,
}: {
    region: Region;
    fortifications: Event.EventFortification[];
    itemMap: Map<number, Item.Item>;
    servantMap: Map<number, Servant.ServantBasic>;
}) => {
    const { t } = useTranslation();
    return (
        <Table hover responsive className="event-table">
            <thead>
                <tr>
                    <th className="text-center">#</th>
                    <th className="text-center">{t("Detail")}</th>
                    <th className="text-center">{t("Type")}</th>
                    <th className="text-center">{t("Limit")}</th>
                    <th className="text-center">{t("Rewards")}</th>
                </tr>
            </thead>
            <tbody>
                {fortifications.map((fortification) => (
                    <tr key={fortification.idx}>
                        <td className="text-center">{fortification.idx}</td>
                        <td>
                            <span lang={lang(region)}>{fortification.name}</span>
                            <br />
                            {fortification.releaseConditions.length > 0 ? (
                                <>
                                    {t("Release Condition")}:
                                    <ul className="condition-list">
                                        {fortification.releaseConditions.map((cond, index) => (
                                            <li key={index}>
                                                <CondTargetValueDescriptor
                                                    region={region}
                                                    cond={cond.condType}
                                                    target={cond.condId}
                                                    value={cond.condNum}
                                                />
                                            </li>
                                        ))}
                                    </ul>
                                </>
                            ) : null}
                            {fortification.details.length > 0 ? (
                                <>
                                    {t("Detail")}:
                                    <ul className="condition-list">
                                        {fortification.details.map((detail) => (
                                            <li key={detail.position}>
                                                <EventFortificationDetail region={region} fortDetail={detail} />
                                            </li>
                                        ))}
                                    </ul>
                                </>
                            ) : null}
                            {fortification.servants.length > 0 ? (
                                <>
                                    {t("Servants")}:
                                    <ul className="condition-list">
                                        {fortification.servants.map((svt) => (
                                            <li key={svt.position}>
                                                <EventFortificationServant
                                                    region={region}
                                                    fortServant={svt}
                                                    servantMap={servantMap}
                                                />
                                            </li>
                                        ))}
                                    </ul>
                                </>
                            ) : null}
                        </td>
                        <td className="text-center">
                            {fortification.workType === Event.EventWorkType.MILITSRY_AFFAIRS
                                ? "Military"
                                : fortification.workType === Event.EventWorkType.INTERNAL_AFFAIRS
                                  ? "Political"
                                  : "Internal"}
                        </td>
                        <td className="text-center">{fortification.maxFortificationPoint.toLocaleString()}</td>
                        <td>
                            {fortification.gifts.map((gift, idx) => (
                                <React.Fragment key={idx}>
                                    <GiftDescriptor region={region} gift={gift} items={itemMap} servants={servantMap} />
                                    <br />
                                </React.Fragment>
                            ))}
                        </td>
                    </tr>
                ))}
            </tbody>
        </Table>
    );
};

export default EventFortification;
