declare class PolynomialFit {
    coefficients: number[];
    constructor(degree: number);
}
export default class LeastSquareSolver {
    private x;
    private y;
    private w;
    constructor(x: number[], y: number[], w: number[]);
    solve(degree: number): PolynomialFit | null;
}
export {};
