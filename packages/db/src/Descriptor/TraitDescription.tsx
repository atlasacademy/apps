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
    overrideTraits?: Trait.Trait[];
    owner?: "entities" | "funcs" | "buffs" | "noble-phantasms";
    ownerParameter?: "trait" | "vals" | "tvals" | "questTvals" | "ckSelfIndv" | "ckOpIndv" | "individuality";
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

    static renderAsString(trait: Trait.Trait | number): string {
        const descriptor = TraitDescriptor.describe(trait);

        return Description.renderAsString(descriptor);
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
        const descriptor = TraitDescriptor.describe(trait, this.props.overrideTraits);

        return <Description region={this.props.region} descriptor={descriptor}/>;
    }

    private getLocation(): string {
        const owner = this.props.owner ? this.props.owner : "entities";
        const ownerParameter = this.props.ownerParameter ? this.props.ownerParameter : "trait";
        return `/${this.props.region}/${owner}?${ownerParameter}=${this.state.id}`;
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
