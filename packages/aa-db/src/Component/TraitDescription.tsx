import React from "react";
import Connection from "../Api/Connection";
import Region from "../Api/Data/Region";
import Trait from "../Api/Data/Trait";

interface IProps {
    region: Region;
    trait: Trait | number;
}

interface IState {
    id: number;
    trait?: Trait;
}

class TraitDescription extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);

        this.state = {
            id: typeof props.trait === "number" ? props.trait : props.trait.id,
            trait: typeof props.trait === "number" ? undefined : props.trait,
        };
    }

    async componentDidMount() {
        if (this.state.trait)
            return;

        const traitMap = await Connection.traitMap(this.props.region);
        if (traitMap[this.state.id] !== undefined)
            this.setState({
                trait: {
                    id: this.state.id,
                    name: traitMap[this.state.id]
                }
            });
    }

    render() {
        return (
            <span>
                [
                {this.state.trait ? this.state.trait.name : 'unknown'}
                {this.state.trait === undefined || this.state.trait.name === 'unknown' ? `(${this.state.id})` : null}
                ]
            </span>
        );
    }
}

export default TraitDescription;
