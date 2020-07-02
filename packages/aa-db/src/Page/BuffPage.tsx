import {faShare} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import React from "react";
import {Link} from "react-router-dom";
import Connection from "../Api/Connection";
import Buff from "../Api/Data/Buff";
import Region from "../Api/Data/Region";
import BuffIcon from "../Component/BuffIcon";
import DataTable from "../Component/DataTable";
import Loading from "../Component/Loading";
import RawDataViewer from "../Component/RawDataViewer";
import {describeFunc} from "../Helper/FuncHelper";
import {joinElements} from "../Helper/OutputHelper";

interface IProps {
    region: Region;
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
        const buff = await Connection.buff(this.props.region, this.props.id);

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
                    "Raw": <RawDataViewer data={buff}/>,
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

                <h3>Related Functions</h3>
                {buff.reverseFunctions.map((func, index) => {
                    return (
                        <p key={index}>
                            {describeFunc(this.props.region, func)}
                            &nbsp;
                            <Link to={`/${this.props.region}/func/${func.funcId}`}>
                                <FontAwesomeIcon icon={faShare}/>
                            </Link>
                        </p>
                    )
                })}
            </div>
        );
    }
}

export default BuffPage;
