import { ClassName, Quest, QuestEnemy } from "@atlasacademy/api-connector";

export enum CalcStringType {
    OFF = "off",
    ERESH = "eresh",
    ARCHIMEDES = "archimedes",
}

const DEFAULT_ESM = new Map([
    [ClassName.RIDER, 1.1],
    [ClassName.CASTER, 1.2],
    [ClassName.ASSASSIN, 0.9],
    [ClassName.BERSERKER, 0.8],
    [ClassName.MOON_CANCER, 1.2],
]);

export const getEnemyCalcString = (enemy: QuestEnemy.QuestEnemy): string => {
    const defaultESM = DEFAULT_ESM.get(enemy.svt.className) ?? 1,
        enemyEsm = enemy.serverMod.tdRate / 1000,
        esmString = enemyEsm !== defaultESM ? ` esm${enemyEsm}` : "";

    return `${enemy.svt.className.toLowerCase()} ${enemy.svt.attribute.toLowerCase()} hp${enemy.hp}${esmString}`;
};

export const getStageCalcString = (
    calcStringType: CalcStringType,
    enemies: QuestEnemy.QuestEnemy[],
    config?: { indexStart?: number; waveSize?: number }
): string => {
    const enemyDeckEnemies = enemies
            .filter((enemy) => enemy.deck === QuestEnemy.DeckType.ENEMY)
            .sort((a, b) => a.deckId - b.deckId)
            .slice(0, config?.waveSize ?? 3),
        enemyCalcStrings = enemyDeckEnemies.map(
            (enemy, enemyIdx) => `enemy${(config?.indexStart ?? 0) + enemyIdx + 1} ${getEnemyCalcString(enemy)}`
        );

    if (enemyDeckEnemies.length === 0) return "";

    switch (calcStringType) {
        case CalcStringType.OFF:
            return "";
        case CalcStringType.ERESH:
            return enemyCalcStrings.join(" ");
        case CalcStringType.ARCHIMEDES:
            return "[" + enemyCalcStrings.join(", ") + "]";
    }
};

export const getStagesCalcString = (calcStringType: CalcStringType, stages: Quest.Stage[]): string => {
    switch (calcStringType) {
        case CalcStringType.OFF:
            return "";
        case CalcStringType.ERESH:
            return stages
                .map((stage, stageIdx) => {
                    const waveSize = stage.enemyFieldPosCount ?? 3;
                    return getStageCalcString(calcStringType, stage.enemies, {
                        indexStart: stageIdx * waveSize,
                        waveSize,
                    });
                })
                .join(" ");
        case CalcStringType.ARCHIMEDES:
            return stages.map((stage) => getStageCalcString(calcStringType, stage.enemies)).join(" ");
    }
};
