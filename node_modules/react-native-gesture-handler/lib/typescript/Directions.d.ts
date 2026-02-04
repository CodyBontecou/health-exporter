export declare const Directions: {
    readonly RIGHT: 1;
    readonly LEFT: 2;
    readonly UP: 4;
    readonly DOWN: 8;
};
export declare const DiagonalDirections: {
    readonly UP_RIGHT: number;
    readonly DOWN_RIGHT: number;
    readonly UP_LEFT: number;
    readonly DOWN_LEFT: number;
};
export type Directions = typeof Directions[keyof typeof Directions];
export type DiagonalDirections = typeof DiagonalDirections[keyof typeof DiagonalDirections];
