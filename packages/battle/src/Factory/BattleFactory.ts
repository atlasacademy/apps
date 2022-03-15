import { ApiConnector, Language, Region } from "@atlasacademy/api-connector";

import { BattleActor } from "../Actor/BattleActor";
import { Battle } from "../Battle";
import createServantActor, { BattleServantActorProps } from "./createServantActor";

export default class BattleFactory {
    private currentPhase = 1;
    private nextActorId = 1;
    private region = Region.JP;

    constructor(public battle = new Battle()) {
        //
    }

    reset() {
        this.battle = new Battle();
        this.currentPhase = 1;
        this.nextActorId = 1;
        this.region = Region.JP;
    }

    addServant(props: BattleServantActorProps): BattleActor {
        const actor = createServantActor(this.generateId(), this.currentPhase, props);

        this.battle.addActor(actor);

        return actor;
    }

    advancePhase() {
        this.currentPhase++;
    }

    async load() {
        await this.battle.constants().initRegion(this.region);
    }

    setRegion(region: Region, language: Language = Language.DEFAULT) {
        this.battle.state.api = new ApiConnector({
            region,
            language,
        });

        this.region = region;
    }

    private generateId(): number {
        const actorId = this.nextActorId;

        this.nextActorId++;

        return actorId;
    }
}
