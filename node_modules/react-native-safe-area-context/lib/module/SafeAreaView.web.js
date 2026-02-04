function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from './SafeAreaContext';
const defaultEdges = {
  top: 'additive',
  left: 'additive',
  bottom: 'additive',
  right: 'additive'
};
function getEdgeValue(inset, current, mode) {
  switch (mode) {
    case 'off':
      return current;
    case 'maximum':
      return Math.max(current, inset);
    case 'additive':
    default:
      return current + inset;
  }
}
export const SafeAreaView = /*#__PURE__*/React.forwardRef(({
  style = {},
  mode,
  edges,
  ...rest
}, ref) => {
  const insets = useSafeAreaInsets();
  const edgesRecord = React.useMemo(() => {
    if (edges == null) {
      return defaultEdges;
    }
    return Array.isArray(edges) ? edges.reduce((acc, edge) => {
      acc[edge] = 'additive';
      return acc;
    }, {}) :
    // ts has trouble with refining readonly arrays.
    edges;
  }, [edges]);
  const appliedStyle = React.useMemo(() => {
    const flatStyle = StyleSheet.flatten(style);
    if (mode === 'margin') {
      const {
        margin = 0,
        marginVertical = margin,
        marginHorizontal = margin,
        marginTop = marginVertical,
        marginRight = marginHorizontal,
        marginBottom = marginVertical,
        marginLeft = marginHorizontal
      } = flatStyle;
      const marginStyle = {
        marginTop: getEdgeValue(insets.top, marginTop, edgesRecord.top),
        marginRight: getEdgeValue(insets.right, marginRight, edgesRecord.right),
        marginBottom: getEdgeValue(insets.bottom, marginBottom, edgesRecord.bottom),
        marginLeft: getEdgeValue(insets.left, marginLeft, edgesRecord.left)
      };
      return [style, marginStyle];
    } else {
      const {
        padding = 0,
        paddingVertical = padding,
        paddingHorizontal = padding,
        paddingTop = paddingVertical,
        paddingRight = paddingHorizontal,
        paddingBottom = paddingVertical,
        paddingLeft = paddingHorizontal
      } = flatStyle;
      const paddingStyle = {
        paddingTop: getEdgeValue(insets.top, paddingTop, edgesRecord.top),
        paddingRight: getEdgeValue(insets.right, paddingRight, edgesRecord.right),
        paddingBottom: getEdgeValue(insets.bottom, paddingBottom, edgesRecord.bottom),
        paddingLeft: getEdgeValue(insets.left, paddingLeft, edgesRecord.left)
      };
      return [style, paddingStyle];
    }
  }, [edgesRecord.bottom, edgesRecord.left, edgesRecord.right, edgesRecord.top, insets.bottom, insets.left, insets.right, insets.top, mode, style]);
  return /*#__PURE__*/React.createElement(View, _extends({
    style: appliedStyle
  }, rest, {
    ref: ref
  }));
});
//# sourceMappingURL=SafeAreaView.web.js.map