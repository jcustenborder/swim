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

import type {Interpolator} from "@swim/util";
import {AnyBoxShadow, BoxShadow, BoxShadowInterpolator} from "@swim/style";
import {Look} from "./Look";

/** @public */
export type AnyShadowOrLook = Look<BoxShadow, any> | AnyBoxShadow;

/** @public */
export type ShadowOrLook = Look<BoxShadow, any> | BoxShadow;

/** @public */
export class ShadowLook extends Look<BoxShadow, AnyBoxShadow> {
  override combine(combination: BoxShadow | undefined, value: BoxShadow, weight?: number): BoxShadow {
    if (weight === void 0 || weight !== 0) {
      return value;
    } else if (combination !== void 0) {
      return combination;
    } else {
      return value;
    }
  }

  override between(a: BoxShadow, b: BoxShadow): Interpolator<BoxShadow> {
    return BoxShadowInterpolator(a, b);
  }

  override coerce(value: AnyBoxShadow): BoxShadow {
    return BoxShadow.fromAny(value)!;
  }

  static fromAny(value: Look<BoxShadow> | AnyBoxShadow): Look<BoxShadow> | BoxShadow;
  static fromAny(value: Look<BoxShadow> | AnyBoxShadow | null): Look<BoxShadow> | BoxShadow | null;
  static fromAny(value: Look<BoxShadow> | AnyBoxShadow | null | undefined): Look<BoxShadow> | BoxShadow | null | undefined;
  static fromAny(value: Look<BoxShadow> | AnyBoxShadow | null | undefined): Look<BoxShadow> | BoxShadow | null | undefined {
    if (value === void 0 || value === null || value instanceof Look || value instanceof BoxShadow) {
      return value;
    } else {
      return BoxShadow.fromAny(value);
    }
  }
}
