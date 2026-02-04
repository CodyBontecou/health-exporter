"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AnimatedWrap = exports.Wrap = void 0;

var _react = _interopRequireDefault(require("react"));

var _reanimatedWrapper = require("../reanimatedWrapper");

var _utils = require("../../../utils");

var _Reanimated$default$c, _Reanimated$default;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class Wrap extends _react.default.Component {
  render() {
    try {
      // I don't think that fighting with types over such a simple function is worth it
      // The only thing it does is add 'collapsable: false' to the child component
      // to make sure it is in the native view hierarchy so the detector can find
      // correct viewTag to attach to.
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const child = _react.default.Children.only(this.props.children);

      return /*#__PURE__*/_react.default.cloneElement(child, {
        collapsable: false
      }, // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      child.props.children);
    } catch (e) {
      throw new Error((0, _utils.tagMessage)(`GestureDetector got more than one view as a child. If you want the gesture to work on multiple views, wrap them with a common parent and attach the gesture to that view.`));
    }
  }

}

exports.Wrap = Wrap;
const AnimatedWrap = (_Reanimated$default$c = _reanimatedWrapper.Reanimated === null || _reanimatedWrapper.Reanimated === void 0 ? void 0 : (_Reanimated$default = _reanimatedWrapper.Reanimated.default) === null || _Reanimated$default === void 0 ? void 0 : _Reanimated$default.createAnimatedComponent(Wrap)) !== null && _Reanimated$default$c !== void 0 ? _Reanimated$default$c : Wrap;
exports.AnimatedWrap = AnimatedWrap;
//# sourceMappingURL=Wrap.js.map