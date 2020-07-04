import React from "react";
import {Link} from "react-router-dom";
import Buff, {BuffType} from "../Api/Data/Buff";
import Region from "../Api/Data/Region";
import BuffIcon from "../Component/BuffIcon";
import {joinElements} from "../Helper/OutputHelper";
import TraitDescriptor from "./TraitDescriptor";

const upDownBuffs: { up?: BuffType, down?: BuffType, description: string }[] = [
    {up: BuffType.UP_ATK, down: BuffType.DOWN_ATK, description: "ATK"},
    {up: BuffType.UP_CHAGETD, down: undefined, description: "Overcharge"},
    {up: BuffType.UP_COMMANDATK, down: BuffType.DOWN_COMMANDATK, description: "ATK"},
    {up: BuffType.UP_CRITICALDAMAGE, down: BuffType.DOWN_CRITICALDAMAGE, description: "Critical"},
    {up: BuffType.UP_CRITICAL_RATE_DAMAGE_TAKEN, down: BuffType.DOWN_CRITICAL_RATE_DAMAGE_TAKEN, description: "Critical Rate Taken"},
    {up: BuffType.UP_DAMAGE, down: BuffType.DOWN_DAMAGE, description: "SP.DMG"},
    {up: BuffType.UP_DEFENCE, down: BuffType.DOWN_DEFENCE, description: "DEF"},
    {up: BuffType.UP_DEFENCECOMMANDALL, down: BuffType.DOWN_DEFENCECOMMANDALL, description: "Resistance"},
    {up: BuffType.UP_DROPNP, down: BuffType.DOWN_DROPNP, description: "NP Gain"},
    {up: BuffType.UP_GRANT_INSTANTDEATH, down: BuffType.DOWN_GRANT_INSTANTDEATH, description: "Death Chance"},
    {up: BuffType.UP_NPDAMAGE, down: BuffType.DOWN_NPDAMAGE, description: "NP Damage"},
    {up: BuffType.UP_STARWEIGHT, down: BuffType.DOWN_STARWEIGHT, description: "Star Weight"},
];

const traitDescriptions = new Map<number, string>([
    [3012, 'Charm'],
    [3015, 'Burn'],
    [3045, 'Stun'],
]);

const typeDescriptions = new Map<BuffType, string>([
    [BuffType.AVOID_INSTANTDEATH, 'Immune to Death'],
    [BuffType.AVOID_STATE, 'Immunity'],
    [BuffType.ADD_DAMAGE, 'Damage Plus'],
    [BuffType.ADD_INDIVIDUALITY, 'Add Trait'],
    [BuffType.AVOIDANCE, 'Evade'],
    [BuffType.BREAK_AVOIDANCE, 'Sure Hit'],
    [BuffType.INVINCIBLE, 'Invincible'],
    [BuffType.REGAIN_HP, 'HP Per Turn'],
    [BuffType.SUB_SELFDAMAGE, 'Damage Cut'],
    [BuffType.UP_HATE, 'Taunt'],
]);

interface IProps {
    region: Region;
    buff: Buff;
}

class BuffDescriptor extends React.Component<IProps> {
    private getCommandCardTypes(): string {
        const cards = [];

        if (this.hasApplicableTrait(4001)) {
            cards.push('Arts');
        }

        if (this.hasApplicableTrait(4002)) {
            cards.push('Buster');
        }

        if (this.hasApplicableTrait(4003)) {
            cards.push('Quick');
        }

        if (this.hasApplicableTrait(4004)) {
            cards.push('Extra');
        }

        if (!cards.length) {
            cards.push('Command Card');
        }

        return cards.join(' & ');
    }

    private getEffectiveTargetsDescriptions(): JSX.Element | undefined {
        const buff = this.props.buff;

        if (!buff.ckOpIndv.length)
            return undefined;

        return (
            <React.Fragment>
                {' vs. '}
                {joinElements(
                    buff.ckOpIndv.map(trait => {
                        return <TraitDescriptor region={this.props.region} trait={trait}/>;
                    }),
                    ' & '
                ).map((element, index) => {
                    return <React.Fragment key={index}>{element}</React.Fragment>;
                })}
            </React.Fragment>
        );
    }

    private getTraitDescription(): string {
        const buff = this.props.buff,
            traitIds = buff.vals.map(trait => trait.id);

        for (let x in traitIds) {
            const traitId = traitIds[x],
                description = traitDescriptions.get(traitId);

            if (description !== undefined)
                return description;
        }

        return "";
    }

    private getTraitFilters(): JSX.Element | undefined {
        if (!this.props.buff.ckSelfIndv.length)
            return undefined;

        return (
            <React.Fragment>
                {joinElements(
                    this.props.buff.ckSelfIndv.map(
                        trait => <TraitDescriptor region={this.props.region} trait={trait}/>
                    ),
                    ' & '
                )}
            </React.Fragment>
        );
    }

    private getTypeDescription(): string {
        const type = this.props.buff.type;

        return typeDescriptions.get(type) ?? "";
    }

    private getUpDownDescription(): string {
        const type = this.props.buff.type;

        for (let x in upDownBuffs) {
            if (upDownBuffs[x].up === type)
                return `${upDownBuffs[x].description} Up`;
            if (upDownBuffs[x].down === type)
                return `${upDownBuffs[x].description} Down`;
        }

        return "";
    }

    private hasApplicableTrait(id: number): boolean {
        const buff = this.props.buff;

        return buff.ckSelfIndv.filter(trait => trait.id === id).length > 0;
    }

    private hasTraitDescription(): boolean {
        const buff = this.props.buff,
            traitIds = buff.vals.map(trait => trait.id);

        for (let x in traitIds) {
            const traitId = traitIds[x],
                description = traitDescriptions.get(traitId);

            if (description !== undefined)
                return true;
        }

        return false;
    }

    private hasTypeDescription(): boolean {
        const buff = this.props.buff;

        return typeDescriptions.has(buff.type);
    }

    private isUpDownBuff(): boolean {
        const type = this.props.buff.type;

        for (let x in upDownBuffs) {
            if (upDownBuffs[x].up === type || upDownBuffs[x].down === type)
                return true;
        }

        return false;
    }

    render() {
        const buff = this.props.buff;

        let description: JSX.Element | string = buff.name;

        if (this.isUpDownBuff()) {
            description = this.getUpDownDescription();
        } else if (buff.type === BuffType.UP_COMMANDALL) {
            description = this.getCommandCardTypes() + ' Up';
        } else if (buff.type === BuffType.DOWN_COMMANDALL) {
            description = this.getCommandCardTypes() + ' Down';
        } else if (buff.type === BuffType.COMMANDATTACK_FUNCTION) {
            description = <React.Fragment>
                Trigger Skill on {this.getTraitFilters()} attacks
            </React.Fragment>;
        } else if (buff.type === BuffType.NPATTACK_PREV_BUFF) {
            description = <React.Fragment>
                Trigger Skill on {this.getTraitFilters()} NP
            </React.Fragment>;
        } else if (this.hasTypeDescription()) {
            description = this.getTypeDescription();
        } else if (this.hasTraitDescription()) {
            description = this.getTraitDescription();
        }

        return (
            <Link to={`/${this.props.region}/buff/${buff.id}`}>
                [
                <BuffIcon location={buff.icon}/>
                {' '}
                {description}
                {this.getEffectiveTargetsDescriptions()}
                ]
            </Link>
        );
    }
}

export default BuffDescriptor;
