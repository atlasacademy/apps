import {Region, Trait} from "@atlasacademy/api-connector";
import {TraitDescriptor} from "@atlasacademy/api-descriptor";
import React from "react";
import {Link} from "react-router-dom";
import Api from "../Api";
import Description from "./Description";

interface IProps {
    region: Region;
    trait: Trait.Trait | number;
    disableLink?: boolean;
}

interface IState {
    id: number;
    trait?: Trait.Trait;
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

        const traitList = await Api.traitList();

        for (let i = 0; i < traitList.length; i++) {
            const trait = traitList[i];

            if (trait.id === this.state.id) {
                this.setState({trait});

                return;
            }
        }
    }

    private getDescription(trait: Trait.Trait | number) {
        const descriptor = TraitDescriptor.describe(trait);

        return <Description region={this.props.region} descriptor={descriptor}/>;
    }

    private getLocation(): string {
        return `/${this.props.region}/entities/trait/${this.state.id}`;
    }

    render() {
        const trait = this.state.trait ?? this.state.id;

        return (
            this.props.disableLink
                ? <span>[{this.getDescription(trait)}]</span>
                : <Link to={this.getLocation()}>[{this.getDescription(trait)}]</Link>
        );
    }
}

export default TraitDescription;
