function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var React = require('react');
var React__default = _interopDefault(React);

var infiniteThenable = {
  then: function then() {}
};
function Suspender(_ref) {
  var freeze = _ref.freeze,
    children = _ref.children;
  if (freeze) {
    throw infiniteThenable;
  }
  return React__default.createElement(React.Fragment, null, children);
}
function Freeze(_ref2) {
  var freeze = _ref2.freeze,
    children = _ref2.children,
    _ref2$placeholder = _ref2.placeholder,
    placeholder = _ref2$placeholder === void 0 ? null : _ref2$placeholder;
  return React__default.createElement(React.Suspense, {
    fallback: placeholder
  }, React__default.createElement(Suspender, {
    freeze: freeze
  }, children));
}

exports.Freeze = Freeze;
//# sourceMappingURL=index.js.map
