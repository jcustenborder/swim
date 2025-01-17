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

import {Mutable, Interpolator} from "@swim/util";
import {GeoSegment} from "./GeoSegment";

/** @internal */
export const GeoSegmentInterpolator = (function (_super: typeof Interpolator) {
  const GeoSegmentInterpolator = function (s0: GeoSegment, s1: GeoSegment): Interpolator<GeoSegment> {
    const interpolator = function (u: number): GeoSegment {
      const s0 = interpolator[0];
      const s1 = interpolator[1];
      const lng0 = s0.lng0 + u * (s1.lng0 - s0.lng0);
      const lat0 = s0.lat0 + u * (s1.lat0 - s0.lat0);
      const lng1 = s0.lng1 + u * (s1.lng1 - s0.lng1);
      const lat1 = s0.lat1 + u * (s1.lat1 - s0.lat1);
      return new GeoSegment(lng0, lat0, lng1, lat1);
    } as Interpolator<GeoSegment>;
    Object.setPrototypeOf(interpolator, GeoSegmentInterpolator.prototype);
    (interpolator as Mutable<typeof interpolator>)[0] = s0;
    (interpolator as Mutable<typeof interpolator>)[1] = s1;
    return interpolator;
  } as {
    (s0: GeoSegment, s1: GeoSegment): Interpolator<GeoSegment>;

    /** @internal */
    prototype: Interpolator<GeoSegment>;
  };

  GeoSegmentInterpolator.prototype = Object.create(_super.prototype);
  GeoSegmentInterpolator.prototype.constructor = GeoSegmentInterpolator;

  return GeoSegmentInterpolator;
})(Interpolator);
