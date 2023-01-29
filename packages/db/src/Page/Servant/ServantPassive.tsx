import { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { Link } from "react-router";

import { Buff, ConstantStr, Region, Servant } from "@atlasacademy/api-connector";

import Api from "../../Api";
import SkillBreakdown from "../../Breakdown/SkillBreakdown";
import { mergeElements } from "../../Helper/OutputHelper";
import ExtraPassive from "./ExtraPassive";

const ServantScriptPassive = ({ region, servant }: { region: Region; servant: Servant.Servant }) => {
    const { t } = useTranslation();
    const [buffTypes, setBuffTypes] = useState<string[] | undefined>(undefined);
    const [buffNames, setBuffNames] = useState<Map<string, Buff.BuffType> | undefined>(undefined);

    useEffect(() => {
        if (servant.script.svtBuffTurnExtend) {
            Api.constantStrs().then((constantStrs) => {
                const buffTurnExtendTypes = constantStrs[ConstantStr.ConstantStr.EXTEND_TURN_BUFF_TYPE];
                if (buffTurnExtendTypes !== undefined) {
                    setBuffTypes(buffTurnExtendTypes.split(","));
                }
            });
            Api.enumList().then((enumList) => {
                setBuffNames(new Map(Object.entries(enumList.NiceBuffType)));
            });
        }
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

const ServantPassive = ({ region, servant }: { region: Region; servant: Servant.Servant }) => {
    const { t } = useTranslation();
    return (
        <>
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
