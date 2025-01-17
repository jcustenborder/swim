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

import type {Length} from "@swim/math";
import type {View} from "@swim/view";
import type {HtmlViewObserver} from "@swim/dom";
import type {ToolLayout} from "../layout/ToolLayout";
import type {BarLayout} from "../layout/BarLayout";
import type {ToolView} from "../tool/ToolView";
import type {BarPlacement, BarView} from "./BarView";

/** @public */
export interface BarViewObserver<V extends BarView = BarView> extends HtmlViewObserver<V> {
  viewDidSetPlacement?(placement: BarPlacement, view: V): void;

  viewDidSetEffectiveHeight?(effectiveHeight: Length | null, view: V): void;

  viewDidSetBarLayout?(barLayout: BarLayout | null, view: V): void;

  viewDidSetBarHeight?(barHeight: Length | null, view: V): void;

  viewWillAttachTool?(toolView: ToolView, targetView: View | null, view: V): void;

  viewDidDetachTool?(toolView: ToolView, view: V): void;

  viewDidDismissTool?(toolView: ToolView, toolLayout: ToolLayout, view: V): void;
}
