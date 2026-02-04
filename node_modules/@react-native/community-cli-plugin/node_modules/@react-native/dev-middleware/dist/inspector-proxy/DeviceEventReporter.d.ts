/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 *
 * @format
 */

import type { EventReporter } from "../types/EventReporter";
import type { CDPResponse } from "./cdp-types/messages";
import type { DeepReadOnly } from "./types";
type DeviceMetadata = Readonly<{
  appId: string;
  deviceId: string;
  deviceName: string;
}>;
type RequestMetadata = Readonly<{
  pageId: string | null;
  frontendUserAgent: string | null;
  prefersFuseboxFrontend: boolean | null;
}>;
type ResponseMetadata = Readonly<{
  pageId: string | null;
  frontendUserAgent: string | null;
  prefersFuseboxFrontend: boolean | null;
}>;
declare class DeviceEventReporter {
  constructor(eventReporter: EventReporter, metadata: DeviceMetadata);
  logRequest(
    req: Readonly<{ id: number; method: string }>,
    origin: "debugger" | "proxy",
    metadata: RequestMetadata
  ): void;
  logResponse(
    res: DeepReadOnly<CDPResponse<>>,
    origin: "device" | "proxy",
    metadata: ResponseMetadata
  ): void;
  logConnection(
    connectedEntity: "debugger",
    metadata: Readonly<{ pageId: string; frontendUserAgent: string | null }>
  ): void;
  logDisconnection(disconnectedEntity: "device" | "debugger"): void;
  logProxyMessageHandlingError(
    messageOrigin: "device" | "debugger",
    error: Error,
    message: string
  ): void;
}
declare const $$EXPORT_DEFAULT_DECLARATION$$: typeof DeviceEventReporter;
export default $$EXPORT_DEFAULT_DECLARATION$$;
