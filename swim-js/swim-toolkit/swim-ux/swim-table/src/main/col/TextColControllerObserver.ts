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
import type {ColControllerObserver} from "./ColControllerObserver";
import type {TextColView} from "./TextColView";
import type {TextColTrait} from "./TextColTrait";
import type {TextColController} from "./TextColController";

/** @public */
export interface TextColControllerObserver<C extends TextColController = TextColController> extends ColControllerObserver<C> {
  controllerWillAttachColTrait?(colTrait: TextColTrait, controller: C): void;

  controllerDidDetachColTrait?(colTrait: TextColTrait, controller: C): void;

  controllerWillAttachColView?(colView: TextColView, controller: C): void;

  controllerDidDetachColView?(colView: TextColView, controller: C): void;

  controllerWillAttachColLabelView?(colLabelView: HtmlView, controller: C): void;

  controllerDidDetachColLabelView?(colLabelView: HtmlView, controller: C): void;
}
