import * as React from 'react';
import { type ViewProps } from 'react-native';
import { StackPresentationTypes } from '../types';
type ContainerProps = ViewProps & {
    stackPresentation: StackPresentationTypes;
    children: React.ReactNode;
};
/**
 * This view must *not* be flattened.
 * See https://github.com/software-mansion/react-native-screens/pull/1825
 * for detailed explanation.
 */
declare let DebugContainer: React.ComponentType<ContainerProps>;
export default DebugContainer;
//# sourceMappingURL=DebugContainer.d.ts.map