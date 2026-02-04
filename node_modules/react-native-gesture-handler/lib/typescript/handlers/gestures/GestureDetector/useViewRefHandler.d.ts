import { GestureDetectorState } from './types';
import React from 'react';
export declare function useViewRefHandler(state: GestureDetectorState, updateAttachedGestures: (skipConfigUpdate?: boolean) => void): (ref: React.Component | null) => void;
