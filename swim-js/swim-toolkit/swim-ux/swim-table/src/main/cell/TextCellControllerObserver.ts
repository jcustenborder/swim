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

import type {HtmlView} from "@swim/dom";
import type {CellControllerObserver} from "./CellControllerObserver";
import type {TextCellView} from "./TextCellView";
import type {TextCellTrait} from "./TextCellTrait";
import type {TextCellController} from "./TextCellController";

/** @public */
export interface TextCellControllerObserver<C extends TextCellController = TextCellController> extends CellControllerObserver<C> {
  controllerWillAttachCellTrait?(cellTrait: TextCellTrait, controller: C): void;

  controllerDidDetachCellTrait?(cellTrait: TextCellTrait, controller: C): void;

  controllerWillAttachCellView?(cellView: TextCellView, controller: C): void;

  controllerDidDetachCellView?(cellView: TextCellView, controller: C): void;

  controllerWillAttachCellContentView?(cellContentView: HtmlView, controller: C): void;

  controllerDidDetachCellContentView?(cellContentView: HtmlView, controller: C): void;
}
