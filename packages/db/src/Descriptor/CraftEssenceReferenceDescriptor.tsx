import React from "react";
import { Link } from "react-router-dom";

import { CraftEssence, Region } from "@atlasacademy/api-connector";

import Api from "../Api";
import { BasicCraftEssenceDescriptor } from "./CraftEssenceDescriptor";

interface IProps {
    region: Region;
    id: number;
}

interface IState {
    craftEssence?: CraftEssence.CraftEssenceBasic;
}

class CraftEssenceReferenceDescriptor extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);

        this.state = {};
    }

    async componentDidMount() {
        Api.craftEssenceBasic(this.props.id).then((craftEssence) => this.setState({ craftEssence }));
    }

    render() {
        const route = `/${this.props.region}/craft-essence/${this.props.id}`;

        if (this.state.craftEssence === undefined) {
            return <Link to={route}>[Craft Essence: {this.props.id}]</Link>;
        }

        return <BasicCraftEssenceDescriptor region={this.props.region} craftEssence={this.state.craftEssence} />;
    }
}

export default CraftEssenceReferenceDescriptor;
