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
import type {Color} from "@swim/style";
import type {ScatterPlotViewObserver} from "./ScatterPlotViewObserver";
import type {BubblePlotView} from "./BubblePlotView";

/** @public */
export interface BubblePlotViewObserver<X = unknown, Y = unknown, V extends BubblePlotView<X, Y> = BubblePlotView<X, Y>> extends ScatterPlotViewObserver<X, Y, V> {
  viewDidSetRadius?(radius: Length | null, view: V): void;

  viewDidSetFill?(fill: Color | null, view: V): void;
}
