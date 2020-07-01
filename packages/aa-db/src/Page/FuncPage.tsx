import React from "react";
import Connection from "../Api/Connection";
import Func from "../Api/Data/Func";
import BuffIcon from "../Component/BuffIcon";
import DataTable from "../Component/DataTable";
import Loading from "../Component/Loading";
import RawDataViewer from "../Component/RawDataViewer";

interface IProps {
    id: number;
}

interface IState {
    loading: boolean;
    func?: Func;
}

class FuncPage extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);

        this.state = {
            loading: true
        };
    }

    componentDidMount() {
        this.loadFunc();
    }

    async loadFunc() {
        const func = await Connection.func(this.props.id);

        this.setState({
            loading: false,
            func: func,
        });
    }

    render() {
        if (this.state.loading || !this.state.func)
            return <Loading/>;

        const func = this.state.func;

        return (
            <div>
                <h1>
                    {func.funcPopupIcon ? (
                        <span>
                            <BuffIcon location={func.funcPopupIcon} height={48}/>
                            &nbsp;
                        </span>
                    ) : null}
                    Function: {this.props.id}
                </h1>
                <br/>

                <DataTable data={{
                    "Raw": <RawDataViewer data={func}/>,
                    "ID": func.funcId,
                    "Type": func.funcType,
                    "Target": func.funcTargetType,
                    "Affects Players/Enemies": func.funcTargetTeam,
                    "Popup Text": func.funcPopupText,
                }}/>
            </div>
        );
    }
}

export default FuncPage;
