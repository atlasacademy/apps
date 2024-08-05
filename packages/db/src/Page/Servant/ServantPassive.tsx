import { useEffect, useState } from "react";
import React from "react";
import { Badge, Col, Row, Table } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import { Buff, ConstantStr, Region, Servant } from "@atlasacademy/api-connector";
import { toTitleCase } from "@atlasacademy/api-descriptor";

import Api from "../../Api";
import SkillBreakdown from "../../Breakdown/SkillBreakdown";
import LoadStatus from "../../Helper/LoadStatus";
import { mergeElements } from "../../Helper/OutputHelper";
import ExtraPassive from "./ExtraPassive";

import "../ListingPage.css";

interface ServantScriptPassiveLoadStatus extends LoadStatus<string[]> {
    buffNames?: Map<string, Buff.BuffType>;
}

const ServantScriptPassive = ({ region, servant }: { region: Region; servant: Servant.Servant }) => {
    const { t } = useTranslation();
    const [{ data: buffTypes, buffNames }, setLoadStatus] = useState<ServantScriptPassiveLoadStatus>({
        loading: true,
    });

    useEffect(() => {
        const controller = new AbortController();
        if (servant.script.svtBuffTurnExtend) {
            Promise.all([Api.constantStrs(), Api.enumList()]).then(([constantStrs, enumList]) => {
                if (controller.signal.aborted) return;
                const buffTurnExtendTypes = constantStrs[ConstantStr.ConstantStr.EXTEND_TURN_BUFF_TYPE];
                if (buffTurnExtendTypes !== undefined) {
                    setLoadStatus({
                        loading: false,
                        data: buffTurnExtendTypes.split(","),
                        buffNames: new Map(Object.entries(enumList.NiceBuffType)),
                    });
                }
            });
        }
        return () => {
            controller.abort();
        };
    }, [servant]);

    if (servant.script.svtBuffTurnExtend) {
        return (
            <>
                <h3>{t("Extend Attack Buff Duration")}</h3>
                <p>
                    {t("Extend Attack Buff Duration Explain")}
                    {buffTypes !== undefined && buffNames !== undefined ? (
                        <>
                            <br />
                            {t("Applies to")}:{" "}
                            {mergeElements(
                                buffTypes.map((buff) => (
                                    <Link to={`/${region}/buffs?type=${buffNames.get(buff)}`}>
                                        {buffNames.get(buff)}
                                    </Link>
                                )),
                                ", "
                            )}
                            .
                        </>
                    ) : null}
                </p>
            </>
        );
    }

    return <></>;
};

const ServantBattlePoint = ({ region, servant }: { region: Region; servant: Servant.Servant }) => {
    const { t } = useTranslation();
    return (
        <>
            {servant.battlePoints.map((bp) => (
                <React.Fragment key={bp.id}>
                    <h3 className="mt-2 mb-3">
                        {t("Battle Point")} {bp.id}
                    </h3>

                    {bp.flags.map((flag) => (
                        <Badge key={flag} className="mr-1" style={{ background: "green", color: "white" }}>
                            {toTitleCase(flag)}
                        </Badge>
                    ))}

                    <Table responsive className="my-4 listing-page">
                        <thead>
                            <tr>
                                <th className="col-center">{t("Level")}</th>
                                <th className="col-center">{t("Value")}</th>
                                <th className="col-center">{t("Name")}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {bp.phases.map((phase) => (
                                <tr key={phase.phase}>
                                    <td className="col-center">{phase.phase}</td>
                                    <td className="col-center">{phase.value}</td>
                                    <td className="col-center">{phase.name}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </React.Fragment>
            ))}
        </>
    );
};

const ServantPassive = ({ region, servant }: { region: Region; servant: Servant.Servant }) => {
    const { t } = useTranslation();
    return (
        <>
            <ServantBattlePoint region={region} servant={servant} />
            <Row>
                {servant.classPassive.map((skill) => {
                    return (
                        <Col xs={12} lg={(servant.classPassive.length ?? 1) > 1 ? 6 : 12} key={skill.id}>
                            <SkillBreakdown region={region} skill={skill} cooldowns={false} />
                        </Col>
                    );
                })}
            </Row>
            <ServantScriptPassive region={region} servant={servant} />
            {servant.appendPassive.length > 0 ? (
                <>
                    <h3 className="my-4">{t("Append Skills")}</h3>
                    <Row>
                        {servant.appendPassive
                            .sort((a, b) => a.num - b.num)
                            .map((skill) => {
                                return (
                                    <Col lg={12} key={skill.skill.id}>
                                        <SkillBreakdown
                                            region={region}
                                            skill={skill.skill}
                                            cooldowns={false}
                                            levels={skill.skill.coolDown.length}
                                        />
                                    </Col>
                                );
                            })}
                    </Row>
                </>
            ) : null}
            {servant.extraPassive.length > 0 ? (
                <>
                    <h3 className="my-4">{t("Extra Passive")}</h3>
                    <ExtraPassive region={region} skills={servant.extraPassive} />
                </>
            ) : null}
        </>
    );
};

export default ServantPassive;
