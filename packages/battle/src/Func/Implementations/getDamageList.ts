import {Buff, Card, ClassName, Constant, Func} from "@atlasacademy/api-connector";
import {BattleAttackAction} from "../../Action/BattleAttackAction";
import {BattleActor} from "../../Actor/BattleActor";
import {Battle} from "../../Battle";
import {BattleBuff} from "../../Buff/BattleBuff";
import {BattleTeam} from "../../Enum/BattleTeam";
import BattleEvent from "../../Event/BattleEvent";
import GameConstantManager from "../../Game/GameConstantManager";
import {Variable} from "../../Game/Variable";
import BattleNoblePhantasmFunc from "../../NoblePhantasm/BattleNoblePhantasmFunc";

function attackMagnification(attack: BattleAttackAction,
                             actor: BattleActor,
                             target: BattleActor,
                             func?: BattleNoblePhantasmFunc): Variable {
    const attackUpValue = actor.netBuffsByGroup(Buff.BuffAction.ATK, attack, target, true),
        defensePierceBuffs = actor.buffsByGroup(Buff.BuffAction.PIERCE_DEFENCE),
        defensePierce = defensePierceBuffs.length || func?.props.func.funcType === Func.FuncType.DAMAGE_NP_PIERCE,
        defenseGroup = defensePierce ? Buff.BuffAction.DEFENCE_PIERCE : Buff.BuffAction.DEFENCE,
        defenseUpValue = target.netBuffsByGroup(defenseGroup, attack, actor, false),
        attackUp = Variable.float(attackUpValue).divide(Variable.float(1000)),
        defenseUp = Variable.float(defenseUpValue).divide(Variable.float(1000));

    let magnification = Variable.float(1).add(attackUp).subtract(defenseUp);
    if (magnification.value() < 0)
        magnification = Variable.float(0);

    return magnification;
}

function attributeAffinityRate(actor: BattleActor, target: BattleActor): Variable {
    let affinity = GameConstantManager.attributeAffinity(actor.attribute(), target.attribute());
    if (affinity === undefined)
        affinity = 1000;

    return Variable.float(affinity).divide(Variable.float(1000));
}

function classAttackRate(className: ClassName): Variable {
    const attackValue = GameConstantManager.classAttack(className);
    if (attackValue === undefined)
        throw Error('FAILED TO GET CLASS ATTACK RATE.');

    let attackRate = Variable.float(attackValue);
    attackRate = attackRate.divide(Variable.float(1000));

    return attackRate;
}

function classAffinityOverrideRate(affinity: number,
                                   attack: BattleAttackAction,
                                   actor: BattleActor,
                                   target: BattleActor,
                                   attacking: boolean): number {
    let attackerClass = actor.className(attack, target, true),
        defenderClass = target.className(attack, actor, false),
        overrideBuffs: BattleBuff[];

    if (attacking) {
        overrideBuffs = actor.buffsByGroup(Buff.BuffAction.OVERWRITE_CLASS_RELATION, attack, target, true);
    } else {
        overrideBuffs = target.buffsByGroup(Buff.BuffAction.OVERWRITE_CLASS_RELATION, attack, actor, false);
    }

    overrideBuffs.forEach(buff => {
        let relationOverwrite = buff.props.buff.script.relationId;

        if (relationOverwrite) {
            let relationMap = attacking ? relationOverwrite.atkSide : relationOverwrite.defSide;

            if (relationMap[attackerClass] && relationMap[attackerClass][defenderClass]) {
                const type = relationMap[attackerClass][defenderClass].type,
                    value = relationMap[attackerClass][defenderClass].damageRate;

                switch (type) {
                    case Buff.ClassRelationOverwriteType.OVERWRITE_FORCE:
                        affinity = value;
                        break;
                    case Buff.ClassRelationOverwriteType.OVERWRITE_MORE_THAN_TARGET:
                        affinity = Math.min(affinity, value);
                        break;
                    case Buff.ClassRelationOverwriteType.OVERWRITE_LESS_THAN_TARGET:
                        affinity = Math.max(affinity, value);
                        break;
                }
            }
        }
    });

    return affinity;
}

function classAffinityRate(attack: BattleAttackAction, actor: BattleActor, target: BattleActor): Variable {
    let attackerClass = actor.className(attack, target, true),
        defenderClass = target.className(attack, actor, false),
        affinity = GameConstantManager.classAffinity(attackerClass, defenderClass);

    if (affinity === undefined)
        affinity = 1000;

    // Choosing to ignore old OVERWRITE_CLASSRELATIO_ATK and OVERWRITE_CLASSRELATIO_DEF.
    // This implementation has been phased out and there are no buffs that use this type.

    affinity = classAffinityOverrideRate(affinity, attack, actor, target, true);
    affinity = classAffinityOverrideRate(affinity, attack, actor, target, false);

    return Variable.float(affinity).divide(Variable.float(1000));
}

function commandCardAttack(battle: Battle,
                           attack: BattleAttackAction,
                           actor: BattleActor,
                           target: BattleActor): Variable {
    const cardConstant = GameConstantManager.cardConstants(attack.card, attack.np ? 1 : attack.num);
    if (!cardConstant) {
        throw new Error('FAILED TO FIND CARD CONSTANT');
    }

    let cardBaseValue = 0;
    if (actor.props.team === BattleTeam.ENEMY) {
        switch (attack.card) {
            case Card.ARTS:
                cardBaseValue = GameConstantManager.getValue(Constant.Constant.ENEMY_ATTACK_RATE_ARTS);
                break;
            case Card.QUICK:
                cardBaseValue = GameConstantManager.getValue(Constant.Constant.ENEMY_ATTACK_RATE_QUICK);
                break;
            case Card.BUSTER:
                cardBaseValue = GameConstantManager.getValue(Constant.Constant.ENEMY_ATTACK_RATE_BUSTER);
                break;
            default:
                cardBaseValue = cardConstant.adjustAtk;
        }
    } else {
        cardBaseValue = cardConstant.adjustAtk;
    }

    let cardBase = Variable.float(cardBaseValue).divide(Variable.float(1000)),
        cardBonus = Variable.float(1),
        cardAdd = Variable.float(cardConstant.addAtk);

    cardBonus = cardBonus.add(Variable.float(actor.state.buffs.netBuffsRate(
        Buff.BuffAction.COMMAND_ATK,
        actor.traits(attack),
        target.traits()
    )));

    cardBonus = cardBonus.subtract(Variable.float(actor.state.buffs.netBuffsRate(
        Buff.BuffAction.COMMAND_DEF,
        actor.traits(),
        target.traits(attack)
    )));

    if (cardBonus.value() < 0)
        cardBonus = Variable.float(0);

    cardAdd = cardAdd.divide(Variable.float(1000));

    return cardBase.multiply(cardBonus).add(cardAdd);
}

function criticalMagnification(attack: BattleAttackAction, actor: BattleActor, target: BattleActor): Variable {
    const value = actor.buffs().netBuffs(Buff.BuffAction.CRITICAL_DAMAGE, actor.traits(attack), target.traits());

    return Variable.float(value).divide(Variable.float(1000));
}

function npDamageBonus(actor: BattleActor,
                       func: BattleNoblePhantasmFunc): Variable {
    let bonus = Variable.float(0);

    if (func.props.func.funcType === Func.FuncType.DAMAGE_NP_HPRATIO_HIGH) {
        bonus = Variable.float(func.state.dataVal.Target ?? 0);

        let ratio = Variable.float(actor.state.health);
        ratio = ratio.divide(Variable.float(actor.state.maxHealth));

        bonus = bonus.multiply(ratio);
    } else if (func.props.func.funcType === Func.FuncType.DAMAGE_NP_HPRATIO_LOW) {
        bonus = Variable.float(func.state.dataVal.Target ?? 0);

        let ratio = Variable.float(actor.state.health);
        ratio = ratio.divide(Variable.float(actor.state.maxHealth));
        ratio = Variable.float(1).subtract(ratio);

        bonus = bonus.multiply(ratio);
    }

    return bonus;
}

function npMagnification(attack: BattleAttackAction, actor: BattleActor, target: BattleActor): Variable {
    const value = actor.buffs().netBuffs(Buff.BuffAction.NPDAMAGE, actor.traits(attack), target.traits());

    return Variable.float(value).divide(Variable.float(1000));
}

function powerMagnification(attack: BattleAttackAction, actor: BattleActor, target: BattleActor): Variable {
    let magnification = Variable.int(0);

    // target traits
    magnification = magnification.add(Variable.int(actor.buffs().netBuffs(
        Buff.BuffAction.DAMAGE,
        actor.traits(attack),
        target.traits()
    )));

    // target passive traits
    magnification = magnification.add(Variable.int(actor.buffs().netBuffs(
        Buff.BuffAction.DAMAGE_INDIVIDUALITY,
        actor.traits(attack),
        target.buffTraits(true)
    )));

    // target active traits
    magnification = magnification.add(Variable.int(actor.buffs().netBuffs(
        Buff.BuffAction.DAMAGE_INDIVIDUALITY_ACTIVEONLY,
        actor.traits(attack),
        target.buffTraits(false)
    )));

    // target active traits
    magnification = magnification.add(Variable.int(actor.buffs().netBuffs(
        Buff.BuffAction.DAMAGE_EVENT_POINT,
        actor.traits(attack),
        target.buffTraits(false)
    )));

    return Variable
        .float(magnification.value())
        .divide(Variable.float(1000));
}

async function randomAttack(battle: Battle): Promise<Variable> {
    const random = await battle.random().generate(
        GameConstantManager.getValue(Constant.Constant.ATTACK_RATE_RANDOM_MIN),
        GameConstantManager.getValue(Constant.Constant.ATTACK_RATE_RANDOM_MAX),
        'ATTACK RANDOM RANGE'
    );

    return Variable.float(random).divide(Variable.float(1000));
}

function selfDamageMagnification(attack: BattleAttackAction, actor: BattleActor, target: BattleActor): Variable {
    const value = target.buffs().netBuffs(Buff.BuffAction.SELFDAMAGE, target.traits(), actor.traits(attack));

    return Variable.float(value).divide(Variable.float(1000));
}

function specialDefence(attack: BattleAttackAction, actor: BattleActor, target: BattleActor): Variable {
    const value = target.netBuffsByGroup(Buff.BuffAction.SPECIALDEFENCE, attack, actor, false);

    let defence = Variable.float(value).divide(Variable.float(1000));
    defence = Variable.float(1).subtract(defence);
    if (defence.value() < 0)
        defence = Variable.float(0);

    return defence;
}

async function getDamageList(battle: Battle,
                             attack: BattleAttackAction,
                             actor: BattleActor,
                             target: BattleActor,
                             func?: BattleNoblePhantasmFunc): Promise<BattleEvent[]> {
    const hits = actor.hits(attack, target);

    const baseHitDistributionTotal = actor.baseHits(attack).reduce((a, b) => a + b);
    let damageTotal = Variable.float(actor.baseAttack() * baseHitDistributionTotal / 100);

    let percentMod = Variable.float(1000);
    if (attack.np && func) {
        percentMod = Variable.float(func.state.dataVal.Value ?? 0);
        percentMod = percentMod.add(npDamageBonus(actor, func));
    }
    percentMod = percentMod.divide(Variable.float(1000));

    damageTotal = damageTotal.multiply(percentMod);
    damageTotal = damageTotal.multiply(commandCardAttack(battle, attack, actor, target));
    damageTotal = damageTotal.multiply(classAttackRate(actor.baseClassName()));
    damageTotal = damageTotal.multiply(classAffinityRate(attack, actor, target));
    damageTotal = damageTotal.multiply(attributeAffinityRate(actor, target));
    damageTotal = damageTotal.multiply(await randomAttack(battle));
    damageTotal = damageTotal.multiply(Variable.float(GameConstantManager.getRateValue(Constant.Constant.ATTACK_RATE)));
    damageTotal = damageTotal.multiply(attackMagnification(attack, actor, target, func));

    if (attack.critical)
        damageTotal = damageTotal.multiply(Variable.float(GameConstantManager.getRateValue(Constant.Constant.CRITICAL_ATTACK_RATE)));

    if (attack.card === Card.EXTRA && attack.grand)
        damageTotal = damageTotal.multiply(Variable.float(GameConstantManager.getRateValue(Constant.Constant.EXTRA_ATTACK_RATE_GRAND)));
    else if (attack.card === Card.EXTRA)
        damageTotal = damageTotal.multiply(Variable.float(GameConstantManager.getRateValue(Constant.Constant.EXTRA_ATTACK_RATE_SINGLE)));

    damageTotal = damageTotal.multiply(specialDefence(attack, actor, target));

    let powerMod = Variable.float(1);
    powerMod = powerMod.add(powerMagnification(attack, actor, target));
    powerMod = powerMod.add(selfDamageMagnification(attack, actor, target));
    if (attack.critical)
        powerMod = powerMod.add(criticalMagnification(attack, actor, target));
    if (attack.np)
        powerMod = powerMod.add(npMagnification(attack, actor, target));
    if (powerMod.value() < 0.001)
        powerMod = Variable.float(0.001);

    damageTotal = damageTotal.multiply(powerMod);
    // damageTotal = damageTotal.multiply(npTraitBonusMagnification(battle, actor, target));
    // damageTotal = damageTotal.add(attackBonus(battle, attack, actor, target));
    // if (!attack.np && attack.busterChain())
    //     damageTotal = damageTotal.add(busterChainBonus(actor));
    //
    // if (attack.np && actor.noblePhantasm().props.type === NoblePhantasmType.NOBLE_SAFE) {
    //     if (damageTotal.value() >= target.state.health)
    //         damageTotal = new Variable(VariableType.FLOAT, target.state.health - 1);
    // }
    //
    // if (damageTotal.value() < 0)
    //     damageTotal = new Variable(VariableType.FLOAT, 0);
    //
    // let didHit = damageTotal.value() > 0 ? checkAbleToHit(battle, attack, actor, target) : false;
    //
    // damageTotal = damageTotal.cast(VariableType.INT);
    //
    // let damageList: number[] = [],
    //     remainingDamage = damageTotal.copy();
    //
    // for (let i = 0; i < hits.length - 1; i++) {
    //     let damageInstance = damageTotal.copy();
    //     damageInstance = damageInstance.multiply(new Variable(VariableType.INT, hits[i]));
    //     damageInstance = damageInstance.divide(new Variable(VariableType.INT, , hitDistributionTotal));
    //     if (damageInstance.value() <= 0 && didHit) {
    //         damageInstance = new Variable(VariableType.INT, 1);
    //     }
    //
    //     damageList.push(damageInstance.value());
    //     remainingDamage.subtract(damageInstance);
    // }
    //
    // if (remainingDamage.value() <= 0 && didHit)
    //     remainingDamage = new Variable(VariableType.INT, 1);
    // damageList.push(remainingDamage.value());
    //
    // let attackNpGainRate = attackNpGainRate(battle, attack, actor, target),
    //     defenceNpGainRate = defenceNpGainRate(battle, attack, actor, target),
    //     starRate = starRate(battle, attack, actor, target),
    //     overkillNpGainMod = new Variable(VariableType.FLOAT, 1),
    //     overkillStarMod = new Variable(VariableType.FLOAT, 1),
    //     overkillStarBonus = new Variable(VariableType.FLOAT, 0),
    //     maxStarRate = GameConstantManager.getValue('STAR_RATE_MAX'),
    //     events = [];
    //
    // for (let i = 0; i < damageList.length; i++) {
    //     let overkill = target.overkill(damageList[i].value());
    //     target.reduceHpForOverkill(damageList[i].value());
    //
    //     if (overkill) {
    //         overkillNpGainMod = new Variable(VariableType.FLOAT, GameConstantManager.getRateValue('OVER_KILL_NP_RATE'));
    //         overkillStarMod = new Variable(VariableType.FLOAT, GameConstantManager.getRateValue('OVER_KILL_STAR_RATE'));
    //         overkillStarBonus = new Variable(VariableType.FLOAT, GameConstantManager.getValue('OVER_KILL_STAR_ADD'));
    //     }
    //
    //     let stars = 0,
    //         starRange = starRate
    //             .multiply(overkillStarMod)
    //             .add(overkillStarBonus)
    //             .cast(VariableType.INT);
    //     for (let j = Math.min(starRange.value(), maxStarRate); j > 0; j -= 1000) {
    //         stars += battle.random(0, 1000) >= j ? 0 : 1;
    //     }
    //
    //     let attackNpGained = calcNpGained(actor, attackNpGainRate.multiply(overkillNpGainMod)),
    //         defenceNpGained = calcNpGained(target, defenceNpGainRate.multiply(overkillNpGainMod));
    //
    //     let event = new BattleDamageEvent(actor, target, true, {
    //         damage: damageList[i],
    //         npGainedOnAttack: attackNpGained,
    //         npGainedOnDefence: defenceNpGained,
    //         stars,
    //     });
    //     battle.addEvent(event);
    //     events.push(event);
    // }
    //
    // for (let i = 0; i < events.length; i++) {
    //     target.adjustHealth(events[i].reference.damage * -1);
    //     actor.adjustGauge(events[i].reference.npGainedOnAttack);
    //     target.adjustGauge(events[i].reference.npGainedOnDefence);
    //     battle.adjustStars(events[i].reference.stars);
    // }

    return [];
}

export {
    attackMagnification,
    attributeAffinityRate,
    classAffinityOverrideRate,
    classAffinityRate,
    classAttackRate,
    commandCardAttack,
    criticalMagnification,
    npDamageBonus,
    powerMagnification,
    randomAttack,
    selfDamageMagnification,
    specialDefence,
}

export default getDamageList;
