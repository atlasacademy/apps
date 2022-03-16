import { expect } from "chai";

import { Card } from "@atlasacademy/api-connector";

import { BattleTeam } from "../../../src";
import { BattleAttackActionList } from "../../../src/Action/BattleAttackAction";
import { BattleSelectType } from "../../../src/Actor/BattleActorManager";
import BattleEvent from "../../../src/Event/BattleEvent";
import BattleSkillFunc from "../../../src/Skill/BattleSkillFunc";
import { createBattle, servant } from "../../helpers";

describe("BattleActorManager Target", () => {
    it("ally skill follow target", async () => {
        let battle = createBattle(),
            waver = servant(37, BattleTeam.PLAYER),
            artoria = servant(2, BattleTeam.PLAYER),
            target = servant(17, BattleTeam.ENEMY),
            func = <BattleSkillFunc>waver.skill(1)?.func(1),
            events: BattleEvent[];

        battle.addActor(waver);
        battle.addActor(artoria);
        battle.addActor(target);

        expect(waver.state.position).to.equal(1);
        expect(artoria.state.position).to.equal(2);

        events = await func.execute(battle);
        expect(events[0].target?.props.id).to.equal(waver.props.id);

        battle.actors().targetAlly(2, BattleSelectType.SELECT);
        events = await func.execute(battle);
        expect(events[0].target?.props.id).to.equal(artoria.props.id);

        battle.actors().targetAlly(1, BattleSelectType.SELECT);
        events = await func.execute(battle);
        expect(events[0].target?.props.id).to.equal(waver.props.id);
    });

    it("ally target resets on position change", async () => {
        //todo
    });

    it("ally attacks follow target", async () => {
        let battle = createBattle(),
            artoria = servant(2, BattleTeam.PLAYER),
            cu = servant(17, BattleTeam.ENEMY),
            emiya = servant(11, BattleTeam.ENEMY),
            events: BattleEvent[];

        battle.addActor(artoria);
        battle.addActor(cu);
        battle.addActor(emiya);

        const actions = new BattleAttackActionList();
        actions.add(artoria, Card.BUSTER, false);

        events = await artoria.autoAttack(actions.get(1));
        expect(events[0].target?.id()).to.equal(cu.id());

        battle.actors().targetEnemy(2, BattleSelectType.ACTIVE);
        events = await artoria.autoAttack(actions.get(1));
        expect(events[0].target?.id()).to.equal(emiya.id());

        battle.actors().targetEnemy(1, BattleSelectType.ACTIVE);
        events = await artoria.autoAttack(actions.get(1));
        expect(events[0].target?.id()).to.equal(cu.id());
    });
});
