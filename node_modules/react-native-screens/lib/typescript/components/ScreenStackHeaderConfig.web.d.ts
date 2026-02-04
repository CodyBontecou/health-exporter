import { ImageProps, ViewProps } from 'react-native';
import React from 'react';
import { HeaderSubviewTypes, ScreenStackHeaderConfigProps, SearchBarProps } from '../types';
export declare const ScreenStackHeaderBackButtonImage: (props: ImageProps) => JSX.Element;
export declare const ScreenStackHeaderRightView: (props: React.PropsWithChildren<ViewProps>) => JSX.Element;
export declare const ScreenStackHeaderLeftView: (props: React.PropsWithChildren<ViewProps>) => JSX.Element;
export declare const ScreenStackHeaderCenterView: (props: React.PropsWithChildren<ViewProps>) => JSX.Element;
export declare const ScreenStackHeaderSearchBarView: (props: React.PropsWithChildren<Omit<SearchBarProps, 'ref'>>) => JSX.Element;
export declare const ScreenStackHeaderConfig: (props: React.PropsWithChildren<ScreenStackHeaderConfigProps>) => JSX.Element;
export declare const ScreenStackHeaderSubview: React.ComponentType<React.PropsWithChildren<ViewProps & {
    type?: HeaderSubviewTypes;
}>>;
//# sourceMappingURL=ScreenStackHeaderConfig.web.d.ts.map