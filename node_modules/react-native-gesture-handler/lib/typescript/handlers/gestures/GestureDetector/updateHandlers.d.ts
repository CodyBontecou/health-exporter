import { GestureType } from '../gesture';
import { ComposedGesture } from '../gestureComposition';
import { AttachedGestureState } from './types';
export declare function updateHandlers(preparedGesture: AttachedGestureState, gestureConfig: ComposedGesture | GestureType, newGestures: GestureType[]): void;
