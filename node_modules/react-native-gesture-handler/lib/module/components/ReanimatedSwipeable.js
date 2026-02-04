function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

// Similarily to the DrawerLayout component this deserves to be put in a
// separate repo. Although, keeping it here for the time being will allow us to
// move faster and fix possible issues quicker
import React, { forwardRef, useCallback, useImperativeHandle, useRef } from 'react';
import { GestureObjects as Gesture } from '../handlers/gestures/gestureObjects';
import { GestureDetector } from '../handlers/gestures/GestureDetector';
import Animated, { Extrapolation, interpolate, runOnJS, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { I18nManager, StyleSheet, View } from 'react-native';
const DRAG_TOSS = 0.05;
const Swipeable = /*#__PURE__*/forwardRef(function Swipeable(props, ref) {
  const {
    leftThreshold,
    rightThreshold,
    onSwipeableOpenStartDrag,
    onSwipeableCloseStartDrag,
    enableTrackpadTwoFingerGesture,
    enabled,
    containerStyle,
    childrenContainerStyle,
    animationOptions,
    overshootLeft,
    overshootRight,
    onSwipeableWillOpen,
    onSwipeableWillClose,
    onSwipeableOpen,
    onSwipeableClose,
    testID,
    ...remainingProps
  } = props;
  const rowState = useSharedValue(0);
  const userDrag = useSharedValue(0);
  const appliedTranslation = useSharedValue(0);
  const rowWidth = useSharedValue(0);
  const leftWidth = useSharedValue(0);
  const rightWidth = useSharedValue(0);
  const rightOffset = useSharedValue(0);
  const leftActionTranslate = useSharedValue(0);
  const rightActionTranslate = useSharedValue(0);
  const showLeftProgress = useSharedValue(0);
  const showRightProgress = useSharedValue(0);
  const swipeableMethods = useRef({
    close: () => {
      'worklet';
    },
    openLeft: () => {
      'worklet';
    },
    openRight: () => {
      'worklet';
    },
    reset: () => {
      'worklet';
    }
  });
  const defaultProps = {
    friction: 1,
    overshootFriction: 1
  };
  const {
    friction = defaultProps.friction,
    overshootFriction = defaultProps.overshootFriction
  } = props;
  const overshootLeftProp = overshootLeft;
  const overshootRightProp = overshootRight;
  const calculateCurrentOffset = useCallback(() => {
    'worklet';

    if (rowState.value === 1) {
      return leftWidth.value;
    } else if (rowState.value === -1) {
      return -rowWidth.value - rightOffset.value;
    }

    return 0;
  }, [leftWidth, rightOffset, rowState, rowWidth]);

  const updateAnimatedEvent = () => {
    'worklet';

    rightWidth.value = Math.max(0, rowWidth.value - rightOffset.value);
    const overshootLeft = overshootLeftProp !== null && overshootLeftProp !== void 0 ? overshootLeftProp : leftWidth.value > 0;
    const overshootRight = overshootRightProp !== null && overshootRightProp !== void 0 ? overshootRightProp : rightWidth.value > 0;
    const startOffset = rowState.value === 1 ? leftWidth.value : rowState.value === -1 ? -rightWidth.value : 0;
    const offsetDrag = userDrag.value / friction + startOffset;
    appliedTranslation.value = interpolate(offsetDrag, [-rightWidth.value - 1, -rightWidth.value, leftWidth.value, leftWidth.value + 1], [-rightWidth.value - (overshootRight ? 1 / overshootFriction : 0), -rightWidth.value, leftWidth.value, leftWidth.value + (overshootLeft ? 1 / overshootFriction : 0)]);
    showLeftProgress.value = leftWidth.value > 0 ? interpolate(appliedTranslation.value, [-1, 0, leftWidth.value], [0, 0, 1]) : 0;
    leftActionTranslate.value = interpolate(showLeftProgress.value, [0, Number.MIN_VALUE], [-10000, 0], Extrapolation.CLAMP);
    showRightProgress.value = rightWidth.value > 0 ? interpolate(appliedTranslation.value, [-rightWidth.value, 0, 1], [1, 0, 0]) : 0;
    rightActionTranslate.value = interpolate(showRightProgress.value, [0, Number.MIN_VALUE], [-10000, 0], Extrapolation.CLAMP);
  };

  const dispatchImmediateEvents = useCallback((fromValue, toValue) => {
    if (toValue > 0 && onSwipeableWillOpen) {
      onSwipeableWillOpen('left');
    } else if (toValue < 0 && onSwipeableWillOpen) {
      onSwipeableWillOpen('right');
    } else if (onSwipeableWillClose) {
      const closingDirection = fromValue > 0 ? 'left' : 'right';
      onSwipeableWillClose(closingDirection);
    }
  }, [onSwipeableWillClose, onSwipeableWillOpen]);
  const dispatchEndEvents = useCallback((fromValue, toValue) => {
    if (toValue > 0 && onSwipeableOpen) {
      onSwipeableOpen('left', swipeableMethods.current);
    } else if (toValue < 0 && onSwipeableOpen) {
      onSwipeableOpen('right', swipeableMethods.current);
    } else if (onSwipeableClose) {
      const closingDirection = fromValue > 0 ? 'left' : 'right';
      onSwipeableClose(closingDirection, swipeableMethods.current);
    }
  }, [onSwipeableClose, onSwipeableOpen]);
  const animationOptionsProp = animationOptions;
  const animateRow = useCallback((fromValue, toValue, velocityX) => {
    'worklet';

    rowState.value = Math.sign(toValue);
    const translationSpringConfig = {
      duration: 1000,
      dampingRatio: 0.9,
      stiffness: 500,
      velocity: velocityX,
      overshootClamping: true,
      ...animationOptionsProp
    };
    const progressSpringConfig = { ...translationSpringConfig,
      velocity: 0
    };
    appliedTranslation.value = withSpring(toValue, translationSpringConfig, isFinished => {
      if (isFinished) {
        runOnJS(dispatchEndEvents)(fromValue, toValue);
      }
    });
    const progressTarget = toValue === 0 ? 0 : 1;
    showLeftProgress.value = leftWidth.value > 0 ? withSpring(progressTarget, progressSpringConfig) : 0;
    showRightProgress.value = rightWidth.value > 0 ? withSpring(progressTarget, progressSpringConfig) : 0;
    runOnJS(dispatchImmediateEvents)(fromValue, toValue);
  }, [rowState, animationOptionsProp, appliedTranslation, showLeftProgress, leftWidth.value, showRightProgress, rightWidth.value, dispatchImmediateEvents, dispatchEndEvents]);

  const onRowLayout = ({
    nativeEvent
  }) => {
    rowWidth.value = nativeEvent.layout.width;
  };

  const {
    children,
    renderLeftActions,
    renderRightActions,
    dragOffsetFromLeftEdge = 10,
    dragOffsetFromRightEdge = 10
  } = props;
  swipeableMethods.current = {
    close() {
      'worklet';

      animateRow(calculateCurrentOffset(), 0);
    },

    openLeft() {
      'worklet';

      animateRow(calculateCurrentOffset(), leftWidth.value);
    },

    openRight() {
      'worklet';

      rightWidth.value = rowWidth.value - rightOffset.value;
      animateRow(calculateCurrentOffset(), -rightWidth.value);
    },

    reset() {
      'worklet';

      userDrag.value = 0;
      showLeftProgress.value = 0;
      appliedTranslation.value = 0;
      rowState.value = 0;
    }

  };
  const leftAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{
      translateX: leftActionTranslate.value
    }]
  }), [leftActionTranslate]);
  const leftElement = renderLeftActions && /*#__PURE__*/React.createElement(Animated.View, {
    style: [styles.leftActions, leftAnimatedStyle]
  }, renderLeftActions(showLeftProgress, appliedTranslation, swipeableMethods.current), /*#__PURE__*/React.createElement(View, {
    onLayout: ({
      nativeEvent
    }) => leftWidth.value = nativeEvent.layout.x
  }));
  const rightAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{
      translateX: rightActionTranslate.value
    }]
  }), [rightActionTranslate]);
  const rightElement = renderRightActions && /*#__PURE__*/React.createElement(Animated.View, {
    style: [styles.rightActions, rightAnimatedStyle]
  }, renderRightActions(showRightProgress, appliedTranslation, swipeableMethods.current), /*#__PURE__*/React.createElement(View, {
    onLayout: ({
      nativeEvent
    }) => rightOffset.value = nativeEvent.layout.x
  }));
  const leftThresholdProp = leftThreshold;
  const rightThresholdProp = rightThreshold;

  const handleRelease = event => {
    'worklet';

    const {
      velocityX
    } = event;
    userDrag.value = event.translationX;
    rightWidth.value = rowWidth.value - rightOffset.value;
    const leftThreshold = leftThresholdProp !== null && leftThresholdProp !== void 0 ? leftThresholdProp : leftWidth.value / 2;
    const rightThreshold = rightThresholdProp !== null && rightThresholdProp !== void 0 ? rightThresholdProp : rightWidth.value / 2;
    const startOffsetX = calculateCurrentOffset() + userDrag.value / friction;
    const translationX = (userDrag.value + DRAG_TOSS * velocityX) / friction;
    let toValue = 0;

    if (rowState.value === 0) {
      if (translationX > leftThreshold) {
        toValue = leftWidth.value;
      } else if (translationX < -rightThreshold) {
        toValue = -rightWidth.value;
      }
    } else if (rowState.value === 1) {
      // Swiped to left
      if (translationX > -leftThreshold) {
        toValue = leftWidth.value;
      }
    } else {
      // Swiped to right
      if (translationX < rightThreshold) {
        toValue = -rightWidth.value;
      }
    }

    animateRow(startOffsetX, toValue, velocityX / friction);
  };

  const close = () => {
    'worklet';

    animateRow(calculateCurrentOffset(), 0);
  };

  const tapGesture = Gesture.Tap().onStart(() => {
    if (rowState.value !== 0) {
      close();
    }
  });
  const panGesture = Gesture.Pan().onUpdate(event => {
    userDrag.value = event.translationX;
    const direction = rowState.value === -1 ? 'right' : rowState.value === 1 ? 'left' : event.translationX > 0 ? 'left' : 'right';

    if (rowState.value === 0 && onSwipeableOpenStartDrag) {
      runOnJS(onSwipeableOpenStartDrag)(direction);
    } else if (rowState.value !== 0 && onSwipeableCloseStartDrag) {
      runOnJS(onSwipeableCloseStartDrag)(direction);
    }

    updateAnimatedEvent();
  }).onEnd(event => {
    handleRelease(event);
  });

  if (enableTrackpadTwoFingerGesture) {
    panGesture.enableTrackpadTwoFingerGesture(enableTrackpadTwoFingerGesture);
  }

  panGesture.activeOffsetX([-dragOffsetFromRightEdge, dragOffsetFromLeftEdge]);
  tapGesture.shouldCancelWhenOutside(true);
  useImperativeHandle(ref, () => swipeableMethods.current, [swipeableMethods]);
  panGesture.enabled(enabled !== false);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{
      translateX: appliedTranslation.value
    }],
    pointerEvents: rowState.value === 0 ? 'auto' : 'box-only'
  }), [appliedTranslation, rowState]);
  const swipeableComponent = /*#__PURE__*/React.createElement(GestureDetector, {
    gesture: panGesture,
    touchAction: "pan-y"
  }, /*#__PURE__*/React.createElement(Animated.View, _extends({}, remainingProps, {
    onLayout: onRowLayout,
    style: [styles.container, containerStyle]
  }), leftElement, rightElement, /*#__PURE__*/React.createElement(GestureDetector, {
    gesture: tapGesture,
    touchAction: "pan-y"
  }, /*#__PURE__*/React.createElement(Animated.View, {
    style: [animatedStyle, childrenContainerStyle]
  }, children))));
  return testID ? /*#__PURE__*/React.createElement(View, {
    testID: testID
  }, swipeableComponent) : swipeableComponent;
});
export default Swipeable;
const styles = StyleSheet.create({
  container: {
    overflow: 'hidden'
  },
  leftActions: { ...StyleSheet.absoluteFillObject,
    flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row'
  },
  rightActions: { ...StyleSheet.absoluteFillObject,
    flexDirection: I18nManager.isRTL ? 'row' : 'row-reverse'
  }
});
//# sourceMappingURL=ReanimatedSwipeable.js.map