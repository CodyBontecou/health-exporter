import { GestureUpdateEvent, PanGestureHandlerEventPayload } from 'react-native-gesture-handler';
export declare const DefaultEvent: GestureUpdateEvent<PanGestureHandlerEventPayload>;
export declare const DefaultScreenDimensions: {
    width: number;
    height: number;
    x: number;
    y: number;
    pageX: number;
    pageY: number;
};
export declare const AnimationForGesture: {
    swipeRight: import("react-native-reanimated").AnimatedScreenTransition;
    swipeLeft: import("react-native-reanimated").AnimatedScreenTransition;
    swipeDown: import("react-native-reanimated").AnimatedScreenTransition;
    swipeUp: import("react-native-reanimated").AnimatedScreenTransition;
    horizontalSwipe: import("react-native-reanimated").AnimatedScreenTransition;
    verticalSwipe: import("react-native-reanimated").AnimatedScreenTransition;
    twoDimensionalSwipe: import("react-native-reanimated").AnimatedScreenTransition;
};
//# sourceMappingURL=defaults.d.ts.map