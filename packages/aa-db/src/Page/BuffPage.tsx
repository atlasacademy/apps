import React from "react";
import Connection from "../Api/Connection";
import Buff from "../Api/Data/Buff";
import BuffIcon from "../Component/BuffIcon";
import DataTable from "../Component/DataTable";
import Loading from "../Component/Loading";
import {joinElements} from "../Helper/ArrayHelper";

interface IProps {
    id: number;
}

interface IState {
    loading: boolean;
    buff?: Buff;
}

class BuffPage extends React.Component<IProps, IState>{
    constructor(props:IProps) {
        super(props);

        this.state = {
            loading: true,
        };
    }

    componentDidMount() {
        this.loadBuff();
    }

    async loadBuff() {
        const buff = await Connection.buff(this.props.id);

        this.setState({
            loading: false,
            buff: buff,
        });
    }

    render() {
        if (this.state.loading || !this.state.buff)
            return <Loading/>;

        const buff = this.state.buff;

        return (
            <div>
                <h1>
                    <BuffIcon location={buff.icon} height={48}/>
                    &nbsp;
                    {buff.name}
                </h1>

                <br/>

                <DataTable data={{
                    "ID": buff.id,
                    "Name": buff.name,
                    "Detail": buff.detail,
                    "Type": buff.type,
                    "Gained Traits": (
                        <div>
                            {joinElements(buff.vals.map(trait => trait.name), ', ')}
                        </div>
                    ),
                }}/>
            </div>
        );
    }
}

export default BuffPage;
