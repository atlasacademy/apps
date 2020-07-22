import {AxiosError} from "axios";
import React from "react";
import {Form} from "react-bootstrap";
import Connection from "../Api/Connection";
import CraftEssence from "../Api/Data/CraftEssence";
import EntityType from "../Api/Data/EntityType";
import Region from "../Api/Data/Region";
import Servant from "../Api/Data/Servant";
import Skill from "../Api/Data/Skill";
import BuffIcon from "../Component/BuffIcon";
import DataTable from "../Component/DataTable";
import ErrorStatus from "../Component/ErrorStatus";
import Loading from "../Component/Loading";
import MysticCodeDescriptor from "../Descriptor/MysticCodeDescriptor";
import RawDataViewer from "../Component/RawDataViewer";
import CraftEssenceDescriptor from "../Descriptor/CraftEssenceDescriptor";
import ServantDescriptor from "../Descriptor/ServantDescriptor";
import SkillVersion from "./Skill/SkillVersion";

interface Event extends React.ChangeEvent<HTMLInputElement> {

}

interface IProps {
    region: Region;
    id: number;
}

interface IState {
    error?: AxiosError;
    loading: boolean;
    skill?: Skill;
    levels: number;
    level: number;
}

class SkillPage extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);

        this.state = {
            loading: true,
            levels: 1,
            level: 1
        };
    }

    componentDidMount() {
        this.loadSkill();
    }

    async loadSkill() {
        try {
            const skill = await Connection.skill(this.props.region, this.props.id);

            this.setState({
                loading: false,
                skill: skill,
                levels: skill.functions[0].svals?.length ?? 1,
            });
        } catch (e) {
            this.setState({
                error: e
            });
        }
    }

    private changeLevel(level: number) {
        this.setState({
            level: level
        });
    }

    render() {
        if (this.state.error)
            return <ErrorStatus error={this.state.error}/>;

        if (this.state.loading || !this.state.skill)
            return <Loading/>;

        const skill = this.state.skill;

        return (
            <div>
                <h1>
                    <BuffIcon location={skill.icon} height={48}/>
                    &nbsp;
                    {skill.name}
                </h1>

                <br/>

                <DataTable data={{
                    "Data": <RawDataViewer data={skill}/>,
                    "Raw": <RawDataViewer data={`https://api.atlasacademy.io/raw/${this.props.region}/skill/${skill.id}?expand=true`}/>,
                    "ID": skill.id,
                    "Name": skill.name,
                    "Detail": skill.detail,
                    "Owner": (
                        <div>
                            {skill.reverseServants
                                .filter(entity => {
                                    return entity.type === EntityType.NORMAL
                                        || entity.type === EntityType.HEROINE
                                        || entity.type === EntityType.SERVANT_EQUIP;
                                })
                                .map((entity, index) => {
                                    if (entity.type === EntityType.SERVANT_EQUIP) {
                                        return (
                                            <div key={index}>
                                                <CraftEssenceDescriptor region={this.props.region}
                                                                        craftEssence={entity as CraftEssence}/>
                                            </div>
                                        );
                                    } else {
                                        return (
                                            <div key={index}>
                                                <ServantDescriptor region={this.props.region}
                                                                   servant={entity as Servant}
                                                                   iconHeight={24}/>
                                            </div>
                                        );
                                    }
                                })
                            }
                            {skill.reverseMC
                                .map((mysticCode, index) => {
                                    return (
                                        <MysticCodeDescriptor key={index}
                                                              region={this.props.region}
                                                              mysticCode={mysticCode}/>
                                    );
                                })
                            }
                        </div>
                    )
                }}/>

                <br/>
                <Form inline style={{justifyContent: 'center'}}>
                    <Form.Control as={'select'} value={this.state.level}
                                  onChange={(ev: Event) => this.changeLevel(parseInt(ev.target.value))}>
                        {Array.from(Array(this.state.levels).keys()).map(i => i + 1).map(level => (
                            <option key={level} value={level}>LEVEL {level}</option>
                        ))}
                    </Form.Control>
                </Form>

                <br/>
                <SkillVersion region={this.props.region}
                              skill={skill}
                              level={this.state.level}/>
            </div>
        );
    }
}

export default SkillPage;
