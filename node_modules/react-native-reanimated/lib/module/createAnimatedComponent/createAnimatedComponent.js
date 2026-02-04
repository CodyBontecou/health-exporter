'use strict';

function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
import React from 'react';
import { Platform } from 'react-native';
import "../layoutReanimation/animationsManager.js";
import invariant from 'invariant';
import { adaptViewConfig } from "../ConfigHelper.js";
import { findHostInstance } from '../platform-specific/findHostInstance';
import { enableLayoutAnimations } from "../core.js";
import { SharedTransition, LayoutAnimationType } from "../layoutReanimation/index.js";
import { getShadowNodeWrapperFromRef } from '../fabricUtils';
import { removeFromPropsRegistry } from "../PropsRegistry.js";
import { getReduceMotionFromConfig } from "../animation/util.js";
import { maybeBuild } from "../animationBuilder.js";
import { SkipEnteringContext } from "../component/LayoutAnimationConfig.js";
import JSPropsUpdater from './JSPropsUpdater';
import { flattenArray } from "./utils.js";
import setAndForwardRef from "./setAndForwardRef.js";
import { isFabric, isJest, isWeb, shouldBeUseWeb } from "../PlatformChecker.js";
import { InlinePropManager } from "./InlinePropManager.js";
import { PropsFilter } from "./PropsFilter.js";
import { startWebLayoutAnimation, tryActivateLayoutTransition, configureWebLayoutAnimations, getReducedMotionFromConfig, saveSnapshot } from "../layoutReanimation/web/index.js";
import { updateLayoutAnimations } from "../UpdateLayoutAnimations.js";
import { addHTMLMutationObserver } from "../layoutReanimation/web/domUtils.js";
import { getViewInfo } from "./getViewInfo.js";
import { NativeEventsManager } from "./NativeEventsManager.js";
import { ReanimatedError } from "../errors.js";
const IS_WEB = isWeb();
const IS_JEST = isJest();
const SHOULD_BE_USE_WEB = shouldBeUseWeb();
if (IS_WEB) {
  configureWebLayoutAnimations();
}
function onlyAnimatedStyles(styles) {
  return styles.filter(style => style?.viewDescriptors);
}

/**
 * Lets you create an Animated version of any React Native component.
 *
 * @param component - The component you want to make animatable.
 * @returns A component that Reanimated is capable of animating.
 * @see https://docs.swmansion.com/react-native-reanimated/docs/core/createAnimatedComponent
 */

// Don't change the order of overloads, since such a change breaks current behavior

/**
 * @deprecated Please use `Animated.FlatList` component instead of calling
 *   `Animated.createAnimatedComponent(FlatList)` manually.
 */
// @ts-ignore This is required to create this overload, since type of createAnimatedComponent is incorrect and doesn't include typeof FlatList

let id = 0;
export function createAnimatedComponent(Component, options) {
  invariant(typeof Component !== 'function' || Component.prototype && Component.prototype.isReactComponent, `Looks like you're passing a function component \`${Component.name}\` to \`createAnimatedComponent\` function which supports only class components. Please wrap your function component with \`React.forwardRef()\` or use a class component instead.`);
  class AnimatedComponent extends React.Component {
    _styles = null;
    _isFirstRender = true;
    jestAnimatedStyle = {
      value: {}
    };
    _componentRef = null;
    _sharedElementTransition = null;
    _jsPropsUpdater = new JSPropsUpdater();
    _InlinePropManager = new InlinePropManager();
    _PropsFilter = new PropsFilter();
    static contextType = SkipEnteringContext;
    reanimatedID = id++;
    constructor(props) {
      super(props);
      if (IS_JEST) {
        this.jestAnimatedStyle = {
          value: {}
        };
      }
      const entering = this.props.entering;
      if (entering && isFabric()) {
        updateLayoutAnimations(this.reanimatedID, LayoutAnimationType.ENTERING, maybeBuild(entering, this.props?.style, AnimatedComponent.displayName));
      }
    }
    componentDidMount() {
      if (!IS_WEB) {
        // It exists only on native platforms. We initialize it here because the ref to the animated component is available only post-mount
        this._NativeEventsManager = new NativeEventsManager(this, options);
      }
      this._NativeEventsManager?.attachEvents();
      this._jsPropsUpdater.addOnJSPropsChangeListener(this);
      this._attachAnimatedStyles();
      this._InlinePropManager.attachInlineProps(this, this._getViewInfo());
      const layout = this.props.layout;
      if (layout) {
        this._configureLayoutTransition();
      }
      if (IS_WEB) {
        if (this.props.exiting) {
          saveSnapshot(this._componentRef);
        }
        if (!this.props.entering || getReducedMotionFromConfig(this.props.entering)) {
          this._isFirstRender = false;
          return;
        }
        const skipEntering = this.context?.current;
        if (!skipEntering) {
          startWebLayoutAnimation(this.props, this._componentRef, LayoutAnimationType.ENTERING);
        } else {
          this._componentRef.style.visibility = 'initial';
        }
      }
      this._isFirstRender = false;
    }
    componentWillUnmount() {
      this._NativeEventsManager?.detachEvents();
      this._jsPropsUpdater.removeOnJSPropsChangeListener(this);
      this._detachStyles();
      this._InlinePropManager.detachInlineProps();
      if (this.props.sharedTransitionTag) {
        this._configureSharedTransition(true);
      }
      this._sharedElementTransition?.unregisterTransition(this.getComponentViewTag(), true);
      const exiting = this.props.exiting;
      if (IS_WEB && this._componentRef && exiting && !getReducedMotionFromConfig(exiting)) {
        addHTMLMutationObserver();
        startWebLayoutAnimation(this.props, this._componentRef, LayoutAnimationType.EXITING);
      } else if (exiting && !IS_WEB && !isFabric()) {
        const reduceMotionInExiting = 'getReduceMotion' in exiting && typeof exiting.getReduceMotion === 'function' ? getReduceMotionFromConfig(exiting.getReduceMotion()) : getReduceMotionFromConfig();
        if (!reduceMotionInExiting) {
          updateLayoutAnimations(this.getComponentViewTag(), LayoutAnimationType.EXITING, maybeBuild(exiting, this.props?.style, AnimatedComponent.displayName));
        }
      }
    }
    getComponentViewTag() {
      return this._getViewInfo().viewTag;
    }
    _detachStyles() {
      const viewTag = this.getComponentViewTag();
      if (viewTag !== -1 && this._styles !== null) {
        for (const style of this._styles) {
          style.viewDescriptors.remove(viewTag);
        }
        if (this.props.animatedProps?.viewDescriptors) {
          this.props.animatedProps.viewDescriptors.remove(viewTag);
        }
        if (isFabric()) {
          removeFromPropsRegistry(viewTag);
        }
      }
    }
    _updateFromNative(props) {
      if (options?.setNativeProps) {
        options.setNativeProps(this._componentRef, props);
      } else {
        this._componentRef?.setNativeProps?.(props);
      }
    }
    _getViewInfo() {
      if (this._viewInfo !== undefined) {
        return this._viewInfo;
      }
      let viewTag;
      let viewName;
      let shadowNodeWrapper = null;
      let viewConfig;
      if (SHOULD_BE_USE_WEB) {
        // At this point I assume that `_setComponentRef` was already called and `_component` is set.
        // `this._component` on web represents HTMLElement of our component, that's why we use casting
        viewTag = this._componentRef;
        viewName = null;
        shadowNodeWrapper = null;
        viewConfig = null;
      } else {
        const hostInstance = findHostInstance(this);
        if (!hostInstance) {
          /* 
            findHostInstance can return null for a component that doesn't render anything 
            (render function returns null). Example: 
            svg Stop: https://github.com/react-native-svg/react-native-svg/blob/develop/src/elements/Stop.tsx
          */
          throw new ReanimatedError('Cannot find host instance for this component. Maybe it renders nothing?');
        }
        const viewInfo = getViewInfo(hostInstance);
        viewTag = viewInfo.viewTag;
        viewName = viewInfo.viewName;
        viewConfig = viewInfo.viewConfig;
        shadowNodeWrapper = isFabric() ? getShadowNodeWrapperFromRef(this, hostInstance) : null;
      }
      this._viewInfo = {
        viewTag,
        viewName,
        shadowNodeWrapper,
        viewConfig
      };
      return this._viewInfo;
    }
    _attachAnimatedStyles() {
      const styles = this.props.style ? onlyAnimatedStyles(flattenArray(this.props.style)) : [];
      const prevStyles = this._styles;
      this._styles = styles;
      const prevAnimatedProps = this._animatedProps;
      this._animatedProps = this.props.animatedProps;
      const {
        viewTag,
        viewName,
        shadowNodeWrapper,
        viewConfig
      } = this._getViewInfo();

      // update UI props whitelist for this view
      const hasReanimated2Props = this.props.animatedProps?.viewDescriptors || styles.length;
      if (hasReanimated2Props && viewConfig) {
        adaptViewConfig(viewConfig);
      }

      // remove old styles
      if (prevStyles) {
        // in most of the cases, views have only a single animated style and it remains unchanged
        const hasOneSameStyle = styles.length === 1 && prevStyles.length === 1 && styles[0] === prevStyles[0];
        if (!hasOneSameStyle) {
          // otherwise, remove each style that is not present in new styles
          for (const prevStyle of prevStyles) {
            const isPresent = styles.some(style => style === prevStyle);
            if (!isPresent) {
              prevStyle.viewDescriptors.remove(viewTag);
            }
          }
        }
      }
      styles.forEach(style => {
        style.viewDescriptors.add({
          tag: viewTag,
          name: viewName,
          shadowNodeWrapper
        });
        if (IS_JEST) {
          /**
           * We need to connect Jest's TestObject instance whose contains just
           * props object with the updateProps() function where we update the
           * properties of the component. We can't update props object directly
           * because TestObject contains a copy of props - look at render
           * function: const props = this._filterNonAnimatedProps(this.props);
           */
          this.jestAnimatedStyle.value = {
            ...this.jestAnimatedStyle.value,
            ...style.initial.value
          };
          style.jestAnimatedStyle.current = this.jestAnimatedStyle;
        }
      });

      // detach old animatedProps
      if (prevAnimatedProps && prevAnimatedProps !== this.props.animatedProps) {
        prevAnimatedProps.viewDescriptors.remove(viewTag);
      }

      // attach animatedProps property
      if (this.props.animatedProps?.viewDescriptors) {
        this.props.animatedProps.viewDescriptors.add({
          tag: viewTag,
          name: viewName,
          shadowNodeWrapper: shadowNodeWrapper
        });
      }
    }
    componentDidUpdate(prevProps, _prevState,
    // This type comes straight from React
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    snapshot) {
      const layout = this.props.layout;
      const oldLayout = prevProps.layout;
      if (layout !== oldLayout) {
        this._configureLayoutTransition();
      }
      if (this.props.sharedTransitionTag !== undefined || prevProps.sharedTransitionTag !== undefined) {
        this._configureSharedTransition();
      }
      this._NativeEventsManager?.updateEvents(prevProps);
      this._attachAnimatedStyles();
      this._InlinePropManager.attachInlineProps(this, this._getViewInfo());
      if (IS_WEB && this.props.exiting) {
        saveSnapshot(this._componentRef);
      }

      // Snapshot won't be undefined because it comes from getSnapshotBeforeUpdate method
      if (IS_WEB && snapshot !== null && this.props.layout && !getReducedMotionFromConfig(this.props.layout)) {
        tryActivateLayoutTransition(this.props, this._componentRef, snapshot);
      }
    }
    _configureLayoutTransition() {
      if (IS_WEB) {
        return;
      }
      const layout = this.props.layout ? maybeBuild(this.props.layout, undefined /* We don't have to warn user if style has common properties with animation for LAYOUT */, AnimatedComponent.displayName) : undefined;
      updateLayoutAnimations(this.getComponentViewTag(), LayoutAnimationType.LAYOUT, layout);
    }
    _configureSharedTransition(isUnmounting = false) {
      if (IS_WEB) {
        return;
      }
      const {
        sharedTransitionTag
      } = this.props;
      if (!sharedTransitionTag) {
        this._sharedElementTransition?.unregisterTransition(this.getComponentViewTag(), isUnmounting);
        this._sharedElementTransition = null;
        return;
      }
      const sharedElementTransition = this.props.sharedTransitionStyle ?? this._sharedElementTransition ?? new SharedTransition();
      sharedElementTransition.registerTransition(this.getComponentViewTag(), sharedTransitionTag, isUnmounting);
      this._sharedElementTransition = sharedElementTransition;
    }
    _resolveComponentRef = ref => {
      const componentRef = ref;
      // Component can specify ref which should be animated when animated version of the component is created.
      // Otherwise, we animate the component itself.
      if (componentRef && componentRef.getAnimatableRef) {
        return componentRef.getAnimatableRef();
      }
      return componentRef;
    };
    _setComponentRef = setAndForwardRef({
      getForwardedRef: () => this.props.forwardedRef,
      setLocalRef: ref => {
        if (!ref) {
          // component has been unmounted
          return;
        }
        if (ref !== this._componentRef) {
          this._componentRef = this._resolveComponentRef(ref);
          // if ref is changed, reset viewInfo
          this._viewInfo = undefined;
        }
        const tag = this.getComponentViewTag();
        const {
          layout,
          entering,
          exiting,
          sharedTransitionTag
        } = this.props;
        if (layout || entering || exiting || sharedTransitionTag) {
          if (!SHOULD_BE_USE_WEB) {
            enableLayoutAnimations(true, false);
          }
          if (sharedTransitionTag) {
            this._configureSharedTransition();
          }
          if (exiting && isFabric()) {
            const reduceMotionInExiting = 'getReduceMotion' in exiting && typeof exiting.getReduceMotion === 'function' ? getReduceMotionFromConfig(exiting.getReduceMotion()) : getReduceMotionFromConfig();
            if (!reduceMotionInExiting) {
              updateLayoutAnimations(tag, LayoutAnimationType.EXITING, maybeBuild(exiting, this.props?.style, AnimatedComponent.displayName));
            }
          }
          const skipEntering = this.context?.current;
          if (entering && !skipEntering && !IS_WEB) {
            updateLayoutAnimations(tag, LayoutAnimationType.ENTERING, maybeBuild(entering, this.props?.style, AnimatedComponent.displayName));
          }
        }
      }
    });

    // This is a component lifecycle method from React, therefore we are not calling it directly.
    // It is called before the component gets rerendered. This way we can access components' position before it changed
    // and later on, in componentDidUpdate, calculate translation for layout transition.
    getSnapshotBeforeUpdate() {
      if (IS_WEB && this._componentRef?.getBoundingClientRect !== undefined) {
        return this._componentRef.getBoundingClientRect();
      }
      return null;
    }
    render() {
      const filteredProps = this._PropsFilter.filterNonAnimatedProps(this);
      if (IS_JEST) {
        filteredProps.jestAnimatedStyle = this.jestAnimatedStyle;
      }

      // Layout animations on web are set inside `componentDidMount` method, which is called after first render.
      // Because of that we can encounter a situation in which component is visible for a short amount of time, and later on animation triggers.
      // I've tested that on various browsers and devices and it did not happen to me. To be sure that it won't happen to someone else,
      // I've decided to hide component at first render. Its visibility is reset in `componentDidMount`.
      if (this._isFirstRender && IS_WEB && filteredProps.entering && !getReducedMotionFromConfig(filteredProps.entering)) {
        filteredProps.style = {
          ...(filteredProps.style ?? {}),
          visibility: 'hidden' // Hide component until `componentDidMount` triggers
        };
      }
      const platformProps = Platform.select({
        web: {},
        default: {
          collapsable: false
        }
      });
      const skipEntering = this.context?.current;
      const nativeID = skipEntering || !isFabric() ? undefined : `${this.reanimatedID}`;
      const jestProps = IS_JEST ? {
        jestInlineStyle: this.props.style,
        jestAnimatedStyle: this.jestAnimatedStyle
      } : {};
      return /*#__PURE__*/React.createElement(Component, _extends({
        nativeID: nativeID
      }, filteredProps, jestProps, {
        // Casting is used here, because ref can be null - in that case it cannot be assigned to HTMLElement.
        // After spending some time trying to figure out what to do with this problem, we decided to leave it this way
        ref: this._setComponentRef
      }, platformProps));
    }
  }
  AnimatedComponent.displayName = `AnimatedComponent(${Component.displayName || Component.name || 'Component'})`;
  return /*#__PURE__*/React.forwardRef((props, ref) => {
    return /*#__PURE__*/React.createElement(AnimatedComponent, _extends({}, props, ref === null ? null : {
      forwardedRef: ref
    }));
  });
}
//# sourceMappingURL=createAnimatedComponent.js.map