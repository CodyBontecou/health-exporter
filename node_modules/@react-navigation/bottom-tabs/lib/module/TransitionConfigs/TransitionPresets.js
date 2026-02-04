"use strict";

import { forFade, forShift } from "./SceneStyleInterpolators.js";
import { FadeSpec, ShiftSpec } from "./TransitionSpecs.js";
export const FadeTransition = {
  transitionSpec: FadeSpec,
  sceneStyleInterpolator: forFade
};
export const ShiftTransition = {
  transitionSpec: ShiftSpec,
  sceneStyleInterpolator: forShift
};
//# sourceMappingURL=TransitionPresets.js.map