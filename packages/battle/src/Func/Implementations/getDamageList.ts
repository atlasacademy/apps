import {Card, ClassName} from "@atlasacademy/api-connector";
import {BattleAttackAction} from "../../Action/BattleAttackAction";
import {BattleActor} from "../../Actor/BattleActor";
import {Battle} from "../../Battle";
import {BattleTeam} from "../../Enum/BattleTeam";
import BattleEvent from "../../Event/BattleEvent";
import {GameBuffGroup} from "../../Game/GameBuffConstantMap";
import GameConstantManager from "../../Game/GameConstantManager";

function applyMultiAttack(damageList: number[],
                          battle: Battle,
                          attack: BattleAttackAction,
                          actor: BattleActor,
                          target: BattleActor): number[] {
    const multiHit = actor.state.buffs.netBuffs(
        GameBuffGroup.MULTI_ATTACK,
        actor.traits(battle, attack),
        target.traits(battle, attack)
    );

    if (multiHit > 1) {
        damageList = damageList.map(damage => {
            return new Array(multiHit).fill(damage).map(damage => Math.floor(damage / multiHit));
        }).flat();
    }

    return damageList;
}

function classAttack(className: ClassName): number {
    const classAttack = GameConstantManager.classAttackRate(className);
    if (!classAttack) {
        throw new Error('FAILED TO FIND CLASS ATTACK RATE');
    }

    return classAttack;
}

function commandCardAttack(battle: Battle,
                           attack: BattleAttackAction,
                           actor: BattleActor,
                           target: BattleActor): number {
    const cardConstant = GameConstantManager.cardConstants(attack.card, attack.np ? 1 : attack.num);
    if (!cardConstant) {
        throw new Error('FAILED TO FIND CARD CONSTANT');
    }

    let cardBase = 0;
    if (actor.props.team === BattleTeam.ENEMY) {
        switch (attack.card) {
            case Card.ARTS:
                cardBase = GameConstantManager.getValue('ENEMY_ATTACK_RATE_ARTS');
                break;
            case Card.QUICK:
                cardBase = GameConstantManager.getValue('ENEMY_ATTACK_RATE_QUICK');
                break;
            case Card.BUSTER:
                cardBase = GameConstantManager.getValue('ENEMY_ATTACK_RATE_BUSTER');
                break;
            default:
                cardBase = cardConstant.adjustAtk;
        }
    } else {
        cardBase = cardConstant.adjustAtk;
    }

    let cardBonus = 1;
    cardBonus += actor.state.buffs.netBuffs(
        GameBuffGroup.COMMAND_ATK,
        actor.traits(battle).concat(cardConstant.individuality),
        target?.traits(battle) ?? []
    );
    cardBonus -= actor.state.buffs.netBuffs(
        GameBuffGroup.COMMAND_DEF,
        actor.traits(battle),
        (target?.traits(battle) ?? []).concat(cardConstant.individuality)
    );

    return cardBase * cardBonus + cardConstant.addAtk / 1000;
}

export default function getDamageList(actor: BattleActor,
                                      attack: BattleAttackAction,
                                      hits: number[],
                                      defence: boolean,
                                      battle: Battle,
                                      target: BattleActor,
                                      percentMods: number[]): BattleEvent[] {
    hits = applyMultiAttack(hits, battle, attack, actor, target);
    let hitDistributionTotal = hits.reduce((a, b) => a + b);
    let damageTotal = actor.props.baseAttack * hitDistributionTotal / 100;

    let percentMod = percentMods[0] ?? 0;
    percentMod += npRatioMagnification(actor);

    damageTotal *= percentMod;
    damageTotal *= commandCardAttack(battle, attack, actor, target);
    damageTotal *= classAttack(actor.props.className) / 1000;
    damageTotal *= classMagnification(actor.className(battle, attack), target.className(battle, attack));
    damageTotal *= attributeMagnification(actor.props.attribute, target.props.attribute);
    damageTotal *= battle.random(
        GameConstantManager.getValue('ATTACK_RATE_RANDOM_MIN'),
        GameConstantManager.getValue('ATTACK_RATE_RANDOM_MAX')
    );
    damageTotal *= GameConstantManager.getValue('ATTACK_RATE') / 1000;
    damageTotal *= attackMagnification(battle, attack, actor, target);

    let critical = isCritical(battle);
    if (critical)
        damageTotal *= GameConstantManager.getValue('CRITICAL_ATTACK_RATE') / 1000;

    if (attack.isGrand())
        damageTotal *= GameConstantManager.getValue('EXTRA_ATTACK_RATE_GRAND') / 1000;
    else if (attack.card === Card.EXTRA)
        damageTotal *= GameConstantManager.getValue('EXTRA_ATTACK_RATE_SINGLE') / 1000;

    damageTotal *= specialDefence(battle, attack, actor, target);

    let powerMod = 1;
    powerMod += powerMagnification(battle, attack, actor, target);
    powerMod += selfDamageMagnification(battle, attack, actor, target);
    if (critical)
        powerMod += criticalMod(battle, attack, actor, target);
    if (attack.np)
        powerMod += npMagnification(battle, attack, actor, target);
    if (powerMod < 0.001)
        powerMod = 0.001;

    damageTotal *= powerMod;
    damageTotal *= npTraitBonusMagnification(battle, actor, target);
    damageTotal += attackBonus(battle, attack, actor, target);
    if (!attack.np && attack.busterChain())
        damageTotal += actor.props.baseAttack * GameConstantManager.getValue('CHAINBONUS_BUSTER_RATE');

    if (attack.np && actor.noblePhantasm().props.type === NoblePhantasmType.NOBLE_SAFE) {
        if (damageTotal >= target.state.health)
            damageTotal = target.state.health - 1;
    }

    if (damageTotal < 0)
        damageTotal = 0;

    let didHit = damageTotal > 0 ? checkAbleToHit(battle, attack, actor, target) : false;

    damageTotal = Math.floor(damageTotal);

    let damageSum = 0,
        damageList = [];

    for (let i = 0; i < hits.length - 1; i++) {
        let damageInstance = damageTotal * hits[i] / hitDistributionTotal;
        if (damageInstance <= 0 && didHit) {
            damageInstance = 1;
        }

        damageList.push(damageInstance);
        damageSum += damageInstance;
    }

    let remainingDamage = damageTotal - damageSum;
    if (remainingDamage <= 0 && didHit)
        remainingDamage = 1;
    damageList.push(remainingDamage);

    let attackNpGainRate = attackNpGainRate(battle, attack, actor, target),
        defenceNpGainRate = defenceNpGainRate(battle, attack, actor, target),
        starRate = starRate(battle, attack, actor, target),
        overkillNpGainMod = 1,
        overkillStarMod = 1,
        overkillStarBonus = 0,
        maxStarRate = GameConstantManager.getValue('STAR_RATE_MAX'),
        events = [];

    for (let i = 0; i < damageList.length; i++) {
        let overkill = target.overkill(damageList[i]);
        target.reduceHpForOverkill(damageList[i]);

        if (overkill) {
            overkillNpGainMod = GameConstantManager.getValue('OVER_KILL_NP_RATE');
            overkillStarMod = GameConstantManager.getValue('OVER_KILL_STAR_RATE');
            overkillStarBonus = GameConstantManager.getValue('OVER_KILL_STAR_ADD');
        }

        let stars = 0,
            starRange = starRate * overkillStarMod + overkillStarBonus;
        for (let j = Math.min(starRange, maxStarRate); j > 0; j -= 1000) {
            stars += battle.random(0, 1000) >= j ? 0 : 1;
        }

        let attackNpGained = calcNpGained(actor, attackNpGainRate * overkillNpGainMod),
            defenceNpGained = calcNpGained(target, defenceNpGainRate * overkillNpGainMod);

        let event = new BattleDamageEvent(actor, target, true, {
            damage: damageList[i],
            npGainedOnAttack: attackNpGained,
            npGainedOnDefence: defenceNpGained,
            stars,
        });
        battle.addEvent(event);
        events.push(event);
    }

    for (let i = 0; i < events.length; i++) {
        target.adjustHealth(events[i].reference.damage * -1);
        actor.adjustGauge(events[i].reference.npGainedOnAttack);
        target.adjustGauge(events[i].reference.npGainedOnDefence);
        battle.adjustStars(events[i].reference.stars);
    }

    return events;
}
