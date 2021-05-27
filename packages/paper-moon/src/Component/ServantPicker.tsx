import {Servant} from "@atlasacademy/api-connector";
import React from "react";
import Api from "../Api";

interface Props {

}

interface State {
    servants: Servant.ServantBasic[],
}

export class ServantPicker extends React.Component<Props,State> {

    constructor(props: Props) {
        super(props);

        this.state = {
            servants: [],
        };
    }

    async componentDidMount() {
        this.setState({
            servants: await Api.servantList(60 * 1000),
        });
    }

    render() {
        return (
            <select>
                {this.state.servants.map(servant => (
                    <option key={servant.id}>{servant.collectionNo}: {servant.name}</option>
                ))}
            </select>
        );
    }

}
