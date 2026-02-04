import React from 'react';
import { GestureType } from '../gesture';
import { ComposedGesture } from '../gestureComposition';
import { AttachedGestureState, GestureDetectorState, WebEventHandler } from './types';
export declare function useDetectorUpdater(state: GestureDetectorState, preparedGesture: AttachedGestureState, gesturesToAttach: GestureType[], gestureConfig: ComposedGesture | GestureType, webEventHandlersRef: React.RefObject<WebEventHandler>): (skipConfigUpdate?: boolean) => void;
