import { Buff, Card, ClassName, Constant, Func } from "@atlasacademy/api-connector";

import { BattleAttackAction } from "../../Action/BattleAttackAction";
import { BattleActor } from "../../Actor/BattleActor";
import { Battle } from "../../Battle";
import { BattleBuff } from "../../Buff/BattleBuff";
import { BattleTeam } from "../../Enum/BattleTeam";
import BattleDamageEvent from "../../Event/BattleDamageEvent";
import BattleEvent from "../../Event/BattleEvent";
import { Variable, VariableType } from "../../Game/Variable";
import BattleFunc from "../BattleFunc";

function attackBonus(attack: BattleAttackAction, actor: BattleActor, target: BattleActor): Variable {
    let bonus = Variable.float(0);

    bonus = bonus.add(
        Variable.float(
            actor.buffs().netBuffs(Buff.BuffAction.GIVEN_DAMAGE, actor.traits(attack.traits()), target.traits())
        )
    );

    bonus = bonus.add(
        Variable.float(
            target.buffs().netBuffs(Buff.BuffAction.RECEIVE_DAMAGE, actor.traits(), target.traits(attack.traits()))
        )
    );

    if (!attack.np && attack.firstCard === Card.BUSTER && attack.grand) {
        let busterBraveBonus = Variable.float(actor.baseAttack());
        busterBraveBonus = busterBraveBonus.multiply(
            Variable.float(actor.battle().constants().getRateValue(Constant.Constant.CHAINBONUS_BUSTER_RATE))
        );

        bonus = bonus.add(busterBraveBonus);
    }

    return bonus;
}

function attackMagnification(
    attack: BattleAttackAction,
    actor: BattleActor,
    target: BattleActor,
    func?: BattleFunc
): Variable {
    const attackUpValue = actor.buffs().netBuffs(Buff.BuffAction.ATK, actor.traits(attack.traits()), target.traits()),
        defensePierceBuffs = actor
            .buffs()
            .getBuffs(Buff.BuffAction.PIERCE_DEFENCE, actor.traits(attack.traits()), target.traits(), true, true),
        defensePierce = defensePierceBuffs.length || func?.props.func.funcType === Func.FuncType.DAMAGE_NP_PIERCE,
        defenseGroup = defensePierce ? Buff.BuffAction.DEFENCE_PIERCE : Buff.BuffAction.DEFENCE,
        defenseUpValue = target.buffs().netBuffs(defenseGroup, actor.traits(), target.traits(attack.traits())),
        attackUp = Variable.float(attackUpValue).divide(Variable.float(1000)),
        defenseUp = Variable.float(defenseUpValue).divide(Variable.float(1000));

    let magnification = Variable.float(1).add(attackUp).subtract(defenseUp);
    if (magnification.value() < 0) magnification = Variable.float(0);

    return magnification;
}

function attackNpGainRate(attack: BattleAttackAction, actor: BattleActor, target: BattleActor): Variable {
    if (actor.team() === BattleTeam.ENEMY) return Variable.int(0);

    if (!canGainNp(actor)) return Variable.int(0);

    let npGain = Variable.float(
        attack.np ? actor.noblePhantasm().gainForNp() : actor.noblePhantasm().gainForCard(attack.card)
    );

    // Card NP Gain calcs
    const cardConstant = actor
            .battle()
            .constants()
            .cardConstants(attack.card, attack.np ? 1 : attack.num),
        firstCardConstant = actor.battle().constants().cardConstants(attack.firstCard, 1),
        cardAdjustTdGauge = cardConstant?.adjustTdGauge ?? 0,
        cardAddTdGauge = firstCardConstant?.addTdGauge ?? 0,
        cardActorMag = actor
            .buffs()
            .netBuffsRate(Buff.BuffAction.COMMAND_NP_ATK, actor.traits(attack.traits()), target.traits()),
        cardTargetMag = target
            .buffs()
            .netBuffsRate(Buff.BuffAction.COMMAND_NP_DEF, actor.traits(), target.traits(attack.traits()));

    let cardNpGain: Variable = Variable.float(1)
        .add(Variable.float(cardActorMag))
        .subtract(Variable.float(cardTargetMag));
    if (cardNpGain.value() < 0) cardNpGain = Variable.float(0);

    cardNpGain = Variable.float(cardAdjustTdGauge).divide(Variable.float(1000)).multiply(cardNpGain);

    cardNpGain = cardNpGain.add(Variable.float(cardAddTdGauge).divide(Variable.float(1000)));

    npGain = npGain.multiply(cardNpGain);
    // End Card NP Gain calcs

    // Server Mod Calcs
    npGain = npGain.multiply(Variable.float(target.serverMod().tdRate).divide(Variable.float(1000)));

    // Np Gain Mods calcs
    const npGainBonusRate = actor.buffs().netBuffsRate(
        Buff.BuffAction.DROP_NP,
        actor.traits(attack.traits()),
        target.traits(attack.traits()) // why? original has this. dunno. ref: BattleServantData.getUpDownDropNp
    );

    npGain = npGain.multiply(Variable.float(npGainBonusRate));

    // Critical NP Gain calcs
    if (attack.critical)
        npGain = npGain.multiply(
            Variable.float(actor.battle().constants().getRateValue(Constant.Constant.CRITICAL_TD_POINT_RATE))
        );

    if (npGain.value() < 0) npGain = Variable.float(0);

    return Variable.int(npGain.value());
}

function attributeAffinityRate(actor: BattleActor, target: BattleActor): Variable {
    let affinity = actor.battle().constants().attributeAffinity(actor.attribute(), target.attribute());
    if (affinity === undefined) affinity = 1000;

    return Variable.float(affinity).divide(Variable.float(1000));
}

function canGainNp(actor: BattleActor): boolean {
    const doNotGainNpBuffs = actor.buffs().getBuffs(Buff.BuffAction.DONOT_GAINNP, actor.traits(), [], true, true);

    return doNotGainNpBuffs.length <= 0;
}

function checkAbleToHit(attack: BattleAttackAction, actor: BattleActor, target: BattleActor): boolean {
    const pierceInvincible =
            actor
                .buffs()
                .getBuffs(Buff.BuffAction.PIERCE_INVINCIBLE, actor.traits(attack.traits()), target.traits(), true, true)
                .length > 0,
        invincible =
            target
                .buffs()
                .getBuffs(Buff.BuffAction.INVINCIBLE, actor.traits(), target.traits(attack.traits()), true, true)
                .length > 0,
        sureHit =
            actor
                .buffs()
                .getBuffs(Buff.BuffAction.BREAK_AVOIDANCE, actor.traits(attack.traits()), target.traits(), true, true)
                .length > 0,
        evade =
            target
                .buffs()
                .getBuffs(Buff.BuffAction.AVOIDANCE, actor.traits(), target.traits(attack.traits()), true, true)
                .length > 0;

    if (pierceInvincible) return true;
    if (invincible) return false;
    if (sureHit) return true;

    return !evade;
}

function classAttackRate(battle: Battle, className: ClassName): Variable {
    const attackValue = battle.constants().classAttack(className);
    if (attackValue === undefined) throw Error("FAILED TO GET CLASS ATTACK RATE.");

    let attackRate = Variable.float(attackValue);
    attackRate = attackRate.divide(Variable.float(1000));

    return attackRate;
}

function classAffinityOverrideRate(
    affinity: number,
    attack: BattleAttackAction,
    actor: BattleActor,
    target: BattleActor,
    attacking: boolean
): number {
    let attackerClass = actor.className(attack, target, true),
        defenderClass = target.className(attack, actor, false),
        overrideBuffs: BattleBuff[];

    if (attacking) {
        overrideBuffs = actor
            .buffs()
            .getBuffs(
                Buff.BuffAction.OVERWRITE_CLASS_RELATION,
                actor.traits(attack.traits()),
                target.traits(),
                true,
                true
            );
    } else {
        overrideBuffs = target
            .buffs()
            .getBuffs(
                Buff.BuffAction.OVERWRITE_CLASS_RELATION,
                actor.traits(),
                target.traits(attack.traits()),
                true,
                true
            );
    }

    overrideBuffs.forEach((buff) => {
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
        affinity = actor.battle().constants().classAffinity(attackerClass, defenderClass);

    if (affinity === undefined) affinity = 1000;

    // Choosing to ignore old OVERWRITE_CLASSRELATIO_ATK and OVERWRITE_CLASSRELATIO_DEF.
    // This implementation has been phased out and there are no buffs that use this type.

    affinity = classAffinityOverrideRate(affinity, attack, actor, target, true);
    affinity = classAffinityOverrideRate(affinity, attack, actor, target, false);

    return Variable.float(affinity).divide(Variable.float(1000));
}

function commandCardAttack(
    battle: Battle,
    attack: BattleAttackAction,
    actor: BattleActor,
    target: BattleActor
): Variable {
    const cardConstant = battle.constants().cardConstants(attack.card, attack.np ? 1 : attack.num);
    if (!cardConstant) {
        throw new Error("FAILED TO FIND CARD CONSTANT");
    }

    let cardBaseValue = 0;
    if (actor.props.team === BattleTeam.ENEMY) {
        switch (attack.card) {
            case Card.ARTS:
                cardBaseValue = battle.constants().getValue(Constant.Constant.ENEMY_ATTACK_RATE_ARTS);
                break;
            case Card.QUICK:
                cardBaseValue = battle.constants().getValue(Constant.Constant.ENEMY_ATTACK_RATE_QUICK);
                break;
            case Card.BUSTER:
                cardBaseValue = battle.constants().getValue(Constant.Constant.ENEMY_ATTACK_RATE_BUSTER);
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

    cardBonus = cardBonus.add(
        Variable.float(
            actor.state.buffs.netBuffsRate(Buff.BuffAction.COMMAND_ATK, actor.traits(attack.traits()), target.traits())
        )
    );

    cardBonus = cardBonus.subtract(
        Variable.float(
            actor.state.buffs.netBuffsRate(Buff.BuffAction.COMMAND_DEF, actor.traits(), target.traits(attack.traits()))
        )
    );

    if (cardBonus.value() < 0) cardBonus = Variable.float(0);

    cardAdd = cardAdd.divide(Variable.float(1000));

    return cardBase.multiply(cardBonus).add(cardAdd);
}

function criticalMagnification(attack: BattleAttackAction, actor: BattleActor, target: BattleActor): Variable {
    const value = actor
        .buffs()
        .netBuffs(Buff.BuffAction.CRITICAL_DAMAGE, actor.traits(attack.traits()), target.traits());

    return Variable.float(value).divide(Variable.float(1000));
}

function defenseNpGainRate(attack: BattleAttackAction, actor: BattleActor, target: BattleActor): Variable {
    if (target.team() === BattleTeam.ENEMY) return Variable.int(0);

    if (!canGainNp(target)) return Variable.int(0);

    let npGain = Variable.float(actor.noblePhantasm().gainForDefense());

    // Server Mod Calcs
    npGain = npGain.multiply(Variable.float(actor.serverMod().tdAttackRate).divide(Variable.float(1000)));

    // Np Gain Mods calcs
    npGain = npGain.multiply(
        Variable.float(
            target.buffs().netBuffsRate(
                Buff.BuffAction.DROP_NP,
                // why? original has this. dunno. ref: BattleServantData.getUpDownDropNp
                // i think so np gain on arts card doesn't trigger if enemy hits you with an arts card
                target.traits(),
                actor.traits()
            )
        )
    );

    // Np gain on damage Mods calcs
    npGain = npGain.multiply(
        Variable.float(
            target.buffs().netBuffsRate(Buff.BuffAction.DROP_NP_DAMAGE, actor.traits(attack.traits()), target.traits())
        )
    );

    // Np given for damage Mods calcs
    npGain = npGain.multiply(
        Variable.float(
            actor.buffs().netBuffsRate(Buff.BuffAction.GIVE_NP, actor.traits(attack.traits()), target.traits())
        )
    );

    if (npGain.value() < 0) npGain = Variable.float(0);

    return Variable.int(npGain.value());
}

function npDamageBonus(actor: BattleActor, func: BattleFunc): Variable {
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
    const value = actor.buffs().netBuffs(Buff.BuffAction.NPDAMAGE, actor.traits(attack.traits()), target.traits());

    return Variable.float(value).divide(Variable.float(1000));
}

function npTraitBonusMagnification(func: BattleFunc, actor: BattleActor, target: BattleActor): Variable {
    let magnification = Variable.float(1);

    if (func.props.func.funcType === Func.FuncType.DAMAGE_NP_INDIVIDUAL) {
        const trait = func.state.dataVal.Target ?? 0,
            correction = func.state.dataVal.Correction ?? 0;

        if (target.hasTrait(trait)) {
            magnification = Variable.float(correction).divide(Variable.float(1000));
        }
    } else if (func.props.func.funcType === Func.FuncType.DAMAGE_NP_STATE_INDIVIDUAL) {
        /**
         * This case is intentionally broken. This code functionality was copied from the NA 1.35.1 APK. In there,
         * the DataVal.Target is passed to the wrong parameter and therefore will always pass the check. I left it as
         * they have implemented it in case some time in the future it comes up again. For now, this is how it is
         * supposed to be working.
         */
        const actorTraitTarget = func.state.dataVal.Target ?? 0,
            buffTraitTarget = 0,
            correction = func.state.dataVal.Correction ?? 0;

        if (!buffTraitTarget || target.buffs().hasTrait(buffTraitTarget, false)) {
            magnification = Variable.float(correction).divide(Variable.float(1000));
        }
    } else if (func.props.func.funcType === Func.FuncType.DAMAGE_NP_STATE_INDIVIDUAL_FIX) {
        const trait = func.state.dataVal.Target ?? 0,
            correction = func.state.dataVal.Correction ?? 0;

        if (target.buffs().hasTrait(trait, false)) {
            magnification = Variable.float(correction).divide(Variable.float(1000));
        }
    }

    return magnification;
}

function powerMagnification(attack: BattleAttackAction, actor: BattleActor, target: BattleActor): Variable {
    let magnification = Variable.int(0);

    // target traits
    magnification = magnification.add(
        Variable.int(actor.buffs().netBuffs(Buff.BuffAction.DAMAGE, actor.traits(attack.traits()), target.traits()))
    );

    // target passive traits
    magnification = magnification.add(
        Variable.int(
            actor
                .buffs()
                .netBuffs(
                    Buff.BuffAction.DAMAGE_INDIVIDUALITY,
                    actor.traits(attack.traits()),
                    target.buffs().traits(false)
                )
        )
    );

    // target active traits
    magnification = magnification.add(
        Variable.int(
            actor
                .buffs()
                .netBuffs(
                    Buff.BuffAction.DAMAGE_INDIVIDUALITY_ACTIVEONLY,
                    actor.traits(attack.traits()),
                    target.buffs().traits(true)
                )
        )
    );

    // target active traits
    magnification = magnification.add(
        Variable.int(
            actor
                .buffs()
                .netBuffs(
                    Buff.BuffAction.DAMAGE_EVENT_POINT,
                    actor.traits(attack.traits()),
                    target.buffs().traits(true)
                )
        )
    );

    return Variable.float(magnification.value()).divide(Variable.float(1000));
}

async function randomAttack(battle: Battle): Promise<Variable> {
    const random = await battle
        .random()
        .generate(
            battle.constants().getValue(Constant.Constant.ATTACK_RATE_RANDOM_MIN),
            battle.constants().getValue(Constant.Constant.ATTACK_RATE_RANDOM_MAX),
            "ATTACK RANDOM RANGE"
        );

    return Variable.float(random).divide(Variable.float(1000));
}

function selfDamageMagnification(attack: BattleAttackAction, actor: BattleActor, target: BattleActor): Variable {
    const value = target.buffs().netBuffs(Buff.BuffAction.SELFDAMAGE, target.traits(), actor.traits(attack.traits()));

    return Variable.float(value).divide(Variable.float(1000));
}

function specialDefence(attack: BattleAttackAction, actor: BattleActor, target: BattleActor): Variable {
    const value = target
        .buffs()
        .netBuffs(Buff.BuffAction.SPECIALDEFENCE, actor.traits(), target.traits(attack.traits()));

    let defence = Variable.float(value).divide(Variable.float(1000));
    defence = Variable.float(1).subtract(defence);
    if (defence.value() < 0) defence = Variable.float(0);

    return defence;
}

function starGenRate(attack: BattleAttackAction, actor: BattleActor, target: BattleActor): Variable {
    if (actor.team() === BattleTeam.ENEMY) return Variable.int(0);

    let starGen = Variable.float(0);

    // Base Star Gen Rate
    starGen = starGen.add(Variable.floatRate(actor.baseStarGen()));

    // Card Star Gen calcs
    const cardConstant = actor
            .battle()
            .constants()
            .cardConstants(attack.card, attack.np ? 1 : attack.num),
        firstCardConstant = actor.battle().constants().cardConstants(attack.firstCard, 1),
        cardAdjustCritical = cardConstant?.adjustCritical ?? 0,
        cardAddCritical = firstCardConstant?.addCritical ?? 0,
        cardActorMag = actor
            .buffs()
            .netBuffsRate(Buff.BuffAction.COMMAND_STAR_ATK, actor.traits(attack.traits()), target.traits()),
        cardTargetMag = target
            .buffs()
            .netBuffsRate(Buff.BuffAction.COMMAND_STAR_DEF, actor.traits(), target.traits(attack.traits()));

    let cardStarGen: Variable = Variable.float(1)
        .add(Variable.float(cardActorMag))
        .subtract(Variable.float(cardTargetMag));
    if (cardStarGen.value() < 0) cardStarGen = Variable.float(0);

    cardStarGen = Variable.floatRate(cardAdjustCritical).multiply(cardStarGen);
    cardStarGen = cardStarGen.add(Variable.floatRate(cardAddCritical));
    starGen = starGen.add(cardStarGen);
    // End Car Star Gen calcs

    // Target Star Server Mod
    starGen = starGen.add(Variable.floatRate(target.serverMod().starRate));

    // Star Drop Buff Calcs
    starGen = starGen.add(
        Variable.float(
            actor
                .buffs()
                .netBuffsRate(
                    Buff.BuffAction.CRITICAL_POINT,
                    actor.traits(attack.traits()),
                    target.traits(attack.traits())
                )
        )
    );

    // Star Drop Buff on Target Calcs
    starGen = starGen.subtract(
        Variable.float(target.buffs().netBuffsRate(Buff.BuffAction.CRITICAL_POINT, target.traits(), actor.traits()))
    );

    // Critical Bonus
    if (attack.critical)
        starGen = starGen.add(
            Variable.float(actor.battle().constants().getRateValue(Constant.Constant.CRITICAL_STAR_RATE))
        );

    if (starGen.value() < 0) starGen = Variable.float(0);

    starGen = starGen.multiply(Variable.float(1000));

    return Variable.int(starGen.value());
}

async function getDamageList(
    battle: Battle,
    attack: BattleAttackAction,
    actor: BattleActor,
    target: BattleActor,
    func?: BattleFunc
): Promise<BattleEvent[]> {
    const hits = actor.hits(attack, target);

    const baseHitDistributionTotal = actor.baseHits(attack).reduce((a, b) => a + b);
    let damageTotal = Variable.float((actor.baseAttack() * baseHitDistributionTotal) / 100);

    let percentMod = Variable.float(1000);
    if (attack.np && func) {
        percentMod = Variable.float(func.state.dataVal.Value ?? 0);
        percentMod = percentMod.add(npDamageBonus(actor, func));
    }
    percentMod = percentMod.divide(Variable.float(1000));

    damageTotal = damageTotal.multiply(percentMod);
    damageTotal = damageTotal.multiply(commandCardAttack(battle, attack, actor, target));
    damageTotal = damageTotal.multiply(classAttackRate(battle, actor.baseClassName()));
    damageTotal = damageTotal.multiply(classAffinityRate(attack, actor, target));
    damageTotal = damageTotal.multiply(attributeAffinityRate(actor, target));
    damageTotal = damageTotal.multiply(await randomAttack(battle));
    damageTotal = damageTotal.multiply(Variable.float(battle.constants().getRateValue(Constant.Constant.ATTACK_RATE)));
    damageTotal = damageTotal.multiply(attackMagnification(attack, actor, target, func));

    if (attack.critical)
        damageTotal = damageTotal.multiply(
            Variable.float(battle.constants().getRateValue(Constant.Constant.CRITICAL_ATTACK_RATE))
        );

    if (attack.card === Card.EXTRA && attack.grand)
        damageTotal = damageTotal.multiply(
            Variable.float(battle.constants().getRateValue(Constant.Constant.EXTRA_ATTACK_RATE_GRAND))
        );
    else if (attack.card === Card.EXTRA)
        damageTotal = damageTotal.multiply(
            Variable.float(battle.constants().getRateValue(Constant.Constant.EXTRA_ATTACK_RATE_SINGLE))
        );

    damageTotal = damageTotal.multiply(specialDefence(attack, actor, target));

    let powerMod = Variable.float(1);
    powerMod = powerMod.add(powerMagnification(attack, actor, target));
    powerMod = powerMod.add(selfDamageMagnification(attack, actor, target));
    if (attack.critical) powerMod = powerMod.add(criticalMagnification(attack, actor, target));
    if (attack.np) powerMod = powerMod.add(npMagnification(attack, actor, target));
    if (powerMod.value() < 0.001) powerMod = Variable.float(0.001);

    damageTotal = damageTotal.multiply(powerMod);

    if (attack.np && func) damageTotal = damageTotal.multiply(npTraitBonusMagnification(func, actor, target));

    damageTotal = damageTotal.add(attackBonus(attack, actor, target));

    if (attack.np && func && func.props.func.funcType === Func.FuncType.DAMAGE_NP_SAFE) {
        if (target.state.health > 0 && damageTotal.value() >= target.state.health) {
            damageTotal = Variable.float(target.state.health - 1);
        }
    }

    if (damageTotal.value() < 0) damageTotal = Variable.float(0);

    const didHit = damageTotal.value() > 0 ? checkAbleToHit(attack, actor, target) : false;
    if (!didHit) damageTotal = Variable.float(0);

    damageTotal = Variable.int(damageTotal.value());

    let hitsTotal = Variable.int(hits.reduce((a, b) => a + b)),
        damageList: number[] = [],
        remainingDamage = damageTotal.copy(),
        num17 = remainingDamage.copy(); // not sure what this does in the original code

    for (let i = 0; i < hits.length - 1; i++) {
        let damageInstance = num17.copy();
        damageInstance = damageInstance.multiply(Variable.int(hits[i]));
        damageInstance = damageInstance.divide(hitsTotal);
        if (damageInstance.value() <= 0 && didHit) {
            damageInstance = Variable.int(1);
            num17 = num17.subtract(Variable.int(1));
            if (num17.value() <= 0) num17 = Variable.int(0);
        }

        damageList.push(damageInstance.value());
        remainingDamage = remainingDamage.subtract(damageInstance);
        if (remainingDamage.value() <= 0) remainingDamage = Variable.int(0);
    }

    if (remainingDamage.value() <= 0 && didHit) remainingDamage = Variable.int(1);

    damageList.push(remainingDamage.value());

    let attackNpGain = attackNpGainRate(attack, actor, target),
        defenseNpGain = defenseNpGainRate(attack, actor, target),
        starGen = starGenRate(attack, actor, target),
        overkillNpGainMod = Variable.float(1),
        overkillStarMod = Variable.float(1),
        overkillStarBonus = Variable.int(0),
        maxStarRate = battle.constants().getValue(Constant.Constant.STAR_RATE_MAX),
        events: BattleDamageEvent[] = [];

    for (let i = 0; i < damageList.length; i++) {
        let overkill = target.overkill(damageList[i]);
        target.recordDamageForOverkill(damageList[i]);

        if (overkill) {
            overkillNpGainMod = Variable.float(battle.constants().getRateValue(Constant.Constant.OVER_KILL_NP_RATE));
            overkillStarMod = Variable.float(battle.constants().getRateValue(Constant.Constant.OVER_KILL_STAR_RATE));
            overkillStarBonus = Variable.int(battle.constants().getValue(Constant.Constant.OVER_KILL_STAR_ADD));
        }

        let stars = 0,
            starRange = starGen.multiply(overkillStarMod).cast(VariableType.INT).add(overkillStarBonus);

        for (let j = Math.min(starRange.value(), maxStarRate); j > 0; j -= 1000) {
            const rand = await battle.random().generate(0, 1000, "STAR GEN ROLL");
            stars += rand >= j ? 0 : 1;
        }

        let attackNpGained = attackNpGain.multiply(overkillNpGainMod).cast(VariableType.INT).value(),
            defenceNpGained = defenseNpGain.multiply(overkillNpGainMod).cast(VariableType.INT).value();

        let event = new BattleDamageEvent(actor, target, true, {
            attack,
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
        battle.addStars(events[i].reference.stars);
    }

    return events;
}

export {
    attackBonus,
    attackMagnification,
    attackNpGainRate,
    attributeAffinityRate,
    checkAbleToHit,
    classAffinityOverrideRate,
    classAffinityRate,
    classAttackRate,
    commandCardAttack,
    criticalMagnification,
    npDamageBonus,
    npMagnification,
    npTraitBonusMagnification,
    powerMagnification,
    randomAttack,
    selfDamageMagnification,
    specialDefence,
    starGenRate,
};

export default getDamageList;
