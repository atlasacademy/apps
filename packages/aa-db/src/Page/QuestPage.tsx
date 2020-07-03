import {AxiosError} from "axios";
import React from "react";
import Connection from "../Api/Connection";
import Quest from "../Api/Data/Quest";
import Region from "../Api/Data/Region";
import DataTable from "../Component/DataTable";
import ErrorStatus from "../Component/ErrorStatus";
import Loading from "../Component/Loading";
import RawDataViewer from "../Component/RawDataViewer";

interface IProps {
    region: Region;
    id: number;
    phase: number;
}

interface IState {
    error?: AxiosError;
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
        try {
            const quest = await Connection.quest(this.props.region, this.props.id, this.props.phase);

            this.setState({
                loading: false,
                quest: quest,
            });
        } catch (e) {
            this.setState({
                error: e
            });
        }
    }

    render() {
        if (this.state.error)
            return <ErrorStatus error={this.state.error} />;

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
