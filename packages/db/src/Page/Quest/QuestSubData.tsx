import { Badge, Col, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import { Quest, Region } from "@atlasacademy/api-connector";
import { toTitleCase } from "@atlasacademy/api-descriptor";

import Api from "../../Api";
import ClassIcon from "../../Component/ClassIcon";
import DataTable from "../../Component/DataTable";
import RawDataViewer from "../../Component/RawDataViewer";
import CondTargetValueDescriptor from "../../Descriptor/CondTargetValueDescriptor";
import { QuestFlagDescription } from "../../Descriptor/QuestEnumDescription";
import TraitDescription from "../../Descriptor/TraitDescription";
import { mergeElements } from "../../Helper/OutputHelper";
import { lang } from "../../Setting/Manager";

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
                                          <Badge style={{ marginRight: 5, background: "green", color: "white" }}>
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
                    label: "Raw",
                    value: (
                        <Row>
                            <Col>
                                <RawDataViewer
                                    text="Nice"
                                    data={quest}
                                    url={Api.getUrl("nice", "quest", `${quest.id}/${quest.phase}`)}
                                />
                            </Col>
                            <Col>
                                <RawDataViewer
                                    text="Raw"
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
