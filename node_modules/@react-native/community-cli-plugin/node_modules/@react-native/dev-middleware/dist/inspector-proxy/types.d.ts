/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 *
 * @format
 * @oncall react_native
 */

/**
 * A capability flag disables a specific feature/hack in the InspectorProxy
 * layer by indicating that the target supports one or more modern CDP features.
 */
export type TargetCapabilityFlags = Readonly<{
  /**
   * The target supports a stable page representation across reloads.
   *
   * In the proxy, this disables legacy page reload emulation and the
   * additional '(Experimental)' target in `/json/list`.
   *
   * In the launch flow, this allows targets to be matched directly by `appId`.
   */
  nativePageReloads?: boolean;
  /**
   * The target supports fetching source code and source maps.
   *
   * In the proxy, this disables source fetching emulation and host rewrites.
   */
  nativeSourceCodeFetching?: boolean;
  /**
   * The target supports native network inspection.
   *
   * In the proxy, this disables intercepting and storing network requests.
   */
  nativeNetworkInspection?: boolean;
  /**
   * The target supports the modern `rn_fusebox.html` entry point.
   *
   * In the launch flow, this controls the Chrome DevTools entrypoint that is used.
   */
  prefersFuseboxFrontend?: boolean;
}>;
export type PageFromDevice = Readonly<{
  id: string;
  title: string;
  /** @deprecated This is sent from legacy targets only */
  vm?: string;
  app: string;
  capabilities?: TargetCapabilityFlags;
}>;
export type Page = Readonly<
  Omit<
    PageFromDevice,
    keyof ({ capabilities: NonNullable<PageFromDevice["capabilities"]> })
  > & { capabilities: NonNullable<PageFromDevice["capabilities"]> }
>;
export type WrappedEvent = Readonly<{
  event: "wrappedEvent";
  payload: Readonly<{ pageId: string; wrappedEvent: string }>;
}>;
export type ConnectRequest = Readonly<{
  event: "connect";
  payload: Readonly<{ pageId: string }>;
}>;
export type DisconnectRequest = Readonly<{
  event: "disconnect";
  payload: Readonly<{ pageId: string }>;
}>;
export type GetPagesRequest = { event: "getPages" };
export type GetPagesResponse = {
  event: "getPages";
  payload: ReadonlyArray<PageFromDevice>;
};
export type MessageFromDevice =
  | GetPagesResponse
  | WrappedEvent
  | DisconnectRequest;
export type MessageToDevice =
  | GetPagesRequest
  | WrappedEvent
  | ConnectRequest
  | DisconnectRequest;
export type PageDescription = Readonly<{
  id: string;
  title: string;
  description: string;
  type: string;
  devtoolsFrontendUrl: string;
  webSocketDebuggerUrl: string;
  deviceName: string;
  /** @deprecated This is sent from legacy targets only */
  vm?: string;
  reactNative: Readonly<{
    logicalDeviceId: string;
    capabilities: Page["capabilities"];
  }>;
}>;
export type JsonPagesListResponse = Array<PageDescription>;
export type JsonVersionResponse = Readonly<{
  Browser: string;
  "Protocol-Version": string;
}>;
export type JSONSerializable =
  | boolean
  | number
  | string
  | null
  | ReadonlyArray<JSONSerializable>
  | { readonly [$$Key$$: string]: JSONSerializable };
export type DeepReadOnly<T> =
  T extends ReadonlyArray<infer V>
    ? ReadonlyArray<DeepReadOnly<V>>
    : T extends {}
      ? { readonly [K in keyof T]: DeepReadOnly<T[K]> }
      : T;
