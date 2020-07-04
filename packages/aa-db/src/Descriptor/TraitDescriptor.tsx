import React from "react";
import Connection from "../Api/Connection";
import Region from "../Api/Data/Region";
import Trait from "../Api/Data/Trait";

const traitDescriptions = new Map<number, string>([
    [202, "Human Attribute"],
    [1000, "Servant"],
    [2019, "Demonic"],
    [3005, "Debuff"],
    [3007, "Buff:Defensive"],
    [3015, "Burn"],
    [4001, "Arts Card"],
]);

interface IProps {
    region: Region;
    trait: Trait | number;
}

interface IState {
    id: number;
    trait?: Trait;
}

class TraitDescriptor extends React.Component<IProps, IState> {
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

    private getDescription() : string {
        let description;

        description = traitDescriptions.get(this.state.id);
        if (description) {
            return description;
        }

        if (this.state.trait && this.state.trait.name !== 'unknown')
            return this.state.trait.name;

        return `unknown(${this.state.id})`;
    }

    render() {
        return (
            <span>
                [{this.getDescription()}]
            </span>
        );
    }
}

export default TraitDescriptor;
