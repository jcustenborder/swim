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

import type {Trait} from "@swim/model";
import type {SheetControllerObserver} from "@swim/sheet";
import type {PanelView} from "../panel/PanelView";
import type {PanelController} from "../panel/PanelController";
import type {BoardView} from "./BoardView";
import type {BoardController} from "./BoardController";

/** @public */
export interface BoardControllerObserver<C extends BoardController = BoardController> extends SheetControllerObserver<C> {
  controllerWillAttachSheetTrait?(boatdTrait: Trait, controller: C): void;

  controllerDidDetachSheetTrait?(boatdTrait: Trait, controller: C): void;

  controllerWillAttachSheetView?(boardView: BoardView, controller: C): void;

  controllerDidDetachSheetView?(boardView: BoardView, controller: C): void;

  controllerWillAttachPanel?(panelController: PanelController, controller: C): void;

  controllerDidDetachPanel?(panelController: PanelController, controller: C): void;

  controllerWillAttachPanelTrait?(panelTrait: Trait, panelController: PanelController, controller: C): void;

  controllerDidDetachPanelTrait?(panelTrait: Trait, panelController: PanelController, controller: C): void;

  controllerWillAttachPanelView?(panelView: PanelView, panelController: PanelController, controller: C): void;

  controllerDidDetachPanelView?(panelView: PanelView, panelController: PanelController, controller: C): void;
}
