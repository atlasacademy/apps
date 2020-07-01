import React from "react";
import {Tab, Tabs} from "react-bootstrap";
import Connection from "../Api/Connection";
import NoblePhantasm from "../Api/Data/NoblePhantasm";
import Region from "../Api/Data/Region";
import DataTable from "../Component/DataTable";
import Loading from "../Component/Loading";
import RawDataViewer from "../Component/RawDataViewer";
import NoblePhantasmVersion from "./NoblePhantasm/NoblePhantasmVersion";

interface IProps {
    region: Region;
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
        const noblePhantasm = await Connection.noblePhantasm(this.props.region, this.props.id);

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

                <Tabs id={'np-tabs'} defaultActiveKey={'n1o1'} transition={false}>
                    {[1, 2, 3, 4, 5].map(level => {
                        return [1, 2, 3, 4, 5].map(overcharge => {
                            const key = `n${level}o${overcharge}`,
                                title = `NP${level}-OC${overcharge}`;

                            return (
                                <Tab key={key} eventKey={key} title={title}>
                                    <br/>
                                    <NoblePhantasmVersion region={this.props.region}
                                                          noblePhantasm={noblePhantasm}
                                                          level={level}
                                                          overcharge={overcharge}/>
                                </Tab>
                            );
                        });
                    })}
                </Tabs>
            </div>
        );
    }
}

export default NoblePhantasmPage;
