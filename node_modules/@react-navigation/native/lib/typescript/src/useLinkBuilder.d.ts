/**
 * Helper to build a href for a screen based on the linking options.
 */
export declare function useBuildHref(): (name: string, params?: object) => string | undefined;
/**
 * Helper to build a navigation action from a href based on the linking options.
 */
export declare const useBuildAction: () => (href: string) => {
    type: "NAVIGATE";
    payload: {
        name: string;
        params?: import("@react-navigation/core").NavigatorScreenParams<Readonly<{
            key: string;
            index: number;
            routeNames: string[];
            history?: unknown[];
            routes: import("@react-navigation/routers").NavigationRoute<import("@react-navigation/routers").ParamListBase, string>[];
            type: string;
            stale: false;
        }>>;
        path?: string;
    };
} | {
    type: "GO_BACK";
    source?: string;
    target?: string;
} | {
    type: "NAVIGATE";
    payload: {
        name: string;
        params?: object;
        path?: string;
        merge?: boolean;
        pop?: boolean;
    };
    source?: string;
    target?: string;
} | {
    type: "NAVIGATE_DEPRECATED";
    payload: {
        name: string;
        params?: object;
        merge?: boolean;
    };
    source?: string;
    target?: string;
} | {
    type: "SET_PARAMS";
    payload: {
        params?: object;
    };
    source?: string;
    target?: string;
} | {
    type: "REPLACE_PARAMS";
    payload: {
        params?: object;
    };
    source?: string;
    target?: string;
} | {
    type: "PRELOAD";
    payload: {
        name: string;
        params?: object;
    };
    source?: string;
    target?: string;
} | {
    readonly type: "RESET";
    readonly payload: (Readonly<{
        key: string;
        index: number;
        routeNames: string[];
        history?: unknown[];
        routes: import("@react-navigation/routers").NavigationRoute<import("@react-navigation/routers").ParamListBase, string>[];
        type: string;
        stale: false;
    }> | import("@react-navigation/routers").PartialState<Readonly<{
        key: string;
        index: number;
        routeNames: string[];
        history?: unknown[];
        routes: import("@react-navigation/routers").NavigationRoute<import("@react-navigation/routers").ParamListBase, string>[];
        type: string;
        stale: false;
    }>> | (Omit<Readonly<{
        key: string;
        index: number;
        routeNames: string[];
        history?: unknown[];
        routes: import("@react-navigation/routers").NavigationRoute<import("@react-navigation/routers").ParamListBase, string>[];
        type: string;
        stale: false;
    }>, "routes"> & {
        routes: Omit<import("@react-navigation/routers").Route<string>, "key">[];
    })) | undefined;
};
/**
 * Helpers to build href or action based on the linking options.
 *
 * @returns `buildHref` to build an `href` for screen and `buildAction` to build an action from an `href`.
 */
export declare function useLinkBuilder(): {
    buildHref: (name: string, params?: object) => string | undefined;
    buildAction: (href: string) => {
        type: "NAVIGATE";
        payload: {
            name: string;
            params?: import("@react-navigation/core").NavigatorScreenParams<Readonly<{
                key: string;
                index: number;
                routeNames: string[];
                history?: unknown[];
                routes: import("@react-navigation/routers").NavigationRoute<import("@react-navigation/routers").ParamListBase, string>[];
                type: string;
                stale: false;
            }>>;
            path?: string;
        };
    } | {
        type: "GO_BACK";
        source?: string;
        target?: string;
    } | {
        type: "NAVIGATE";
        payload: {
            name: string;
            params?: object;
            path?: string;
            merge?: boolean;
            pop?: boolean;
        };
        source?: string;
        target?: string;
    } | {
        type: "NAVIGATE_DEPRECATED";
        payload: {
            name: string;
            params?: object;
            merge?: boolean;
        };
        source?: string;
        target?: string;
    } | {
        type: "SET_PARAMS";
        payload: {
            params?: object;
        };
        source?: string;
        target?: string;
    } | {
        type: "REPLACE_PARAMS";
        payload: {
            params?: object;
        };
        source?: string;
        target?: string;
    } | {
        type: "PRELOAD";
        payload: {
            name: string;
            params?: object;
        };
        source?: string;
        target?: string;
    } | {
        readonly type: "RESET";
        readonly payload: (Readonly<{
            key: string;
            index: number;
            routeNames: string[];
            history?: unknown[];
            routes: import("@react-navigation/routers").NavigationRoute<import("@react-navigation/routers").ParamListBase, string>[];
            type: string;
            stale: false;
        }> | import("@react-navigation/routers").PartialState<Readonly<{
            key: string;
            index: number;
            routeNames: string[];
            history?: unknown[];
            routes: import("@react-navigation/routers").NavigationRoute<import("@react-navigation/routers").ParamListBase, string>[];
            type: string;
            stale: false;
        }>> | (Omit<Readonly<{
            key: string;
            index: number;
            routeNames: string[];
            history?: unknown[];
            routes: import("@react-navigation/routers").NavigationRoute<import("@react-navigation/routers").ParamListBase, string>[];
            type: string;
            stale: false;
        }>, "routes"> & {
            routes: Omit<import("@react-navigation/routers").Route<string>, "key">[];
        })) | undefined;
    };
};
//# sourceMappingURL=useLinkBuilder.d.ts.map