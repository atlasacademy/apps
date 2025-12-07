import ClassName from "../Enum/ClassName";
import CondType from "../Enum/Cond";
import { Func } from "./Func";
import { Item, ItemAmount } from "./Item";
import { Skill } from "./Skill";

export interface ClassBoardClass {
    classId: number;
    className: ClassName;
    condType: CondType;
    condTargetId: number;
    condNum: number;
}

export interface ClassBoardCommandSpell {
    id: number;
    commandSpellId: number;
    name: string;
    detail: string;
    functions: Func[];
}

export interface ClassBoardLock {
    id: number;
    items: ItemAmount[];
    closedMessage: string;
    condType: CondType;
    condTargetId: number;
    condNum: number;
}

export enum ClassBoardSquareFlag {
    START = "start",
    BLANK = "blank",
}

export enum ClassBoardSkillType {
    NONE = "none",
    PASSIVE = "passive",
    COMMAND_SPELL = "commandSpell",
}

export interface ClassBoardSquare {
    id: number;
    icon?: string;
    items: ItemAmount[];
    posX: number;
    posY: number;
    skillType: ClassBoardSkillType;
    targetSkill?: Skill;
    upSkillLv: number;
    targetCommandSpell?: ClassBoardCommandSpell;
    lock?: ClassBoardLock;
    flags: ClassBoardSquareFlag[];
    priority: number;
}

export interface ClassBoardLine {
    id: number;
    prevSquareId: number;
    nextSquareId: number;
}

export interface ClassBoard {
    id: number;
    name: string;
    icon: string;
    dispItems: Item[];
    closedMessage: string;
    condType: CondType;
    condTargetId: number;
    condNum: number;
    parentClassBoardBaseId: number;
    classes: ClassBoardClass[];
    squares: ClassBoardSquare[];
    lines: ClassBoardLine[];
}
