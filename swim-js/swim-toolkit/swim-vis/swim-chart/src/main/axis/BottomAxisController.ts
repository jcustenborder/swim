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

import type {FastenerClass} from "@swim/component";
import {TraitViewRef} from "@swim/controller";
import {BottomAxisTrait} from "./BottomAxisTrait";
import {BottomAxisView} from "./BottomAxisView";
import {AxisController} from "./AxisController";

/** @public */
export class BottomAxisController<X = unknown> extends AxisController<X> {
  @TraitViewRef<BottomAxisController<X>["axis"]>({
    extends: AxisController.axis,
    traitType: BottomAxisTrait,
    viewType: BottomAxisView,
  })
  override readonly axis!: TraitViewRef<this, BottomAxisTrait<X>, BottomAxisView<X>> & AxisController<X>["axis"];
  static override readonly axis: FastenerClass<BottomAxisController["axis"]>;
}
