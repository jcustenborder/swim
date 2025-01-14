// Copyright 2015-2023 Swim.inc
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

import type {WarpDownlinkObserver} from "./WarpDownlinkObserver";
import type {ValueDownlink} from "./ValueDownlink";

/** @public */
export interface ValueDownlinkObserver<V = unknown, D extends ValueDownlink<any, V, any> = ValueDownlink<unknown, V>> extends WarpDownlinkObserver<D> {
  willSet?(newValue: V, downlink: D): V | void;

  didSet?(newValue: V, oldValue: V, downlink: D): void;
}
