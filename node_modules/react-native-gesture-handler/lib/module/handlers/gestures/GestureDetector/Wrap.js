var _Reanimated$default$c, _Reanimated$default;

import React from 'react';
import { Reanimated } from '../reanimatedWrapper';
import { tagMessage } from '../../../utils';
export class Wrap extends React.Component {
  render() {
    try {
      // I don't think that fighting with types over such a simple function is worth it
      // The only thing it does is add 'collapsable: false' to the child component
      // to make sure it is in the native view hierarchy so the detector can find
      // correct viewTag to attach to.
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const child = React.Children.only(this.props.children);
      return /*#__PURE__*/React.cloneElement(child, {
        collapsable: false
      }, // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      child.props.children);
    } catch (e) {
      throw new Error(tagMessage(`GestureDetector got more than one view as a child. If you want the gesture to work on multiple views, wrap them with a common parent and attach the gesture to that view.`));
    }
  }

}
export const AnimatedWrap = (_Reanimated$default$c = Reanimated === null || Reanimated === void 0 ? void 0 : (_Reanimated$default = Reanimated.default) === null || _Reanimated$default === void 0 ? void 0 : _Reanimated$default.createAnimatedComponent(Wrap)) !== null && _Reanimated$default$c !== void 0 ? _Reanimated$default$c : Wrap;
//# sourceMappingURL=Wrap.js.map