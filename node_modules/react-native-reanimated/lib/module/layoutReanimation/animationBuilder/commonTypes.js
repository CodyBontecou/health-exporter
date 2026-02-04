'use strict';

// this is just a temporary mock

export let LayoutAnimationType = /*#__PURE__*/function (LayoutAnimationType) {
  LayoutAnimationType[LayoutAnimationType["ENTERING"] = 1] = "ENTERING";
  LayoutAnimationType[LayoutAnimationType["EXITING"] = 2] = "EXITING";
  LayoutAnimationType[LayoutAnimationType["LAYOUT"] = 3] = "LAYOUT";
  LayoutAnimationType[LayoutAnimationType["SHARED_ELEMENT_TRANSITION"] = 4] = "SHARED_ELEMENT_TRANSITION";
  LayoutAnimationType[LayoutAnimationType["SHARED_ELEMENT_TRANSITION_PROGRESS"] = 5] = "SHARED_ELEMENT_TRANSITION_PROGRESS";
  return LayoutAnimationType;
}({});
/**
 * Used to configure the `.defaultTransitionType()` shared transition modifier.
 *
 * @experimental
 */
export let SharedTransitionType = /*#__PURE__*/function (SharedTransitionType) {
  SharedTransitionType["ANIMATION"] = "animation";
  SharedTransitionType["PROGRESS_ANIMATION"] = "progressAnimation";
  return SharedTransitionType;
}({});
//# sourceMappingURL=commonTypes.js.map