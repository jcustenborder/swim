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

import type {Class} from "@swim/util";
import type {TraitViewRef} from "@swim/controller";
import {PlotController} from "./PlotController";
import type {SeriesPlotView} from "./SeriesPlotView";
import type {SeriesPlotTrait} from "./SeriesPlotTrait";
import type {SeriesPlotControllerObserver} from "./SeriesPlotControllerObserver";

/** @public */
export abstract class SeriesPlotController<X = unknown, Y = unknown> extends PlotController<X, Y> {
  override readonly observerType?: Class<SeriesPlotControllerObserver<X, Y>>;

  abstract override readonly plot: TraitViewRef<this, SeriesPlotTrait<X, Y>, SeriesPlotView<X, Y>>;
}
