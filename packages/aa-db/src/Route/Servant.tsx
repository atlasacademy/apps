import React from "react";
import Loading from "../Component/Loading";

interface IState {
    loading: boolean;
    id: number;
}

class Servant extends React.Component<any, IState> {
    constructor(props: any) {
        super(props);

        this.state = {
            loading: true,
            id: this.props.match.params.id
        };
    }

    render() {
        if (this.state.loading)
            return <Loading/>;

        return (
            <div>

            </div>
        );
    }
}

export default Servant;
