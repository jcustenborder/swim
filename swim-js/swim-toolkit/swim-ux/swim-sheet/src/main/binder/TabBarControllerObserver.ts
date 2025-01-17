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

import type {PositionGestureInput} from "@swim/view";
import type {BarControllerObserver} from "@swim/toolbar";
import type {SheetController} from "../sheet/SheetController";
import type {TabBarController} from "./TabBarController";

/** @public */
export interface TabBarControllerObserver<C extends TabBarController = TabBarController> extends BarControllerObserver<C> {
  controllerDidPressTabHandle?(input: PositionGestureInput, event: Event | null, tabController: SheetController, controller: C): void;

  controllerDidLongPressTabHandle?(input: PositionGestureInput, tabController: SheetController, controller: C): void;
}
