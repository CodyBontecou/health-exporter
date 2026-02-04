import React, { Suspense, Fragment } from 'react';

var infiniteThenable = {
  then: function then() {}
};
function Suspender(_ref) {
  var freeze = _ref.freeze,
    children = _ref.children;
  if (freeze) {
    throw infiniteThenable;
  }
  return React.createElement(Fragment, null, children);
}
function Freeze(_ref2) {
  var freeze = _ref2.freeze,
    children = _ref2.children,
    _ref2$placeholder = _ref2.placeholder,
    placeholder = _ref2$placeholder === void 0 ? null : _ref2$placeholder;
  return React.createElement(Suspense, {
    fallback: placeholder
  }, React.createElement(Suspender, {
    freeze: freeze
  }, children));
}

export { Freeze };
//# sourceMappingURL=index.modern.js.map
