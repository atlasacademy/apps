import { faArrowUpRightFromSquare } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Badge, Col, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import { Quest, Region } from "@atlasacademy/api-connector";
import { toTitleCase } from "@atlasacademy/api-descriptor";

import Api from "../../Api";
import ClassIcon from "../../Component/ClassIcon";
import CopyToClipboard from "../../Component/CopyToClipboard";
import DataTable from "../../Component/DataTable";
import RawDataViewer from "../../Component/RawDataViewer";
import CondTargetValueDescriptor from "../../Descriptor/CondTargetValueDescriptor";
import { QuestFlagDescription } from "../../Descriptor/QuestEnumDescription";
import TraitDescription from "../../Descriptor/TraitDescription";
import { getStagesCalcString } from "../../Helper/CalcString";
import { mergeElements } from "../../Helper/OutputHelper";
import Manager, { lang } from "../../Setting/Manager";

const QuestSubData = ({ region, quest }: { region: Region; quest: Quest.QuestPhase }) => {
    const { t } = useTranslation();
    return (
        <DataTable
            data={[
                { label: t("QP Reward"), value: quest.qp.toLocaleString() },
                { label: t("EXP"), value: quest.exp.toLocaleString() },
                { label: t("Bond"), value: quest.bond.toLocaleString() },
                {
                    label: t("Flags"),
                    value: (
                        <>
                            {quest.flags.length > 0
                                ? quest.flags.map((flag) => (
                                      <Link to={`/${region}/quests?flag=${flag}`} key={flag}>
                                          <Badge className="mr-1" style={{ background: "green", color: "white" }}>
                                              {QuestFlagDescription.get(flag) ?? toTitleCase(flag)}
                                          </Badge>
                                      </Link>
                                  ))
                                : "This quest has no flag"}
                        </>
                    ),
                },
                {
                    label: t("Unlock Condition"),
                    value: (
                        <>
                            {quest.releaseConditions.map((cond) => (
                                <div key={`${cond.type}-${cond.targetId}-${cond.value}`}>
                                    {cond.closedMessage !== "" ? (
                                        <span lang={lang(region)}>{cond.closedMessage} — </span>
                                    ) : (
                                        ""
                                    )}
                                    <CondTargetValueDescriptor
                                        region={region}
                                        cond={cond.type}
                                        target={cond.targetId}
                                        value={cond.value}
                                    />
                                </div>
                            ))}
                        </>
                    ),
                },
                {
                    label: t("Individuality"),
                    value: mergeElements(
                        quest.individuality.map((trait) => (
                            <TraitDescription
                                key={trait.id}
                                region={region}
                                trait={trait}
                                owner="quests"
                                ownerParameter="fieldIndividuality"
                            />
                        )),
                        ", "
                    ),
                },
                {
                    label: t("Enemy Classes"),
                    value: mergeElements(
                        quest.className.map((className) => <ClassIcon key={className} className={className} />),
                        " "
                    ),
                },
                { label: t("Recommended Level"), value: quest.recommendLv },
                {
                    label: t("Battle BG ID"),
                    value: <Link to={`/${region}/quests?battleBgId=${quest.battleBgId}`}>{quest.battleBgId}</Link>,
                },
                {
                    label: t("Quest Calc String"),
                    value: (
                        <CopyToClipboard
                            text={getStagesCalcString(Manager.calcStringType(), quest.stages)}
                            title={t("Copy stage calc string to clipboard")}
                        />
                    ),
                    hidden:
                        Manager.calcStringType() === "off" ||
                        quest.stages.length === 0 ||
                        quest.enemyHash === undefined,
                },
                {
                    label: t("Original Name"),
                    value: <span lang={lang(region)}>{quest.originalName}</span>,
                    hidden: quest.name === quest.originalName,
                },
                {
                    label: t("Chaldea App"),
                    value: (
                        <a
                            className="descriptor-link"
                            target="_blank"
                            rel="noreferrer"
                            href={`https://link.chaldea.center/db/${region}/quest/${quest.id}/${quest.phase}`}
                        >
                            <span className="hover-text">{t("Open in Laplace Simulator")}</span>{" "}
                            <FontAwesomeIcon icon={faArrowUpRightFromSquare} title={t("Open in Laplace Simulator")} />
                        </a>
                    ),
                    hidden: quest.stages.every((stage) => stage.enemies.length === 0),
                },
                {
                    label: t("Raw"),
                    value: (
                        <Row>
                            <Col>
                                <RawDataViewer
                                    text={t("Nice")}
                                    data={quest}
                                    url={Api.getUrl("nice", "quest", `${quest.id}/${quest.phase}`)}
                                />
                            </Col>
                            <Col>
                                <RawDataViewer
                                    text={t("Raw")}
                                    data={Api.getUrl("raw", "quest", `${quest.id}/${quest.phase}`)}
                                />
                            </Col>
                        </Row>
                    ),
                },
            ]}
        />
    );
};

export default QuestSubData;
