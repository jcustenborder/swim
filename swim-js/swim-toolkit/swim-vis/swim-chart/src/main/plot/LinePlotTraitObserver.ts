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
import type {ColorOrLook} from "@swim/theme";
import type {SeriesPlotTraitObserver} from "./SeriesPlotTraitObserver";
import type {LinePlotTrait} from "./LinePlotTrait";

/** @public */
export interface LinePlotTraitObserver<X = unknown, Y = unknown, T extends LinePlotTrait<X, Y> = LinePlotTrait<X, Y>> extends SeriesPlotTraitObserver<X, Y, T> {
  traitDidSetStroke?(stroke: ColorOrLook | null, trait: T): void;

  traitDidSetStrokeWidth?(strokeWidth: Length | null, trait: T): void;
}
