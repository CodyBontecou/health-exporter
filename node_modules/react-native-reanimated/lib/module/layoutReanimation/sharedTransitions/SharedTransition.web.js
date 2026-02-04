'use strict';

import { ReduceMotion } from "../../commonTypes.js";
export class SharedTransition {
  custom() {
    return this;
  }
  progressAnimation() {
    return this;
  }
  duration() {
    return this;
  }
  reduceMotion() {
    return this;
  }
  defaultTransitionType() {
    return this;
  }
  registerTransition() {
    // no-op
  }
  unregisterTransition() {
    // no-op
  }
  getReduceMotion() {
    return ReduceMotion.System;
  }

  // static builder methods

  static custom() {
    return new SharedTransition();
  }
  static duration() {
    return new SharedTransition();
  }
  static progressAnimation() {
    return new SharedTransition();
  }
  static defaultTransitionType() {
    return new SharedTransition();
  }
  static reduceMotion() {
    return new SharedTransition();
  }
}
//# sourceMappingURL=SharedTransition.web.js.map