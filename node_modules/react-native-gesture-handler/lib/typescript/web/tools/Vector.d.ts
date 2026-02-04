import { DiagonalDirections, Directions } from '../../Directions';
import PointerTracker from './PointerTracker';
export default class Vector {
    private readonly x;
    private readonly y;
    private readonly unitX;
    private readonly unitY;
    private readonly _magnitude;
    constructor(x: number, y: number);
    static fromDirection(direction: Directions | DiagonalDirections): Vector;
    static fromVelocity(tracker: PointerTracker, pointerId: number): Vector;
    get magnitude(): number;
    computeSimilarity(vector: Vector): number;
    isSimilar(vector: Vector, threshold: number): boolean;
}
