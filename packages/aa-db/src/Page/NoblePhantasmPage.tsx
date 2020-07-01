import React from "react";
import Connection from "../Api/Connection";
import NoblePhantasm from "../Api/Data/NoblePhantasm";
import DataTable from "../Component/DataTable";
import Loading from "../Component/Loading";
import RawDataViewer from "../Component/RawDataViewer";

interface IProps {
    id: number;
}

interface IState {
    loading: boolean;
    noblePhantasm?: NoblePhantasm;
}

class NoblePhantasmPage extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);

        this.state = {
            loading: true
        };
    }

    componentDidMount() {
        this.loadNp();
    }

    async loadNp() {
        const noblePhantasm = await Connection.noblePhantasm(this.props.id);

        this.setState({
            loading: false,
            noblePhantasm: noblePhantasm,
        });
    }

    render() {
        if (this.state.loading || !this.state.noblePhantasm)
            return <Loading/>;

        const noblePhantasm = this.state.noblePhantasm;

        return (
            <div>
                <h1>{noblePhantasm.name}</h1>
                <br/>

                <DataTable data={{
                    "Raw": <RawDataViewer data={noblePhantasm}/>,
                    "ID": noblePhantasm.id,
                    "Name": noblePhantasm.name,
                    "Type": noblePhantasm.type,
                    "Rank": noblePhantasm.rank,
                    "Detail": noblePhantasm.detail,
                    "Card Type": noblePhantasm.card,
                }}/>
            </div>
        );
    }
}

export default NoblePhantasmPage;
