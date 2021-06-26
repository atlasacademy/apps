import {Battle} from "../Battle";
import {BattleTeam} from "../Enum/BattleTeam";
import {BattleCommandAction, BattleCommandActionFactory} from "./BattleCommandAction";

export default function (battle: Battle): BattleCommandAction[] {
    const available: BattleCommandAction[] = [];

    battle.actors().activeActorsByTeam(BattleTeam.PLAYER).forEach(actor => {
        for (let pos = 1; pos <= 3; pos++) {
            const skill = actor.skill(pos);
            if (!skill || !skill.available())
                continue;

            const action = BattleCommandActionFactory.servantSkillAction(actor.position(), pos);
            if (action)
                available.push(action);
        }
    });

    return available;
}
