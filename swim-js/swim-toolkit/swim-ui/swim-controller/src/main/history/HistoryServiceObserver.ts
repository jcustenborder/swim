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

import type {ServiceObserver} from "@swim/component";
import type {HistoryState} from "./HistoryState";
import type {HistoryService} from "./HistoryService";

/** @public */
export interface HistoryServiceObserver<S extends HistoryService = HistoryService> extends ServiceObserver<S> {
  serviceWillPushHistory?(newState: HistoryState, oldState: HistoryState, service: S): void;

  serviceDidPushHistory?(newState: HistoryState, oldState: HistoryState, service: S): void;

  serviceWillReplaceHistory?(newState: HistoryState, oldState: HistoryState, service: S): void;

  serviceDidReplaceHistory?(newState: HistoryState, oldState: HistoryState, service: S): void;

  serviceWillPopHistory?(newState: HistoryState, oldState: HistoryState, service: S): void | boolean;

  serviceDidPopHistory?(newState: HistoryState, oldState: HistoryState, service: S): void;
}
