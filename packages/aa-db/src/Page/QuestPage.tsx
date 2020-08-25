import {Quest, Region} from "@atlasacademy/api-connector";
import {AxiosError} from "axios";
import React from "react";
import Api from "../Api";
import DataTable from "../Component/DataTable";
import ErrorStatus from "../Component/ErrorStatus";
import Loading from "../Component/Loading";
import RawDataViewer from "../Component/RawDataViewer";
import Manager from "../Setting/Manager";

interface IProps {
    region: Region;
    id: number;
    phase: number;
}

interface IState {
    error?: AxiosError;
    loading: boolean;
    quest?: Quest.QuestPhase;
}

class QuestPage extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);

        this.state = {
            loading: true
        };
    }

    componentDidMount() {
        Manager.setRegion(this.props.region);
        this.loadQuest();
    }

    async loadQuest() {
        try {
            const quest = await Api.questPhase(this.props.id, this.props.phase);

            this.setState({
                loading: false,
                quest: quest,
            });
            document.title = `[${this.props.region}] Quest - ${quest.name} - Atlas Academy DB`;
        } catch (e) {
            this.setState({
                error: e
            });
        }
    }

    render() {
        if (this.state.error)
            return <ErrorStatus error={this.state.error}/>;

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
