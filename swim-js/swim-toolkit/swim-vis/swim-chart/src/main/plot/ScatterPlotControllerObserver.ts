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

import type {PlotControllerObserver} from "./PlotControllerObserver";
import type {ScatterPlotView} from "./ScatterPlotView";
import type {ScatterPlotTrait} from "./ScatterPlotTrait";
import type {ScatterPlotController} from "./ScatterPlotController";

/** @public */
export interface ScatterPlotControllerObserver<X = unknown, Y = unknown, C extends ScatterPlotController<X, Y> = ScatterPlotController<X, Y>> extends PlotControllerObserver<X, Y, C> {
  controllerWillAttachPlotTrait?(plotTrait: ScatterPlotTrait<X, Y>, controller: C): void;

  controllerDidDetachPlotTrait?(plotTrait: ScatterPlotTrait<X, Y>, controller: C): void;

  controllerWillAttachPlotView?(plotView: ScatterPlotView<X, Y>, controller: C): void;

  controllerDidDetachPlotView?(plotView: ScatterPlotView<X, Y>, controller: C): void;
}
