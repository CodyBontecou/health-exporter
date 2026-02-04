import JSReanimated from './JSReanimated';
import type { StyleProps, AnimatedStyle } from '../commonTypes';
declare const reanimatedJS: JSReanimated;
interface JSReanimatedComponent {
    previousStyle: StyleProps;
    setNativeProps?: (style: StyleProps) => void;
    style?: StyleProps;
    props: Record<string, string | number>;
    _touchableNode: {
        setAttribute: (key: string, props: unknown) => void;
    };
}
export interface ReanimatedHTMLElement extends HTMLElement {
    previousStyle: StyleProps;
    setNativeProps?: (style: StyleProps) => void;
    props: Record<string, string | number>;
    _touchableNode: {
        setAttribute: (key: string, props: unknown) => void;
    };
    reanimatedDummy?: boolean;
    removedAfterAnimation?: boolean;
}
export declare const _updatePropsJS: (updates: StyleProps | AnimatedStyle<any>, viewRef: (JSReanimatedComponent | ReanimatedHTMLElement) & {
    getAnimatableRef?: () => JSReanimatedComponent | ReanimatedHTMLElement;
}, isAnimatedProps?: boolean) => void;
export default reanimatedJS;
//# sourceMappingURL=index.d.ts.map