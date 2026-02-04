import { PointerType } from '../PointerType';
import type { Point, StylusData } from './interfaces';
export declare function isPointerInBounds(view: HTMLElement, { x, y }: Point): boolean;
export declare const PointerTypeMapping: Map<string, PointerType>;
export declare const degToRad: (degrees: number) => number;
export declare const coneToDeviation: (degrees: number) => number;
export declare function calculateViewScale(view: HTMLElement): {
    scaleX: number;
    scaleY: number;
};
export declare function tryExtractStylusData(event: PointerEvent): StylusData | undefined;
