import { faShare } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios, { AxiosError } from "axios";
import React from "react";
import { Col, Form, Row } from "react-bootstrap";
import { WithTranslation, withTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import { NoblePhantasm, Quest, Region, Skill } from "@atlasacademy/api-connector";
import { toTitleCase } from "@atlasacademy/api-descriptor";

import Api from "../Api";
import EffectBreakdown from "../Breakdown/EffectBreakdown";
import BuffIcon from "../Component/BuffIcon";
import DataTable from "../Component/DataTable";
import ErrorStatus from "../Component/ErrorStatus";
import Loading from "../Component/Loading";
import RawDataViewer from "../Component/RawDataViewer";
import SkillGroupOverWrite from "../Component/SkillGroupOverWrite";
import AiDescriptor from "../Descriptor/AiDescriptor";
import CommandCodeDescriptor from "../Descriptor/CommandCodeDescriptor";
import CondTargetValueDescriptor from "../Descriptor/CondTargetValueDescriptor";
import EntityDescriptor from "../Descriptor/EntityDescriptor";
import { BasicMysticCodeDescriptor } from "../Descriptor/MysticCodeDescriptor";
import NoblePhantasmDescriptor from "../Descriptor/NoblePhantasmDescriptor";
import { QuestDescriptionNoApi } from "../Descriptor/QuestDescriptor";
import SkillDescriptor from "../Descriptor/SkillDescriptor";
import { emptyOrUndefinded } from "../Helper/ArrayHelper";
import { FGOText, Ruby } from "../Helper/StringHelper";
import Manager, { lang } from "../Setting/Manager";
import SkillVersion from "./Skill/SkillVersion";

interface Event extends React.ChangeEvent<HTMLInputElement> {}

interface IProps extends WithTranslation {
    region: Region;
    id: number;
}

interface IState {
    error?: AxiosError;
    loading: boolean;
    skill?: Skill.Skill;
    triggeringSkills: Skill.SkillBasic[];
    triggeringNoblePhantasms: NoblePhantasm.NoblePhantasmBasic[];
    relatedQuests: Quest.QuestPhaseBasic[];
    levels: number;
    level: number;
}

class SkillPage extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);

        this.state = {
            loading: true,
            levels: 1,
            level: 1,
            triggeringSkills: [],
            triggeringNoblePhantasms: [],
            relatedQuests: [],
        };
    }

    async componentDidMount() {
        Manager.setRegion(this.props.region);
        await this.loadSkill();
    }

    async loadSkill() {
        try {
            const skill = await Api.skill(this.props.id);

            const [triggeringSkills, triggeringNoblePhantasms] = await Promise.all([
                Api.searchSkill({ triggerSkillId: [this.props.id], reverse: false }),
                Api.searchNoblePhantasm({ triggerSkillId: [this.props.id], reverse: false }),
            ]);

            let relatedQuests: Quest.QuestPhaseBasic[] = [];
            if (
                emptyOrUndefinded(skill.reverse?.basic?.servant) &&
                emptyOrUndefinded(skill.reverse?.basic?.CC) &&
                emptyOrUndefinded(skill.reverse?.basic?.MC) &&
                emptyOrUndefinded(triggeringSkills) &&
                emptyOrUndefinded(triggeringNoblePhantasms)
            ) {
                relatedQuests = await Api.searchQuestPhase({ enemySkillId: [this.props.id] });
            }

            document.title = `[${this.props.region}] Skill - ${skill.name} - Atlas Academy DB`;
            this.setState({
                skill,
                levels: skill.functions[0]?.svals?.length ?? 1,
                loading: false,
                triggeringSkills,
                triggeringNoblePhantasms,
                relatedQuests,
            });
        } catch (error) {
            if (axios.isAxiosError(error)) {
                this.setState({ error });
            }
        }
    }

    private changeLevel(level: number) {
        this.setState({
            level: level,
        });
    }

    render() {
        if (this.state.error) return <ErrorStatus error={this.state.error} />;

        if (this.state.loading || !this.state.skill) return <Loading />;

        const skill = this.state.skill;
        const { t, region } = this.props;

        const skillAdd = (
            <>
                {skill.skillAdd.map((skillAdd) => (
                    <React.Fragment key={skillAdd.priority}>
                        <span lang={lang(region)}>
                            <Ruby region={region} text={skillAdd.name} ruby={skillAdd.ruby} splitRank={true} />
                            {skillAdd.name !== skillAdd.originalName && (
                                <Ruby
                                    region={region}
                                    text={skillAdd.originalName}
                                    ruby={skillAdd.ruby}
                                    splitRank={true}
                                />
                            )}
                        </span>
                        {skillAdd.releaseConditions.map((cond) => (
                            <div key={`${cond.condType}-${cond.condId}-${cond.condNum}`}>
                                <CondTargetValueDescriptor
                                    region={region}
                                    cond={cond.condType}
                                    target={cond.condId}
                                    value={cond.condNum}
                                />
                            </div>
                        ))}
                    </React.Fragment>
                ))}
            </>
        );

        return (
            <div>
                <h1>
                    {skill.icon ? <BuffIcon location={skill.icon} height={48} /> : undefined}
                    {skill.icon ? " " : undefined}
                    <span lang={lang(this.props.region)}>
                        <Ruby region={this.props.region} text={skill.name} ruby={skill.ruby} splitRank={true} />
                    </span>
                </h1>

                <br />

                <DataTable
                    data={[
                        { label: t("ID"), value: skill.id },
                        {
                            label: "Name",
                            value: (
                                <span className="text-prewrap" lang={lang(this.props.region)}>
                                    <FGOText text={skill.name} />
                                </span>
                            ),
                        },
                        {
                            label: t("Original Name"),
                            value: (
                                <span className="text-prewrap" lang={lang(this.props.region)}>
                                    {skill.originalName}
                                </span>
                            ),
                            hidden: skill.name === skill.originalName,
                        },
                        {
                            label: t("Ruby"),
                            value: (
                                <span className="text-prewrap" lang={lang(this.props.region)}>
                                    {skill.ruby}
                                </span>
                            ),
                        },
                        {
                            label: t("Detail"),
                            value: (
                                <span className="text-prewrap" lang={lang(this.props.region)}>
                                    {skill.detail}
                                </span>
                            ),
                        },
                        { label: t("Skill Add"), value: skillAdd, hidden: skill.skillAdd.length === 0 },
                        { label: t("Type"), value: toTitleCase(skill.type) },
                        {
                            label: t("Related AIs"),
                            value: AiDescriptor.renderParentAiLinks(this.props.region, skill.aiIds),
                            hidden: skill.aiIds === undefined || Object.keys(skill.aiIds).length === 0,
                        },
                        {
                            label: t("Owner"),
                            value: (
                                <>
                                    {(skill.reverse?.basic?.servant ?? []).map((servant) => {
                                        return (
                                            <div key={servant.id}>
                                                <EntityDescriptor
                                                    region={this.props.region}
                                                    entity={servant}
                                                    iconHeight={25}
                                                />
                                            </div>
                                        );
                                    })}
                                    {(skill.reverse?.basic?.CC ?? []).map((commandCode) => (
                                        <CommandCodeDescriptor
                                            key={commandCode.id}
                                            region={this.props.region}
                                            commandCode={commandCode}
                                        />
                                    ))}
                                    {(skill.reverse?.basic?.MC ?? []).map((mysticCode) => {
                                        return (
                                            <BasicMysticCodeDescriptor
                                                key={mysticCode.id}
                                                region={this.props.region}
                                                mysticCode={mysticCode}
                                            />
                                        );
                                    })}
                                </>
                            ),
                            hidden:
                                emptyOrUndefinded(skill.reverse?.basic?.servant) &&
                                emptyOrUndefinded(skill.reverse?.basic?.CC) &&
                                emptyOrUndefinded(skill.reverse?.basic?.MC),
                        },
                        {
                            label: t("Triggered by"),
                            value: (
                                <>
                                    {this.state.triggeringSkills.map((skill) => (
                                        <React.Fragment key={skill.id}>
                                            <SkillDescriptor region={this.props.region} skill={skill} />
                                            <br />
                                        </React.Fragment>
                                    ))}
                                    {this.state.triggeringNoblePhantasms.map((np) => (
                                        <React.Fragment key={skill.id}>
                                            <NoblePhantasmDescriptor region={this.props.region} noblePhantasm={np} />
                                            <br />
                                        </React.Fragment>
                                    ))}
                                </>
                            ),
                            hidden:
                                this.state.triggeringSkills.length === 0 &&
                                this.state.triggeringNoblePhantasms.length === 0,
                        },
                        {
                            label: t("Used in Quests"),
                            value: (
                                <ul>
                                    {this.state.relatedQuests.slice(0, 10).map((quest) => (
                                        <li key={`${quest.id}-${quest.phase}`}>
                                            <QuestDescriptionNoApi
                                                region={this.props.region}
                                                quest={quest}
                                                questPhase={quest.phase}
                                            />
                                        </li>
                                    ))}
                                    {this.state.relatedQuests.length > 10 ? (
                                        <li>
                                            <Link to={`/${this.props.region}/quests?enemySkillId=${this.props.id}`}>
                                                and {this.state.relatedQuests.length - 10} other quests{" "}
                                                <FontAwesomeIcon icon={faShare} />
                                            </Link>
                                        </li>
                                    ) : null}
                                </ul>
                            ),
                            hidden: this.state.relatedQuests.length === 0,
                        },
                    ]}
                />
                <Row>
                    <Col>
                        <RawDataViewer
                            text={t("Nice")}
                            data={skill}
                            url={Api.getUrl("nice", "skill", this.props.id, { expand: true })}
                        />
                    </Col>
                    <Col>
                        <RawDataViewer
                            text={t("Raw")}
                            data={Api.getUrl("raw", "skill", this.props.id, { expand: true })}
                        />
                    </Col>
                </Row>

                <br />
                <h3>{t("Breakdown")}</h3>
                <EffectBreakdown
                    region={this.props.region}
                    cooldowns={skill.coolDown.length > 0 ? skill.coolDown : undefined}
                    funcs={skill.functions}
                    levels={skill.functions[0]?.svals?.length ?? 1}
                    scripts={skill.script}
                    triggerSkillIdStack={[skill.id]}
                    additionalSkillId={skill.script.additionalSkillId}
                />
                {skill.groupOverwrites && (
                    <SkillGroupOverWrite region={this.props.region} overwrites={skill.groupOverwrites} levels={1} />
                )}

                <br />
                <br />
                <h3>{t("Detailed Effects")}</h3>
                <Form inline style={{ justifyContent: "center" }}>
                    <Form.Control
                        as={"select"}
                        value={this.state.level}
                        onChange={(ev: Event) => this.changeLevel(parseInt(ev.target.value))}
                    >
                        {Array.from(Array(this.state.levels).keys())
                            .map((i) => i + 1)
                            .map((level) => (
                                <option key={level} value={level}>
                                    LEVEL {level}
                                </option>
                            ))}
                    </Form.Control>
                </Form>

                <br />
                <SkillVersion region={this.props.region} skill={skill} level={this.state.level} />
            </div>
        );
    }
}

export default withTranslation()(SkillPage);
