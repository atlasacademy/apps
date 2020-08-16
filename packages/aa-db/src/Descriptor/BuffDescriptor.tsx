import {Buff, Region} from "@atlasacademy/api-connector";
import React from "react";
import {Link} from "react-router-dom";
import BuffIcon from "../Component/BuffIcon";
import {joinElements, mergeElements} from "../Helper/OutputHelper";
import TraitDescription from "./TraitDescription";

export const upDownBuffs: { up?: Buff.BuffType, down?: Buff.BuffType, description: string }[] = [
    {up: Buff.BuffType.ADD_MAXHP, down: Buff.BuffType.SUB_MAXHP, description: "Max HP"},
    {up: Buff.BuffType.UP_ATK, down: Buff.BuffType.DOWN_ATK, description: "ATK"},
    {up: Buff.BuffType.UP_CHAGETD, down: undefined, description: "Overcharge"},
    {up: Buff.BuffType.UP_COMMANDATK, down: Buff.BuffType.DOWN_COMMANDATK, description: "ATK"},
    {up: Buff.BuffType.UP_CRITICALDAMAGE, down: Buff.BuffType.DOWN_CRITICALDAMAGE, description: "Critical Damage"},
    {up: Buff.BuffType.UP_CRITICALPOINT, down: Buff.BuffType.DOWN_CRITICALPOINT, description: "Star Drop Rate"},
    {up: Buff.BuffType.UP_CRITICALRATE, down: Buff.BuffType.DOWN_CRITICALRATE, description: "Critical Rate"},
    {
        up: Buff.BuffType.UP_CRITICAL_RATE_DAMAGE_TAKEN,
        down: Buff.BuffType.DOWN_CRITICAL_RATE_DAMAGE_TAKEN,
        description: "Critical Rate Taken"
    },
    {up: Buff.BuffType.UP_DAMAGE, down: Buff.BuffType.DOWN_DAMAGE, description: "SP.DMG"},
    {up: Buff.BuffType.UP_DAMAGEDROPNP, down: Buff.BuffType.DOWN_DAMAGEDROPNP, description: "NP Gain When Damaged"},
    {up: Buff.BuffType.UP_DEFENCE, down: Buff.BuffType.DOWN_DEFENCE, description: "DEF"},
    {up: Buff.BuffType.UP_DEFENCECOMMANDALL, down: Buff.BuffType.DOWN_DEFENCECOMMANDALL, description: "Resistance"},
    {up: Buff.BuffType.UP_DROPNP, down: Buff.BuffType.DOWN_DROPNP, description: "NP Gain"},
    {up: Buff.BuffType.UP_FUNC_HP_REDUCE, down: Buff.BuffType.DOWN_FUNC_HP_REDUCE, description: "DoT Effectiveness"},
    {up: Buff.BuffType.UP_GRANT_INSTANTDEATH, down: Buff.BuffType.DOWN_GRANT_INSTANTDEATH, description: "Death Chance"},
    {up: Buff.BuffType.UP_GRANTSTATE, down: Buff.BuffType.DOWN_GRANTSTATE, description: "Buff Chance"},
    {up: undefined, down: Buff.BuffType.UP_NONRESIST_INSTANTDEATH, description: "Death Resist"},
    {up: Buff.BuffType.UP_NPDAMAGE, down: Buff.BuffType.DOWN_NPDAMAGE, description: "NP Damage"},
    {up: Buff.BuffType.UP_SPECIALDEFENCE, down: Buff.BuffType.DOWN_SPECIALDEFENCE, description: "SP.DEF"},
    {up: Buff.BuffType.UP_STARWEIGHT, down: Buff.BuffType.DOWN_STARWEIGHT, description: "Star Weight"},
    {up: Buff.BuffType.UP_TOLERANCE, down: Buff.BuffType.DOWN_TOLERANCE, description: "Debuff Resist"},
    {
        up: Buff.BuffType.UP_TOLERANCE_SUBSTATE,
        down: Buff.BuffType.DOWN_TOLERANCE_SUBSTATE,
        description: "Buff Removal Resist"
    },
];

export const traitDescriptions = new Map<number, string>([
    [3012, 'Charm'],
    [3015, 'Burn'],
    [3026, 'Curse'],
    [3045, 'Stun'],
]);

export const typeDescriptions = new Map<Buff.BuffType, string>([
    [Buff.BuffType.AVOID_INSTANTDEATH, 'Immune to Death'],
    [Buff.BuffType.AVOID_STATE, 'Immunity'],
    [Buff.BuffType.ADD_DAMAGE, 'Damage Plus'],
    [Buff.BuffType.ADD_INDIVIDUALITY, 'Add Trait'],
    [Buff.BuffType.AVOIDANCE, 'Evade'],
    [Buff.BuffType.CHANGE_COMMAND_CARD_TYPE, 'Change Command Card Types'],
    [Buff.BuffType.COMMANDCODEATTACK_FUNCTION, 'Command Code Effect'],
    [Buff.BuffType.BREAK_AVOIDANCE, 'Sure Hit'],
    [Buff.BuffType.DELAY_FUNCTION, 'Trigger Skill after Duration'],
    [Buff.BuffType.DONOT_NOBLE, 'NP Seal'],
    [Buff.BuffType.DONOT_NOBLE_COND_MISMATCH, 'NP Block if Condition Failed'],
    [Buff.BuffType.DONOT_RECOVERY, 'Recovery Disabled'],
    [Buff.BuffType.DONOT_SELECT_COMMANDCARD, 'Do Not Shuffle In Cards'],
    [Buff.BuffType.DONOT_SKILL, 'Skill Seal'],
    [Buff.BuffType.FIELD_INDIVIDUALITY, 'Change Field Type'],
    [Buff.BuffType.FIX_COMMANDCARD, 'Freeze Command Cards'],
    [Buff.BuffType.GUTS, 'Guts'],
    [Buff.BuffType.GUTS_FUNCTION, 'Trigger Skill on Guts'],
    [Buff.BuffType.INVINCIBLE, 'Invincible'],
    [Buff.BuffType.MULTIATTACK, 'Multiple Hits'],
    [Buff.BuffType.PIERCE_INVINCIBLE, 'Ignore Invincible'],
    [Buff.BuffType.REGAIN_HP, 'HP Per Turn'],
    [Buff.BuffType.REGAIN_NP, 'NP Per Turn'],
    [Buff.BuffType.REGAIN_STAR, 'Stars Per Turn'],
    [Buff.BuffType.SELFTURNEND_FUNCTION, 'Trigger Skill every Turn'],
    [Buff.BuffType.SPECIAL_INVINCIBLE, 'Special invincible'],
    [Buff.BuffType.SUB_SELFDAMAGE, 'Damage Cut'],
    [Buff.BuffType.TD_TYPE_CHANGE, 'Change Noble Phantasm'],
    [Buff.BuffType.TD_TYPE_CHANGE_ARTS, 'Set Noble Phantasm: Arts'],
    [Buff.BuffType.TD_TYPE_CHANGE_BUSTER, 'Set Noble Phantasm: Buster'],
    [Buff.BuffType.TD_TYPE_CHANGE_QUICK, 'Set Noble Phantasm: Quick'],
    [Buff.BuffType.UP_HATE, 'Taunt'],
]);

interface IProps {
    region: Region;
    buff: Buff.Buff;
}

class BuffDescriptor extends React.Component<IProps> {
    private getTraitFilterAppend(): JSX.Element | undefined {
        if (!this.getTraitFilters())
            return undefined;

        return <React.Fragment> for {this.getTraitFilters()}</React.Fragment>;
    }

    private getTraitFilterAppendWithoutCards(): JSX.Element | undefined {
        const traits = this.props.buff.ckSelfIndv.filter(
            trait => [4001, 4002, 4003, 4004].indexOf(trait.id) === -1
        );

        if (!traits.length)
            return undefined;

        return (
            <React.Fragment>
                {' '}
                for
                {' '}
                {joinElements(
                    traits.map(
                        trait => <TraitDescription region={this.props.region} trait={trait}/>
                    ),
                    ' & '
                )}
            </React.Fragment>
        );
    }

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
                        return <TraitDescription region={this.props.region} trait={trait}/>;
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
                {mergeElements(
                    this.props.buff.ckSelfIndv.map(
                        trait => <TraitDescription region={this.props.region} trait={trait}/>
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
            description = <React.Fragment>
                {this.getUpDownDescription()}
                {this.getTraitFilterAppend()}
            </React.Fragment>
        } else if (buff.type === Buff.BuffType.UP_COMMANDALL) {
            description = <React.Fragment>
                {this.getCommandCardTypes()} Up
                {this.getTraitFilterAppendWithoutCards()}
            </React.Fragment>
        } else if (buff.type === Buff.BuffType.DOWN_COMMANDALL) {
            description = <React.Fragment>
                {this.getCommandCardTypes()} Down
                {this.getTraitFilterAppendWithoutCards()}
            </React.Fragment>
        } else if (buff.type === Buff.BuffType.ATTACK_FUNCTION) {
            description = <React.Fragment>
                Trigger Skill on {this.getTraitFilters()} attacks
            </React.Fragment>;
        } else if (buff.type === Buff.BuffType.COMMANDATTACK_FUNCTION) {
            description = <React.Fragment>
                Trigger Skill on {this.getTraitFilters()} cards
            </React.Fragment>;
        } else if (buff.type === Buff.BuffType.COMMANDATTACK_BEFORE_FUNCTION) {
            description = <React.Fragment>
                Trigger Skill before {this.getTraitFilters()} cards
            </React.Fragment>;
        } else if (buff.type === Buff.BuffType.DAMAGE_FUNCTION) {
            description = <React.Fragment>
                Trigger Skill on receiving {this.getTraitFilters()} attacks
            </React.Fragment>;
        } else if (buff.type === Buff.BuffType.DEAD_FUNCTION) {
            description = <React.Fragment>
                Trigger Skill on death
                {this.getTraitFilterAppend()}
            </React.Fragment>;
        } else if (buff.type === Buff.BuffType.NPATTACK_PREV_BUFF) {
            description = <React.Fragment>
                Trigger Skill on {this.getTraitFilters()} NP
            </React.Fragment>;
        } else if (this.hasTypeDescription()) {
            description = <React.Fragment>
                {this.getTypeDescription()}
                {this.getTraitFilterAppend()}
            </React.Fragment>;
        } else if (this.hasTraitDescription()) {
            description = <React.Fragment>
                {this.getTraitDescription()}
                {this.getTraitFilterAppend()}
            </React.Fragment>;
        }

        return (
            <Link to={`/${this.props.region}/buff/${buff.id}`}>
                [
                {buff.icon ? <BuffIcon location={buff.icon}/> : undefined}
                {buff.icon ? ' ' : undefined}
                {description}
                {this.getEffectiveTargetsDescriptions()}
                ]
            </Link>
        );
    }
}

export default BuffDescriptor;
