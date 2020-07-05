import React from "react";
import Connection from "../Api/Connection";
import Region from "../Api/Data/Region";
import Trait from "../Api/Data/Trait";

const traitDescriptions = new Map<number, string>([
    [1, "Gender:Male"],
    [2, "Gender:Female"],
    [3, "Gender:Unknown"],
    [100, "Class:Saber"],
    [101, "Class:Lancer"],
    [102, "Class:Archer"],
    [103, "Class:Rider"],
    [104, "Class:Caster"],
    [105, "Class:Assassin"],
    [106, "Class:Berserker"],
    [107, "Class:Shielder"],
    [108, "Class:Ruler"],
    [109, "Class:Alter Ego"],
    [110, "Class:Avenger"],
    [111, "Demon Pillar"],
    [112, "Class:Grand Caster"],
    [113, "Beast I"],
    [114, "Beast II"],
    [115, "Class:Moon Cancer"],
    [116, "Beast IIIR"],
    [117, "Class:Foreigner"],
    [118, "Beast IIIL"],
    [119, "Beast Unknown"],
    [200, "Attribute:Sky"],
    [201, "Attribute:Eart"],
    [202, "Attribute:Human"],
    [203, "Attribute:Star"],
    [204, "Attribute:Beast"],
    [300, "Alignment:Lawful"],
    [301, "Alignment:Chaotic"],
    [302, "Alignment:Neutral"],
    [303, "Alignment:Good"],
    [304, "Alignment:Evil"],
    [305, "Alignment:Balanced"],
    [306, "Alignment:Madness"],
    [308, "Alignment:Summer"],
    [1000, "Servant"],
    [1002, "Undead"],
    [1122, "Shadow Servant"],
    [2004, "Roman"],
    [2005, "Beasts"],
    [2019, "Demonic"],
    [2654, "Pseudo-Servant"],
    [3004, "Buff"],
    [3005, "Debuff"],
    [3006, "Buff:Offensive"],
    [3007, "Buff:Defensive"],
    [3011, "Poison"],
    [3012, "Charm"],
    [3015, "Burn"],
    [3026, "Curse"],
    [3047, "Pigify"],
    [4001, "Card:Arts"],
    [4002, "Card:Buster"],
    [4003, "Card:Quick"],
    [4004, "Card:Extra"],
    [4008, "Player Card"],
    [4100, "Critical Hit"],
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
