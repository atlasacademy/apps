import { faShare } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios, { AxiosError } from "axios";
import React from "react";
import { Col, Form, Row } from "react-bootstrap";
import { Link } from "react-router-dom";

import { Entity, NoblePhantasm, Quest, Region } from "@atlasacademy/api-connector";
import { toTitleCase } from "@atlasacademy/api-descriptor";

import Api from "../Api";
import EffectBreakdown from "../Breakdown/EffectBreakdown";
import DataTable from "../Component/DataTable";
import ErrorStatus from "../Component/ErrorStatus";
import Loading from "../Component/Loading";
import RawDataViewer from "../Component/RawDataViewer";
import EntityDescriptor from "../Descriptor/EntityDescriptor";
import { QuestDescriptionNoApi } from "../Descriptor/QuestDescriptor";
import TraitDescription from "../Descriptor/TraitDescription";
import { asPercent, mergeElements } from "../Helper/OutputHelper";
import getRubyText from "../Helper/StringHelper";
import Manager, { lang } from "../Setting/Manager";
import NoblePhantasmVersion from "./NoblePhantasm/NoblePhantasmVersion";

interface Event extends React.ChangeEvent<HTMLInputElement> {}

interface IProps {
    region: Region;
    id: number;
}

interface IState {
    error?: AxiosError;
    loading: boolean;
    noblePhantasm?: NoblePhantasm.NoblePhantasm;
    relatedQuests: Quest.QuestPhaseBasic[];
    level: number;
    overcharge: number;
}

class NoblePhantasmPage extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);

        this.state = {
            loading: true,
            level: 1,
            overcharge: 1,
            relatedQuests: [],
        };
    }

    async componentDidMount() {
        Manager.setRegion(this.props.region);
        await this.loadNp();
    }

    async loadNp() {
        try {
            const noblePhantasm = await Api.noblePhantasm(this.props.id);

            let relatedQuests: Quest.QuestPhaseBasic[] = [];
            const ownerTypes = new Set((noblePhantasm.reverse?.basic?.servant ?? []).map((svt) => svt.type));
            if (ownerTypes.size > 0 && !ownerTypes.has(Entity.EntityType.NORMAL)) {
                relatedQuests = await Api.searchQuestPhase({ enemyNoblePhantasmId: [this.props.id] });
            }

            document.title = `[${this.props.region}] Noble Phantasm - ${noblePhantasm.name} - Atlas Academy DB`;
            this.setState({ noblePhantasm, loading: false, relatedQuests });
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

    private changeOvercharge(level: number) {
        this.setState({
            overcharge: level,
        });
    }

    render() {
        if (this.state.error) return <ErrorStatus error={this.state.error} />;

        if (this.state.loading || !this.state.noblePhantasm) return <Loading />;

        const noblePhantasm = this.state.noblePhantasm,
            region = this.props.region;

        return (
            <div>
                <h1 lang={lang(region)}>{getRubyText(this.props.region, noblePhantasm.name, noblePhantasm.ruby)}</h1>
                <br />

                <DataTable
                    data={[
                        { label: "ID", value: noblePhantasm.id },
                        { label: "Name", value: <span lang={lang(region)}>{noblePhantasm.name}</span> },
                        {
                            label: "Original Name",
                            value: <span lang={lang(region)}>{noblePhantasm.originalName}</span>,
                            hidden: noblePhantasm.name === noblePhantasm.originalName,
                        },
                        { label: "Ruby", value: <span lang={lang(region)}>{noblePhantasm.ruby}</span> },
                        { label: "Detail", value: <span lang={lang(region)}>{noblePhantasm.detail}</span> },
                        { label: "Rank", value: noblePhantasm.rank },
                        { label: "Type", value: <span lang={lang(region)}>{noblePhantasm.type}</span> },
                        { label: "Card Type", value: toTitleCase(noblePhantasm.card) },
                        {
                            label: "Hits",
                            value: mergeElements(
                                noblePhantasm.npDistribution.map((hit) => asPercent(hit, 0)),
                                ", "
                            ),
                        },
                        {
                            label: "Traits",
                            value: mergeElements(
                                noblePhantasm.individuality.map((trait) => (
                                    <TraitDescription
                                        region={this.props.region}
                                        trait={trait}
                                        owner="noble-phantasms"
                                        ownerParameter="individuality"
                                    />
                                )),
                                ", "
                            ),
                        },
                        {
                            label: "Owner",
                            value: (
                                <div>
                                    {(noblePhantasm.reverse?.basic?.servant ?? []).map((servant) => {
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
                                </div>
                            ),
                        },
                        {
                            label: "Used in Quests",
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
                <span>
                    <RawDataViewer
                        text="Nice"
                        data={noblePhantasm}
                        url={Api.getUrl("nice", "NP", this.props.id, { expand: true })}
                    />
                    <RawDataViewer text="Raw" data={Api.getUrl("raw", "NP", this.props.id, { expand: true })} />
                </span>

                <br />
                <h3>Breakdown</h3>
                <EffectBreakdown
                    region={this.props.region}
                    funcs={noblePhantasm.functions}
                    gain={noblePhantasm.npGain}
                    levels={noblePhantasm.functions[0]?.svals.length ?? 1}
                />

                <br />
                <br />
                <h3>Detailed Effects</h3>
                <Row>
                    <Col>
                        <Form inline style={{ justifyContent: "flex-end" }}>
                            <Form.Control
                                as={"select"}
                                value={this.state.level}
                                onChange={(ev: Event) => this.changeLevel(parseInt(ev.target.value))}
                            >
                                {[1, 2, 3, 4, 5].map((level) => (
                                    <option key={level} value={level}>
                                        NP LEVEL {level}
                                    </option>
                                ))}
                            </Form.Control>
                        </Form>
                    </Col>
                    <Col>
                        <Form inline>
                            <Form.Control
                                as={"select"}
                                value={this.state.overcharge}
                                onChange={(ev: Event) => this.changeOvercharge(parseInt(ev.target.value))}
                            >
                                {[1, 2, 3, 4, 5].map((level) => (
                                    <option key={level} value={level}>
                                        OVERCHARGE {level}
                                    </option>
                                ))}
                            </Form.Control>
                        </Form>
                    </Col>
                </Row>

                <br />
                <NoblePhantasmVersion
                    region={this.props.region}
                    noblePhantasm={noblePhantasm}
                    level={this.state.level}
                    overcharge={this.state.overcharge}
                />
            </div>
        );
    }
}

export default NoblePhantasmPage;
