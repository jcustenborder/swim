// Copyright 2015-2021 Swim.inc
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import type {Value} from "@swim/structure";
import type {Host} from "./Host";

/** @public */
export interface HostContext {
  readonly online: boolean;
 
  /** @internal */
  hostDidConnect(host: Host): void;
 
  /** @internal */
  hostDidAuthenticate(body: Value, host: Host): void;
 
  /** @internal */
  hostDidDeauthenticate(body: Value, host: Host): void;
 
  /** @internal */
  hostDidDisconnect(host: Host): void;
 
  /** @internal */
  hostDidFail(error: unknown, host: Host): void;
 
  /** @internal */
  closeHost(host: Host): void;
}