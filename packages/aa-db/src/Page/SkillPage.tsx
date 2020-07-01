import React from "react";
import Connection from "../Api/Connection";
import Region from "../Api/Data/Region";
import Skill from "../Api/Data/Skill";
import BuffIcon from "../Component/BuffIcon";
import DataTable from "../Component/DataTable";
import Loading from "../Component/Loading";
import RawDataViewer from "../Component/RawDataViewer";

interface IProps {
    region: Region;
    id: number;
}

interface IState {
    loading: boolean;
    skill?: Skill;
}

class SkillPage extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);

        this.state = {
            loading: true
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
            </div>
        );
    }
}

export default SkillPage;
