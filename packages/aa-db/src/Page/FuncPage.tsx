import React from "react";
import Connection from "../Api/Connection";
import Func from "../Api/Data/Func";
import Loading from "../Component/Loading";

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

        return (
            <div>
                <h1>Function: {this.props.id}</h1>
                <br/>


            </div>
        );
    }
}

export default FuncPage;
