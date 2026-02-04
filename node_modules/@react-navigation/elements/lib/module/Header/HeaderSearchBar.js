"use strict";

import { useNavigation, useTheme } from '@react-navigation/native';
import Color from 'color';
import * as React from 'react';
import { Animated, Image, Platform, StyleSheet, TextInput, View } from 'react-native';
import clearIcon from '../assets/clear-icon.png';
import closeIcon from '../assets/close-icon.png';
import searchIcon from '../assets/search-icon.png';
import { PlatformPressable } from "../PlatformPressable.js";
import { Text } from "../Text.js";
import { HeaderButton } from "./HeaderButton.js";
import { HeaderIcon } from "./HeaderIcon.js";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const INPUT_TYPE_TO_MODE = {
  text: 'text',
  number: 'numeric',
  phone: 'tel',
  email: 'email'
};
const useNativeDriver = Platform.OS !== 'web';
function HeaderSearchBarInternal({
  visible,
  inputType,
  autoFocus = true,
  autoCapitalize,
  placeholder = 'Search',
  cancelButtonText = 'Cancel',
  enterKeyHint = 'search',
  onChangeText,
  onClose,
  tintColor,
  style,
  ...rest
}, ref) {
  const navigation = useNavigation();
  const {
    dark,
    colors,
    fonts
  } = useTheme();
  const [value, setValue] = React.useState('');
  const [rendered, setRendered] = React.useState(visible);
  const [visibleAnim] = React.useState(() => new Animated.Value(visible ? 1 : 0));
  const [clearVisibleAnim] = React.useState(() => new Animated.Value(0));
  const visibleValueRef = React.useRef(visible);
  const clearVisibleValueRef = React.useRef(false);
  const inputRef = React.useRef(null);
  React.useEffect(() => {
    // Avoid act warning in tests just by rendering header
    if (visible === visibleValueRef.current) {
      return;
    }
    Animated.timing(visibleAnim, {
      toValue: visible ? 1 : 0,
      duration: 100,
      useNativeDriver
    }).start(({
      finished
    }) => {
      if (finished) {
        setRendered(visible);
        visibleValueRef.current = visible;
      }
    });
    return () => {
      visibleAnim.stopAnimation();
    };
  }, [visible, visibleAnim]);
  const hasText = value !== '';
  React.useEffect(() => {
    if (clearVisibleValueRef.current === hasText) {
      return;
    }
    Animated.timing(clearVisibleAnim, {
      toValue: hasText ? 1 : 0,
      duration: 100,
      useNativeDriver
    }).start(({
      finished
    }) => {
      if (finished) {
        clearVisibleValueRef.current = hasText;
      }
    });
  }, [clearVisibleAnim, hasText]);
  const clearText = React.useCallback(() => {
    inputRef.current?.clear();
    inputRef.current?.focus();
    setValue('');
  }, []);
  const onClear = React.useCallback(() => {
    clearText();
    // FIXME: figure out how to create a SyntheticEvent
    // @ts-expect-error: we don't have the native event here
    onChangeText?.({
      nativeEvent: {
        text: ''
      }
    });
  }, [clearText, onChangeText]);
  const cancelSearch = React.useCallback(() => {
    onClear();
    onClose();
  }, [onClear, onClose]);
  React.useEffect(() => navigation?.addListener('blur', cancelSearch), [cancelSearch, navigation]);
  React.useImperativeHandle(ref, () => ({
    focus: () => {
      inputRef.current?.focus();
    },
    blur: () => {
      inputRef.current?.blur();
    },
    setText: text => {
      inputRef.current?.setNativeProps({
        text
      });
      setValue(text);
    },
    clearText,
    cancelSearch
  }), [cancelSearch, clearText]);
  if (!visible && !rendered) {
    return null;
  }
  const textColor = tintColor ?? colors.text;
  return /*#__PURE__*/_jsxs(Animated.View, {
    pointerEvents: visible ? 'auto' : 'none',
    "aria-live": "polite",
    "aria-hidden": !visible,
    style: [styles.container, {
      opacity: visibleAnim
    }, style],
    children: [/*#__PURE__*/_jsxs(View, {
      style: styles.searchbarContainer,
      children: [/*#__PURE__*/_jsx(HeaderIcon, {
        source: searchIcon,
        tintColor: textColor,
        style: styles.inputSearchIcon
      }), /*#__PURE__*/_jsx(TextInput, {
        ...rest,
        ref: inputRef,
        onChange: onChangeText,
        onChangeText: setValue,
        autoFocus: autoFocus,
        autoCapitalize: autoCapitalize === 'systemDefault' ? undefined : autoCapitalize,
        inputMode: INPUT_TYPE_TO_MODE[inputType ?? 'text'],
        enterKeyHint: enterKeyHint,
        placeholder: placeholder,
        placeholderTextColor: Color(textColor).alpha(0.5).string(),
        cursorColor: colors.primary,
        selectionHandleColor: colors.primary,
        selectionColor: Color(colors.primary).alpha(0.3).string(),
        style: [fonts.regular, styles.searchbar, {
          backgroundColor: Platform.select({
            ios: dark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
            default: 'transparent'
          }),
          color: textColor,
          borderBottomColor: Color(textColor).alpha(0.2).string()
        }]
      }), Platform.OS === 'ios' ? /*#__PURE__*/_jsx(PlatformPressable, {
        onPress: onClear,
        style: [{
          opacity: clearVisibleAnim,
          transform: [{
            scale: clearVisibleAnim
          }]
        }, styles.clearButton],
        children: /*#__PURE__*/_jsx(Image, {
          source: clearIcon,
          resizeMode: "contain",
          tintColor: textColor,
          style: styles.clearIcon
        })
      }) : null]
    }), Platform.OS !== 'ios' ? /*#__PURE__*/_jsx(HeaderButton, {
      onPress: () => {
        if (value) {
          onClear();
        } else {
          onClose();
        }
      },
      style: styles.closeButton,
      children: /*#__PURE__*/_jsx(HeaderIcon, {
        source: closeIcon,
        tintColor: textColor
      })
    }) : null, Platform.OS === 'ios' ? /*#__PURE__*/_jsx(PlatformPressable, {
      onPress: cancelSearch,
      style: styles.cancelButton,
      children: /*#__PURE__*/_jsx(Text, {
        style: [fonts.regular, {
          color: tintColor ?? colors.primary
        }, styles.cancelText],
        children: cancelButtonText
      })
    }) : null]
  });
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'stretch'
  },
  inputSearchIcon: {
    position: 'absolute',
    opacity: 0.5,
    left: Platform.select({
      ios: 16,
      default: 4
    }),
    top: Platform.select({
      ios: -1,
      default: 17
    }),
    ...Platform.select({
      ios: {
        height: 18,
        width: 18
      },
      default: {}
    })
  },
  closeButton: {
    position: 'absolute',
    opacity: 0.5,
    right: Platform.select({
      ios: 0,
      default: 8
    }),
    top: Platform.select({
      ios: -2,
      default: 17
    })
  },
  clearButton: {
    position: 'absolute',
    right: 0,
    top: -7,
    bottom: 0,
    justifyContent: 'center',
    padding: 8
  },
  clearIcon: {
    height: 16,
    width: 16,
    opacity: 0.5
  },
  cancelButton: {
    alignSelf: 'center',
    top: -4
  },
  cancelText: {
    fontSize: 17,
    marginHorizontal: 12
  },
  searchbarContainer: {
    flex: 1
  },
  searchbar: Platform.select({
    ios: {
      flex: 1,
      fontSize: 17,
      paddingHorizontal: 32,
      marginLeft: 16,
      marginTop: -1,
      marginBottom: 4,
      borderRadius: 8,
      borderCurve: 'continuous'
    },
    default: {
      flex: 1,
      fontSize: 18,
      paddingHorizontal: 36,
      marginRight: 8,
      marginTop: 8,
      marginBottom: 8,
      borderBottomWidth: 1
    }
  })
});
export const HeaderSearchBar = /*#__PURE__*/React.forwardRef(HeaderSearchBarInternal);
//# sourceMappingURL=HeaderSearchBar.js.map