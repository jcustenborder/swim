// Copyright 2015-2022 Swim.inc
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
import {Property} from "@swim/component";
import {AnyLength, Length} from "@swim/math";
import {AnyColorOrLook, ColorOrLook, ColorLook} from "@swim/theme";
import type {GeoController} from "../geo/GeoController";
import {GeoPathTrait} from "./GeoPathTrait";
import type {GeoAreaTraitObserver} from "./GeoAreaTraitObserver";
import {GeoAreaController} from "./"; // forward import

/** @public */
export abstract class GeoAreaTrait extends GeoPathTrait {
  override readonly observerType?: Class<GeoAreaTraitObserver>;

  @Property<GeoAreaTrait["fill"]>({
    valueType: ColorLook,
    value: null,
    didSetValue(fill: ColorOrLook | null): void {
      this.owner.callObservers("traitDidSetFill", fill, this.owner);
    },
  })
  readonly fill!: Property<this, ColorOrLook | null, AnyColorOrLook | null>;

  @Property<GeoAreaTrait["stroke"]>({
    valueType: ColorLook,
    value: null,
    didSetValue(stroke: ColorOrLook | null): void {
      this.owner.callObservers("traitDidSetStroke", stroke, this.owner);
    },
  })
  readonly stroke!: Property<this, ColorOrLook | null, AnyColorOrLook | null>;

  @Property<GeoAreaTrait["strokeWidth"]>({
    valueType: Length,
    value: null,
    didSetValue(strokeWidth: Length | null): void {
      this.owner.callObservers("traitDidSetStrokeWidth", strokeWidth, this.owner);
    },
  })
  readonly strokeWidth!: Property<this, Length | null, AnyLength | null>;

  override createGeoController(): GeoController {
    return new GeoAreaController();
  }
}
