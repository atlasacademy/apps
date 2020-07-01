import React from "react";
import Connection from "../Api/Connection";
import Quest from "../Api/Data/Quest";
import DataTable from "../Component/DataTable";
import Loading from "../Component/Loading";
import RawDataViewer from "../Component/RawDataViewer";

interface IProps {
    id: number;
    phase: number;
}

interface IState {
    loading: boolean;
    quest?: Quest;
}

class QuestPage extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);

        this.state = {
            loading: true
        };
    }

    componentDidMount() {
        this.loadQuest();
    }

    async loadQuest() {
        const quest = await Connection.quest(this.props.id, this.props.phase);

        this.setState({
            loading: false,
            quest: quest,
        });
    }

    render() {
        if (this.state.loading || !this.state.quest)
            return <Loading/>;

        const quest = this.state.quest;

        return (
            <div>
                <h1>{quest.name}</h1>

                <br/>

                <DataTable data={{
                    "Raw": <RawDataViewer data={quest}/>,
                    "ID": quest.id,
                    "Phase": quest.phase,
                    "Name": quest.name,
                    "Type": quest.type,
                }}/>
            </div>
        );
    }
}

export default QuestPage;
