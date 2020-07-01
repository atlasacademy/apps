import React from "react";
import {Form} from "react-bootstrap";
import Connection from "../Api/Connection";
import Region from "../Api/Data/Region";
import Skill from "../Api/Data/Skill";
import BuffIcon from "../Component/BuffIcon";
import DataTable from "../Component/DataTable";
import Loading from "../Component/Loading";
import RawDataViewer from "../Component/RawDataViewer";
import SkillVersion from "./Skill/SkillVersion";

interface Event extends React.ChangeEvent<HTMLInputElement> {

}

interface IProps {
    region: Region;
    id: number;
}

interface IState {
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
        const skill = await Connection.skill(this.props.region, this.props.id);

        this.setState({
            loading: false,
            skill: skill,
            levels: skill.functions[0].svals.length ?? 1,
        });
    }

    private changeLevel(level: number) {
        this.setState({
            level: level
        });
    }

    render() {
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
                    "Raw": <RawDataViewer data={skill}/>,
                    "ID": skill.id,
                    "Name": skill.name,
                    "Detail": skill.detail,
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
