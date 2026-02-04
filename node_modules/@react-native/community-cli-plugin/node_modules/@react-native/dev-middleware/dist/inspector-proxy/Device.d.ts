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

import type { EventReporter } from "../types/EventReporter";
import type { CreateCustomMessageHandlerFn } from "./CustomMessageHandler";
import type { Page } from "./types";
import WS from "ws";
/**
 * Device class represents single device connection to Inspector Proxy. Each device
 * can have multiple inspectable pages.
 */
declare class Device {
  constructor(
    id: string,
    name: string,
    app: string,
    socket: WS,
    projectRoot: string,
    eventReporter: null | undefined | EventReporter,
    createMessageMiddleware: null | undefined | CreateCustomMessageHandlerFn
  );
  dangerouslyRecreateDevice(
    id: string,
    name: string,
    app: string,
    socket: WS,
    projectRoot: string,
    eventReporter: null | undefined | EventReporter,
    createMessageMiddleware: null | undefined | CreateCustomMessageHandlerFn
  ): void;
  getName(): string;
  getApp(): string;
  getPagesList(): ReadonlyArray<Page>;
  handleDebuggerConnection(
    socket: WS,
    pageId: string,
    metadata: Readonly<{ userAgent: string | null }>
  ): void;
  dangerouslyGetSocket(): WS;
}
export default Device;
