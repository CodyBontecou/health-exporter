/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 *
 * @format
 */

type SuccessResult<Props extends {} | void = {}> =
  /**
   * > 13 |   ...Props,
   *      |   ^^^^^^^^ Unsupported feature: Translating "object types with spreads in the middle or at the end" is currently not supported.
   **/
  any;
type ErrorResult<ErrorT = unknown> = {
  status: "error";
  error: ErrorT;
  prefersFuseboxFrontend?: null | undefined | boolean;
};
type CodedErrorResult<ErrorCode extends string> = {
  status: "coded_error";
  errorCode: ErrorCode;
  errorDetails?: string;
};
type DebuggerSessionIDs = {
  appId: string;
  deviceName: string;
  deviceId: string;
  pageId: string | null;
};
export type ReportableEvent =
  | /**
   * > 39 |       ...
   *      |       ^^^
   * > 40 |         | SuccessResult<{
   *      | ^^^^^^^^^^^^^^^^^^^^^^^^^
   * > 41 |             appId: string | null,
   *      | ^^^^^^^^^^^^^^^^^^^^^^^^^
   * > 42 |             deviceId: string | null,
   *      | ^^^^^^^^^^^^^^^^^^^^^^^^^
   * > 43 |             resolvedTargetDescription: string,
   *      | ^^^^^^^^^^^^^^^^^^^^^^^^^
   * > 44 |             prefersFuseboxFrontend: boolean,
   *      | ^^^^^^^^^^^^^^^^^^^^^^^^^
   * > 45 |           }>
   *      | ^^^^^^^^^^^^^^^^^^^^^^^^^
   * > 46 |         | ErrorResult<mixed>
   *      | ^^^^^^^^^^^^^^^^^^^^^^^^^
   * > 47 |         | CodedErrorResult<"NO_APPS_FOUND">,
   *      | ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ Unsupported feature: Translating "object types with spreads in the middle or at the end" is currently not supported.
   **/
  any
  | /**
   * > 51 |       ...
   *      |       ^^^
   * > 52 |         | SuccessResult<{
   *      | ^^^^^^^^^^^^^^^^^^^^^^^^^
   * > 53 |             ...DebuggerSessionIDs,
   *      | ^^^^^^^^^^^^^^^^^^^^^^^^^
   * > 54 |             frontendUserAgent: string | null,
   *      | ^^^^^^^^^^^^^^^^^^^^^^^^^
   * > 55 |           }>
   *      | ^^^^^^^^^^^^^^^^^^^^^^^^^
   * > 56 |         | ErrorResult<mixed>,
   *      | ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ Unsupported feature: Translating "object types with spreads in the middle or at the end" is currently not supported.
   **/
  any
  | /**
   * > 66 |       ...DebuggerSessionIDs,
   *      |       ^^^^^^^^^^^^^^^^^^^^^ Unsupported feature: Translating "object types with spreads in the middle or at the end" is currently not supported.
   **/
  any
  | /**
   * > 86 |       ...DebuggerSessionIDs,
   *      |       ^^^^^^^^^^^^^^^^^^^^^ Unsupported feature: Translating "object types with spreads in the middle or at the end" is currently not supported.
   **/
  any;
/**
 * A simple interface for logging events, to be implemented by integrators of
 * `dev-middleware`.
 *
 * This is an unstable API with no semver guarantees.
 */
export interface EventReporter {
  logEvent(event: ReportableEvent): void;
}
