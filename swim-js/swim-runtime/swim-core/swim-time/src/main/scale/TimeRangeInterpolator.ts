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
import {DateTime} from "../DateTime";
import {TimeRange} from "./TimeRange";

/** @internal */
export const TimeRangeInterpolator = (function (_super: typeof Interpolator) {
  const TimeRangeInterpolator = function (y0: TimeRange, y1: TimeRange): Interpolator<TimeRange> {
    const interpolator = function (u: number): TimeRange {
      const y0 = interpolator[0];
      const y00 = y0[0];
      const y01 = y0[1];
      const y1 = interpolator[1];
      const y10 = y1[0];
      const y11 = y1[1];
      return TimeRange(new DateTime(y00.time + u * (y10.time - y00.time), u === 0 ? y00.zone : y10.zone),
                       new DateTime(y01.time + u * (y11.time - y01.time), u === 0 ? y01.zone : y11.zone));
    } as Interpolator<TimeRange>;
    Object.setPrototypeOf(interpolator, TimeRangeInterpolator.prototype);
    (interpolator as Mutable<typeof interpolator>)[0] = y0;
    (interpolator as Mutable<typeof interpolator>)[1] = y1;
    return interpolator;
  } as {
    (y0: TimeRange, y1: TimeRange): Interpolator<TimeRange>;

    /** @internal */
    prototype: Interpolator<TimeRange>;
  };

  TimeRangeInterpolator.prototype = Object.create(_super.prototype);
  TimeRangeInterpolator.prototype.constructor = TimeRangeInterpolator;

  return TimeRangeInterpolator;
})(Interpolator);
