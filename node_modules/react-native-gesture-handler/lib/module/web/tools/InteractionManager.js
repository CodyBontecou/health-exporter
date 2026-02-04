function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import { State } from '../../State';
export default class InteractionManager {
  // Private becaues of singleton
  // eslint-disable-next-line no-useless-constructor, @typescript-eslint/no-empty-function
  constructor() {
    _defineProperty(this, "waitForRelations", new Map());

    _defineProperty(this, "simultaneousRelations", new Map());

    _defineProperty(this, "blocksHandlersRelations", new Map());
  }

  configureInteractions(handler, config) {
    this.dropRelationsForHandlerWithTag(handler.getTag());

    if (config.waitFor) {
      const waitFor = [];
      config.waitFor.forEach(otherHandler => {
        // New API reference
        if (typeof otherHandler === 'number') {
          waitFor.push(otherHandler);
        } else {
          // Old API reference
          waitFor.push(otherHandler.handlerTag);
        }
      });
      this.waitForRelations.set(handler.getTag(), waitFor);
    }

    if (config.simultaneousHandlers) {
      const simultaneousHandlers = [];
      config.simultaneousHandlers.forEach(otherHandler => {
        if (typeof otherHandler === 'number') {
          simultaneousHandlers.push(otherHandler);
        } else {
          simultaneousHandlers.push(otherHandler.handlerTag);
        }
      });
      this.simultaneousRelations.set(handler.getTag(), simultaneousHandlers);
    }

    if (config.blocksHandlers) {
      const blocksHandlers = [];
      config.blocksHandlers.forEach(otherHandler => {
        if (typeof otherHandler === 'number') {
          blocksHandlers.push(otherHandler);
        } else {
          blocksHandlers.push(otherHandler.handlerTag);
        }
      });
      this.blocksHandlersRelations.set(handler.getTag(), blocksHandlers);
    }
  }

  shouldWaitForHandlerFailure(handler, otherHandler) {
    const waitFor = this.waitForRelations.get(handler.getTag());
    return (waitFor === null || waitFor === void 0 ? void 0 : waitFor.find(tag => {
      return tag === otherHandler.getTag();
    })) !== undefined;
  }

  shouldRecognizeSimultaneously(handler, otherHandler) {
    const simultaneousHandlers = this.simultaneousRelations.get(handler.getTag());
    return (simultaneousHandlers === null || simultaneousHandlers === void 0 ? void 0 : simultaneousHandlers.find(tag => {
      return tag === otherHandler.getTag();
    })) !== undefined;
  }

  shouldRequireHandlerToWaitForFailure(handler, otherHandler) {
    const waitFor = this.blocksHandlersRelations.get(handler.getTag());
    return (waitFor === null || waitFor === void 0 ? void 0 : waitFor.find(tag => {
      return tag === otherHandler.getTag();
    })) !== undefined;
  }

  shouldHandlerBeCancelledBy(_handler, otherHandler) {
    var _otherHandler$isButto;

    // We check constructor name instead of using `instanceof` in order do avoid circular dependencies
    const isNativeHandler = otherHandler.constructor.name === 'NativeViewGestureHandler';
    const isActive = otherHandler.getState() === State.ACTIVE;
    const isButton = ((_otherHandler$isButto = otherHandler.isButton) === null || _otherHandler$isButto === void 0 ? void 0 : _otherHandler$isButto.call(otherHandler)) === true;
    return isNativeHandler && isActive && !isButton;
  }

  dropRelationsForHandlerWithTag(handlerTag) {
    this.waitForRelations.delete(handlerTag);
    this.simultaneousRelations.delete(handlerTag);
    this.blocksHandlersRelations.delete(handlerTag);
  }

  reset() {
    this.waitForRelations.clear();
    this.simultaneousRelations.clear();
    this.blocksHandlersRelations.clear();
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new InteractionManager();
    }

    return this.instance;
  }

}

_defineProperty(InteractionManager, "instance", void 0);
//# sourceMappingURL=InteractionManager.js.map