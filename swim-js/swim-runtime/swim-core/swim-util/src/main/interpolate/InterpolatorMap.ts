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

import type {Mutable} from "../types/Mutable";
import {Interpolator} from "./Interpolator";

/** @internal */
export interface InterpolatorMap<Y, FY> extends Interpolator<FY> {
  /** @internal */
  readonly interpolator: Interpolator<Y>;

  /** @internal */
  readonly transform: (y: Y) => FY;

  /** @override */
  readonly 0: FY;

  /** @override */
  readonly 1: FY;

  /** @override */
  equals(that: unknown): boolean;
}

/** @internal */
export const InterpolatorMap = (function (_super: typeof Interpolator) {
  const InterpolatorMap = function <Y, FY>(interpolator: Interpolator<Y>,
                                           transform: (y: Y) => FY): InterpolatorMap<Y, FY> {
    const map = function (u: number): FY {
      return map.transform(map.interpolator(u));
    } as InterpolatorMap<Y, FY>;
    Object.setPrototypeOf(map, InterpolatorMap.prototype);
    (map as Mutable<typeof map>).interpolator = interpolator;
    (map as Mutable<typeof map>).transform = transform;
    return map;
  } as {
    <Y, FY>(interpolator: Interpolator<Y>, transform: (y: Y) => FY): InterpolatorMap<Y, FY>;

    /** @internal */
    prototype: InterpolatorMap<any, any>;
  };

  InterpolatorMap.prototype = Object.create(_super.prototype);
  InterpolatorMap.prototype.constructor = InterpolatorMap;

  Object.defineProperty(InterpolatorMap.prototype, 0, {
    get<Y, FY>(this: InterpolatorMap<Y, FY>): FY {
      return this.transform(this.interpolator[0]);
    },
    configurable: true,
  });

  Object.defineProperty(InterpolatorMap.prototype, 1, {
    get<Y, FY>(this: InterpolatorMap<Y, FY>): FY {
      return this.transform(this.interpolator[1]);
    },
    configurable: true,
  });

  InterpolatorMap.prototype.equals = function <Y, FY>(this: InterpolatorMap<Y, FY>, that: unknown): boolean {
    if (this === that) {
      return true;
    } else if (that instanceof InterpolatorMap) {
      return this.interpolator.equals(that.interpolator)
          && this.transform === that.transform;
    }
    return false;
  };

  return InterpolatorMap;
})(Interpolator);
