import { AxiosError } from "axios";
import React from "react";
import { Form } from "react-bootstrap";

import { Region, Skill } from "@atlasacademy/api-connector";
import { toTitleCase } from "@atlasacademy/api-descriptor";

import Api, { Host } from "../Api";
import EffectBreakdown from "../Breakdown/EffectBreakdown";
import BuffIcon from "../Component/BuffIcon";
import DataTable from "../Component/DataTable";
import ErrorStatus from "../Component/ErrorStatus";
import Loading from "../Component/Loading";
import RawDataViewer from "../Component/RawDataViewer";
import AiDescriptor from "../Descriptor/AiDescriptor";
import CommandCodeDescriptor from "../Descriptor/CommandCodeDescriptor";
import CondTargetValueDescriptor from "../Descriptor/CondTargetValueDescriptor";
import EntityDescriptor from "../Descriptor/EntityDescriptor";
import { BasicMysticCodeDescriptor } from "../Descriptor/MysticCodeDescriptor";
import { mergeElements } from "../Helper/OutputHelper";
import getRubyText, { replacePUACodePoints } from "../Helper/StringHelper";
import Manager from "../Setting/Manager";
import SkillVersion from "./Skill/SkillVersion";

import "../Helper/StringHelper.css";

interface Event extends React.ChangeEvent<HTMLInputElement> {}

interface IProps {
    region: Region;
    id: number;
}

interface IState {
    error?: AxiosError;
    loading: boolean;
    skill?: Skill.Skill;
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
        };
    }

    componentDidMount() {
        Manager.setRegion(this.props.region);
        this.loadSkill();
    }

    async loadSkill() {
        Api.skill(this.props.id)
            .then((skill) => {
                document.title = `[${this.props.region}] Skill - ${skill.name} - Atlas Academy DB`;
                this.setState({
                    skill,
                    levels: skill.functions[0]?.svals?.length ?? 1,
                    loading: false,
                });
            })
            .catch((error) => this.setState({ error }));
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

        const skillAdd = mergeElements(
            this.state.skill.skillAdd.map((skillAdd) => (
                <>
                    {getRubyText(this.props.region, skillAdd.name, skillAdd.ruby, true)}
                    {skillAdd.releaseConditions.map((cond) => (
                        <div key={`${cond.condType}-${cond.condId}-${cond.condNum}`}>
                            <CondTargetValueDescriptor
                                region={this.props.region}
                                cond={cond.condType}
                                target={cond.condId}
                                value={cond.condNum}
                            />
                        </div>
                    ))}
                </>
            )),
            <br />
        );

        return (
            <div>
                <h1>
                    {skill.icon ? <BuffIcon location={skill.icon} height={48} /> : undefined}
                    {skill.icon ? " " : undefined}
                    {getRubyText(this.props.region, skill.name, skill.ruby, true)}
                </h1>

                <br />

                <DataTable
                    data={{
                        ID: skill.id,
                        Name: <span className="newline">{replacePUACodePoints(skill.name)}</span>,
                        Ruby: skill.ruby,
                        Detail: <span className="newline">{skill.detail}</span>,
                        "Skill Add": skillAdd,
                        Type: toTitleCase(skill.type),
                        "Related AIs": AiDescriptor.renderParentAiLinks(this.props.region, skill.aiIds),
                        Owner: (
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
                    }}
                />
                <span>
                    <RawDataViewer text="Nice" data={skill} />
                    <RawDataViewer text="Raw" data={`${Host}/raw/${this.props.region}/skill/${skill.id}?expand=true`} />
                </span>

                <br />
                <h3>Breakdown</h3>
                <EffectBreakdown
                    region={this.props.region}
                    cooldowns={skill.coolDown.length > 0 ? skill.coolDown : undefined}
                    funcs={skill.functions}
                    levels={skill.functions[0]?.svals?.length ?? 1}
                    scripts={skill.script}
                    triggerSkillIdStack={[skill.id]}
                    additionalSkillId={skill.script.additionalSkillId}
                />

                <br />
                <br />
                <h3>Detailed Effects</h3>
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

export default SkillPage;
