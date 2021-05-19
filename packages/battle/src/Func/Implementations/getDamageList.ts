import {Card, ClassName} from "@atlasacademy/api-connector";
import {BattleAttackAction} from "../../Action/BattleAttackAction";
import {BattleActor} from "../../Actor/BattleActor";
import {Battle} from "../../Battle";
import {BattleTeam} from "../../Enum/BattleTeam";
import BattleEvent from "../../Event/BattleEvent";
import {GameBuffGroup} from "../../Game/GameBuffConstantMap";
import GameConstantManager from "../../Game/GameConstantManager";
import {GameConstantKey} from "../../Game/GameConstants";
import {Variable, VariableType} from "../../Game/Variable";

function cardHitDistribution(battle: Battle,
                             attack: BattleAttackAction,
                             actor: BattleActor,
                             target: BattleActor): number[] {
    let hits = [100];
    switch (attack.card) {
        case Card.BUSTER:
            hits = actor.props.hits.buster ?? [100];
            break;
        case Card.QUICK:
            hits = actor.props.hits.quick ?? [100];
            break;
        case Card.ARTS:
            hits = actor.props.hits.arts ?? [100];
            break;
        case Card.EXTRA:
            hits = actor.props.hits.extra ?? [100];
            break;
    }

    const multiHit = actor.state.buffs.netBuffs(
        GameBuffGroup.MULTI_ATTACK,
        actor.traits(battle, attack),
        target.traits(battle, attack)
    );

    if (multiHit > 1) {
        hits = hits.map(hit => {
            return new Array(multiHit).fill(hit).map(damage => Math.floor(damage / multiHit));
        }).flat();
    }

    return hits;
}

// function classAttack(className: ClassName): number {
//     const classAttack = GameConstantManager.classAttackRate(className);
//     if (!classAttack) {
//         throw new Error('FAILED TO FIND CLASS ATTACK RATE');
//     }
//
//     return classAttack;
// }

// function commandCardAttack(battle: Battle,
//                            attack: BattleAttackAction,
//                            actor: BattleActor,
//                            target: BattleActor): number {
//     const cardConstant = GameConstantManager.cardConstants(attack.card, attack.np ? 1 : attack.num);
//     if (!cardConstant) {
//         throw new Error('FAILED TO FIND CARD CONSTANT');
//     }
//
//     let cardBase = 0;
//     if (actor.props.team === BattleTeam.ENEMY) {
//         switch (attack.card) {
//             case Card.ARTS:
//                 cardBase = GameConstantManager.getValue('ENEMY_ATTACK_RATE_ARTS');
//                 break;
//             case Card.QUICK:
//                 cardBase = GameConstantManager.getValue('ENEMY_ATTACK_RATE_QUICK');
//                 break;
//             case Card.BUSTER:
//                 cardBase = GameConstantManager.getValue('ENEMY_ATTACK_RATE_BUSTER');
//                 break;
//             default:
//                 cardBase = cardConstant.adjustAtk;
//         }
//     } else {
//         cardBase = cardConstant.adjustAtk;
//     }
//
//     let cardBonus = 1;
//     cardBonus += actor.state.buffs.netBuffs(
//         GameBuffGroup.COMMAND_ATK,
//         actor.traits(battle).concat(cardConstant.individuality),
//         target?.traits(battle) ?? []
//     );
//     cardBonus -= actor.state.buffs.netBuffs(
//         GameBuffGroup.COMMAND_DEF,
//         actor.traits(battle),
//         (target?.traits(battle) ?? []).concat(cardConstant.individuality)
//     );
//
//     return cardBase * cardBonus + cardConstant.addAtk / 1000;
// }

function getDamageList(battle: Battle,
                       attack: BattleAttackAction,
                       actor: BattleActor,
                       target: BattleActor): BattleEvent[] {
    let hits = cardHitDistribution(battle, attack, actor, target);
    // if (attack.np)
    //     hits = npHitDistribution(battle, actor);
    //
    // hits = applyMultiAttack(hits, battle, attack, actor, target);
    // let hitDistributionTotal = hits.reduce((a, b) => a + b);
    // let damageTotal = new Variable(VariableType.FLOAT, actor.props.baseAttack * hitDistributionTotal / 100);
    //
    // let percentMod = new Variable(VariableType.FLOAT, 1000);
    // if (attack.np) {
    //     percentMod = npBaseValue(actor);
    //     percentMod = percentMod.add(npRatioMagnification(actor));
    // }
    // percentMod = percentMod.divide(new Variable(VariableType.FLOAT, 1000));
    //
    // damageTotal = damageTotal.multiply(percentMod);
    // damageTotal = damageTotal.multiply(commandCardAttack(battle, attack, actor, target));
    // damageTotal = damageTotal.multiply(classAttack(actor.props.className));
    // damageTotal = damageTotal.multiply(classMagnification(actor.className(battle, attack), target.className(battle, attack)));
    // damageTotal = damageTotal.multiply(attributeMagnification(actor.props.attribute, target.props.attribute));
    // damageTotal = damageTotal.multiply(new Variable(VariableType.FLOAT, battle.random(
    //     GameConstantManager.getValue(GameConstantKey.ATTACK_RATE_RANDOM_MIN),
    //     GameConstantManager.getValue(GameConstantKey.ATTACK_RATE_RANDOM_MAX)
    // ) / 1000));
    // damageTotal = damageTotal.multiply(new Variable(VariableType.FLOAT, GameConstantManager.getRateValue('ATTACK_RATE')));
    // damageTotal = damageTotal.multiply(attackMagnification(battle, attack, actor, target));
    //
    // let critical = isCritical(battle);
    // if (critical)
    //     damageTotal = damageTotal.multiply(new Variable(VariableType.FLOAT, GameConstantManager.getRateValue('CRITICAL_ATTACK_RATE')));
    //
    // if (attack.isGrand())
    //     damageTotal = damageTotal.multiply(new Variable(VariableType.FLOAT, GameConstantManager.getRateValue('EXTRA_ATTACK_RATE_GRAND')));
    // else if (attack.card === Card.EXTRA)
    //     damageTotal = damageTotal.multiply(new Variable(VariableType.FLOAT, GameConstantManager.getRateValue('EXTRA_ATTACK_RATE_SINGLE')));
    //
    // damageTotal = damageTotal.multiply(specialDefence(battle, attack, actor, target));
    //
    // let powerMod = new Variable(VariableType.FLOAT, 1);
    // powerMod = powerMod.add(powerMagnification(battle, attack, actor, target));
    // powerMod = powerMod.add(selfDamageMagnification(battle, attack, actor, target));
    // if (critical)
    //     powerMod = powerMod.add(criticalMod(battle, attack, actor, target));
    // if (attack.np)
    //     powerMod = powerMod.add(npMagnification(battle, attack, actor, target));
    // if (powerMod.value() < 0.001)
    //     powerMod = new Variable(VariableType.FLOAT, 0.001);
    //
    // damageTotal = damageTotal.multiply(powerMod);
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

export {cardHitDistribution};
export default getDamageList;
