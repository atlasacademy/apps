export enum GameConstantKey {
    ATTACK_RATE_RANDOM_MAX = 'ATTACK_RATE_RANDOM_MAX',
    ATTACK_RATE_RANDOM_MIN = 'ATTACK_RATE_RANDOM_MIN',
}

type GameConstants = {
    [key in GameConstantKey]?: number
}

export default GameConstants;
