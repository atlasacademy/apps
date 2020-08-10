import ClassName from "../Enum/ClassName";
import QuestConsumeType from "../Enum/QuestConsumeType";
import QuestType from "../Enum/QuestType";
import Trait from "./Trait";

interface QuestPhase {
    id: number;
    phase: number;
    name: string;
    type: QuestType;
    consumeType: QuestConsumeType;
    consume: number;
    spotId: number;
    className: ClassName[];
    individuality: Trait[];
    qp: number;
    exp: number;
    bond: number;
    noticeAt: number;
    openedAt: number;
    closedAt: number;
}

export default QuestPhase;
