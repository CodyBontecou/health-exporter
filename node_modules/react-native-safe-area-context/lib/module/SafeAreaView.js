function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
import * as React from 'react';
import NativeSafeAreaView from './specs/NativeSafeAreaView';
import { useMemo } from 'react';
const defaultEdges = {
  top: 'additive',
  left: 'additive',
  bottom: 'additive',
  right: 'additive'
};
export const SafeAreaView = /*#__PURE__*/React.forwardRef(({
  edges,
  ...props
}, ref) => {
  const nativeEdges = useMemo(() => {
    if (edges == null) {
      return defaultEdges;
    }
    const edgesObj = Array.isArray(edges) ? edges.reduce((acc, edge) => {
      acc[edge] = 'additive';
      return acc;
    }, {}) :
    // ts has trouble with refining readonly arrays.
    edges;

    // make sure that we always pass all edges, required for fabric
    const requiredEdges = {
      top: edgesObj.top ?? 'off',
      right: edgesObj.right ?? 'off',
      bottom: edgesObj.bottom ?? 'off',
      left: edgesObj.left ?? 'off'
    };
    return requiredEdges;
  }, [edges]);
  return /*#__PURE__*/React.createElement(NativeSafeAreaView, _extends({}, props, {
    edges: nativeEdges,
    ref: ref
  }));
});
//# sourceMappingURL=SafeAreaView.js.map