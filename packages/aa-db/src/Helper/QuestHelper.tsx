export function describeQuestType(questId?: number, questPhase?: number): string {
    const prefix = Math.floor((questId ?? 0) / 1000000);

    switch (prefix) {
        case 91:
            return 'Interlude';
        case 94:
            return 'Strengthening';
        default:
            return 'Main Quest';
    }
}
