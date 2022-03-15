import React from "react";
import { Link } from "react-router-dom";

import { Region, Trait } from "@atlasacademy/api-connector";
import { TraitDescriptor } from "@atlasacademy/api-descriptor";

import Api from "../Api";
import Description from "./Description";

interface IProps {
    region: Region;
    trait: Trait.Trait | number;
    disableLink?: boolean;
    overrideTraits?: Trait.Trait[];
    owner?: "entities" | "funcs" | "buffs" | "noble-phantasms" | "quests";
    ownerParameter?:
        | "trait"
        | "vals"
        | "tvals"
        | "questTvals"
        | "ckSelfIndv"
        | "ckOpIndv"
        | "individuality"
        | "fieldIndividuality"
        | "enemyTrait";
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
        if (this.state.trait) return;

        const traitList = await Api.traitList();

        for (let i = 0; i < traitList.length; i++) {
            const trait = traitList[i];

            if (trait.id === this.state.id) {
                this.setState({ trait });

                return;
            }
        }
    }

    private getDescription(trait: Trait.Trait | number) {
        const descriptor = TraitDescriptor.describe(trait, this.props.overrideTraits);

        return <Description region={this.props.region} descriptor={descriptor} />;
    }

    private getLocation(): string {
        let owner = this.props.owner ?? "entities";
        let ownerParameter = this.props.ownerParameter ?? "trait";
        if (this.state.trait !== undefined) {
            if (this.state.trait.name.startsWith("buff")) {
                owner = "buffs";
                ownerParameter = "vals";
            }
            if (this.state.trait.name.startsWith("enemy")) {
                owner = "quests";
                ownerParameter = "enemyTrait";
            }
            if (this.state.trait.name.startsWith("event")) {
                owner = "quests";
                ownerParameter = "fieldIndividuality";
            }
        }
        return `/${this.props.region}/${owner}?${ownerParameter}=${this.state.id}`;
    }

    render() {
        const trait = this.state.trait ?? this.state.id;

        return this.props.disableLink ? (
            <span>[{this.getDescription(trait)}]</span>
        ) : (
            <Link to={this.getLocation()}>[{this.getDescription(trait)}]</Link>
        );
    }
}

export default TraitDescription;
